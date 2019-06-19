//loads data from file into database. Serves as database seeder.

const sequelize_fixtures = require('sequelize-fixtures');
const db = require('../../infrastructures/database/sequelize/sequelize');

const models = { user: db.user, like: db.like };
module.exports = () => {
  //from file
  sequelize_fixtures.loadFile('tests/scripts/fixtures/data.json', models);
};
