import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const cadastrar = async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/cadastro",
        {
          nome,
          email,
          senha,
        }
      );

      alert("Conta criada com sucesso!");
      navigate("/");
    } catch (error) {
      alert("Erro ao criar conta");
      console.error(error);
    }
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
            color: "#60a5fa",
            marginBottom: "20px",
          }}
        >
          MuttiFlow
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            maxWidth: "500px",
            lineHeight: "1.6",
          }}
        >
          Crie sua conta para acessar o sistema de gestão de pedidos,
          estoque, clientes e entregas.
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
            Criar Conta
          </h2>

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "15px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "15px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
          />

          <button
            onClick={cadastrar}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Criar Conta
          </button>

          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            Já possui conta?
            <span
              onClick={() => navigate("/")}
              style={{
                color: "#2563eb",
                cursor: "pointer",
                marginLeft: "5px",
              }}
            >
              Fazer login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}