import React from 'react';
import styled from 'styled-components';
import Button from '../../../../components/Button';
import CadenceSelector from './CadenceSelector';

const CreateCalendarFormContainer = styled('div')`
  width: 360px;

  border-radius: 8px;

  padding: 16px;
  box-shadow: inset 0px 1px 4px rgba(0, 0, 0, 0.25);
`;

const CalendarNameInput = styled('input', { type: 'text' })`
  border: 0;
  font-size: 18px;
  width: 100%;
`;

const FormLabel = styled('div')`
  font-weight: 600;
  font-size: 14px;
  color: #808080;
  margin: 8px 0;
`;

const Color = styled('span')`
  color: ${p => p.color};
`;

const AccountSelectorButton = styled(Button)`
  background-color: ${p => (p.expenses ? '#C56666' : '#6A9669')};
  color: white;
  font-weight: 600;
  padding: 8px;
`;

const SaveButton = styled(Button)`
  background-color: #697796;
  color: white;
  font-family: 'Arvo', serif;
  margin-top: 16px;
  padding: 8px;
  width: 392px;
  font-size: 14px;
`;

export default class CreateCalendarForm extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CreateCalendarFormContainer>
          <CalendarNameInput placeholder="Calendar name" />

          <FormLabel>Cadence</FormLabel>

          <CadenceSelector />

          <FormLabel>
            Measure <Color color="#C56666">expenses</Color> from 0 accounts
          </FormLabel>

          <AccountSelectorButton expenses>Select accounts</AccountSelectorButton>

          <FormLabel>
            Measure <Color color="#6A9669">income</Color> from 0 accounts
          </FormLabel>

          <AccountSelectorButton>Select accounts</AccountSelectorButton>
        </CreateCalendarFormContainer>
        <SaveButton>Save calendar</SaveButton>
      </React.Fragment>
    );
  }
}
