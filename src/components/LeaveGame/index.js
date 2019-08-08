import React, { useContext } from 'react';
import GameContext from '../../context/GameContext'

import { socket } from '../../reducers/sockets'
import { remove } from '../../hooks/useCookie'
import useRedirect from '../../hooks/useRedirect';

import { Button } from '../Button'

export default (props) => {
    let game = useContext(GameContext)
    return (
        <Button 
            content="Leave Game"
            type="link"
            onClick={() => {
                remove()
                socket.disconnect()
                game = null
                useRedirect('/')
            }}
        />
    );
}