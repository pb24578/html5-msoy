import React from 'react';
import styled from 'styled-components';
import { FlexColumn } from '../../shared/styles/flex';

const Container = styled(FlexColumn)`
  padding: 8px;
`;

const UsersTitle = styled.div`
  margin-bottom: 2px;
  font-size: 16px;
  font-weight: bold;
`;

const UsersList = styled(FlexColumn)`
  max-height: 100px;
  max-width: 200px;
  overflow-y: auto;
  overflow-x: auto;
  background-color: rgba(40, 172, 222, 0.25);
`;

const User = styled.div`
  margin: 2px;
`;

export const Chat = React.memo(() => (
  <Container>
    <UsersTitle>Users Online</UsersTitle>
    <UsersList>
      <User>Shadowsych</User>
      <User>{'y0>'}</User>
      <User>Five</User>
      <User>Zahreik</User>
    </UsersList>
  </Container>
));
