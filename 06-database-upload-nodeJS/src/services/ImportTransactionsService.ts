import { getCustomRepository, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

// bookInsert strategy
class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const contactsReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    // Validacao das categorias, buscando categorias existentes no BD
    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    // pegando o titulo da categoria existente no banco de dados
    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    // verificando categoria nao existente no banco de dados, matando duplicidade de categoria no csv
    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    // pegando titulo da categoria que nao existe no banco de dados
    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    // salvando nova categoria no banco de dados
    await categoriesRepository.save(newCategories);

    // pegando as novas categorias e as existentes e salvando na variavel
    const finalCategories = [...newCategories, ...existentCategories];

    // criando as transactions
    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    // salvando as transactions no banco de dados
    await transactionRepository.save(createdTransactions);

    // deletando o arquivo temporario da pasta tmp
    await fs.promises.unlink(filePath);

    // retornando todas as transactions criadas
    return createdTransactions;
  }
}

export default ImportTransactionsService;
