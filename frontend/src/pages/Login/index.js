import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import publicClient from '../../apollo/publicClient';

export default () => (
  <Query
    client={publicClient}
    query={gql`
      query { googleAuthUrl }
    `}
  >
  {({ loading, error, data }) => {
    if (loading) return 'Loading...';

    return (
      <div>
        <h1><a href={data.googleAuthUrl}>login to gogle</a></h1>
      </div>
    );
  }}
  </Query>
);
