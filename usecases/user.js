/**
 * User usecases is a business logic of user and it contains operations done on the user entity
 */
const UserDomain = require('../domains/user');

class User {
  constructor(options) {
    this.configurationData = options.ConfigurationData;
    this.authenticationInterface = options.AuthenticationInterface;
    this.databaseInterface = options.DatabaseInterface;
  }

  async createNewUser(options) {
    try {
      if (!options && typeof options === 'undefined') {
        throw new Error('[Missing user information]');
      }
      if (!options.username
        || !options.password) {
        return { ok: false, error: '[Missing username or password information]' };
      }

      // check if user exists
      const res = await this.databaseInterface.isUserExists({ username: options.username });

      if (res.ok) {
        return { ok: false, error: `[User ${options.username} already exists.]` };
      }

      const newUser = new UserDomain();

      newUser.Id = this.authenticationInterface.getNewUserId();
      newUser.Password = options.password;
      newUser.Username = options.username;
      newUser.WebToken = this.authenticationInterface.getNewWebToken({
        tokenPayload: {
          id: newUser.Id,
          username: newUser.Username,
        },
        secret: this.configurationData.SecretKey,
        expiration: '1h',
      });
      return await this.databaseInterface.saveNewUser(newUser);
    } catch (error) {
      throw new Error(`User could not be saved. Reason: ${error}`);
    }
  }

  async login(options) {
    try {
      if (!options && typeof options === 'undefined') {
        throw new Error('[Missing user information]');
      }
      if (!options.username
        || !options.password) {
        return { ok: false, error: '[Missing username or password information]' };
      }

      // check if user exists
      const res = await this.databaseInterface.isUserExists(options);

      if (!res) {
        return { login: false, error: '[Invalid credentials]' };
      }

      // check if passwords match
      const match = await this.databaseInterface.login({ inputPassword: options.password, password: res.result.password });
      // generate new token
      if (!match) return { ok: false, error: 'passwords don\'t match' };
      //const id = this.authenticationInterface.getNewUserId();
      const token = this.authenticationInterface.getNewWebToken({
        tokenPayload: {
          id: res.result.id,
          username: options.username,
        },
        secret: this.configurationData.SecretKey,
        issuer: this.configurationData.Issuer,
        subject: options.username,
        audience: this.configurationData.audience,
        expiration: '1h',
      });
      const result = {};
      result.username = options.username;
      result.token = token;
      return { ok: true, result };
    } catch (error) {
      throw new Error(`User could not be saved. Reason: ${error}`);
    }
  }

  getProfile(options) {
    if (!options) {
      throw new Error('Missing token information');
    }
    return this.databaseInterface.getProfile(options);
  }

  getUser(userId) {
    if (!userId) {
      throw new Error('Missing token information');
    }
    return this.databaseInterface.getUser(userId);
  }

  getUserList() {
    return this.databaseInterface.getUserList();
  }

  async updatePassword(options) {
    if (!options) {
      throw new Error('Missing user information');
    }
    return this.databaseInterface.updatePassword(options);
  }

  async saveLike(options) {
    if (!options) {
      throw new Error('Missing user information');
    }

    if (!options.firstUserId
      || !options.secondUserId) {
      return { ok: false, error: '[Missing user_id or other_user_id information]' };
    }

    return this.databaseInterface.saveLike(options);
  }

  async deleteLike(options) {
    if (!options) {
      throw new Error('Missing user information');
    }

    if (!options.firstUserId
      || !options.secondUserId) {
      return { ok: false, error: '[Missing user_id or other_user_id information]' };
    }

    return this.databaseInterface.deleteLike(options);
  }

  // Get number of seconds until token is expired
  // This is will be used in the "expiresIn" options
  // when creating the JWT token
  expiresOneYearFromNow() {
    const now = new Date();
    const nowInMilliseconds = now.getTime();

    const nextYearInMilliseconds = new Date(
      new Date().setFullYear(now.getFullYear() + 1)).getTime();

    return Math.round((nextYearInMilliseconds - nowInMilliseconds) / 1000);
  }

  static toString() {
    return 'User interactor';
  }
}

module.exports = User;
