import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import CalendarCard from '../../../components/CalendarCard';
import HomeContext from '../HomeContext';
import { ItemContainer, Title } from '../BankAccounts';
import AddYourFirstCalendarButton from './AddYourFirstCalendarButton';
import CreateCalendarForm from './CreateCalendarForm';
import CalendarBlockingOverlay from './CalendarBlockingOverlay';

const CALENDARS_QUERY = gql`
  query Calendars {
    viewer {
      user {
        calendars {
          name
          backgroundColor
          googleCalendarInSync
        }
      }
    }
  }
`;

export default props => {
  return (
    <Query query={CALENDARS_QUERY}>
      {({ loading, error, data }) => {
        const calendars = loading || !data ? [] : data.viewer.user.calendars;

        if (loading) {
          return (
            <ItemContainer>
              <Title>Calendars</Title>
              Loading...
            </ItemContainer>
          );
        }

        return (
          <HomeContext.Consumer>
            {({
              isCreatingCalendar,
              setIsCreatingCalendar,
              setSelectingAccountType,
              setIncomeAccountIds,
              setExpenseAccountIds,
            }) => (
              <ItemContainer>
                <Title>Calendars</Title>

                {!isCreatingCalendar &&
                  !calendars.length && (
                    <AddYourFirstCalendarButton onClick={() => setIsCreatingCalendar(true)} />
                  )}

                {!isCreatingCalendar && calendars.map(c => <CalendarCard calendar={c} />)}

                {isCreatingCalendar && (
                  <CreateCalendarForm
                    cancelForm={() => {
                      setSelectingAccountType(null);
                      setIncomeAccountIds([]);
                      setExpenseAccountIds([]);
                      setIsCreatingCalendar(false);
                    }}
                  />
                )}

                <CalendarBlockingOverlay />
              </ItemContainer>
            )}
          </HomeContext.Consumer>
        );
      }}
    </Query>
  );
};
