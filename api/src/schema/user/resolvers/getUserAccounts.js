import Bluebird from 'bluebird';
import db from '../../../db';
import plaidClient from '../../../lib/plaid/client';

export default async (user, args) => {
  const accounts = db.PlaidAccount.findAll({
    where: { userId: user.id },
    include: {
      model: db.PlaidItem,
      as: 'plaidItem',
    },
    offset: args.offset || undefined,
    limit: args.limit || undefined,
    order: [['createdAt', 'DESC'], ['accountId', 'ASC']],
  });

  /**
   * When items have `loginRequired` flagged as true, we need to generate public
   * tokens for them so users can reauthenticate.
   * See: https://plaid.com/docs/#updating-items-via-link
   */
  const itemsLoginRequired = accounts.map(a => a.plaidItem).filter(i => i && i.loginRequired);

  const itemsPublicTokens = await Bluebird.reduce(
    itemsLoginRequired,
    async (acc, item) => {
      if (!acc[item.itemId]) {
        const { public_token: publicToken } = await plaidClient.createPublicToken(item.accessToken);
        return { [item.itemId]: publicToken, ...acc };
      }
      return acc;
    },
    {},
  );

  return accounts.map(a => ({
    ...a.toJSON(),
    itemPublicToken: itemsPublicTokens[a.plaidItem.itemId],
  }));
};
