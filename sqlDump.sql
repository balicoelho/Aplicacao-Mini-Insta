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