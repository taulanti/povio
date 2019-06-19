/**
 * Unique Id class is responsible for generating a Universally unique identifier
 */
const uuidV4 = require('uuid/v4');

class UniqueId {

  // generate() creates a new Universally unique identifier
  static generate() {
    return uuidV4();
  }
}

module.exports = UniqueId;
