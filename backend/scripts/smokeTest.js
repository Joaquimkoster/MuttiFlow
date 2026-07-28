const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');
const { pool } = require('../src/config/database');

const API = process.env.SMOKE_API_URL || 'http://127.0.0.1:3000';
const sessao = `smoke-${randomUUID()}`;
const idempotencia = randomUUID();
let pedidoId;
let estoqueAntes;
const usuariosTeste = [];
let eventoId;

function proximaTerca() {
  const data = new Date();
  data.setHours(12, 0, 0, 0);
  const dias = ((2 - data.getDay() + 7) % 7) || 7;
  data.setDate(data.getDate() + dias);
  return data.toISOString().slice(0, 10);
}

async function api(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': sessao,
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${response.status} ${JSON.stringify(data)}`);
  return { status: response.status, data };
}

function afirmar(condicao, mensagem) {
  if (!condicao) throw new Error(mensagem);
  console.log(`OK: ${mensagem}`);
}

async function executar() {
  estoqueAntes = Number((await pool.query('SELECT estoque FROM produtos WHERE id = $1', [1])).rows[0].estoque);
  const carrinho = await api('/carrinho/itens', {
    method: 'POST',
    body: JSON.stringify({ produto_id: 1, quantidade: 1, preco: 0.01 }),
  });
  afirmar(Number(carrinho.data.itens[0].price) === 26, 'backend ignora preço adulterado e usa o preço do banco');

  const corpo = {
    nome: 'Teste Automático',
    whatsapp: '11999999999',
    pagamento: 'Cartão na entrega/retirada',
    regiaoEntrega: 'retirada',
    dataEntrega: proximaTerca(),
    horario: '18:00',
    observacoes: 'Teste automático removido ao finalizar',
    cupom: '',
  };
  const primeiro = await api('/pedidos', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencia },
    body: JSON.stringify(corpo),
  });
  pedidoId = primeiro.data.id;
  afirmar(primeiro.status === 201, 'primeira confirmação cria o pedido');
  afirmar(/^MUT-\d{4}-\d{5,}$/.test(primeiro.data.codigo_publico), 'pedido recebe código público');

  const repetido = await api('/pedidos', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencia },
    body: JSON.stringify(corpo),
  });
  afirmar(repetido.status === 200 && repetido.data.id === pedidoId, 'repetição idempotente retorna o mesmo pedido');

  const publico = await api(`/pedidos/publico/${primeiro.data.codigo_publico}`);
  const chavesPublicas = Object.keys(publico.data).sort();
  afirmar(JSON.stringify(chavesPublicas) === JSON.stringify(['codigo', 'data', 'horario', 'itens', 'status', 'tipo_entrega']), 'acompanhamento não expõe dados sensíveis');
  afirmar(publico.data.itens.length === 1, 'acompanhamento apresenta o resumo dos itens');

  const [pagamento, historico, estoque, carrinhoFinal] = await Promise.all([
    pool.query('SELECT COUNT(*)::int total FROM pagamentos WHERE pedido_id = $1', [pedidoId]),
    pool.query('SELECT COUNT(*)::int total FROM pedido_status_historico WHERE pedido_id = $1', [pedidoId]),
    pool.query('SELECT estoque FROM produtos WHERE id = $1', [1]),
    api('/carrinho'),
  ]);
  afirmar(pagamento.rows[0].total === 1, 'pagamento foi registrado na transação');
  afirmar(historico.rows[0].total === 1, 'status inicial foi registrado no histórico');
  afirmar(Number(estoque.rows[0].estoque) === estoqueAntes - 1, 'estoque foi reduzido uma única vez');
  afirmar(carrinhoFinal.data.itens.length === 0, 'carrinho foi limpo após o pedido');

  const senhaTeste = `Smoke${randomUUID().slice(0, 8)}1`;
  const senhaHash = await bcrypt.hash(senhaTeste, 10);
  for (const funcao of ['admin', 'operador']) {
    const email = `smoke-${funcao}-${randomUUID()}@example.test`;
    const usuario = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, funcao) VALUES ($1, $2, $3, $4) RETURNING id, nome',
      [`Smoke ${funcao}`, email, senhaHash, funcao]
    );
    usuariosTeste.push(usuario.rows[0].id);
    const login = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ nome: usuario.rows[0].nome, senha: senhaTeste }),
    });
    afirmar(Boolean(login.data.token), `login ${funcao} retorna JWT`);
    const dashboard = await api('/dashboard', { headers: { Authorization: `Bearer ${login.data.token}` } });
    afirmar(dashboard.status === 200, `${funcao} autenticado acessa rota administrativa`);
    if (funcao === 'admin') {
      const mudanca = await api(`/pedidos/${pedidoId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${login.data.token}` },
        body: JSON.stringify({ status: 'Confirmado' }),
      });
      afirmar(mudanca.data.status === 'Confirmado', 'administrador altera status do pedido');
      const autoria = await pool.query(
        'SELECT usuario_id FROM pedido_status_historico WHERE pedido_id = $1 AND status_novo = $2',
        [pedidoId, 'Confirmado']
      );
      afirmar(autoria.rows[0].usuario_id === usuario.rows[0].id, 'histórico registra o usuário responsável');
      const pagamentoAtualizado = await api(`/pedidos/${pedidoId}/pagamento`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${login.data.token}` },
        body: JSON.stringify({ pagamento_status: 'Pago' }),
      });
      afirmar(pagamentoAtualizado.data.pagamento_status === 'Pago', 'painel atualiza o pagamento do pedido');
      const pagamentoSincronizado = await pool.query('SELECT status FROM pagamentos WHERE pedido_id = $1', [pedidoId]);
      afirmar(pagamentoSincronizado.rows[0].status === 'Pago', 'registro de pagamento permanece sincronizado');

      const evento = await api('/eventos', {
        method: 'POST',
        body: JSON.stringify({
          cliente: 'Evento Smoke', telefone: '11988888888', tipo: 'Corporativo',
          data: proximaTerca(), hora: '19:00', endereco: 'Endereço de teste', convidados: 20,
        }),
      });
      eventoId = evento.data.id;
      afirmar(evento.status === 201, 'cliente envia solicitação de evento');
      const eventos = await api('/eventos', { headers: { Authorization: `Bearer ${login.data.token}` } });
      afirmar(eventos.data.some((item) => item.id === eventoId), 'painel lista a solicitação de evento');
      const eventoAtualizado = await api(`/eventos/${eventoId}/status`, {
        method: 'PATCH', headers: { Authorization: `Bearer ${login.data.token}` },
        body: JSON.stringify({ status: 'Aceito' }),
      });
      afirmar(eventoAtualizado.data.status === 'Aceito', 'painel atualiza o status do evento');
    } else {
      const proibido = await fetch(`${API}/pedidos/${pedidoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${login.data.token}` },
      });
      afirmar(proibido.status === 403, 'operador não pode excluir pedidos');
    }
  }
}

