import React from 'react';
import styled from 'styled-components';

import ConnectWithPlaidButton from '../../../components/ConnectWithPlaidButton';

export const ItemContainer = styled('div')`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const Title = styled('div')`
  font-family: 'Arvo', serif;
  color: #808080;
  font-size: 24px;
  padding: 0 16px;
  margin-bottom: 32px;
`;

export default () => {
  return (
    <ItemContainer>
      <Title>Bank Accounts</Title>

      <ConnectWithPlaidButton />
    </ItemContainer>
  );
};
