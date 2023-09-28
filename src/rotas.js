const express = require("express");
const { login } = require("./controladores/login");
const {
  cadastrarUsuario,
  getUsuario,
  updateUsuario,
} = require("./controladores/usuarios");
const verificarTokenAutenticacao = require("./intermediarios/tokenAutenticacao");

const rotas = express();

rotas.post("/cadastrousuario", cadastrarUsuario);
rotas.post("/login", login);

rotas.use(verificarTokenAutenticacao);

rotas.get("/usuario", getUsuario);
rotas.put("/atualizarusuario", updateUsuario);

module.exports = rotas;
