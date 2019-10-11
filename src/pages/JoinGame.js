import React, { useState } from 'react';

import { emit, events } from '../reducers/sockets'
import useRedirect from '../hooks/useRedirect';

import { Input } from  'antd'
import { Button } from '../components/Button'

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
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        margin: '15px 0'
    },
    input: {
        height: '45px',
        margin: '15px 0'
    },
    button: {
        height: '70px',
        fontSize: '1.5em',
        marginBottom: '30px'
    }
}

export default (props) => {
    const [name, setName] = useState('')
    const [gameCode, setGameCode] = useState('')
    return (
        <div
            style={styles.mainContainer}
        >
            <h2
                style={styles.title}
            >
                Join Game
            </h2>
            <div style={styles.inputContainer}>
                <Input 
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChange={({target: { value }}) => {
                        setName(value.toUpperCase())
                    }}
                />
                <Input 
                    style={styles.input}
                    placeholder="Gamecode"
                    value={gameCode}
                    onChange={({target: { value }}) => {
                        setGameCode(value.toUpperCase())
                    }}
                />
            </div>
            <Button 
                content="Join Game"
                style={styles.button}
                type="primary"
                onClick={() => {
                    if(name && gameCode && gameCode.length === 6){
                        emit(events.joinGame, { name, gameCode })
                        useRedirect('waiting-room')
                    }
                }}
            />
        </div>
    )
}