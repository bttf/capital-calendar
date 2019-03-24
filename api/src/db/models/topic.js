export default (sequelize, DataTypes) => {
  const Topic = sequelize.define(
    'Topic',
    {
      entityId: { type: DataTypes.STRING, field: 'entity_id' },
      slug: DataTypes.STRING,
      title: DataTypes.STRING,
      body: DataTypes.STRING,
      isCollection: { type: DataTypes.BOOLEAN, field: 'is_collection' },
      pinnedIndex: { type: DataTypes.INTEGER, field: 'pinned_index' },
      childrenUpdatedAt: { type: DataTypes.DATE, field: 'children_updated_at' },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
      },
    },
    {
      schema: 'app',
      tableName: 'topics',
    },
  );

  Topic.associate = models => {
    const { User } = models;
    Topic.Creator = Topic.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
    Topic.ParentTopic = Topic.belongsTo(Topic, { foreignKey: 'parent_id', as: 'parentTopic' });
  };

  Topic.getBoardsOfUser = (user, options = {}) => {
    return Topic.findAll({
      where: {
        isCollection: true,
        parent_id: null,
        created_by: user.id,
      },
      ...options,
    });
  };

  Topic.getBoardBySlug = (slug, options = {}) => {
    return Topic.findOne({
      where: {
        isCollection: true,
        parent_id: null,
        slug,
      },
      ...options,
    });
  };

  return Topic;
};
