'use strict';

// var dbm;
// var type;
// var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(/* options, seedLink */) {
  // dbm = options.dbmigrate;
  // type = dbm.dataType;
  // seed = seedLink;
};

exports.up = function(db) {
  const sql = `
  CREATE TABLE app.user_auths (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES app.users ON DELETE CASCADE,
    github_id TEXT,
    github_access_token TEXT,
    github_refresh_token TEXT,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
  );

  CREATE INDEX app_user_auths_user_id_fkey ON app.user_auths(user_id);

  CREATE TRIGGER update_user_auths_modtime
  BEFORE UPDATE ON app.user_auths FOR EACH ROW EXECUTE PROCEDURE app.update_modified_column();
  `;

  return db.runSql(sql);
};

exports.down = function(db) {
  const sql = `
DROP TABLE app.user_auths;
  `;

  return db.runSql(sql);
};

exports._meta = {
  version: 1,
};
