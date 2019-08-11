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
    response = await plaidClient.getTransactions(accessToken, someDaysAgo, today);
  } catch (e) {
    return { errors: ['Error fetching transactions'] };
  }

  // eslint-disable-next-line no-console
  console.log('DEBUG: response', response);

  return { status: 'OK', errors: [] };
};
