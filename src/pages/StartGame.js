import React, { useState } from 'react';

import { emit, events } from '../reducers/sockets'

import { Input } from  'antd'
import { Button } from '../components/Button'
import useRedirect from '../hooks/useRedirect';

const styles = {
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%'
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: '3em',
        fontWeight: 'bold',
        marginBottom: '40px'
    },
    input: {
        height: '45px',
        margin: '30px 0'
    },
    button: {
        height: '70px',
        fontSize: '1.5em',
        marginBottom: '30px'
    }
}

export default (props) => {
    const [name, setName] = useState('')
    return (
        <div
            style={styles.mainContainer}
        >
            <h2
                style={styles.title}
            >
                Start Game
            </h2>
            <Input 
                style={styles.input}
                placeholder="Name"
                value={name}
                onChange={({target: { value }}) => {
                    setName(value)
                }}
            />
            <Button 
                content="Start Game"
                style={styles.button}
                onClick={() => {
                    emit(events.startGame, { name })
                    useRedirect('waiting-room')
                }}
            />
        </div>
    )
}