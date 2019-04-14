import React from 'react';
import styled from 'styled-components';
import ItemCard from '../ItemCard';

const ItemCardInner = styled('div')`
  flex: 1;
  display: flex;

  padding: 0 32px;

  img {
    max-height: 24px;
    width: auto;
    margin-right: 16px;
  }
`;

const ItemCardDetails = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const AccountName = styled('div')`
  font-family: 'Open Sans', sans-serif;
  font-size: 18px;
  color: #000;
`;

const AccountInfo = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const AccountMask = styled('sub')`
  color: #808080;
  font-style: italic;
`;

export default ({ index, logo, primaryColor, account, institutionName }) => {
  return (
    <ItemCard borderLeft={primaryColor} index={index}>
      <ItemCardInner>
        <img src={`data:image/png;base64,${logo}`} alt="Logo" />
        <ItemCardDetails>
          <AccountName>{account.name}</AccountName>
          <AccountInfo>
            <sub>{institutionName}</sub>
            <AccountMask>
              xxxxxxxx
              {account.mask}
            </AccountMask>
          </AccountInfo>
        </ItemCardDetails>
      </ItemCardInner>
    </ItemCard>
  );
};
