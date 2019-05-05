import React, { useState } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Text from '../../components/Text';
import HomeContext from './HomeContext';
import BankAccounts from './BankAccounts';
import Calendars from './Calendars';

export default () => {
  const [isCreatingCalendar, setIsCreatingCalendar] = useState(false);
  const [incomeAccountIdsSelected, setIncomeAccountIds] = useState([]);
  const [expenseAccountIdsSelected, setExpenseAccountIds] = useState([]);
  const [selectingAccountType, setSelectingAccountType] = useState(null);

  const submitAccountId = accountId => {
    if (!selectingAccountType) return;

    const accountIds = [
      ...(selectingAccountType === 'expenses'
        ? expenseAccountIdsSelected
        : incomeAccountIdsSelected),
    ];
    const setAccountIds =
      selectingAccountType === 'expenses' ? setExpenseAccountIds : setIncomeAccountIds;

    if (accountIds.includes(accountId)) {
      accountIds.splice(accountIds.indexOf(accountId), 1);
    } else {
      accountIds.push(accountId);
    }

    setAccountIds(accountIds);
  };

  /**
   * Using context API
   */
  const HomeContextValue = {
    isCreatingCalendar,
    setIsCreatingCalendar,
    selectingAccountType,
    setSelectingAccountType,
    incomeAccountIdsSelected,
    setIncomeAccountIds,
    expenseAccountIdsSelected,
    setExpenseAccountIds,
    submitAccountId,
  };

  return (
    <Query query={HOME_QUERY}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <Text color="#808080" font="'Arvo', serif" size={48}>
              Loading...
            </Text>
          );
        }

        const viewer = data && data.viewer;

        if (!viewer) return null;

        return (
          <HomeContext.Provider value={HomeContextValue}>
            <BankAccounts />
            <Calendars />
          </HomeContext.Provider>
        );
      }}
    </Query>
  );
};

const HOME_QUERY = gql`
  query {
    viewer {
      user {
        email
      }
    }
  }
`;
