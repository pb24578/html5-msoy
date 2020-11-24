import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Header } from './components/header';
import { Game } from './components/game';

const App = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route path="/">
        <Game />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
