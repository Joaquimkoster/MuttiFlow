import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!nome.trim() || !senha) {
      setErro("Preencha nome e senha.");
      return;
    }

    try {
      setErro("");
      setCarregando(true);

      const { data } = await api.post("/auth/login", {
        nome: nome.trim(),
        senha,
      });
      localStorage.setItem("muttiflow_token", data.token);
      localStorage.setItem("muttiflow_usuario", JSON.stringify(data.usuario));
      navigate("/dashboard");
    } catch (error) {
      setErro(error.response?.data?.erro || "Não foi possível entrar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const handleCadastro = () => {
    navigate("/cadastro");
  };

  if (localStorage.getItem("muttiflow_token")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <h1>MuttiFlow</h1>
      </div>

      <div className="auth-panel">
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Entrar</h2>

          <input
            className="input"
            type="text"
            placeholder="Digite seu nome"
            aria-label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="username"
            required
          />

          <div className="password-field">
            <input
              className="input"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Digite sua senha"
              aria-label="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setMostrarSenha((valorAtual) => !valorAtual)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9 5 9 5a15.7 15.7 0 01-2.1 2.4M6.2 6.2C4.2 7.6 3 9 3 9s3.5 5 9 5a10.7 10.7 0 004-.8" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              )}
            </button>
          </div>

          <button
            className="button"
            type="submit"
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          {erro && (
            <p role="alert" className="message message-error">
              {erro}
            </p>
          )}

          <div className="auth-links">
            <button
              type="button"
              onClick={handleCadastro}
              className="link-button"
            >
              Criar conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
