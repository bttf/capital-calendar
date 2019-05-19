export default (sequelize, DataTypes) => {
  const PlaidInstitution = sequelize.define(
    'PlaidInstitution',
    {
      institutionId: {
        type: DataTypes.STRING,
        field: 'institution_id',
        primaryKey: true,
      },
      name: { type: DataTypes.STRING },
      primaryColor: {
        type: DataTypes.STRING,
        field: 'primary_color',
      },
      url: { type: DataTypes.STRING },
      logo: { type: DataTypes.STRING },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
    },
    {
      schema: 'app',
      tableName: 'plaid_institutions',
    },
  );

  PlaidInstitution.associate = models => {
    const { PlaidItem } = models;

    PlaidInstitution.PlaidItem = PlaidInstitution.hasMany(PlaidItem, {
      foreignKey: 'plaid_institution_id',
      as: 'plaidItem',
    });
  };

  return PlaidInstitution;
};
