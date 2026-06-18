import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    if (!email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    console.log("Email:", email);
    console.log("Senha:", senha);
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
      {/* Lado esquerdo */}
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

        <p
          style={{
            fontSize: "1.3rem",
            maxWidth: "500px",
            lineHeight: "1.6",
          }}
        >
          Sistema de gestão de pedidos via WhatsApp, controle de estoque,
          clientes e entregas em tempo real.
        </p>
      </div>

      {/* Lado direito */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#f8fafc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
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
            onClick={handleLogin}
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
            Entrar
          </button>

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
        </div>
      </div>
    </div>
  );
}