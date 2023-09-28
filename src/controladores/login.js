const knex = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
  const { username, senha } = req.body;

  if (!username || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios" });
  }

  try {
    const usuario = await knex("usuarios")
      .where({ username: username })
      .first();

    if (!usuario) {
      return res.status(404).json({ message: "E-mail ou senha inválido" });
    }

    const senhaHash = await bcrypt.compare(senha, usuario.senha);

    if (!senhaHash) {
      return res.status(404).json({ message: "E-mail ou senha inválido" });
    }

    const dadosToken = { id: usuario.id, username: usuario.username };

    const token = jwt.sign(dadosToken, process.env.SENHAJWT, {
      expiresIn: "12h",
    });

    const { senha: _, ...usuarioLogado } = usuario;

    return res.status(200).json({ usuario: usuarioLogado, token });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = { login };
