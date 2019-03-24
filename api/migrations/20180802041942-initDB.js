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
    username TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
  );

  CREATE UNIQUE INDEX app_users_username on app.users(lower(username));
  CREATE UNIQUE INDEX app_users_email on app.users(lower(email));

  CREATE TABLE app.topics (
    id SERIAL PRIMARY KEY,
    entity_id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    title TEXT,
    body TEXT,
    is_collection BOOLEAN NOT NULL DEFAULT FALSE,
    pinned_index INTEGER,
    children_updated_at TIMESTAMP WITHOUT TIME ZONE,
    slug TEXT,
    parent_id INTEGER REFERENCES app.topics,
    created_by INTEGER REFERENCES app.users,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
  );

  CREATE UNIQUE INDEX app_topics_slug on app.topics(lower(slug));
  CREATE INDEX app_topics_parent_id_fkey ON app.topics(parent_id);
  CREATE INDEX app_topics_created_by_fkey ON app.topics(created_by);

  CREATE TRIGGER update_topic_modtime
  BEFORE UPDATE ON app.topics FOR EACH ROW EXECUTE PROCEDURE app.update_modified_column();

  CREATE TABLE app.topic_subscriptions (
    user_id INTEGER REFERENCES app.users ON DELETE CASCADE,
    topic_id INTEGER REFERENCES app.topics ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
  );

  CREATE INDEX app_topic_subscriptions_user_id_fkey ON app.topic_subscriptions(user_id);
  CREATE INDEX app_topic_subscriptions_topic_id_fkey ON app.topic_subscriptions(topic_id);
  CREATE UNIQUE INDEX app_topic_subscriptions_pkey ON app.topic_subscriptions(user_id, topic_id);

  CREATE TABLE app.moderators (
    user_id INTEGER REFERENCES app.users ON DELETE CASCADE,
    topic_id INTEGER REFERENCES app.topics ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
  );

  CREATE INDEX app_moderators_user_id_fkey ON app.moderators(user_id);
  CREATE INDEX app_moderators_topic_id_fkey ON app.moderators(topic_id);
  CREATE UNIQUE INDEX app_moderators_pkey ON app.moderators(user_id, topic_id);

  CREATE TABLE app.tags (
    id SERIAL PRIMARY KEY,
    entity_id uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    name TEXT,
    topic_id INTEGER REFERENCES app.topics ON DELETE CASCADE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
  );

  CREATE INDEX app_tags_topic_id_fkey ON app.tags(topic_id);
  CREATE UNIQUE INDEX app_tags_name_unique ON app.tags(lower(name));

  CREATE TABLE app.topic_tags (
    tag_id INTEGER REFERENCES app.tags ON DELETE CASCADE,
    topic_id INTEGER REFERENCES app.topics ON DELETE CASCADE
  );

  CREATE INDEX app_topic_tags_tag_id_fkey ON app.topic_tags(tag_id);
  CREATE INDEX app_topic_tags_topic_id_fkey ON app.topic_tags(topic_id);
  CREATE UNIQUE INDEX app_topic_tags_pkey ON app.topic_tags(tag_id, topic_id);
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
