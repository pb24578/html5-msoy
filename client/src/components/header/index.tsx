import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import routes from '../../shared/routes';
import { AppName } from '../../shared/constants';
import theme from '../../shared/styles/theme';
import { FlexRow, FlexColumn, FlexCenter } from '../../shared/styles/flex';
import { logout } from '../../shared/user/actions';
import { getDisplayName, getToken } from '../../shared/user/selectors';

const Container = styled(FlexRow)`
  height: 10vh;
`;

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

const AccountLink = styled(Link)`
  padding: 0px 16px;
  cursor: pointer;
`;

const Tabs = styled(FlexRow)``;

const TabLink = styled(FlexCenter)`
  margin: 0px 16px;
  padding: 6px;
  width: 64px;
  color: ${theme.secondary};
  background-color: ${theme.primary};
  cursor: pointer;
`;

export const Header = React.memo(() => {
  const token = useSelector(getToken);
  const displayName = useSelector(getDisplayName);

  let accountLinks: React.ReactElement = (
    <>
      <AccountLink to={routes.login.path}>Login</AccountLink>
      <AccountLink to={routes.signup.path}>Signup</AccountLink>
    </>
  );

  if (token) {
    accountLinks = (
      <>
        <AccountLink to={routes.index.path}>{displayName}</AccountLink>
        <AccountLink to={routes.index.path} onClick={() => logout()}>
          Logout
        </AccountLink>
      </>
    );
  }

  return (
    <Container>
      <Logo>{AppName}</Logo>
      <Spacing />
      <Navigation>
        <Account>
          <AccountLink to="">About</AccountLink>
          {accountLinks}
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
