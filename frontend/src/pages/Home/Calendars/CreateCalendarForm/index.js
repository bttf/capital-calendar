import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Formik, Field } from 'formik';
import styled from 'styled-components';
import Button from '../../../../components/Button';
import CadenceSelector from './CadenceSelector';

const CREATE_CALENDAR = gql`
  mutation CreateCalendar(
    $name: String!
    $cadence: TransactionMonitorCadenceEnum!
    $expenseAccountIds: [String!]!
    $incomeAccountIds: [String!]!
  ) {
    createTransactionMonitor(
      name: $name
      cadence: $cadence
      expenseAccountIds: $expenseAccountIds
      incomeAccountIds: $incomeAccountIds
    ) {
      transactionMonitor {
        name
        cadence
      }
    }
  }
`;

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

const ButtonsContainer = styled('div')`
  display: flex;
  justify-content: space-between;

  padding-top: 16px;

  width: 392px;
`;

const CancelButton = styled(Button)`
  flex: 1;
  margin-right: 8px;
  font-family: 'Arvo', serif;
  font-size: 14px;
`;

const SaveButton = styled(Button, { type: 'submit' })`
  flex: 1;
  background-color: #697796;
  color: white;
  font-family: 'Arvo', serif;
  padding: 8px;
  font-size: 14px;
  margin-left: 8px;
`;

export default class CreateCalendarForm extends React.Component {
  render() {
    const { cancelForm } = this.props;

    return (
      <Mutation mutation={CREATE_CALENDAR}>
        {(createCalendar, { called, data, loading }) => {
          return (
            <Formik
              initialValues={{
                cadence: 'daily',
              }}
              onSubmit={values => {
                createCalendar({ variables: values });
              }}
            >
              {({ values, errors, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <CreateCalendarFormContainer>
                    <CalendarNameInput
                      placeholder="Calendar name"
                      name="name"
                      onChange={handleChange}
                      value={values.name}
                    />

                    <FormLabel>Cadence</FormLabel>

                    <Field name="cadence" component={CadenceSelector} />

                    <FormLabel>
                      Measure <Color color="#C56666">expenses</Color> from 0 accounts
                    </FormLabel>

                    <AccountSelectorButton expenses>Select accounts</AccountSelectorButton>

                    <FormLabel>
                      Measure <Color color="#6A9669">income</Color> from 0 accounts
                    </FormLabel>

                    <AccountSelectorButton>Select accounts</AccountSelectorButton>
                  </CreateCalendarFormContainer>
                  <ButtonsContainer>
                    <CancelButton onClick={cancelForm}>Cancel</CancelButton>
                    <SaveButton>Save calendar</SaveButton>
                  </ButtonsContainer>
                </form>
              )}
            </Formik>
          );
        }}
      </Mutation>
    );
  }
}
