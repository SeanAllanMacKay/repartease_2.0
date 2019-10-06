import React from 'react';

import { socket } from '../../reducers/sockets'
import { remove } from '../../hooks/useCookie'
import useRedirect from '../../hooks/useRedirect';

import { Button } from '../Button'

export default (props) => {
    return (
        <Button 
            content="Leave Game"
            type="link"
            onClick={() => {
                remove()
                socket.disconnect()
                useRedirect('/')
                props.onClick()
            }}
        />
    );
}