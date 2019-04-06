import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import onLogout from '../../apollo/onLogout';

export default () => (
  <Query
    query={gql`
      query {
        viewer {
          user {
            email
            calendars {
              name
            }
          }
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';

      const viewer = data && data.viewer;

      if (!viewer) return null;

      const { calendars } = viewer && viewer.user;

      return (
        <div>
          <h1>Welcome {data.viewer.user.email}</h1>

          <hr />

          <h2>calendars</h2>

          <ul>
            {calendars.map((c, i) => (
              <li key={i}>{c.name}</li>
            ))}
          </ul>

          <button onClick={onLogout}>Log out</button>
        </div>
      );
    }}
  </Query>
);
