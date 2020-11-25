import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { FlexRow, FlexColumn } from './shared/styles/flex';
import routes from './shared/routes';
import { Header } from './components/header';
import { Game } from './components/game';
import { Toolbar } from './components/toolbar';
import { Signup } from './components/signup';

/**
 * The client component will take the entire screen
 * if no other flex elements are on the DOM.
 */
const Client = styled(FlexColumn)`
  flex: 6;
`;

/**
 * The menu component will take up a portion of the
 * screen with the client component once it appears.
 */
const Menu = styled.div`
  flex: 4;
`;

const App = () => (
  <BrowserRouter>
    <Header />
    <FlexRow>
      <Client>
        <Game />
        <Toolbar />
      </Client>
      <Switch>
        <Route path={routes.signup.path}>
          <Menu>
            <Signup />
          </Menu>
        </Route>
      </Switch>
    </FlexRow>
  </BrowserRouter>
);

export default App;
