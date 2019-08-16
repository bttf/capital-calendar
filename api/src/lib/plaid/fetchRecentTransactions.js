import moment from 'moment';
import { partition } from 'lodash';
import db from '../../db';
import plaidClient from './client';

export default async (itemId, daysAgo = 30) => {
  const now = moment();
  const today = now.format('YYYY-MM-DD');
  const someDaysAgo = now.subtract(daysAgo, 'days').format('YYYY-MM-DD');

  let plaidItem;

  try {
    plaidItem = await db.PlaidItem.findOne({
      where: { itemId },
    });
  } catch (e) {
    return { errors: ['Error fetching plaid item'] };
  }

  if (!plaidItem) {
    return { errors: ['Error fetching plaid item'] };
  }

  const { accessToken } = plaidItem;

  if (!accessToken) {
    return { errors: ['No access token found'] };
  }

  let transactions;

  try {
    transactions = await plaidClient.getAllTransactions(accessToken, someDaysAgo, today);
  } catch (e) {
    return { errors: ['Error fetching transactions'] };
  }

  const transactionIds = transactions.map(t => t.transaction_id);
  const transactionAttrs = transactions.map(t => ({
    name: t.name,
    accountId: t.account_id,
    amount: t.amount,
    category: t.category,
    categoryId: t.category_id,
    date: t.date,
    pending: t.pending,
    pendingTransactionId: t.pending_transaction_id,
    transactionId: t.transaction_id,
    transactionType: t.transaction_type,
  }));

  const existingTransactions = await db.PlaidTransaction.findAll({
    where: { transactionId: transactionIds },
  });
  const existingTransactionIds = existingTransactions.map(t => t.transactionId);

  const [transactionsToUpdate, transactionsToCreate] = partition(transactionAttrs, a =>
    existingTransactionIds.includes(a.transactionId),
  );

  try {
    await db.sequelize.transaction(async transaction => {
      await Promise.all(
        transactionsToUpdate.map(t =>
          db.PlaidTransaction.update(t, { where: { transactionId: t.transactionId }, transaction }),
        ),
      );
      await db.PlaidTransaction.bulkCreate(transactionsToCreate, { transaction });
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('ERROR creating transactions', e);
    throw e;
  }

  return { status: 'OK', errors: [] };
};
