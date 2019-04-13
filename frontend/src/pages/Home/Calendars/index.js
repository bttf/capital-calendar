import React from 'react';

import CreateCalendarCard from './CreateCalendarCard';
import CalendarBlockingOverlay from './CalendarBlockingOverlay';
import { ItemContainer, Title } from '../BankAccounts';

export default () => {
  return (
    <ItemContainer>
      <Title>Google Calendar</Title>
      <CreateCalendarCard />
      <CalendarBlockingOverlay />
    </ItemContainer>
  );
};
