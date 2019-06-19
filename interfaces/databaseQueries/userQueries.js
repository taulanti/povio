/**
 * Database interface is a gateway between an application and 
 * database related actions
 */
class UserQueries {
  constructor(options) {
    this.databaseAdapter = options.DatabaseAdapter;
  }

  saveNewUser(user) {
    return this.databaseAdapter.saveNewUser(user);
  }

  login(options) {
    return this.databaseAdapter.login(options);
  }

  isUserExists(username) {
    return this.databaseAdapter.isUserExists(username);
  }

  getProfile(options) {
    return this.databaseAdapter.getProfile(options);
  }

  updatePassword(options) {
    return this.databaseAdapter.updatePassword(options);
  }

  getUser(options) {
    return this.databaseAdapter.getUser(options);
  }

  saveLike(options) {
    return this.databaseAdapter.saveLike(options);
  }

  deleteLike(options) {
    return this.databaseAdapter.deleteLike(options);
  }

  getUserList() {
    return this.databaseAdapter.getUserList();
  }
}

module.exports = UserQueries;
