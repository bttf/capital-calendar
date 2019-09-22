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
    ALTER TABLE app.plaid_items
    ADD COLUMN login_required BOOLEAN NOT NULL DEFAULT FALSE;
  `;
  return db.runSql(sql);
};

exports.down = function(db) {
  const sql = `
    ALTER TABLE app.plaid_items
    DROP COLUMN login_required;
  `;
  return db.runSql(sql);
};

exports._meta = {
  version: 1,
};
