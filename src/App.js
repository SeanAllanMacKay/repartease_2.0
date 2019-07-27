import React from 'react';

import { Switch, Route, Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import useScreenSize from './hooks/useScreenSize'

import { Button } from '../src/components/Button';

let history = createBrowserHistory();

export default () => {
  const [screenSize] = useScreenSize();
  console.log(screenSize)
  return (
    <Router history={history}>
      <Switch>
        <Route 
          exact
          path={"/"}
          render={() => 
            <Button
              content="Test"
            />
          }
        />
      </Switch>
    </Router>
  );
};
