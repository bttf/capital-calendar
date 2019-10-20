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
    ALTER TABLE app.plaid_transactions
    DROP constraint plaid_transactions_pending_transaction_id_fkey;
  `;
  return db.runSql(sql);
};

exports.down = function() {
  return null;
};

exports._meta = {
  version: 1,
};
