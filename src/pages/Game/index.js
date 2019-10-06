import React, { useContext } from 'react';
import GameContext from '../../context/GameContext'

import ActivePlayer from './ActivePlayer'
import InactivePlayer from './InactivePlayer'
import { emit } from '../../reducers/sockets';

const styles = {
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
}

export default (props) => {
    const game = useContext(GameContext)
    return (
        <div style={styles.mainContainer}>
            
            {props.activePlayer ? 
                <ActivePlayer 
                    prompt={game && game.prompt} 
                    responses={game && game.responses}
                    submitPick={playerId => {
                        emit('pick-response', { gameCode: game.gameCode, playerId })
                    }}
                /> 
                :
                <InactivePlayer 
                    prompt={game && game.prompt}
                    submitResponse={response => {
                        emit('submit-response', { gameCode: game.gameCode, response })
                    }}
                />
            }
        </div>
    )
}