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
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
      }}
    >
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
          style={{
            fontSize: "4rem",
            marginBottom: "20px",
            color: "#60a5fa",
          }}
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
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            width: "400px",
          }}
        >
          <h2
            style={{
              marginBottom: "25px",
              color: "#0f172a",
            }}
          >
            Entrar
          </h2>

          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "15px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />

          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
            required
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />

          <button
            type="submit"
            disabled={carregando}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          {erro && (
            <p role="alert" style={{ color: "#b91c1c", marginTop: "14px", fontSize: "14px" }}>
              {erro}
            </p>
          )}

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              onClick={handleRecuperarSenha}
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Esqueci minha senha
            </span>

            <span
              onClick={handleCadastro}
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Criar conta
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
