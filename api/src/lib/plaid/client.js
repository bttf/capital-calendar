import plaid from 'plaid';

const { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY } = process.env;

export default new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments.sandbox,
);
