import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import onLogout from '../../apollo/onLogout';

export default () => (
  <Query
    query={gql`
      query {
        viewer {
          user { email }
        }
      }
    `}
  >
  {({ loading, error, data }) => {
    if (loading) return 'Loading...';

    return (
      <div>
        <h1>Welcome {data.viewer.user.email}</h1>
        <button onClick={onLogout}>Log out</button>
      </div>
    );
  }}
  </Query>
);
