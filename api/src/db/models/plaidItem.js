export default (sequelize, DataTypes) => {
  const PlaidItem = sequelize.define(
    'PlaidItem',
    {
      entityId: { type: DataTypes.STRING, field: 'entity_id' },
      itemId: {
        type: DataTypes.STRING,
        field: 'item_id',
        unique: true,
      },
      accessToken: { type: DataTypes.STRING, field: 'access_token' },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
      },
    },
    {
      schema: 'app',
      tableName: 'plaid_items',
    },
  );

  PlaidItem.associate = models => {
    const { User } = models;
    PlaidItem.User = PlaidItem.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  };

  return PlaidItem;
};
