const jwt = require("jsonwebtoken");
const knex = require("../conexao");
require("dotenv").config();

const verificarTokenAutenticacao = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.SENHAJWT);

    const usuarioExiste = await knex("usuarios").where({ id }).first();

    if (!usuarioExiste) {
      return res.status(404).json({ mensagem: "Token inválido" });
    }

    const { senha, ...usuario } = usuarioExiste;

    req.usuario = usuario;

    next();
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ mensagem: "Não autorizado" });
  }
};

module.exports = verificarTokenAutenticacao;
