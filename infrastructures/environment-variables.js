/**
 * Environment variable class is responsible for loading environment variables
 * from process and/or operating system so it is available to be used in
 * this application
 */
const ConfigurationData = require('../domains/configuration-data');
const dotenv = require('dotenv');

class EnvironmentVariable {

  // load() is responsible for loading configuration data
  load() {
  
    const configurationData = new ConfigurationData();
    if (process.env.NODE_ENV === 'test') {
      dotenv.config({
        path: './.env.test',
      });
    } else {
      dotenv.config({
        path: './.env',
      });
    }
    // We are loding the configuration from the environment variable
    //configurationData.MongoDBUrl = process.env.MONGODB_URL || 'localhost';
    configurationData.PostgreSqlUrl = process.env.PostgreSqlUrl || 'localhost';
    configurationData.databaseName = process.env.databaseName || 'povio';
    configurationData.databaseUsername = process.env.databaseUsername || 'postgres';
    configurationData.databasePassword = process.env.databasePassword || 'postgres';
    configurationData.databaseHost = process.env.databaseHost || 'localhost';
    configurationData.dialect = process.env.dialect || 'postgres';
    configurationData.issuer = process.env.Issuer || 'povio.com';
    configurationData.audience = process.env.Audience || 'povio.com';
    configurationData.NodeEnv = process.env.NODE_ENV || 'development';
    configurationData.SecretKey = process.env.SECRET_KEY || 'secret';
    configurationData.PORT = process.env.PORT || 3000;
    return configurationData;
  }
}

module.exports = EnvironmentVariable;
