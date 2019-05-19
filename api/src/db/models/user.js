export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      entityId: { type: DataTypes.STRING, field: 'entity_id' },
      email: { type: DataTypes.STRING, field: 'email' },
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
    const { GoogleAuth, PlaidAccount, PlaidItem } = models;

    User.GoogleAuth = User.hasOne(GoogleAuth, { foreignKey: 'user_id', as: 'googleAuth' });

    User.PlaidItem = User.hasMany(PlaidItem, { foreignKey: 'user_id', as: 'plaidItems' });

    User.PlaidAccount = User.hasMany(PlaidAccount, { foreignKey: 'user_id', as: 'plaidAccounts' });
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
