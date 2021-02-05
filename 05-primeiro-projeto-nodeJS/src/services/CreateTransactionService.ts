import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

// interface para tipar nossos parametros
interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  // metodo execute responsavel por criar a transaction
  public execute({ title, value, type }: Request): Transaction {
    // validando se o tipo da transaction é valido
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('transaction type is invalid');
    }

    // validando se o valor da transaction tipo outcome é maior do que o saldo
    const { total } = this.transactionsRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new Error('You do not have enough balance');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
