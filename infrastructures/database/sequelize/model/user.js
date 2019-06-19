/**
 * like model used by sequelize to map to the database table like.
 */
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Username already in use!',
      },
    },
    password: DataTypes.STRING,
  }, { freezeTableName: true, timestamps: false });
  return user;
};
