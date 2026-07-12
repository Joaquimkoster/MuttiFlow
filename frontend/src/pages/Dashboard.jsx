import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

const moeda = (valor) => Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const numero = (valor, casas = 0) => Number(valor || 0).toLocaleString("pt-BR", { maximumFractionDigits: casas });
const dataCurta = (valor) => new Date(`${valor.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

function BarChart({ data, valueKey, labelKey, currency = false }) {
  const maximo = Math.max(...data.map((item) => Number(item[valueKey])), 1);
  return (
    <div className="bar-chart">
      {data.map((item) => (
        <div className="bar-column" key={item[labelKey]} title={currency ? moeda(item[valueKey]) : numero(item[valueKey])}>
          <span className="bar-value">{currency ? moeda(item[valueKey]) : numero(item[valueKey])}</span>
          <span className="bar-track"><span className="bar-fill" style={{ height: `${Math.max((Number(item[valueKey]) / maximo) * 100, 2)}%` }} /></span>
          <span className="bar-label">{dataCurta(item[labelKey])}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregarDashboard() {
    setCarregando(true);
    try {
      setErro("");
      const { data } = await api.get("/dashboard");
      setDados(data);
    } catch (error) {
      setErro(error.response?.data?.erro || "Não foi possível carregar os indicadores.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(carregarDashboard, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const resumo = dados?.resumo || {};
  const metricas = [
    ["Faturamento hoje", moeda(resumo.faturamento_hoje)],
    ["Faturamento semana", moeda(resumo.faturamento_semana)],
    ["Faturamento mês", moeda(resumo.faturamento_mes)],
    ["Pedidos pagos", numero(resumo.pagos)],
    ["Pagamentos pendentes", numero(resumo.pendentes)],
    ["Eventos aguardando", numero(resumo.eventos_aguardando)],
    ["Estimativa de eventos", moeda(resumo.faturamento_eventos)],
    ["Novos clientes no mês", numero(resumo.novos_clientes)],
    ["Clientes recorrentes", numero(resumo.clientes_recorrentes)],
    ["Média por cliente", numero(resumo.media_pedidos_cliente, 1)],
    ["Clientes inativos (60 dias)", numero(resumo.clientes_inativos)],
    ["Entregas hoje", numero(resumo.entregas_hoje)],
    ["Entregas atrasadas", numero(resumo.entregas_atrasadas)],
  ];

  return (
    <AppLayout title="Dashboard" action={<button type="button" className="button" onClick={carregarDashboard}>Atualizar</button>}>
      {erro && <p className="message message-error" role="alert">{erro}</p>}
      <section className="stats-grid dashboard-stats">
        {metricas.map(([label, valor]) => <article className="card stat-card" key={label}><h3>{label}</h3><strong>{carregando ? "..." : valor}</strong></article>)}
      </section>

      {dados && <>
        <section className="card analytics-panel weekly-panel"><h2>Faturamento por dia</h2><p>Últimos 14 dias</p><BarChart data={dados.faturamentoDia} valueKey="valor" labelKey="dia" currency /></section>

        <section className="card analytics-panel weekly-panel"><h2>Pedidos por semana</h2><p>Últimas 8 semanas</p><BarChart data={dados.pedidosSemana} valueKey="quantidade" labelKey="semana" /></section>

        <div className="analytics-grid analytics-grid-three">
          <Ranking title="Produtos mais vendidos" items={dados.produtosMaisVendidos} value={(item) => `${item.quantidade} un`} />
          <Ranking title="Produtos menos vendidos" items={dados.produtosMenosVendidos} value={(item) => `${item.quantidade} un`} />
          <Ranking title="Receita por produto" items={dados.receitaPorProduto} value={(item) => moeda(item.receita)} />
        </div>

        <div className="analytics-grid analytics-grid-wide">
          <TablePanel title="Próximos eventos" empty="Nenhum evento futuro." headers={["Cliente", "Tipo", "Data", "Valor", "Status"]} rows={dados.proximosEventos.map((evento) => [evento.cliente, evento.tipo, dataCurta(evento.data), evento.valor == null ? "A definir" : moeda(evento.valor), evento.status])} />
          <TablePanel title="Eventos sem confirmação" empty="Nenhum evento aguardando." headers={["Cliente", "Tipo", "Data", "Convidados"]} rows={dados.eventosSemConfirmacao.map((evento) => [evento.cliente, evento.tipo, dataCurta(evento.data), evento.convidados])} />
        </div>

        <div className="analytics-grid analytics-grid-wide">
          <TablePanel title="Regiões com mais pedidos" empty="Sem região informada." headers={["Região", "Pedidos", "Receita"]} rows={dados.regioes.map((regiao) => [regiao.regiao, regiao.pedidos, moeda(regiao.receita)])} />
          <TablePanel title="Clientes sem comprar há 60 dias" empty="Nenhum cliente inativo." headers={["Cliente", "Contato", "Última compra", "Pedidos"]} rows={dados.clientesInativos.map((cliente) => [cliente.cliente, cliente.contato, dataCurta(cliente.ultima_compra), cliente.pedidos])} />
        </div>
      </>}
    </AppLayout>
  );
}

function Ranking({ title, items, value }) {
  return <section className="card ranking-panel"><h2>{title}</h2>{items.length ? <ol>{items.map((item) => <li key={item.nome}><span>{item.nome}</span><strong>{value(item)}</strong></li>)}</ol> : <p className="empty-state">Sem vendas registradas.</p>}</section>;
}

function TablePanel({ title, headers, rows, empty }) {
  return <section className="card table-card analytics-table"><h2>{title}</h2><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row[0]}-${index}`}>{row.map((value, cell) => <td key={`${cell}-${value}`}>{value}</td>)}</tr>)}{rows.length === 0 && <tr><td colSpan={headers.length}>{empty}</td></tr>}</tbody></table></section>;
}
