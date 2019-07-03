import db from '../../../db';

export default (user, args) => {
  return db.PlaidAccount.findAll({
    where: { userId: user.id },
    offset: args.offset || undefined,
    limit: args.limit || undefined,
    order: [['createdAt', 'DESC'], ['accountId', 'ASC']],
  });
};
