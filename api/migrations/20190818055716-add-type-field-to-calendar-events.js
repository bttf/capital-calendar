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
    ALTER TABLE app.calendar_events
    ADD COLUMN type plaid_accounts_calendars_type NOT NULL;
  `;
  return db.runSql(sql);
};

exports.down = function(db) {
  const sql = `
    ALTER TABLE app.calendar_events
    DROP COLUMN type;
  `;
  return db.runSql(sql);
};

exports._meta = {
  version: 1,
};
