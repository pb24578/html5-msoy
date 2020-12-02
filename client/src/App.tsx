import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import styled from 'styled-components';
import { history } from './store';
import Theme from './shared/styles/theme';
import { FlexRow, FlexColumn } from './shared/styles/flex';
import routes from './shared/routes';
import { loadSession } from './shared/user/actions';
import { Header } from './components/header';
import { Game } from './components/game';
import { Toolbar } from './components/toolbar';
import { Login } from './components/login';
import { Signup } from './components/signup';
import { Profile } from './components/profile';
import { MenuBar } from './shared/menu-bar';

/**
 * The client component will take the entire screen
 * if no other flex elements are on the DOM.
 *
 * The width will take the entire screen if there are
 * no other elements. The width must be specified so
 * that the Pixi container knows the resize bounds.
 *
 * The width will take the specified portion of the screen
 * if another element is also on the DOM.
 */
const Client = styled(FlexColumn)`
  flex: 6;
  width: 60%;
`;

/**
 * The menu component will take up a portion of the
 * screen with the client component once it appears.
 *
 * The width will take the specified portion of the screen
 * if another element is also on the DOM.
 */
const Menu = styled.div`
  flex: 4;
  width: 40%;
`;

const App = () => {
  /**
   * Load the local session, this will only work if a
   * session exists in the local storage.
   */
  loadSession();

  const client = (
    <Client>
      <Game />
      <Toolbar />
    </Client>
  );

  return (
    <ConnectedRouter history={history}>
      <Theme>
        <Header />
        <FlexRow>
          <Switch>
            <Route path={`${routes.rooms.pathname}${routes.rooms.params}`}>{client}</Route>
            <Route path={routes.index.pathname}>{client}</Route>
          </Switch>
          <Switch>
            <Route path={routes.login.pathname}>
              <Menu>
                <MenuBar />
                <Login />
              </Menu>
            </Route>
            <Route path={routes.signup.pathname}>
              <Menu>
                <MenuBar />
                <Signup />
              </Menu>
            </Route>
            <Route path={`${routes.profiles.pathname}${routes.profiles.params}`}>
              <Menu>
                <MenuBar />
                <Profile />
              </Menu>
            </Route>
          </Switch>
        </FlexRow>
      </Theme>
    </ConnectedRouter>
  );
};

export default App;
