import { useEffect, useRef, useState } from "react";
import AppLayout from "../components/AppLayout";

const STORAGE_KEY = "muttiflow_calculadora_receitas";
const unidades = ["g", "kg", "ml", "L", "un", "pacote", "caixa"];

function criarId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `ingrediente-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function linhaVazia() {
  return {
    id: criarId(),
    ingrediente: "",
    quantidadeUsada: "",
    unidade: "g",
    quantidadeComprada: "",
    precoCompra: "",
  };
}

function estadoInicial() {
  try {
    const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      nomeReceita: salvo?.nomeReceita || "",
      rendimento: salvo?.rendimento || "",
      precoVenda: salvo?.precoVenda || "",
      linhas: salvo?.linhas?.length ? salvo.linhas : [linhaVazia(), linhaVazia(), linhaVazia()],
    };
  } catch {
    return { nomeReceita: "", rendimento: "", precoVenda: "", linhas: [linhaVazia(), linhaVazia(), linhaVazia()] };
  }
}

function numero(valor) {
  if (typeof valor === "number") return valor;
  const texto = String(valor ?? "").trim().replace(/\s/g, "");
  if (!texto) return 0;
  const normalizado = texto.includes(",")
    ? texto.replace(/\./g, "").replace(",", ".")
    : texto;
  return Number(normalizado) || 0;
}

function dinheiro(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function custoDaLinha(linha) {
  const comprada = numero(linha.quantidadeComprada);
  if (!comprada) return 0;
  return (numero(linha.quantidadeUsada) / comprada) * numero(linha.precoCompra);
}

function separarCsv(texto) {
  const primeiraLinha = texto.split(/\r?\n/, 1)[0] || "";
  const delimitador = (primeiraLinha.match(/;/g) || []).length >= (primeiraLinha.match(/,/g) || []).length ? ";" : ",";
  const linhas = [];
  let atual = "";
  let linha = [];
  let entreAspas = false;

  for (let i = 0; i < texto.length; i += 1) {
    const caractere = texto[i];
    if (caractere === '"' && entreAspas && texto[i + 1] === '"') {
      atual += '"';
      i += 1;
    } else if (caractere === '"') {
      entreAspas = !entreAspas;
    } else if (caractere === delimitador && !entreAspas) {
      linha.push(atual.trim());
      atual = "";
    } else if ((caractere === "\n" || caractere === "\r") && !entreAspas) {
      if (caractere === "\r" && texto[i + 1] === "\n") i += 1;
      linha.push(atual.trim());
      if (linha.some(Boolean)) linhas.push(linha);
      linha = [];
      atual = "";
    } else {
      atual += caractere;
    }
  }
  linha.push(atual.trim());
  if (linha.some(Boolean)) linhas.push(linha);
  return linhas;
}

function chaveCabecalho(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export default function CustosReceitas() {
  const arquivoRef = useRef(null);
  const [inicial] = useState(estadoInicial);
  const [nomeReceita, setNomeReceita] = useState(inicial.nomeReceita);
  const [rendimento, setRendimento] = useState(inicial.rendimento);
  const [precoVenda, setPrecoVenda] = useState(inicial.precoVenda);
  const [linhas, setLinhas] = useState(inicial.linhas);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nomeReceita, rendimento, precoVenda, linhas }));
    } catch {
      // Os cálculos continuam funcionando mesmo quando o navegador bloqueia o armazenamento local.
    }
  }, [nomeReceita, rendimento, precoVenda, linhas]);

  const custoTotal = linhas.reduce((total, linha) => total + custoDaLinha(linha), 0);
  const custoUnidade = numero(rendimento) ? custoTotal / numero(rendimento) : 0;
  const faturamento = numero(rendimento) * numero(precoVenda);
  const lucro = faturamento - custoTotal;
  const margem = faturamento ? (lucro / faturamento) * 100 : 0;

  function alterarLinha(id, campo, valor) {
    setLinhas((atuais) => atuais.map((linha) => linha.id === id ? { ...linha, [campo]: valor } : linha));
  }

  function removerLinha(id) {
    setLinhas((atuais) => atuais.length === 1 ? [linhaVazia()] : atuais.filter((linha) => linha.id !== id));
  }

  async function importarCsv(evento) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;
    if (!arquivo.name.toLowerCase().endsWith(".csv")) {
      setAviso("Por enquanto, importe um arquivo CSV. O suporte ao Excel será ajustado quando você enviar a planilha original.");
      return;
    }

    const dados = separarCsv(await arquivo.text());
    if (dados.length < 2) {
      setAviso("O CSV não possui linhas de ingredientes para importar.");
      return;
    }

    const cabecalhos = dados[0].map(chaveCabecalho);
    const procurar = (...nomes) => cabecalhos.findIndex((item) => nomes.includes(item));
    const indices = {
      ingrediente: procurar("ingrediente", "insumo", "produto"),
      quantidadeUsada: procurar("quantidadeusada", "qtdusada", "quantidade", "qtd"),
      unidade: procurar("unidade", "und"),
      quantidadeComprada: procurar("quantidadecomprada", "qtdcomprada", "quantidadeembalagem", "qtdembalagem"),
      precoCompra: procurar("precocompra", "preco", "valorcompra", "valor"),
    };

    if (indices.ingrediente < 0) {
      setAviso("Não encontrei a coluna “Ingrediente” no CSV. Use o modelo disponível nesta tela.");
      return;
    }

    const importadas = dados.slice(1).map((colunas) => ({
      id: criarId(),
      ingrediente: colunas[indices.ingrediente] || "",
      quantidadeUsada: indices.quantidadeUsada >= 0 ? colunas[indices.quantidadeUsada] || "" : "",
      unidade: indices.unidade >= 0 ? colunas[indices.unidade] || "g" : "g",
      quantidadeComprada: indices.quantidadeComprada >= 0 ? colunas[indices.quantidadeComprada] || "" : "",
      precoCompra: indices.precoCompra >= 0 ? colunas[indices.precoCompra] || "" : "",
    })).filter((linha) => linha.ingrediente);

    setLinhas(importadas.length ? importadas : [linhaVazia()]);
    setAviso(`${importadas.length} ingrediente(s) importado(s) de ${arquivo.name}.`);
  }

  function baixarModelo() {
    const conteudo = "Ingrediente;Quantidade usada;Unidade;Quantidade comprada;Preco compra\nFarinha;500;g;1000;8,50\n";
    const blob = new Blob([`\uFEFF${conteudo}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "modelo-custos-receita.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function limpar() {
    setNomeReceita("");
    setRendimento("");
    setPrecoVenda("");
    setLinhas([linhaVazia(), linhaVazia(), linhaVazia()]);
    setAviso("Nova ficha iniciada.");
  }

  return (
    <AppLayout
      title="Custos e receitas"
      action={<button type="button" className="button button-secondary" onClick={limpar}>Nova ficha</button>}
    >
      <input ref={arquivoRef} className="visually-hidden" type="file" accept=".csv,text/csv" onChange={importarCsv} />

      <section className="recipe-toolbar card">
        <div>
          <span className="recipe-kicker">Planilha de cálculo</span>
          <h2>Ficha técnica da receita</h2>
          <p>Os dados são calculados automaticamente e ficam salvos neste navegador.</p>
        </div>
        <div className="recipe-toolbar-actions">
          <button type="button" className="button button-secondary" onClick={baixarModelo}>Baixar modelo CSV</button>
          <button type="button" className="button" onClick={() => arquivoRef.current?.click()}>Importar planilha</button>
        </div>
      </section>

      {aviso && <p className="message recipe-message" role="status">{aviso}</p>}

      <section className="recipe-settings card">
        <label>Nome da receita<input className="input" value={nomeReceita} onChange={(e) => setNomeReceita(e.target.value)} placeholder="Ex.: Lasanha bolonhesa" /></label>
        <label>Rendimento (porções)<input className="input" inputMode="decimal" value={rendimento} onChange={(e) => setRendimento(e.target.value)} placeholder="Ex.: 10" /></label>
        <label>Preço por porção<input className="input" inputMode="decimal" value={precoVenda} onChange={(e) => setPrecoVenda(e.target.value)} placeholder="R$ 0,00" /></label>
      </section>

      <section className="recipe-summary">
        <article><span>Custo da receita</span><strong>{dinheiro(custoTotal)}</strong><small>Soma dos ingredientes</small></article>
        <article><span>Custo por porção</span><strong>{dinheiro(custoUnidade)}</strong><small>Receita ÷ rendimento</small></article>
        <article><span>Lucro estimado</span><strong className={lucro < 0 ? "negative" : ""}>{dinheiro(lucro)}</strong><small>{dinheiro(faturamento)} de faturamento</small></article>
        <article><span>Margem estimada</span><strong className={margem < 0 ? "negative" : ""}>{margem.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%</strong><small>Lucro ÷ faturamento</small></article>
      </section>

      <section className="card recipe-sheet">
        <div className="recipe-sheet-header">
          <div><h2>Ingredientes</h2><p>Informe quanto foi usado e o preço da embalagem comprada.</p></div>
          <button type="button" className="button button-secondary button-small" onClick={() => setLinhas((atuais) => [...atuais, linhaVazia()])}>+ Adicionar ingrediente</button>
        </div>
        <div className="recipe-table-wrap">
          <table className="recipe-table">
            <thead><tr><th>Ingrediente</th><th>Qtd. usada</th><th>Unidade</th><th>Qtd. comprada</th><th>Preço da compra</th><th>Custo usado</th><th><span className="visually-hidden">Ações</span></th></tr></thead>
            <tbody>
              {linhas.map((linha) => (
                <tr key={linha.id}>
                  <td><input aria-label="Ingrediente" value={linha.ingrediente} onChange={(e) => alterarLinha(linha.id, "ingrediente", e.target.value)} placeholder="Nome do ingrediente" /></td>
                  <td><input aria-label="Quantidade usada" inputMode="decimal" value={linha.quantidadeUsada} onChange={(e) => alterarLinha(linha.id, "quantidadeUsada", e.target.value)} placeholder="0" /></td>
                  <td><select aria-label="Unidade" value={linha.unidade} onChange={(e) => alterarLinha(linha.id, "unidade", e.target.value)}>{unidades.map((unidade) => <option key={unidade}>{unidade}</option>)}</select></td>
                  <td><input aria-label="Quantidade comprada" inputMode="decimal" value={linha.quantidadeComprada} onChange={(e) => alterarLinha(linha.id, "quantidadeComprada", e.target.value)} placeholder="0" /></td>
                  <td><input aria-label="Preço da compra" inputMode="decimal" value={linha.precoCompra} onChange={(e) => alterarLinha(linha.id, "precoCompra", e.target.value)} placeholder="R$ 0,00" /></td>
                  <td className="recipe-line-cost">{dinheiro(custoDaLinha(linha))}</td>
                  <td><button type="button" className="recipe-remove" onClick={() => removerLinha(linha.id)} aria-label={`Remover ${linha.ingrediente || "ingrediente"}`} title="Remover">×</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan="5">Custo total dos ingredientes</td><td>{dinheiro(custoTotal)}</td><td /></tr></tfoot>
          </table>
        </div>
      </section>
    </AppLayout>
  );
}
