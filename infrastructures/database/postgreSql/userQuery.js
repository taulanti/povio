/**
 * This is the adapter (framework) which implements user database interface and communicate with database
 */

const db = require('../sequelize/sequelize');
const bcrypt = require('bcrypt');

const user = db.user;
const like = db.like;
const sequelize = db.sequelize;

const handlePromise = promise => promise.then(result => ({ ok: true, result }))
  .catch(error => Promise.resolve({ ok: false, error }));

class UserQuery {

  // save new user to database
  static async saveNewUser(usr) {
    const { username, password } = usr;
    const encryptedPass = await handlePromise(bcrypt.hash(password, 10));
    if (!encryptedPass.ok) return encryptedPass.error;
    const res = await handlePromise(user.create({
      username,
      password: encryptedPass.result,
    }));

    if (res.ok) { return { ok: true, result: usr }; }
    return { ok: false, error: res.error };
  }

  //login use to the app
  static async login(options) {
    const { result } = await handlePromise(bcrypt.compare(options.inputPassword, options.password));
    if (result) return true;
    return false;
  }

  // get current logged in user profile
  static async getProfile(options) {
    const { ok, result, error } = await handlePromise(user.findOne({ where: { id: options.id } }));

    if (ok && result !== null) {
      return {
        ok,
        id: result.id,
        username: result.username,
      };
    }
    throw new Error(error);
  }

  static async updatePassword(options) {
    const encryptedPass = await handlePromise(bcrypt.hash(options.password, 10));
    if (!encryptedPass.ok) return { ok: encryptedPass.ok, error: encryptedPass.error };
    const { ok, error } = await handlePromise(user.update({ password: encryptedPass.result },
      { where: { username: options.username } }));
    if (ok) {
      return {
        ok,
        message: `Password has been updated succesfully for the user ${options.username}`,
      };
    }
    return { ok, error };
  }

  //when user like another it persist to database.
  static async saveLike(options) {
    const found = await handlePromise(like.findOne({ where: { user_id: options.firstUserId, other_user_id: options.secondUserId } }));
    if (found.result == null) {
      const { ok, error } = await handlePromise(like.create({
        user_id: options.firstUserId,
        other_user_id: options.secondUserId,
      }));
      if (ok) { return { ok }; }
      return { ok, error };
    }
    if (!found.ok) { return { ok: false, error: found.error }; }
    return { ok: false, error: `user ${options.firstUserId} has already liked user with id ${options.secondUserId}` };
  }

  //when user like another it deletes from database.
  static async deleteLike(options) {
    const { ok, result, error } = await handlePromise(like.findOne({ where: { user_id: options.firstUserId, other_user_id: options.secondUserId } }));
    if (result !== null) {
      const deleted = await handlePromise(like.destroy({ where: { id: result.id } }));
      if (deleted.ok) { return { ok: deleted.ok }; }
      return { ok: deleted.ok, error };
    }
    return { ok: false, error };
  }


  //get a specific user
  static async getUser(userId) {
    const usr = await handlePromise(user.findOne({ where: { id: userId } }));
    if (usr.ok && usr.result !== null) {
      const { ok, result, error } = await handlePromise(like.findOne({
        attributes: [[sequelize.fn('COUNT', sequelize.col('like.other_user_id')), 'like_count']],
        include: [
          {
            model: user,
            where: { id: userId },
            attributes: ['username'],
            on: {
              col1: sequelize.where(sequelize.col('user.id'), '=', sequelize.col('like.other_user_id')),
            },
          },
        ],
        group: ['username'],
        raw: true,
      }));
      if (ok) {
        if (result === null) {
          return { ok: true, id: usr.result.id, username: usr.result.username, like_count: 0 };
        }
        return { ok: true, id: usr.result.id, username: usr.result.username, like_count: result.like_count };
      }
      return { ok, error };
    }
    return { ok: usr.ok };
  }

  //get list of all users and likes in descending order by like count
  static async getUserList() {
    const { ok, result, error } = await handlePromise(like.findAll({
      attributes: [[sequelize.fn('COUNT', sequelize.col('like.other_user_id')), 'like_count']],
      include: [
        {
          model: user,
          attributes: ['username'],
          on: {
            col1: sequelize.where(sequelize.col('user.id'), '=', sequelize.col('like.other_user_id')),
          },
        },
      ],
      group: ['user.username'],
      order: [[sequelize.literal('like_count'), 'DESC']],
      raw: true,
    }));
    if (ok && result !== null) {
      return { ok: true, result };
    }
    return { ok, error };
  }

  static async isUserExists(options) {
    const { ok, result, error } = await handlePromise(user.findOne({ where: { username: options.username } }));
    if (ok && result !== null) {
      return { ok: true, result };
    }
    return false;
  }

}

module.exports = UserQuery;
