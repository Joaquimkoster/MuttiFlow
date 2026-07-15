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

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <h1>Diê Mutti</h1>
      </div>

      <div className="auth-panel">
        <form className="auth-form" onSubmit={cadastrar}>
          <h2>Criar Conta</h2>
          <input
            className="input"
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            required
          />
          <input
            className="input"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="new-password"
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmacaoSenha}
            onChange={(e) => setConfirmacaoSenha(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            className="button"
            type="submit"
            disabled={carregando}
          >
            {carregando ? "Criando conta..." : "Criar Conta"}
          </button>
          {erro && (
            <p role="alert" className="message message-error">
              {erro}
            </p>
          )}
          {sucesso && (
            <p role="status" className="message message-success">
              {sucesso}
            </p>
          )}
          <p className="auth-switch">
            Já possui conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="link-button"
            >
              Fazer login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
