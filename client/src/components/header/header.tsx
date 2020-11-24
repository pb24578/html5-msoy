import React from 'react';
import styled from 'styled-components';
import { FlexRow, FlexColumn, FlexCenter } from '../../shared/styles/flex';

const Container = styled(FlexRow)``;

const Logo = styled(FlexRow)`
  flex: 0.2;
  font-size: 24px;
`;

const Spacing = styled.div`
  flex: 0.4;
`;

const Navigation = styled(FlexColumn)`
  flex: 0.4;
  align-items: flex-end;
`;

const Account = styled(FlexRow)`
  margin-bottom: 8px;
`;

const AccountLink = styled.div`
  padding: 0px 16px;
  cursor: pointer;
`;

const Tabs = styled(FlexRow)``;

const TabLink = styled(FlexCenter)`
  margin: 0px 16px;
  padding: 6px;
  width: 64px;
  color: #ffffff;
  background-color: #28acde;
  cursor: pointer;
`;

export const Header = React.memo(() => {
  console.log('Hello');
  return (
    <Container>
      <Logo>HTML5 Whirled</Logo>
      <Spacing />
      <Navigation>
        <Account>
          <AccountLink>Name</AccountLink>
          <AccountLink>About</AccountLink>
          <AccountLink>Login</AccountLink>
          <AccountLink>Logout</AccountLink>
        </Account>
        <Tabs>
          <TabLink>Me</TabLink>
          <TabLink>Stuff</TabLink>
          <TabLink>Games</TabLink>
          <TabLink>Rooms</TabLink>
          <TabLink>Groups</TabLink>
          <TabLink>Shop</TabLink>
        </Tabs>
      </Navigation>
    </Container>
  );
});
