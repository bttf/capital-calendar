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
      user_id INTEGER NOT NULL REFERENCES app.users ON DELETE CASCADE,
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
      updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
    );

    CREATE UNIQUE INDEX app_google_auths_user_id_fkey ON app.google_auths(user_id);

    CREATE TRIGGER update_google_auths_modtime
    BEFORE UPDATE ON app.google_auths FOR EACH ROW EXECUTE PROCEDURE app.update_modified_column();

    CREATE TABLE app.plaid_institutions (
      institution_id TEXT PRIMARY KEY,
      name TEXT,
      logo TEXT,
      primary_color TEXT,
      url TEXT,
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
    );

    CREATE TABLE app.plaid_items (
      item_id TEXT PRIMARY KEY,
      access_token TEXT NOT NULL,
      user_id INTEGER NOT NULL REFERENCES app.users ON DELETE CASCADE,
      plaid_institution_id TEXT,
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
      updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
    );

    CREATE INDEX app_plaid_items_user_id_fkey ON app.plaid_items(user_id);

    CREATE TRIGGER update_plaid_items_modtime
    BEFORE UPDATE ON app.plaid_items FOR EACH ROW EXECUTE PROCEDURE app.update_modified_column();

    CREATE TABLE app.plaid_accounts (
      account_id TEXT PRIMARY KEY,
      name TEXT,
      official_name TEXT,
      mask TEXT,
      subtype TEXT,
      user_id INTEGER NOT NULL REFERENCES app.users ON DELETE CASCADE,
      plaid_institution_id TEXT,
      plaid_item_id TEXT NOT NULL REFERENCES app.plaid_items ON DELETE CASCADE,
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
      updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
    );

    CREATE INDEX app_plaid_accounts_item_id_fkey ON app.plaid_accounts(plaid_item_id);
    CREATE INDEX app_plaid_accounts_user_id_fkey ON app.plaid_accounts(user_id);

    CREATE TRIGGER update_plaid_accounts_modtime
    BEFORE UPDATE ON app.plaid_accounts FOR EACH ROW EXECUTE PROCEDURE app.update_modified_column();

    CREATE TYPE calendars_cadence AS ENUM ('daily', 'weekly', 'monthly');

    CREATE TABLE app.calendars (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      cadence calendars_cadence NOT NULL,
      user_id INTEGER NOT NULL REFERENCES app.users ON DELETE CASCADE,
      google_calendar_id TEXT NOT NULL,
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
      updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
    );

    CREATE INDEX app_calendars_user_id_fkey ON app.calendars(user_id);
    CREATE INDEX app_calendars_cadence_fkey ON app.calendars(cadence);

    CREATE TRIGGER update_calendar_modtime
    BEFORE UPDATE ON app.calendars FOR EACH ROW EXECUTE PROCEDURE app.update_modified_column();

    CREATE TYPE plaid_accounts_calendars_type AS ENUM ('income', 'expenses');

    CREATE TABLE app.plaid_accounts_calendars (
      id SERIAL PRIMARY KEY,
      account_id TEXT NOT NULL REFERENCES app.plaid_accounts ON DELETE CASCADE,
      calendar_id INTEGER NOT NULL REFERENCES app.calendars ON DELETE CASCADE,
      type plaid_accounts_calendars_type NOT NULL,
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
    );

    CREATE INDEX app_plaid_accounts_calendars_fkey ON app.plaid_accounts_calendars(calendar_id);
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
