import React, { useState } from 'react';
import { ItemContainer, Title } from '../BankAccounts';
import AddYourFirstCalendarButton from './AddYourFirstCalendarButton';
import CreateCalendarForm from './CreateCalendarForm';
import CalendarBlockingOverlay from './CalendarBlockingOverlay';

export default () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <ItemContainer>
      <Title>Calendars</Title>

      {!showCreateForm && <AddYourFirstCalendarButton onClick={() => setShowCreateForm(true)} />}

      {showCreateForm && <CreateCalendarForm cancelForm={() => setShowCreateForm(false)} />}

      <CalendarBlockingOverlay />
    </ItemContainer>
  );
};
