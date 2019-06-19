/**
 * Configuration data domain encapsulate all the configuration settings data
 * to be used in the application
 */
class ConfigurationData {
  // Connection string to MongoDB getter and setter
  get MongoDBUrl() {
    return this.mongoDBUrl;
  }
  set MongoDBUrl(url) {
    this.mongoDBUrl = url;
  }

  get PostgreSqlUrl() {
    return this.postgreSqlUrl;
  }
  set PostgreSqlUrl(url) {
    this.postgreSqlUrl = url;
  }

  //Connection details to PostgreSQL

  get PostgreSql() {
    return {
      databaseName: this.databaseName,
      username: this.username,
      password: this.password,
    };
  }
  set PostgreSql(postgresConfigData) {
    this.databaseName = postgresConfigData.databaseName;
    this.databaseUsername = postgresConfigData.username;
    this.databasePassword = postgresConfigData.password;
    this.databaseHost = postgresConfigData.host;
  }

  // Node Environment Name getter and setter
  // Usually 'development', 'staging', 'production
  get NodeEnv() {
    return this.nodeEnv;
  }
  set NodeEnv(environment) {
    this.nodeEnv = environment;
  }

  get SecretKey() {
    return this.secretKey;
  }
  set SecretKey(key) {
    this.secretKey = key;
  }

  // toString() print out all the configuration data in easy to read format
  toString() {
    const output = {
      databaseName: this.databaseName,
      databaseUsername: this.databaseUsername,
      databasePassword: this.databasePassword,
      databaseHost: this.databaseHost,
      NodeEnv: this.nodeEnv,
      SecretKey: this.secretKey,
      PostgreSqlUrl: this.postgreSqlUrl,
    };

    return JSON.stringify(output, null, 2);
  }
}

module.exports = ConfigurationData;
