import db from '../../db';

export default async transactionIds => {
  try {
    await db.PlaidTransaction.destroy({
      where: { transactionId: transactionIds },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('ERROR deleting transactions', e);
    return { status: 'FAIL', errors: [e && e.message] };
  }

  return { status: 'OK', errors: [] };
};
