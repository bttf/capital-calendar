import React from 'react';
import styled from 'styled-components';
import ItemCard from '../ItemCard';

const ItemCardInner = styled('div')`
  flex: 1;
  display: flex;
  align-items: center;

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

export default ({
  index,
  isFaded,
  logo,
  primaryColor,
  account,
  institutionName,
  onClick,
  highlightRed,
  highlightGreen,
}) => {
  const isClickable = typeof onClick === 'function';

  const noop = () => {};

  return (
    <ItemCard
      isFaded={isFaded}
      borderLeft={primaryColor}
      index={index}
      isClickable={isClickable}
      onClick={isClickable ? onClick : noop}
      highlightRed={highlightRed}
      highlightGreen={highlightGreen}
    >
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
