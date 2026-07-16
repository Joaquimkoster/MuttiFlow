import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

const moeda = (valor) => Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const numero = (valor, casas = 0) => Number(valor || 0).toLocaleString("pt-BR", { maximumFractionDigits: casas });
const dataCurta = (valor) => new Date(`${valor.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
const statusClass = (status) => `order-status order-status-${String(status).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}`;

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
  const operacao = [
    { label: "Pedidos pagos", valor: numero(resumo.pagos), tone: "success", icon: "check" },
    { label: "Pagamentos pendentes", valor: numero(resumo.pendentes), tone: "warning", icon: "clock" },
    { label: "Entregas hoje", valor: numero(resumo.entregas_hoje), tone: "primary", icon: "delivery" },
    { label: "Entregas atrasadas", valor: numero(resumo.entregas_atrasadas), tone: "danger", icon: "alert" },
  ];
  const relacionamento = [
    { label: "Eventos aguardando", valor: numero(resumo.eventos_aguardando) },
    { label: "Estimativa de eventos", valor: moeda(resumo.faturamento_eventos) },
    { label: "Novos clientes", valor: numero(resumo.novos_clientes), detail: "este mês" },
    { label: "Clientes recorrentes", valor: numero(resumo.clientes_recorrentes) },
    { label: "Média por cliente", valor: numero(resumo.media_pedidos_cliente, 1), detail: "pedidos" },
    { label: "Clientes inativos", valor: numero(resumo.clientes_inativos), detail: "há mais de 60 dias" },
  ];
  const fluxoPedidos = [
    { label: "Agendados", valor: numero(resumo.pedidos_agendados), status: "Agendado" },
    { label: "Confirmados", valor: numero(resumo.pedidos_confirmados), status: "Confirmado" },
    { label: "Preparando", valor: numero(resumo.pedidos_preparando), status: "Preparando" },
    { label: "Prontos", valor: numero(resumo.pedidos_prontos), status: "Pronto" },
    { label: "Em entrega", valor: numero(resumo.pedidos_em_entrega), status: "Saiu para entrega" },
    { label: "Entregues", valor: numero(resumo.pedidos_entregues), status: "Entregue" },
    { label: "Cancelados", valor: numero(resumo.pedidos_cancelados), status: "Cancelado" },
  ];
  const exibindo = (valor) => carregando ? "..." : valor;

  return (
    <AppLayout title="Dashboard" action={<button type="button" className="button dashboard-refresh" onClick={carregarDashboard} disabled={carregando}><span aria-hidden="true">↻</span>{carregando ? "Atualizando..." : "Atualizar dados"}</button>}>
      {erro && <p className="message message-error" role="alert">{erro}</p>}

      <section className="dashboard-overview">
        <article className="dashboard-revenue-card">
          <div className="revenue-card-copy">
            <span className="dashboard-card-label">Faturamento do mês</span>
            <strong>{exibindo(moeda(resumo.faturamento_mes))}</strong>
            <p>Visão consolidada das vendas realizadas</p>
          </div>
          <div className="revenue-periods">
            <div><span>Hoje</span><b>{exibindo(moeda(resumo.faturamento_hoje))}</b></div>
            <div><span>Esta semana</span><b>{exibindo(moeda(resumo.faturamento_semana))}</b></div>
          </div>
          <span className="revenue-decoration" aria-hidden="true" />
        </article>

        <div className="dashboard-operation-grid">
          {operacao.map((item) => <MetricCard key={item.label} {...item} loading={carregando} />)}
        </div>
      </section>

      {dados && <>
        <SectionTitle eyebrow="Pedidos" title="Fluxo dos pedidos" description="Os totais são atualizados conforme o status definido na tela de pedidos." />
        <section className="order-flow-grid">
          {fluxoPedidos.map((item) => <article key={item.status} className="order-flow-card"><span className={statusClass(item.status)}>{item.label}</span><strong>{item.valor}</strong></article>)}
        </section>

        <SectionTitle eyebrow="Desempenho" title="Movimento da operação" description="Acompanhe vendas e volume de pedidos ao longo do tempo." />
        <div className="dashboard-chart-grid">
          <section className="card analytics-panel"><PanelHeader title="Faturamento diário" detail="Últimos 14 dias" badge="R$" /><BarChart data={dados.faturamentoDia} valueKey="valor" labelKey="dia" currency /></section>
          <section className="card analytics-panel"><PanelHeader title="Pedidos por semana" detail="Últimas 8 semanas" badge="Qtd." /><BarChart data={dados.pedidosSemana} valueKey="quantidade" labelKey="semana" /></section>
        </div>

        <SectionTitle eyebrow="Relacionamento" title="Clientes e eventos" description="Indicadores para acompanhar recorrência e novas oportunidades." />
        <section className="dashboard-secondary-metrics">
          {relacionamento.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.valor}</strong>{item.detail && <small>{item.detail}</small>}</article>)}
        </section>

        <SectionTitle eyebrow="Produtos" title="Destaques de vendas" />
        <div className="analytics-grid analytics-grid-three">
          <Ranking title="Produtos mais vendidos" items={dados.produtosMaisVendidos} value={(item) => `${item.quantidade} un`} />
          <Ranking title="Produtos menos vendidos" items={dados.produtosMenosVendidos} value={(item) => `${item.quantidade} un`} />
          <Ranking title="Receita por produto" items={dados.receitaPorProduto} value={(item) => moeda(item.receita)} />
        </div>

        <SectionTitle eyebrow="Agenda" title="Eventos" />
        <div className="analytics-grid analytics-grid-wide">
          <TablePanel title="Próximos eventos" empty="Nenhum evento futuro." headers={["Cliente", "Tipo", "Data", "Valor", "Status"]} rows={dados.proximosEventos.map((evento) => [evento.cliente, evento.tipo, dataCurta(evento.data), evento.valor == null ? "A definir" : moeda(evento.valor), evento.status])} />
          <TablePanel title="Eventos sem confirmação" empty="Nenhum evento aguardando." headers={["Cliente", "Tipo", "Data", "Convidados"]} rows={dados.eventosSemConfirmacao.map((evento) => [evento.cliente, evento.tipo, dataCurta(evento.data), evento.convidados])} />
        </div>

        <SectionTitle eyebrow="Clientes" title="Distribuição e retenção" />
        <div className="analytics-grid analytics-grid-wide">
          <TablePanel title="Regiões com mais pedidos" empty="Sem região informada." headers={["Região", "Pedidos", "Receita"]} rows={dados.regioes.map((regiao) => [regiao.regiao, regiao.pedidos, moeda(regiao.receita)])} />
          <TablePanel title="Clientes sem comprar há 60 dias" empty="Nenhum cliente inativo." headers={["Cliente", "Contato", "Última compra", "Pedidos"]} rows={dados.clientesInativos.map((cliente) => [cliente.cliente, cliente.contato, dataCurta(cliente.ultima_compra), cliente.pedidos])} />
        </div>
      </>}
    </AppLayout>
  );
}

const metricIcons = {
  check: <path d="m7 12 3 3 7-7" />,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 8v5l3 2" /></>,
  delivery: <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  alert: <><path d="M12 4 3 20h18L12 4Z" /><path d="M12 9v5M12 17h.01" /></>,
};

function MetricCard({ label, valor, tone, icon, loading }) {
  return <article className={`dashboard-metric-card metric-${tone}`}><span className="dashboard-metric-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{metricIcons[icon]}</svg></span><div><span>{label}</span><strong>{loading ? "..." : valor}</strong></div></article>;
}

function SectionTitle({ eyebrow, title, description }) {
  return <div className="dashboard-section-title"><div><span>{eyebrow}</span><h2>{title}</h2></div>{description && <p>{description}</p>}</div>;
}

function PanelHeader({ title, detail, badge }) {
  return <header className="analytics-panel-header"><div><h2>{title}</h2><p>{detail}</p></div><span>{badge}</span></header>;
}

function Ranking({ title, items, value }) {
  return <section className="card ranking-panel"><header><h2>{title}</h2><span>{items.length} itens</span></header>{items.length ? <ol>{items.map((item) => <li key={item.nome}><span>{item.nome}</span><strong>{value(item)}</strong></li>)}</ol> : <p className="empty-state">Sem vendas registradas.</p>}</section>;
}

function TablePanel({ title, headers, rows, empty }) {
  return <section className="card table-card analytics-table"><div className="table-panel-title"><h2>{title}</h2><span>{rows.length}</span></div><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row[0]}-${index}`}>{row.map((value, cell) => <td key={cell}>{value}</td>)}</tr>)}{rows.length === 0 && <tr><td colSpan={headers.length}>{empty}</td></tr>}</tbody></table></section>;
}
