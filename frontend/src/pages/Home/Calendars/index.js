import React from 'react';
import HomeContext from '../HomeContext';
import { ItemContainer, Title } from '../BankAccounts';
import AddYourFirstCalendarButton from './AddYourFirstCalendarButton';
import CreateCalendarForm from './CreateCalendarForm';
import CalendarBlockingOverlay from './CalendarBlockingOverlay';

export default props => {
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

          {!isCreatingCalendar && (
            <AddYourFirstCalendarButton onClick={() => setIsCreatingCalendar(true)} />
          )}

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
};
