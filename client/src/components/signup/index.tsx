import React from 'react';
import styled from 'styled-components';
import theme from '../../shared/styles/theme';
import { FlexColumn } from '../../shared/styles/flex';

const Container = styled(FlexColumn)`
  padding: 8px;
  height: 100%;
  background-color: ${theme.primary};
`;

const SignupTitle = styled.div`
  margin-bottom: 8px;
  color: ${theme.secondary};
  font-size: 24px;
`;

const SignupForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
  align-items: center;
`;

const InputField = styled.input`
  flex: 1;
  margin-right: 8px;
  padding: 8px;
`;

const LogonButton = styled.div`
  margin: 4px;
  padding: 6px;
  color: ${theme.secondary};
  background-color: ${theme.teritary};
  cursor: pointer;
`;

export const Signup = React.memo(() => (
  <Container>
    <SignupTitle>Already have an account? Logon</SignupTitle>
    <SignupForm>
      <InputField placeholder="Type your email here" type="email" />
      <InputField placeholder="Type your password here" type="password" />
      <LogonButton>Logon</LogonButton>
    </SignupForm>
    <SignupTitle>Don&apos;t have an account? Signup</SignupTitle>
    <SignupForm>
      <InputField placeholder="Type your username here" type="text" />
      <InputField placeholder="Type your email here" type="email" />
      <InputField placeholder="Type your password here" type="password" />
      <LogonButton>Signup</LogonButton>
    </SignupForm>
  </Container>
));
