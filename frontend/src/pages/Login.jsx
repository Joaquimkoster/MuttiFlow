import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    try {
      setErro("");
      setCarregando(true);

      const { data } = await api.post("/auth/login", { email, senha });
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

  const handleRecuperarSenha = () => {
    alert("Tela de recuperação de senha em desenvolvimento");
  };

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
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            className="input"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
          />

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
              onClick={handleRecuperarSenha}
              className="link-button"
            >
              Esqueci minha senha
            </button>

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
