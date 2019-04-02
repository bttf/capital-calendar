import React from 'react';
import styled from 'styled-components';

const SignInWithGoogleButton = styled('button')`
  font-family: 'Arvo', serif;
  font-size: 27px;

  height: 70px;
  width: 375px;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  border-style: none;

  cursor: pointer;
  outline: none;

  transition: transform 50ms;

  img {
    margin-right: 16px;
  }

  &:active {
    border-style: none;
    transform: translateY(2px) scale(0.98);
  }
`;

export default () => (
  <SignInWithGoogleButton>
    <img src="/g-logo.png" style={{ height: '48px', width: '48px' }} />
    Sign in with Google
  </SignInWithGoogleButton>
);
