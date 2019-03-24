import { GraphQLObjectType } from 'graphql';
import authWithGithub from './authWithGithub';

export default new GraphQLObjectType({
  name: 'PublicMutation',
  fields: {
    authWithGithub,
  },
});
