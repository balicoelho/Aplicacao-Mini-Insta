const express = require("express");
const { login } = require("./controladores/login");
const {
  cadastrarUsuario,
  getUsuario,
  updateUsuario,
} = require("./controladores/usuarios");
const verificarTokenAutenticacao = require("./intermediarios/tokenAutenticacao");
const {
  getPostagens,
  postPostagem,
  curtirPostagem,
  comentarPostagem,
} = require("./controladores/postagens");

const rotas = express();

rotas.post("/cadastrousuario", cadastrarUsuario);
rotas.post("/login", login);

rotas.use(verificarTokenAutenticacao);

rotas.get("/usuario", getUsuario);
rotas.put("/atualizarusuario", updateUsuario);

rotas.post("/postagens", postPostagem);
rotas.get("/postagens", getPostagens);
rotas.post("/postagens/:id_postagem/curtir", curtirPostagem);
rotas.post("/postagens/:id_postagem/comentar", comentarPostagem);

module.exports = rotas;
