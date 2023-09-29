create database mini_insta;

create table usuarios (
	id serial primary key,
  nome varchar(250),
  foto varchar(500),
  username varchar(250) unique not null,
  email varchar(250) unique,
  site varchar(250),
  bio varchar(250),
  telefone varchar(250),
  genero varchar(50),
  senha varchar(250) not null,
  verificado boolean default false
  );
  
create table postagens (
	id serial primary key,
  id_usuario int not null references usuarios(id) ,
  descricao varchar(500),
  data timestamptz default now()
  );

 create table fotos (
	id serial primary key,
  id_postagem int not null references postagens(id) ,
  url varchar(500) not null,
  data timestamptz default now()
  );
  
create table comentarios (
	id serial primary key,
  id_postagem int not null references postagens(id),
  id_usuario int not null references usuarios(id),   
  comentario varchar(500) not null,
  data timestamptz default now()
  );


   create table curtidas (
    id_postagem int not null references postagens(id),
   	id_usuario int not null references usuarios(id),   
  	data timestamptz default now()
  );







