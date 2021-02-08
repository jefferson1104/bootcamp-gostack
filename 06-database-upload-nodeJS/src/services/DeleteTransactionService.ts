import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // buscar no banco de dados para verificar se existe
    const transaction = await transactionsRepository.findOne(id);

    // se nao existir mostrar erro
    if (!transaction) {
      throw new AppError('Transaction does not exist');
    }

    // se existir deletar
    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
