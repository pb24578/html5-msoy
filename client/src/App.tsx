import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { FlexRow } from './shared/styles/flex';
import routes from './shared/routes';
import { Header } from './components/header';
import { Game } from './components/game';
import { Signup } from './components/signup';

const GameContainer = styled.div`
  flex: 6;
`;

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
