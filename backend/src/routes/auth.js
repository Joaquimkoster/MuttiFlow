const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../database/db");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/cadastro", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query(
      `
      INSERT INTO usuarios
      (nome, email, senha)
      VALUES
      ($1, $2, $3)
      `,
      [nome, email, senhaHash]
    );

    res.status(201).json({
      mensagem: "Usuário criado com sucesso"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao cadastrar"
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (usuario.rows.length === 0) {
      return res.status(401).json({
        erro: "Usuário não encontrado"
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.rows[0].senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        erro: "Senha incorreta"
      });
    }

    const token = jwt.sign(
      { id: usuario.rows[0].id },
      "segredo"
    );

    res.json({ token });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao fazer login"
    });
  }
});

module.exports = router;