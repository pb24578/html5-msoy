import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { FlexRow, FlexColumn } from './shared/styles/flex';
import { resizePixiApp } from './shared/pixi';
import routes from './shared/routes';
import { Header } from './components/header';
import { Game } from './components/game';
import { Toolbar } from './components/toolbar';
import { Signup } from './components/signup';

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
   * Resize the Pixi App container and other DOM
   * elements whenever the window size changes.
   */
  window.onresize = () => {
    resizePixiApp();
  };

  return (
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
};

export default App;