async function limpar() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (pedidoId) {
      const itens = await client.query('SELECT produto_id, quantidade FROM pedido_itens WHERE pedido_id = $1', [pedidoId]);
      for (const item of itens.rows) {
        await client.query('UPDATE produtos SET estoque = estoque + $1 WHERE id = $2', [item.quantidade, item.produto_id]);
      }
      await client.query('DELETE FROM pedidos WHERE id = $1', [pedidoId]);
    }
    if (eventoId) await client.query('DELETE FROM eventos WHERE id = $1', [eventoId]);
    await client.query('DELETE FROM carrinhos WHERE sessao_id = $1', [sessao]);
    if (usuariosTeste.length) await client.query('DELETE FROM usuarios WHERE id = ANY($1::int[])', [usuariosTeste]);
    await client.query('COMMIT');
    if (estoqueAntes != null) {
      const atual = Number((await pool.query('SELECT estoque FROM produtos WHERE id = $1', [1])).rows[0].estoque);
      afirmar(atual === estoqueAntes, 'dados de teste removidos e estoque restaurado');
    }
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

executar()
  .then(() => console.log('Smoke test concluído com sucesso.'))
  .catch((error) => { console.error(error.message); process.exitCode = 1; })
  .finally(async () => {
    try { await limpar(); } catch (error) { console.error(`Falha na limpeza: ${error.message}`); process.exitCode = 1; }
    await pool.end();
  });
