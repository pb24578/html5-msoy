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
 * The client container will take the entire screen
 * if no other flex elements are on the DOM.
 */
const ClientContainer = styled(FlexColumn)`
  flex: 6;
`;

/**
 * The menu container will take up a portion of the
 * screen with the game container once it appears.
 */
const MenuContainer = styled.div`
  flex: 4;
`;

const App = () => (
  <BrowserRouter>
    <Header />
    <FlexRow>
      <ClientContainer>
        <Game />
        <Toolbar />
      </ClientContainer>
      <Switch>
        <Route path={routes.signup.path}>
          <MenuContainer>
            <Signup />
          </MenuContainer>
        </Route>
      </Switch>
    </FlexRow>
  </BrowserRouter>
);

export default App;
