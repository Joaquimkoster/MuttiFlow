import { useState } from "react";
import AppLayout from "../components/AppLayout";

const produtos = [
  {
    id: 1,
    nome: "Farinha de Trigo",
    categoria: "Ingredientes",
    quantidade: 30,
    unidade: "kg",
    minimo: 10,
    validade: "15/10/2026",
    status: "Disponível",
  },
  {
    id: 2,
    nome: "Chocolate Meio Amargo",
    categoria: "Ingredientes",
    quantidade: 5,
    unidade: "kg",
    minimo: 10,
    validade: "20/09/2026",
    status: "Baixo",
  },
  {
    id: 3,
    nome: "Caixas para Bolo",
    categoria: "Embalagens",
    quantidade: 120,
    unidade: "un",
    minimo: 50,
    validade: "-",
    status: "Disponível",
  },
];

export default function Estoque() {
  const [pesquisa, setPesquisa] = useState("");

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  return (
    <AppLayout
      title="Estoque"
      action={
        <button type="button" className="button">
          + Novo Produto
        </button>
      }
    >
      <div className="filters">
        <input
          className="input"
          type="text"
          placeholder="Pesquisar produto..."
          value={pesquisa}
          onChange={(event) => setPesquisa(event.target.value)}
        />

        <select className="select">
          <option>Todas Categorias</option>
          <option>Ingredientes</option>
          <option>Embalagens</option>
          <option>Bebidas</option>
          <option>Utensílios</option>
        </select>
      </div>

      <section className="card table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Unidade</th>
              <th>Mínimo</th>
              <th>Validade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.nome}</td>
                <td>{produto.categoria}</td>
                <td>{produto.quantidade}</td>
                <td>{produto.unidade}</td>
                <td>{produto.minimo}</td>
                <td>{produto.validade}</td>
                <td>{produto.status}</td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="button button-small">
                      Editar
                    </button>
                    <button
                      type="button"
                      className="button button-small button-danger"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppLayout>
  );
}
