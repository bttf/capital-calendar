import React from 'react';
import styled from 'styled-components';
import PlaidLink from 'react-plaid-link';
import ItemCard from '../ItemCard';
import { PLAID_ENV, PLAID_ITEM_WEBHOOK, PLAID_PUBLIC_KEY } from '../../constants';

const Img = styled('img')`
  max-height: 24px;
  width: auto;
  margin-right: 16px;
`;

const AccountCardDetails = styled('div')`
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

const LoginRequiredOverlay = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: -4px;
  border-radius: 8px;

  display: flex-inline;
  justify-content: center;
  align-items: center;

  padding: 6px 12px;

  background-color: rgba(180, 0, 0, 0.9);
  color: white;

  & > div {
    display: inline;
  }
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
      <Img src={`data:image/png;base64,${logo}`} alt="Logo" />
      <AccountCardDetails>
        <AccountName>{account.name}</AccountName>
        <AccountInfo>
          <sub>{institutionName}</sub>
          <AccountMask>
            xxxxxxxx
            {account.mask}
          </AccountMask>
        </AccountInfo>
      </AccountCardDetails>

      {account.loginRequired && (
        <LoginRequiredOverlay>
          We lost access to the bank. They need you to log in again 🙄
          <PlaidLink
            clientName="Capital Calendar"
            product={['transactions']}
            env={PLAID_ENV}
            publicKey={PLAID_PUBLIC_KEY}
            webhook={PLAID_ITEM_WEBHOOK}
            token={account.itemPublicToken}
            onSuccess={() => {}}
            onExit={() => {}}
          >
            Log in here
          </PlaidLink>
        </LoginRequiredOverlay>
      )}
    </ItemCard>
  );
};
