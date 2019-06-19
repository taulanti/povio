/**
 * Configuration interface is a gateway between configuration usecases
 * and detail implementation
 */
class Configuration {
  // We are injecting the configuration adapter as part of the constructor
  constructor(options) {
    this.configurationAdapter = options.ConfigurationAdapter;
  }

  // load() is responsible for loading configuration data
  load() {
    // We are loading the configuration using the adapter

    return this.configurationAdapter.load();
  }
}

module.exports = Configuration;
