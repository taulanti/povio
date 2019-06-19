/**
 * Express server class is responsible for serving the API using
 * the Express web framework
 */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


class ExpressServer {
  // constructor()
  // We are injecting the interface as part of the constructor
  constructor(options) {
    this.webserverInterface = options.WebServerInterface;
    this.configurationData = options.ConfigurationData;
  }
  static toString() {
    return 'Express Server Infrastructure';
  }

  getServer() {
    return app;
  }

  // start() is the starting point of the web server
  start() {
    app.get('/', (req, res) => {
      res.type('application/json');

      // We are getting the current API number via the interface we injected
      // from the constructor
      res.status(200).send(this.webserverInterface.displayApiVersion());
    });

    return app.listen(this.configurationData.PORT, () => {
      console.log(`Example app listening on port ${this.configurationData.PORT}`);
    });
  }
}

module.exports = ExpressServer;
