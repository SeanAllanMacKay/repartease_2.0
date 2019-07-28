import React from 'react';

import useRedirect from '../hooks/useRedirect'

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
        marginBottom: '40px',
    },
    button: {
        height: '70px',
        fontSize: '1.5em',
        marginBottom: '30px'
    }
}

export default (props) => {
    return (
        <div
            style={styles.mainContainer}
        >
            <h2
                style={styles.title}
            >
                Home
            </h2>
            <Button 
                content="Start Game"
                style={styles.button}
                type='primary'
                onClick={() => {
                    useRedirect('start-game')
                }}
            />
            <Button 
                content="Join Game"
                style={styles.button}
                type='primary'
                onClick={() => {
                    useRedirect('join-game')
                }}
            />
        </div>
    )
}