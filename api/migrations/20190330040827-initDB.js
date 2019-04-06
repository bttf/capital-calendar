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
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE SCHEMA app;

    CREATE OR REPLACE FUNCTION app.update_modified_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = now() at time zone 'utc';
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TABLE app.users (
      id SERIAL PRIMARY KEY,
      entity_id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      email TEXT NOT NULL,
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
    );

    CREATE UNIQUE INDEX app_users_email on app.users(LOWER(email));

    CREATE TABLE app.google_auths (
      id SERIAL PRIMARY KEY,
      entity_id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
      access_token TEXT,
      refresh_token TEXT,
      user_id INTEGER REFERENCES app.users ON DELETE CASCADE,
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
      updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
    );

    CREATE UNIQUE INDEX app_google_auths_user_id_fkey ON app.google_auths(user_id);

    CREATE TRIGGER update_topic_modtime
    BEFORE UPDATE ON app.google_auths FOR EACH ROW EXECUTE PROCEDURE app.update_modified_column();
  `;
  return db.runSql(sql);
};

exports.down = function(db) {
  const sql = `
    DROP SCHEMA app;
  `;
  return db.runSql(sql);
};

exports._meta = {
  version: 1,
};
