import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

const formularioVazio = {
  nome: "",
  categoria: "Ingredientes",
  quantidade: "",
  unidade: "kg",
  minimo: "",
  validade: "",
};

export default function Estoque() {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [categoria, setCategoria] = useState("");
  const [formulario, setFormulario] = useState(formularioVazio);
  const [editandoId, setEditandoId] = useState(null);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarEstoque() {
    try {
      setErro("");
      const { data } = await api.get("/estoque");
      setProdutos(data);
    } catch {
      setErro("Não foi possível carregar o estoque.");
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(carregarEstoque, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const categorias = useMemo(
    () => [...new Set(produtos.map((produto) => produto.categoria))].sort(),
    [produtos],
  );

  const produtosFiltrados = produtos.filter((produto) => {
    const nomeCompativel = produto.nome.toLowerCase().includes(pesquisa.toLowerCase());
    const categoriaCompativel = !categoria || produto.categoria === categoria;
    return nomeCompativel && categoriaCompativel;
  });

  function abrirCadastro() {
    setFormulario(formularioVazio);
    setEditandoId(null);
    setErro("");
    setFormularioAberto(true);
  }

  function abrirEdicao(produto) {
    setFormulario({
      nome: produto.nome,
      categoria: produto.categoria,
      quantidade: produto.quantidade,
      unidade: produto.unidade,
      minimo: produto.minimo,
      validade: produto.validade ? produto.validade.slice(0, 10) : "",
    });
    setEditandoId(produto.id);
    setErro("");
    setFormularioAberto(true);
  }

  function alterarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  async function salvar(event) {
    event.preventDefault();
    setSalvando(true);
    setErro("");

    try {
      if (editandoId) {
        await api.put(`/estoque/${editandoId}`, formulario);
      } else {
        await api.post("/estoque", formulario);
      }
      setFormularioAberto(false);
      await carregarEstoque();
    } catch (error) {
      setErro(error.response?.data?.erro || "Não foi possível salvar o item.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(produto) {
    if (!window.confirm(`Excluir ${produto.nome} do estoque?`)) return;

    try {
      setErro("");
      await api.delete(`/estoque/${produto.id}`);
      setProdutos((atuais) => atuais.filter((item) => item.id !== produto.id));
    } catch (error) {
      setErro(error.response?.data?.erro || "Não foi possível excluir o item.");
    }
  }

  return (
    <AppLayout
      title="Estoque"
      action={<button type="button" className="button" onClick={abrirCadastro}>+ Novo Item</button>}
    >
      {formularioAberto && (
        <form className="inventory-form" onSubmit={salvar}>
          <h2>{editandoId ? "Editar item" : "Novo item de estoque"}</h2>
          <div className="inventory-form-grid">
            <label>Nome<input className="input" name="nome" value={formulario.nome} onChange={alterarCampo} required /></label>
            <label>Categoria<input className="input" name="categoria" value={formulario.categoria} onChange={alterarCampo} required /></label>
            <label>Quantidade<input className="input" name="quantidade" type="number" min="0" step="0.01" value={formulario.quantidade} onChange={alterarCampo} required /></label>
            <label>Unidade<input className="input" name="unidade" value={formulario.unidade} onChange={alterarCampo} placeholder="kg, un, L" required /></label>
            <label>Estoque mínimo<input className="input" name="minimo" type="number" min="0" step="0.01" value={formulario.minimo} onChange={alterarCampo} required /></label>
            <label>Validade<input className="input" name="validade" type="date" value={formulario.validade} onChange={alterarCampo} /></label>
          </div>
          <div className="row-actions">
            <button className="button" type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</button>
            <button className="button button-secondary" type="button" onClick={() => setFormularioAberto(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {erro && <p className="message message-error" role="alert">{erro}</p>}

      <div className="filters">
        <input className="input" type="search" placeholder="Pesquisar item..." value={pesquisa} onChange={(event) => setPesquisa(event.target.value)} />
        <select className="select" value={categoria} onChange={(event) => setCategoria(event.target.value)}>
          <option value="">Todas as categorias</option>
          {categorias.map((nome) => <option key={nome} value={nome}>{nome}</option>)}
        </select>
      </div>

      <section className="card table-card">
        <table className="data-table">
          <thead><tr><th>Item</th><th>Categoria</th><th>Quantidade</th><th>Unidade</th><th>Mínimo</th><th>Validade</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {produtosFiltrados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td><td>{produto.categoria}</td><td>{Number(produto.quantidade)}</td><td>{produto.unidade}</td><td>{Number(produto.minimo)}</td>
                <td>{produto.validade ? new Date(`${produto.validade.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR") : "-"}</td>
                <td><span className={`stock-status stock-status-${produto.status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>{produto.status}</span></td>
                <td><div className="row-actions"><button type="button" className="button button-small" onClick={() => abrirEdicao(produto)}>Editar</button><button type="button" className="button button-small button-danger" onClick={() => excluir(produto)}>Excluir</button></div></td>
              </tr>
            ))}
            {produtosFiltrados.length === 0 && <tr><td colSpan="8">Nenhum item encontrado.</td></tr>}
          </tbody>
        </table>
      </section>
    </AppLayout>
  );
}
