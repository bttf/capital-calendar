import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const {
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
  PGHOST,
  PGPORT,
} = process.env;

const sequelize = new Sequelize(
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
  {
    host: PGHOST,
    post: PGPORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false,
    },
  });

const db = {};

fs.readdirSync(path.resolve(__dirname, 'models'))
  .filter(file => file.indexOf('.') !== 0)
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, 'models', file));
    db[model.name] = model;
  });

Object.keys(db).map(modelName => {
  const model = db[modelName];

  if (typeof model.initialize === 'function') {
    model.initialize(sequelize, Sequelize);
  }

  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
