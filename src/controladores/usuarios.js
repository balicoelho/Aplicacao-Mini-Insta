const knex = require("../conexao");
const bcrypt = require("bcrypt");
require("dotenv").config();

const cadastrarUsuario = async (req, res) => {
  const { username, senha } = req.body;

  if (!username || !senha) {
    return res
      .status(400)
      .json({ mensagem: "Todos os campos são obrigatórios" });
  }

  if (senha.length < 5) {
    return res
      .status(400)
      .json({ mensagem: "A senha deve conter, no mínimo, 6 caracteres" });
  }

  try {
    const usernameExiste = await knex("usuarios")
      .where({ username: username })
      .first();

    if (usernameExiste) {
      return res.status(400).json({ mensagem: "Username já cadastrado" });
    }

    const senhaCrypto = await bcrypt.hash(senha, 10);
    const resultado = await knex("usuarios")
      .insert({
        username,
        senha: senhaCrypto,
      })
      .returning("*");

    return res.status(201).json(resultado);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const getUsuario = async (req, res) => {
  try {
    return res.status(200).json(req.usuario);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const updateUsuario = async (req, res) => {
  const { foto, nome, username, site, bio, email, telefone, genero, senha } =
    req.body;

  if (!username) {
    return res.status(400).json({ mensagem: "Username é obrigatório" });
  }

  try {
    if (username !== req.usuario.username) {
      const usernameExiste = await knex("usuarios").where({ username }).first();
      if (usernameExiste) {
        return res.status(400).json({ mensagem: "Username já cadastrado" });
      }
    }

    if (email !== req.usuario.email) {
      const emailExiste = await knex("usuarios").where({ email }).first();
      if (emailExiste) {
        return res.status(400).json({ mensagem: "Email já cadastrado" });
      }
    }

    let senhaCrypto;
    if (senha) {
      if (senha.length < 5) {
        return res
          .status(400)
          .json({ mensagem: "A senha deve conter, no mínimo, 6 caracteres" });
      }
      senhaCrypto = await bcrypt.hash(senha, 10);
    }

    const usuarioAtualizado = await knex("usuarios")
      .update({
        foto,
        nome,
        username,
        site,
        bio,
        email,
        telefone,
        genero,
        senha: senhaCrypto,
      })
      .where({ id: req.usuario.id });

    if (!usuarioAtualizado) {
      return res.status(200).json({ messagem: "Usuário não foi atualizado" });
    }
    return res.status(200).json({ messagem: "Usuário atualizado com sucesso" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

module.exports = { cadastrarUsuario, getUsuario, updateUsuario };
