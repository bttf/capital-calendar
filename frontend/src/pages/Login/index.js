import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import publicClient from '../../apollo/publicClient';
import Link from '../../components/Link';
import SignInWithGoogleButton from '../../components/SignInWithGoogleButton';
import StepsForSuccess from '../../components/StepsForSuccess';

const LoginContainer = styled('div')`
  display: flex;
  height: 420px;
`;

const IntroContainer = styled('div')`
  flex: 1;
  font-size: 27px;
  padding-right: 16px;
`;

const SignInContainer = styled('div')`
  width: 375px;
`;

const P = styled('p')`
  margin-top: 0;
`;

export default () => (
  <Query
    client={publicClient}
    query={gql`
      query {
        googleAuthUrl
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';

      return (
        <LoginContainer>
          <IntroContainer>
            <P>
              Connect your 🏦 <strong>bank</strong> with 🗓 <strong>Google calendar</strong>, and let
              us show you how much 💸 <strong>money</strong> you spend <strong>every day</strong>.
            </P>
            <P>
              Rest easy knowing that we won’t use your data for <strong>anything else</strong>. See
              our <Link href={'#'}>Privacy Policy</Link>.
            </P>
          </IntroContainer>
          <SignInContainer>
            <SignInWithGoogleButton />
            <StepsForSuccess />
          </SignInContainer>
        </LoginContainer>
      );
    }}
  </Query>
);
