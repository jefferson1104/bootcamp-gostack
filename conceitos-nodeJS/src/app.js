const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  //recebendo os dados dentro do corpo da requisicao
  const { title, url, techs } = request.body;

  //objeto onde sera armazenado as informacoes, inciando o like com valor 0
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  //adicionando repostiorio dentro do vetor repositories
  repositories.push(repository);

  //retornando json contendo o repositorio que acabou de ser criado
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {

  //recebendo o id que esta dentro do router params
  const { id } = request.params;

  //parametros permitidos a ser alterados
  const { title, url, techs } = request.body;

  //encontrando repositorio com o id igual ao id que recebemos no router params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //validando se o repositorio existe ou nao, caso nao existir colocar status do http como erro 400
  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  //informacoes a serem alteradas
  const repository = { id, title, url, techs, likes: 0};

  //procurando o array de projetos e substituindo os valores
  repositories[repositoryIndex] = repository;

  //retornando resultado apenas da lista atualizada
  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {

    //recebendo o id que esta dentro do router params
    const { id } = request.params;

    //encontrando repositorio com o id igual ao id que recebemos no router params
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    //validando se o repositorio existe ou nao, caso nao existir colocar status do http como erro 400
    if (repositoryIndex < 0) {
      return response.status(400).send();
    }

    //excluir o repositorio caso exista
    repositories.splice(repositoryIndex, 1);

    //retornando status 204 e resposta vazia
    return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {

  //recebendo o id que esta dentro do router params
  const { id } = request.params;

  //encontrando repositorio com o id igual ao id que recebemos no router params
  const repository = repositories.find(repository => repository.id === id);

  //verificando se o repositorio existe, caso nao existir colocar status 400
  if (!repository) {
    return response.status(400).send();
  }

  //somando mais 1 like para o repositorio
  repository.likes += 1;

  //retornando o repositorio inteiro
  return response.json(repository);
});

module.exports = app;
