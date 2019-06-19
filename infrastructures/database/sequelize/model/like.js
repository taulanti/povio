/**
 * user model used by sequelize to map to the database table user.
 */
module.exports = (sequelize, DataTypes) => {
  const like = sequelize.define('like', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user_id: DataTypes.INTEGER,
    other_user_id: DataTypes.INTEGER,
  }, { freezeTableName: true, timestamps: false });
  return like;
};
