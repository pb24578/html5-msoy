import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { FlexRow } from './shared/styles/flex';
import routes from './shared/routes';
import { Header } from './components/header';
import { Game } from './components/game';
import { Signup } from './components/signup';

/**
 * The game container will take the entire screen
 * if no other flex elements are on the DOM.
 */
const GameContainer = styled.div`
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
      <GameContainer>
        <Game />
      </GameContainer>
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
