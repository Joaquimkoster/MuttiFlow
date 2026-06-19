import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const cadastrar = async (event) => {
    event.preventDefault();

    if (!nome.trim() || !email.trim() || !senha || !confirmacaoSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmacaoSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setErro("");
      setSucesso("");
      setCarregando(true);
      await api.post("/auth/cadastro", {
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });
      setSucesso("Conta criada com sucesso. Redirecionando para o login...");
      window.setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setErro(
        error.response?.data?.erro ||
          "Não foi possível criar a conta. Tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
  };

  return (
    <div style={{ display: "flex", width: "100vw", minHeight: "100vh" }}>
      <div
        style={{
          flex: 1,
          backgroundColor: "#0f172a",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <h1
          style={{ fontSize: "4rem", color: "#60a5fa", marginBottom: "20px" }}
        >
          MuttiFlow
        </h1>
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: "#f8fafc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "32px",
        }}
      >
        <form onSubmit={cadastrar} style={{ width: "400px", maxWidth: "100%" }}>
          <h2 style={{ marginBottom: "25px", color: "#0f172a" }}>
            Criar Conta
          </h2>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            required
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="new-password"
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Confirme sua senha"
            value={confirmacaoSenha}
            onChange={(e) => setConfirmacaoSenha(e.target.value)}
            autoComplete="new-password"
            required
            style={{ ...inputStyle, marginBottom: "20px" }}
          />
          <button
            type="submit"
            disabled={carregando}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: carregando ? "#93c5fd" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: carregando ? "wait" : "pointer",
              fontWeight: "bold",
            }}
          >
            {carregando ? "Criando conta..." : "Criar Conta"}
          </button>
          {erro && (
            <p
              role="alert"
              style={{ color: "#b91c1c", marginTop: "14px", fontSize: "14px" }}
            >
              {erro}
            </p>
          )}
          {sucesso && (
            <p
              role="status"
              style={{ color: "#15803d", marginTop: "14px", fontSize: "14px" }}
            >
              {sucesso}
            </p>
          )}
          <p style={{ marginTop: "20px", textAlign: "center" }}>
            Já possui conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                color: "#2563eb",
                cursor: "pointer",
                border: 0,
                background: "none",
                fontSize: "inherit",
              }}
            >
              Fazer login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
