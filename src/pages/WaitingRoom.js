import React, { useContext } from 'react';
import GameContext from '../context/GameContext'

import { emit, events } from '../reducers/sockets'

import { Button } from '../components/Button'
import LeaveGame from '../components/LeaveGame'

const styles = {
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%'
    },
    title: {
        fontSize: '3em',
        fontWeight: 'bold',
        margin: 0
    },
    gameCode: {
        fontSize: '2em',
        fontWeight: 'bold',
        color: 'grey'
    },
    playersContainer: {
        maxHeight: '50vh',
        width: '100%', 
        overflow: 'auto',
        marginBottom: '20px'
    },
    playerContainer: {
        padding: '10px'
    },
    player: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: '1.5em',
        borderBottom: '1px solid grey',
        width: '100%'
    },
    startButton: {
        height: '70px',
        fontSize: '1.5em',
        width: '100%'
    }
}

export default (props) => {
    const game = useContext(GameContext)
    return (
        <>
            {game ? 
                <div
                    style={styles.mainContainer}
                >
                    <h2
                        style={styles.title}
                    >
                        Waiting Room
                    </h2>
                    <h3
                        style={styles.gameCode}
                    >
                        {game && game.gameCode}
                    </h3>
                    <div
                        style={styles.playersContainer}
                    >
                        {game && game.players && game.players.map(player => {
                            return (
                                <div
                                    style={styles.playerContainer}
                                >
                                    <h4
                                        style={styles.player}
                                    >
                                        {player.name}
                                    </h4>
                                </div>
                            )
                        })}
                    </div>
                    {
                        game && game.players.length > 1 
                        &&
                        props.activePlayer
                        &&
                        <Button 
                            content="Start Playing"
                            type="primary"
                            style={styles.startButton}
                            onClick={() => {
                                emit('all-in', { gameCode: game.gameCode })
                            }}
                        />
                    }
                    <LeaveGame />
                </div>
                :
                <h2
                    style={styles.title}
                >
                    Game not found
                </h2>
            }
        </>
    )
}