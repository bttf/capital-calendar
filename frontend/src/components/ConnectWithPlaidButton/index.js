import React from 'react';
import styled from 'styled-components';
import PlaidLink from 'react-plaid-link';
import { SignInWithGoogleButton } from '../SignInWithGoogleButton';
import { PLAID_PUBLIC_KEY } from '../../constants';

const ConnectWithPlaidButton = styled(PlaidLink)`
  font-family: 'Arvo', serif;
  font-size: 27px;

  height: 70px;
  width: 375px;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
  border-style: none;
  border: none !important;

  cursor: pointer;
  outline: none;

  transition: transform 50ms;

  &:active {
    border-style: none;
    transform: translateY(2px) scale(0.98);
  }

  img {
    margin-left: 16px;
  }
`;

export default () => (
  <ConnectWithPlaidButton
    clientName="Capital Calendar"
    env="sandbox"
    product={['transactions']}
    publicKey={PLAID_PUBLIC_KEY}
    onExit={() => {}}
    onSuccess={() => {}}
  >
    Connect with
    <img alt="Plaid logo" src="/plaid-logo.svg" />
  </ConnectWithPlaidButton>
);
