import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Header } from './components/header';

const App = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route path="/" />
    </Switch>
  </BrowserRouter>
);

export default App;
