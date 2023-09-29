const knex = require("../conexao");

const postPostagem = async (req, res) => {
  const { url, descricao } = req.body;
  const { id } = req.usuario;

  if (!url || url.length < 1) {
    return res
      .status(400)
      .json({ messagem: "Obrigatório inserir, no mínimo, uma imagem" });
  }
  try {
    const postagem = await knex("postagens")
      .insert({ descricao, id_usuario: id })
      .returning("*");

    if (!postagem) {
      return res
        .status(400)
        .json({ messagem: "Não foi permitido criar a postagem" });
    }

    const imagens = url.map((elemento) => {
      return { url: elemento, id_postagem: postagem[0].id };
    });

    if (!imagens) {
      await knex("postagens").del().where({ id: postagem[0].id });

      return res
        .status(400)
        .json({ messagem: "Não foi permitido criar a postagem" });
    }

    await knex("fotos").insert(imagens);

    return res.status(201).json({ messagem: "Postagem realizada com sucesso" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ messagem: "Erro interno do servidor" });
  }
};

const curtirPostagem = async (req, res) => {
  const { id_postagem } = req.params;
  const { id } = req.usuario;

  try {
    const postagemExiste = await knex("postagens")
      .where({ id: id_postagem })
      .first();

    if (!postagemExiste) {
      return res.status(404).json({ messagem: "Postagem não existe" });
    }

    const postagemCurtida = await knex("curtidas")
      .where({
        id_usuario: id,
        id_postagem,
      })
      .first();

    if (postagemCurtida) {
      return res
        .status(400)
        .json({ messagem: "Postagem já curtida pelo uusário" });
    }

    const curtida = await knex("curtidas").insert({
      id_usuario: id,
      id_postagem,
    });

    if (!curtida.rowCount) {
      return res
        .status(400)
        .json({ messagem: "Não foi possível curtir esta postagem" });
    }

    return res.status(200).json({ messagem: "Curtida cadastrada com sucesso" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ messagem: "Erro interno do servidor" });
  }
};

const comentarPostagem = async (req, res) => {
  const { id_postagem } = req.params;
  const { comentario } = req.body;
  const { id } = req.usuario;

  if (!comentario) {
    return res
      .status(400)
      .json({ messagem: "Obrigatório inserir o comentário" });
  }
  try {
    const postagemExiste = await knex("postagens")
      .where({ id: id_postagem })
      .first();

    if (!postagemExiste) {
      return res.status(404).json({ messagem: "Postagem não existe" });
    }

    const novoComentario = await knex("comentarios").insert({
      id_usuario: id,
      id_postagem,
      comentario,
    });

    if (!novoComentario.rowCount) {
      return res
        .status(400)
        .json({ messagem: "Não foi possível comentar esta postagem" });
    }

    return res
      .status(200)
      .json({ messagem: "Comentário cadastrado com sucesso" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ messagem: "Erro interno do servidor" });
  }
};

const getPostagens = async (req, res) => {
  const { offset } = req.query;
  const { id } = req.usuario;
  const limit = 10;

  const paginaAtual = offset ? offset : 0;

  try {
    let postagens = await knex("postagens")
      .where("id_usuario", "!=", id)
      .limit(limit)
      .offset(paginaAtual);

    if (postagens.length === 0) {
      return res.status(200).json(postagens);
    }

    for (const post of postagens) {
      const usuario = await knex("usuarios")
        .where({ id: post.id_usuario })
        .select("username", "foto", "verificado");
      post.usuario = usuario[0];

      const curtidas = await knex("curtidas").where({
        id_postagem: post.id,
      });
      post.quantidadecurtidas = curtidas.length;
      post.curtida = curtidas.some((curtida) => curtida.id_usuario === id);

      const fotos = await knex("fotos")
        .where({ id_postagem: post.id })
        .select("url");
      post.fotos = fotos;

      const comentarios = await knex("comentarios")
        .where({ id_postagem: post.id })
        .join("usuarios", "comentarios.id_usuario", "usuarios.id")
        .select("usuarios.username", "comentario", "data");
      post.comentarios = comentarios;
    }

    return res.json(postagens);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ messagem: "Erro interno do servidor" });
  }
};

module.exports = {
  postPostagem,
  getPostagens,
  curtirPostagem,
  comentarPostagem,
};
