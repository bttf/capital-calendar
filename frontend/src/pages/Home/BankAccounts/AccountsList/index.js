import React from 'react';
import styled from 'styled-components';

import AccountCard from '../../../../components/AccountCard';

const AccountsListContainer = styled('div')`
  min-height: 242px;
`;

export default ({ accounts = [] }) => {
  return (
    <AccountsListContainer>
      {accounts.map((a, i) => (
        <AccountCard
          key={`${a.accountId}_${i}`}
          index={i}
          account={a}
          logo={a.institution.logo}
          primaryColor={a.institution.primaryColor}
          institutionName={a.institution.name}
        />
      ))}
    </AccountsListContainer>
  );
};
