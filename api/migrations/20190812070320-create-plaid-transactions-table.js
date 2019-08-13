'use strict';

/* eslint-disable */
var dbm;
var type;
var seed;
/* eslint-enable */

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  const sql = `
    CREATE TABLE app.plaid_transactions (
      id SERIAL PRIMARY KEY,
      transaction_id TEXT NOT NULL UNIQUE,
      transaction_type TEXT NOT NULL,
      date DATE NOT NULL,
      category TEXT[],
      category_id TEXT,
      name TEXT NOT NULL,
      amount NUMERIC(13, 4) NOT NULL,
      pending BOOLEAN,
      pending_transaction_id TEXT REFERENCES app.plaid_transactions(transaction_id),
      account_id TEXT REFERENCES app.plaid_accounts(account_id)
    );
  `;
  return db.runSql(sql);
};

exports.down = function(db) {
  const sql = `
    DROP TABLE app.plaid_transactions;
  `;
  return db.runSql(sql);
};

exports._meta = {
  version: 1,
};
