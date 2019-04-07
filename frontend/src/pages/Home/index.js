import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import Text from '../../components/Text';
import ConnectWithPlaidButton from '../../components/ConnectWithPlaidButton';
import CreateCalendarCard from './CreateCalendarCard';
import CalendarBlockingOverlay from './CalendarBlockingOverlay';

export const HomeContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: flex-start;
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
      if (loading)
        return (
          <HomeContainer>
            <Text color="#808080" font="'Arvo', serif" size={48}>
              Loading...
            </Text>
          </HomeContainer>
        );

      const viewer = data && data.viewer;

      if (!viewer) return null;

      return (
        <HomeContainer>
          <ItemContainer>
            <Title>Bank Accounts</Title>

            <ConnectWithPlaidButton />
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
