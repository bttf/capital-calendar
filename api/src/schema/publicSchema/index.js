import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { googleScopes, genGoogleOAuthClient } from '../../lib/auth';
import mutation from './mutation';

export default new GraphQLSchema({
  mutation,
  query: new GraphQLObjectType({
    name: 'PublicQuery',
    fields: {
      googleAuthUrl: {
        type: GraphQLString,
        resolve: () => {
          const googleOAuthClient = genGoogleOAuthClient();
          const googleAuthUrl = googleOAuthClient.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',
            scope: googleScopes,
          });
          return googleAuthUrl;
        },
      },
    },
  }),
});
