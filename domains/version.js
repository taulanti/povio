/**
 *
 *   MAJOR version when you make incompatible API changes,
 *   MINOR version when you add functionality in a backwards-compatible manner, and
 *   PATCH version when you make backwards-compatible bug fixes.
 */
class Version {

   // toString() print out version number
  static toString() {
    const output = {
      version: process.env.Version,
    };

    return JSON.stringify(output, null, 2);
  }
}

module.exports = Version;
