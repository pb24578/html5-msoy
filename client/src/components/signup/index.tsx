import React, { useState } from 'react';
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

export const Signup = React.memo(() => {
  const [logonEmail, setLogonEmail] = useState('');
  const [logonPassword, setLogonPassword] = useState('');
  const [username, setUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const onChangeLogonEmail = (event: React.FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;
    setLogonEmail(value);
  };

  const onChangeLogonPassword = (event: React.FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;
    setLogonPassword(value);
  };

  const onChangeUsername = (event: React.FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;
    setUsername(value);
  };

  const onChangeSignupEmail = (event: React.FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;
    setSignupEmail(value);
  };

  const onChangeSignupPassword = (event: React.FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;
    setSignupPassword(value);
  };

  return (
    <Container>
      <SignupTitle>Already have an account? Logon</SignupTitle>
      <SignupForm>
        <InputField placeholder="Type your email here" onChange={onChangeLogonEmail} type="email" value={logonEmail} />
        <InputField
          placeholder="Type your password here"
          onChange={onChangeLogonPassword}
          type="password"
          value={logonPassword}
        />
        <LogonButton>Logon</LogonButton>
      </SignupForm>
      <SignupTitle>Don&apos;t have an account? Signup</SignupTitle>
      <SignupForm>
        <InputField placeholder="Type your username here" onChange={onChangeUsername} type="text" value={username} />
        <InputField
          placeholder="Type your email here"
          onChange={onChangeSignupEmail}
          type="email"
          value={signupEmail}
        />
        <InputField
          placeholder="Type your password here"
          onChange={onChangeSignupPassword}
          type="password"
          value={signupPassword}
        />
        <LogonButton>Signup</LogonButton>
      </SignupForm>
    </Container>
  );
});
