import React from 'react';

import { history } from  './hooks/useRedirect'
import { Switch, Route, Router } from "react-router-dom";

import { Header } from '../src/components/Header'
import LandingPage from '../src/pages/LandingPage'
import StartGame from '../src/pages/StartGame'
import JoinGame from '../src/pages/JoinGame'

const styles = {
  container: {
    padding: '30px',
    height: 'calc(100vh - 115px)'
  }
}

export default () => {
  return (
    <>
    <Header />
      <Router 
        history={history}
      >
        <div style={styles.container}>
          <Switch>
            <Route 
              exact
              path={"/"}
              render={() => 
                <LandingPage />
              }
            />
            <Route 
              exact
              path={"/start-game"}
              render={() => 
                <StartGame />
              }
            />
            <Route 
              exact
              path={"/join-game"}
              render={() => 
                <JoinGame />
              }
            />
          </Switch>
        </div>
      </Router>
    </>
  );
};
