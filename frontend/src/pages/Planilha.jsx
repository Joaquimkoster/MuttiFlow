import { useState } from "react";
import AppLayout from "../components/AppLayout";

const preview = [
  { cliente: "Maria", produto: "Bolo", quantidade: 2, valor: "R$ 180,00" },
  { cliente: "João", produto: "Torta", quantidade: 1, valor: "R$ 95,00" },
  { cliente: "Ana", produto: "Cupcake", quantidade: 24, valor: "R$ 240,00" },
];

export default function Planilha() {
  const [arquivo, setArquivo] = useState(null);

  return (
    <AppLayout
      title="Planilha"
      action={
        <button type="button" className="button">
          Importar Planilha
        </button>
      }
    >
      <div className="stack">
        <section className="card file-box">
          <h2>Selecionar Arquivo Excel</h2>

          <input
            className="input"
            type="file"
            accept=".xlsx,.xls"
            onChange={(event) => setArquivo(event.target.files[0])}
          />

          {arquivo && (
            <div className="file-info">
              <p>
                <strong>Arquivo:</strong> {arquivo.name}
              </p>
              <p>
                <strong>Tamanho:</strong> {(arquivo.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </section>

        <section className="card table-card">
          <h2>Pré-visualização</h2>

          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((linha) => (
                <tr key={`${linha.cliente}-${linha.produto}`}>
                  <td>{linha.cliente}</td>
                  <td>{linha.produto}</td>
                  <td>{linha.quantidade}</td>
                  <td>{linha.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AppLayout>
  );
}
