import bcrypt from 'bcrypt';
import jayson from 'jayson/promise';

const {
  NODE_ENV,
  RPC_HOST,
  RPC_PORT,
  RPC_SECRET,
} = process.env;

const jaysonClient = jayson.client[NODE_ENV === 'production' ? 'https' : 'http']({
  hostname: RPC_HOST,
  port: RPC_PORT,
});

const genAuthToken = () => bcrypt.hash(RPC_SECRET, 10);

export const fetchRecentTransactions = async (itemId) => {
  let response;
  const rpcAuthToken = await genAuthToken();

  try {
    response = await jaysonClient.request(
      'fetchRecentTransactions',
      [rpcAuthToken, itemId],
    );
  } catch(e) {
    // eslint-disable-next-line no-console
    return console.log('ERROR', e);
  }

  // eslint-disable-next-line no-console
  console.log('response', response);

  return response;
};

export const removeTransactions = async (transactionIds) => {
  let response;
  const rpcAuthToken = await genAuthToken();

  try {
    response = await jaysonClient.request(
      'removeTransactions',
      [rpcAuthToken, transactionIds],
    );
  } catch(e) {
    // eslint-disable-next-line no-console
    return console.log('ERROR', e);
  }

  // eslint-disable-next-line no-console
  console.log('response', response);

  return response;
};

export const markItemLoginRequired = async (itemId) => {
  // eslint-disable-next-line no-console
  console.log('DEBUG markItemLoginRequired');

  let response;
  const rpcAuthToken = await genAuthToken();

  try {
    response = await jaysonClient.request(
      'markItemLoginRequired',
      [rpcAuthToken, itemId],
    );
  } catch(e) {
    // eslint-disable-next-line no-console
    return console.log('ERROR', e);
  }

  // eslint-disable-next-line no-console
  console.log('response', response);

  return response;
};
