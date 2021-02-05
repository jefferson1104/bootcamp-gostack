import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

// Rota para listar todas as transactions
transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();

    return response.json({ transactions, balance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

// Rota para criar nossas transactions
transactionRouter.post('/', (request, response) => {
  try {
    // bucando no request.body todos os valores que vamos utilizar
    const { title, value, type } = request.body;

    // Passando valores para o repositorio e instanciando nosso service
    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    // executando metodo execute do service (metodo que executa a criação da transaction)
    const transaction = createTransaction.execute({
      title,
      value,
      type,
    });
    // retornando nossa transaction
    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
