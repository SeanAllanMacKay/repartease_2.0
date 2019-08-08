import React, { useEffect, useState } from 'react';

import useRedirect, { history } from  './hooks/useRedirect'
import { Switch, Route, Router } from "react-router-dom";
import cookie, { set } from './hooks/useCookie'
import { socket, emit, events } from './reducers/sockets'
import { GameProvider } from './context/GameContext'

import { Header } from '../src/components/Header'
import LandingPage from '../src/pages/LandingPage'
import StartGame from '../src/pages/StartGame'
import JoinGame from '../src/pages/JoinGame'
import WaitingRoom from '../src/pages/WaitingRoom'
import Game from './pages/Game'

const styles = {
  container: {
    padding: '30px',
    height: 'calc(100vh - 115px)'
  }
}

export default () => {
  const [game, setGame] = useState(null);
  const [activePlayer, setActivePlayer] = useState(false)
  useEffect(() => {
    if(game){
      game.active ?
        useRedirect('game') : 
        useRedirect('waiting-room')
    }

    if(game === null && cookie){
      emit(events.joinGame, cookie)
    }

    socket
      .on('update-cookie', newCookie => {
        set(newCookie)
      })
      .on('update-game', newGame => {
        setGame(newGame)
        if(game && (newGame.active !== game.active)) useRedirect('game')
      })
      .on('set-active-player', value => {
        setActivePlayer(value)
      })
  }, [game, activePlayer])
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
                <WaitingRoom 
                  activePlayer={activePlayer}
                />
              }
            />
            <Route 
              path={"/game"}
              render={() => 
                <Game 
                  activePlayer={activePlayer}
                />
              }
            />
          </Switch>
        </div>
      </Router>
    </GameProvider>
  );
};
