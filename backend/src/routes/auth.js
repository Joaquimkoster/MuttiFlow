const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../database/db");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/cadastro", async (req, res) => {
  try {
    const nome = req.body.nome?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Nome, e-mail e senha são obrigatórios" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ erro: "Informe um e-mail válido" });
    }

    if (senha.length < 6) {
      return res.status(400).json({ erro: "A senha deve ter pelo menos 6 caracteres" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await pool.query(
      `
      INSERT INTO usuarios
      (nome, email, senha)
      VALUES
      ($1, $2, $3)
      RETURNING id, nome, email
      `,
      [nome, email, senhaHash]
    );

    res.status(201).json({ mensagem: "Usuário criado com sucesso", usuario: usuario.rows[0] });

  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({ erro: "Já existe uma conta com este e-mail" });
    }

    res.status(500).json({
      erro: "Erro ao cadastrar"
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "E-mail e senha são obrigatórios" });
    }

    const usuario = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (usuario.rows.length === 0) {
      return res.status(401).json({
        erro: "E-mail ou senha inválidos"
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.rows[0].senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        erro: "E-mail ou senha inválidos"
      });
    }

    const token = jwt.sign(
      { id: usuario.rows[0].id },
      process.env.JWT_SECRET || "desenvolvimento-apenas-altere-em-producao",
      { expiresIn: "8h" }
    );

    res.json({ token, usuario: { id: usuario.rows[0].id, nome: usuario.rows[0].nome, email: usuario.rows[0].email } });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao fazer login"
    });
  }
});

module.exports = router;
