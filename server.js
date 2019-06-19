/**
 * server.js is a starting point
 */

const EnvironmentVariables = require('./infrastructures/environment-variables');
const ExpressWebServer = require('./infrastructures/express-server');
const JsonWebToken = require('./infrastructures/json-web-token');
//const MongoDb = require('./infrastructures/mongodb');
const UserPostgreSql = require('./infrastructures/database/postgreSql/userQuery');
const UniqueId = require('./infrastructures/unique-id');

const AuthenticationInterface = require('./interfaces/authentication');
const ConfigurationInterface = require('./interfaces/configuration');
const UserDatabaseInterface = require('./interfaces/databaseQueries/userQueries');
const WebServerInterface = require('./interfaces/webserver');
const routes = require('./interfaces/routes/routes');

const ConfigurationInteractor = require('./usecases/configuration');
const VersionInteractor = require('./usecases/version');
const UserInteractor = require('./usecases/user');

const environmentVariable = new EnvironmentVariables();
// init configs
const configurationInterface = new ConfigurationInterface({
  ConfigurationAdapter: environmentVariable,
});

const configurationInteractor = new ConfigurationInteractor({
  ConfigurationInterface: configurationInterface,
});

const configuraionData = configurationInteractor.load();

// Print out the current configuration data for testing purpose
// !init configs
const authenticationInterface = new AuthenticationInterface({
  UniqueIdAdapter: UniqueId,
  WebTokenAdapter: JsonWebToken,
});

const databaseInterface = new UserDatabaseInterface({
  //DatabaseAdapter: MongoDb,
  DatabaseAdapter: UserPostgreSql,
});

const userInteractor = new UserInteractor({
  ConfigurationData: configuraionData,
  AuthenticationInterface: authenticationInterface,
  DatabaseInterface: databaseInterface,
});

const versionInteractor = new VersionInteractor();
const webserverInterface = new WebServerInterface({
  VersionInteractor: versionInteractor,
});
const { userValidator } = require('./infrastructures/express-validator');

const expressWebServer = new ExpressWebServer({
  WebServerInterface: webserverInterface,
  ConfigurationData: configuraionData,
});
routes.assignRoutes(expressWebServer.getServer(), userInteractor, userValidator);

const server = expressWebServer.start();

module.exports = server;
