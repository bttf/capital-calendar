export default (sequelize, DataTypes) => {
  const UserAuth = sequelize.define(
    'UserAuth',
    {
      userID: { type: DataTypes.INTEGER, field: 'user_id' },
      githubID: { type: DataTypes.STRING, field: 'github_id' },
      githubAccessToken: { type: DataTypes.STRING, field: 'github_access_token' },
      githubRefreshToken: { type: DataTypes.STRING, field: 'github_refresh_token' },
    },
    {
      schema: 'app',
      tableName: 'user_auths',
    },
  );

  UserAuth.associate = models => {
    const { User } = models;
    UserAuth.User = UserAuth.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  };

  return UserAuth;
};
