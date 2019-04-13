import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import BankAccounts from './BankAccounts';
import Calendars from './Calendars';
import Text from '../../components/Text';

export default () => (
  <Query query={HOME_QUERY}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Text color="#808080" font="'Arvo', serif" size={48}>
            Loading...
          </Text>
        );

      const viewer = data && data.viewer;

      if (!viewer) return null;

      // const { user } = viewer;
      // const { accounts } = user;

      return (
        <React.Fragment>
          <BankAccounts />
          <Calendars />
        </React.Fragment>
      );
    }}
  </Query>
);

const HOME_QUERY = gql`
  query {
    viewer {
      user {
        email
        accounts {
          name
          mask
          institution {
            logo
            primaryColor
          }
        }
      }
    }
  }
`;
