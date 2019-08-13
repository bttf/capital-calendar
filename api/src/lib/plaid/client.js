import plaid from 'plaid';

const { NODE_ENV, PLAID_CLIENT_ID, PLAID_SECRET, PLAID_PUBLIC_KEY } = process.env;

export default new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  NODE_ENV === 'production' ? plaid.environments.development : plaid.environments.sandbox,
);
