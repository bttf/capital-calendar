export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      entityId: { type: DataTypes.STRING, field: 'entity_id' },
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      avatarUrl: { type: DataTypes.STRING, field: 'avatar_url' },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
    },
    {
      schema: 'app',
      tableName: 'users',
    },
  );

  User.associate = models => {
    const { UserAuth } = models;
    User.UserAuth = User.hasOne(UserAuth, { foreignKey: 'user_id', as: 'userAuth' });
  };

  User.findByEntityId = (entityId, options) => {
    return User.findOne({
      where: {
        entityId,
      },
      ...options,
    });
  };

  return User;
};
