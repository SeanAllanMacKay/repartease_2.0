import React, { useEffect, useState } from 'react';

import useRedirect, { history } from  './hooks/useRedirect'
import { Switch, Route, Router } from "react-router-dom";
import Cookies from 'universal-cookie'
import { socket, emit, events } from './reducers/sockets'
import { GameProvider } from './context/GameContext'

import { Header } from '../src/components/Header'
import LandingPage from '../src/pages/LandingPage'
import StartGame from '../src/pages/StartGame'
import JoinGame from '../src/pages/JoinGame'
import WaitingRoom from '../src/pages/WaitingRoom'

const cookies = new Cookies()

const styles = {
  container: {
    padding: '30px',
    height: 'calc(100vh - 115px)'
  }
}

export default () => {
  const [game, setGame] = useState(null);
  useEffect(() => {
    if(game){
      useRedirect('waiting-room')
    }

    if(game === null && cookies.get('game')){
      emit(events.joinGame, cookies.get('game'))
    }

    socket
      .on('update-cookie', newCookie => {
        cookies.set('game', JSON.stringify(newCookie), { path: '/' })
      })
      .on('update-game', newGame => {
        setGame(newGame)
      })
  })
  return (
    <GameProvider
      value={game}
    >
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
            <Route 
              path={"/waiting-room"}
              render={() => 
                <WaitingRoom />
              }
            />
          </Switch>
        </div>
      </Router>
    </GameProvider>
  );
};
