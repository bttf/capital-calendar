import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import TopNav from '../../components/TopNav';

const HomeContainer = styled('div')`
  display: flex;
`;

const Title = styled('div')`
  font-family: 'Arvo', serif;
  color: #808080;
  font-size: 24px;
  padding: 0 16px;
`;

const PlaidContainer = styled('div')`
  display: flex;
  justify-content: center;

  flex: 1;
  height: 400px;
`;

const GoogleContainer = styled('div')`
  display: flex;
  justify-content: center;

  flex: 1;
  height: 400px;
`;

export default () => (
  <Query
    query={gql`
      query {
        viewer {
          user {
            email
          }
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';

      const viewer = data && data.viewer;

      if (!viewer) return null;

      return (
        <HomeContainer>
          <TopNav />

          <PlaidContainer>
            <Title>Bank Accounts</Title>
          </PlaidContainer>

          <GoogleContainer>
            <Title>Google Calendar</Title>
          </GoogleContainer>
        </HomeContainer>
      );
    }}
  </Query>
);
