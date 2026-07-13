const { pool } = require('../config/database');

async function buscar() {
  const [resumo, produtos, regioes, proximosEventos, clientesInativos, faturamentoDia, pedidosSemana, pedidosRecentes] = await Promise.all([
    pool.query(`
      WITH clientes AS (
        SELECT COALESCE(NULLIF(LOWER(email), ''), whatsapp) chave,
          COUNT(*) pedidos, MIN(criado_em) primeiro, MAX(criado_em) ultimo
        FROM pedidos GROUP BY 1
      )
      SELECT
        COALESCE(SUM(total) FILTER (WHERE criado_em::date = CURRENT_DATE AND status <> 'Cancelado'), 0) faturamento_hoje,
        COALESCE(SUM(total) FILTER (WHERE criado_em >= date_trunc('week', CURRENT_DATE) AND status <> 'Cancelado'), 0) faturamento_semana,
        COALESCE(SUM(total) FILTER (WHERE criado_em >= date_trunc('month', CURRENT_DATE) AND status <> 'Cancelado'), 0) faturamento_mes,
        COUNT(*) FILTER (WHERE pagamento_status = 'Pago') pagos,
        COUNT(*) FILTER (WHERE pagamento_status = 'Pendente') pendentes,
        COUNT(*) FILTER (WHERE status = 'Agendado') pedidos_agendados,
        COUNT(*) FILTER (WHERE status = 'Confirmado') pedidos_confirmados,
        COUNT(*) FILTER (WHERE status = 'Preparando') pedidos_preparando,
        COUNT(*) FILTER (WHERE status = 'Pronto') pedidos_prontos,
        COUNT(*) FILTER (WHERE status = 'Saiu para entrega') pedidos_em_entrega,
        COUNT(*) FILTER (WHERE status = 'Entregue') pedidos_entregues,
        COUNT(*) FILTER (WHERE status = 'Cancelado') pedidos_cancelados,
        COUNT(*) FILTER (WHERE data_entrega = CURRENT_DATE AND status NOT IN ('Entregue','Cancelado')) entregas_hoje,
        COUNT(*) FILTER (WHERE data_entrega < CURRENT_DATE AND status NOT IN ('Entregue','Cancelado')) entregas_atrasadas,
        (SELECT COUNT(*) FROM clientes WHERE primeiro >= date_trunc('month', CURRENT_DATE)) novos_clientes,
        (SELECT COUNT(*) FROM clientes WHERE pedidos > 1) clientes_recorrentes,
        COALESCE((SELECT AVG(pedidos) FROM clientes), 0) media_pedidos_cliente,
        (SELECT COUNT(*) FROM clientes WHERE ultimo < CURRENT_DATE - INTERVAL '60 days') clientes_inativos,
        (SELECT COUNT(*) FROM eventos WHERE status = 'Aguardando') eventos_aguardando,
        COALESCE((SELECT SUM(valor) FROM eventos WHERE status <> 'Cancelado'), 0) faturamento_eventos
      FROM pedidos
    `),
    pool.query(`
      SELECT pi.produto_nome nome, SUM(pi.quantidade)::int quantidade,
        SUM(pi.quantidade * pi.preco_unitario) receita
      FROM pedido_itens pi JOIN pedidos p ON p.id = pi.pedido_id
      WHERE p.status <> 'Cancelado'
      GROUP BY pi.produto_nome ORDER BY quantidade DESC, receita DESC
    `),
    pool.query(`
      SELECT COALESCE(NULLIF(bairro,''), NULLIF(cidade,''), 'Não informado') regiao,
        COUNT(*)::int pedidos, SUM(total) receita
      FROM pedidos WHERE status <> 'Cancelado'
      GROUP BY 1 ORDER BY pedidos DESC, receita DESC LIMIT 8
    `),
    pool.query(`SELECT id, cliente, tipo, data, horario, convidados, valor, status
      FROM eventos WHERE data >= CURRENT_DATE AND status <> 'Cancelado'
      ORDER BY data, horario LIMIT 8`),
    pool.query(`
      SELECT COALESCE(NULLIF(email,''), whatsapp) contato, MAX(cliente_nome) cliente,
        MAX(criado_em) ultima_compra, COUNT(*)::int pedidos
      FROM pedidos GROUP BY COALESCE(NULLIF(email,''), whatsapp)
      HAVING MAX(criado_em) < CURRENT_DATE - INTERVAL '60 days'
      ORDER BY ultima_compra LIMIT 8
    `),
    pool.query(`
      SELECT serie.dia::date dia, COALESCE(SUM(p.total) FILTER (WHERE p.status <> 'Cancelado'),0) valor
      FROM generate_series(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, INTERVAL '1 day') serie(dia)
      LEFT JOIN pedidos p ON p.criado_em::date = serie.dia::date
      GROUP BY serie.dia ORDER BY serie.dia
    `),
    pool.query(`
      SELECT serie.semana::date semana, COUNT(p.id)::int quantidade
      FROM generate_series(date_trunc('week', CURRENT_DATE) - INTERVAL '7 weeks', date_trunc('week', CURRENT_DATE), INTERVAL '1 week') serie(semana)
      LEFT JOIN pedidos p ON date_trunc('week', p.criado_em) = serie.semana AND p.status <> 'Cancelado'
      GROUP BY serie.semana ORDER BY serie.semana
    `),
    pool.query(`
      SELECT id, cliente_nome, total, pagamento_status, data_entrega, horario, status, atualizado_em
      FROM pedidos
      ORDER BY atualizado_em DESC, id DESC
      LIMIT 10
    `),
  ]);

  const ranking = produtos.rows;
  return {
    resumo: resumo.rows[0],
    produtosMaisVendidos: ranking.slice(0, 5),
    produtosMenosVendidos: [...ranking].sort((a, b) => Number(a.quantidade) - Number(b.quantidade)).slice(0, 5),
    receitaPorProduto: ranking,
    regioes: regioes.rows,
    proximosEventos: proximosEventos.rows,
    eventosSemConfirmacao: proximosEventos.rows.filter((evento) => evento.status === 'Aguardando'),
    clientesInativos: clientesInativos.rows,
    faturamentoDia: faturamentoDia.rows,
    pedidosSemana: pedidosSemana.rows,
    pedidosRecentes: pedidosRecentes.rows,
  };
}

module.exports = { buscar };
