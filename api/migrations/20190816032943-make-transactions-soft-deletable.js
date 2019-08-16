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
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ADD COLUMN deleted_at TIMESTAMPTZ;

    CREATE TRIGGER update_plaid_transactions_modtime
    BEFORE UPDATE ON app.plaid_transactions FOR EACH ROW EXECUTE PROCEDURE app.update_modified_column();
  `;
  return db.runSql(sql);
};

exports.down = function(db) {
  const sql = `
    ALTER TABLE app.plaid_transactions
    DROP COLUMN created_at,
    DROP COLUMN updated_at,
    DROP COLUMN deleted_at;
  `;
  return db.runSql(sql);
};

exports._meta = {
  version: 1,
};
