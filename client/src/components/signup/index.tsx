import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexColumn } from '../../shared/styles/flex';
import { closeMenu } from '../menu-bar/actions';
import { signup } from './actions';

const Container = styled(FlexColumn)`
  padding: 8px;
  height: 82.5vh;
  background-color: ${(props) => props.theme.colors.primary};
`;

const SignupTitle = styled.div`
  margin-bottom: 8px;
  color: ${(props) => props.theme.colors.secondary};
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

const SignupButton = styled.div`
  margin: 4px;
  padding: 6px;
  color: ${(props) => props.theme.colors.secondary};
  background-color: ${(props) => props.theme.colors.teritary};
  cursor: pointer;
`;

const Error = styled.div`
  color: ${(props) => props.theme.errorColors.secondary};
  font-weight: bold;
`;

export const Signup = React.memo(() => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error>();

  const onChangeUsername = (event: React.FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;
    setUsername(value);
  };

  const onChangeEmail = (event: React.FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;
    setEmail(value);
  };

  const onChangePassword = (event: React.FormEvent<EventTarget>) => {
    const { value } = event.target as HTMLInputElement;
    setPassword(value);
  };

  const onSignup = async () => {
    try {
      const user = await signup(username, email, password).promise;
      if (user) {
        // created an account, get out of the signup page
        closeMenu();
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Container>
      <SignupTitle>Don&apos;t have an account? Signup</SignupTitle>
      <SignupForm>
        <InputField placeholder="Type your username here" onChange={onChangeUsername} type="text" value={username} />
        <InputField placeholder="Type your email here" onChange={onChangeEmail} type="email" value={email} />
        <InputField
          placeholder="Type your password here"
          onChange={onChangePassword}
          type="password"
          value={password}
        />
        <SignupButton onClick={onSignup}>Signup</SignupButton>
      </SignupForm>
      {error && <Error>{error.message}</Error>}
    </Container>
  );
});
