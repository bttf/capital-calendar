import moment from 'moment';
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

  const { accessToken } = plaidItem;

  if (!accessToken) {
    return { errors: ['No access token found'] };
  }

  let response;

  try {
    response = await plaidClient.getAllTransactions(accessToken, someDaysAgo, today);
  } catch (e) {
    return { errors: ['Error fetching transactions'] };
  }

  const bulkCreateAttrs = (response.transactions || []).map(t => ({
    account_id: t.account_id,
    amount: t.amount,
    category: t.category,
    categoryId: t.category_id,
    date: t.date,
    pending: t.pending,
    pending_transaction_id: t.pending_transaction_id,
    transaction_id: t.transaction_id,
    transaction_type: t.transaction_type,
  }));

  try {
    await db.PlaidInstitution.bulkCreate(bulkCreateAttrs);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('ERROR creating transactions', e);
  }

  // eslint-disable-next-line no-console
  console.log('DEBUG: response', response);

  return { status: 'OK', errors: [] };
};
