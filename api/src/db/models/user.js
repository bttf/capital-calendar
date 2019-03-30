export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      entityId: { type: DataTypes.STRING, field: 'entity_id' },
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
    const { GoogleAuth } = models;
    User.GoogleAuth = User.hasOne(GoogleAuth, { foreignKey: 'user_id', as: 'googleAuth' });
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
