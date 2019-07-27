import React from 'react';

import { Switch, Route, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

let history = createBrowserHistory();

export default () => {
  return (
    <Router history={history}>
      <Switch>
        <Route 
          exact
          path={"/"}
          render={() => {
            return null;
          }}
        />
      </Switch>
    </Router>
  );
};
