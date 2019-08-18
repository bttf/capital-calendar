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
    CREATE TABLE app.calendar_events (
      id SERIAL PRIMARY KEY,
      event_id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      date DATE NOT NULL,
      summary TEXT,
      color_id TEXT,
      google_calendar_id TEXT NOT NULL,
      calendar_id INTEGER NOT NULL REFERENCES app.calendars ON DELETE CASCADE
    );
  `;
  return db.runSql(sql);
};

exports.down = function(db) {
  const sql = `
    DROP TABLE app.calendar_events;
  `;
  return db.runSql(sql);
};

exports._meta = {
  version: 1,
};
