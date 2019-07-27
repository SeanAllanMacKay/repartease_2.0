import React from 'react';

import { Switch, Route, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import { Button } from 'antd';

let history = createBrowserHistory();

export default () => {
  return (
    <Router history={history}>
      <Switch>
        <Route 
          exact
          path={"/"}
          render={() => 
            <Button>Test</Button>
          }
        />
      </Switch>
    </Router>
  );
};
