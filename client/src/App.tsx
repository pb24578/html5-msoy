import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
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

  return (
    <BrowserRouter>
      <Theme>
        <Header />
        <FlexRow>
          <Client>
            <Game />
            <Toolbar />
          </Client>
          <Switch>
            <Route path={routes.login.path}>
              <Menu>
                <Login />
              </Menu>
            </Route>
            <Route path={routes.signup.path}>
              <Menu>
                <Signup />
              </Menu>
            </Route>
            <Route path={`${routes.profiles.path}${routes.profiles.params}`}>
              <Menu>
                <Profile />
              </Menu>
            </Route>
          </Switch>
        </FlexRow>
      </Theme>
    </BrowserRouter>
  );
};

export default App;
