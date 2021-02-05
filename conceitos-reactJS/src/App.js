import React, { useState, useEffect }  from "react";
import api from './services/api';

import "./styles.css";

function App() {

  //variavel onde armazenamos os repositorios em um vetor
  const [repositories, setRepositories] = useState([]);

  //listar dados da api do backend
  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
      console.log(response.data)
    });
  }, []);

  //funcao para adicionar um novo repositorio com api do backend
  async function handleAddRepository() {
    const response = await api.post('repositories', {
      title: `Novo Repositorio ${Date.now()}`,
      url: 'https://github.com/jefferson1104/conceitos-reactjs',
      techs: ['nodejs', 'react']
    });

    //salvando novo conteudo na variavel
    const repository = response.data;

    //atualiza o estado da aplicação
    setRepositories([...repositories, repository]);
  }


  //funcao para deletar o repositorio
  async function handleRemoveRepository(id) {

    //deletar cada repositorio pelo ID
    const response = await api.delete(`repositories/${id}`);

    //filtrando repositorio
    const updatedRepositories = repositories.filter(repository => repository.id !== id);

    //atualizando
    setRepositories(updatedRepositories)
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => <li key={repository.id}>{repository.title} <button onClick={() => handleRemoveRepository(repository.id)}>Remover</button></li>)}
      </ul>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
