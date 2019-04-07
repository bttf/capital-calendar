import React from 'react';
import styled from 'styled-components';
import Link from '../../components/Link';
import Modal from '../../components/Modal';
import SignInWithGoogleButton from '../../components/SignInWithGoogleButton';
import StepsForSuccess from './StepsForSuccess';

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

export default class Login extends React.Component {
  state = {
    isPrivacyPolicyOpen: false,
  };

  togglePrivacyPolicy = () => {
    console.log('toggle');
    this.setState({ isPrivacyPolicyOpen: !this.state.isPrivacyPolicyOpen });
  };

  render() {
    return (
      <LoginContainer>
        <IntroContainer>
          <P>
            Connect your 🏦 <strong>bank</strong> with 🗓 <strong>Google calendar</strong>, and let
            us show you how much 💸 <strong>money</strong> you spend <strong>every day</strong>.
          </P>
          <P>
            Rest easy knowing that we won’t use your data for <strong>anything else</strong>. See
            our <Link onClick={this.togglePrivacyPolicy}>Privacy Policy</Link>.
          </P>
        </IntroContainer>
        <SignInContainer>
          <SignInWithGoogleButton />
          <StepsForSuccess />
        </SignInContainer>

        {/* Modals */}
        <Modal isOpen={this.state.isPrivacyPolicyOpen} onClose={this.togglePrivacyPolicy}>
          Privacy policy
        </Modal>
      </LoginContainer>
    );
  }
}
