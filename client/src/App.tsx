import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/">
        <div>Hello World!</div>
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
