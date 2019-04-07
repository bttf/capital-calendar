import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import CreateCalendarCard from './CreateCalendarCard';
import CalendarBlockingOverlay from './CalendarBlockingOverlay';

const HomeContainer = styled('div')`
  display: flex;
`;

const Title = styled('div')`
  font-family: 'Arvo', serif;
  color: #808080;
  font-size: 24px;
  padding: 0 16px;
  margin-bottom: 32px;
`;

const ItemContainer = styled('div')`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
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
          <ItemContainer>
            <Title>Bank Accounts</Title>
          </ItemContainer>

          <ItemContainer>
            <Title>Google Calendar</Title>
            <CreateCalendarCard />
            <CalendarBlockingOverlay />
          </ItemContainer>
        </HomeContainer>
      );
    }}
  </Query>
);
