/** 
 * It initializes the database, sequelizes the models and authenticates it.
*/

const Sequelize = require('sequelize');
const EnvironmentVariables = require('../../environment-variables');

const configData = new EnvironmentVariables().load();
console.log(`configurationnnn: ${configData}`);

const sequelize = new Sequelize(configData.databaseName, configData.databaseUsername,
  configData.databasePassword, {
    host: configData.databaseHost,
    dialect: configData.dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

  });

const db = {};
db.resetDatabase = async () => {
  await sequelize.sync({
    force: true,
  });
};
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./model/user.js')(sequelize, Sequelize);
db.like = require('./model/like.js')(sequelize, Sequelize);
// Here we can connect companies and products base on company'id
db.user.hasMany(db.like, { foreignKey: 'user_id', sourceKey: 'id' });
db.like.belongsTo(db.user, { foreignKey: 'user_id' });

module.exports = db;
