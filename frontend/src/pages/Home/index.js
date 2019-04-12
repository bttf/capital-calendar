import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import Text from '../../components/Text';
import ItemCard from '../../components/ItemCard';
import BankAccountCard from '../../components/BankAccountCard';
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

const TitleSmallLink = styled('span')`
  cursor: pointer;
  font-size: 14px;
  font-family: 'Arvo', serif;
  color: #808080;
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

      const { user } = viewer;
      const { accounts } = user;

      return (
        <HomeContainer>
          <ItemContainer>
            <Title>
              Bank Accounts {!!accounts.length && <TitleSmallLink>(Add new)</TitleSmallLink>}
            </Title>

            {!accounts.length && <ConnectWithPlaidButton />}

            {!!accounts.length &&
              accounts.map(account => (
                <BankAccountCard
                  name={account.name}
                  logo={account.institution.logo}
                  primaryColor={account.institution.primaryColor}
                />
              ))}
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
