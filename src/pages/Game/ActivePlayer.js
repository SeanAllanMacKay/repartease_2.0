import React, { useState } from 'react';
import { Button } from '../../components/Button'

import style from '../../styles'

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    button: {
        height: '70px',
        fontSize: '1.5em',
        marginBottom: '30px',
        width: '100%'
    },
    title: {
        fontSize: '2em',
    },
    responses: {
        marginBottom: '30px',
        maxHeight: '70vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    response: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '1.25em',
        padding: '10px',
        cursor: 'pointer',
        border: `3px solid ${style.color.primary}`,
        margin: '20px 0'
    },
    chosen: {
        backgroundColor: style.color.primary,
        color: 'white'
    }
}

export default (props) => {
    const [chosen, setChosen] = useState(null)
    return (
        <div style={styles.containerStyle}>
            <div style={styles.responses}>
                <h2 style={styles.title}>{props.prompt}</h2>
                {props.responses.map((response, index) => {
                    return (
                        <div
                            style={response === chosen ? {...styles.response, ...styles.chosen} : styles.response}
                            onClick={() => {
                                index === chosen ? setChosen(null) : setChosen(response)
                            }}
                        >
                            {response.response}
                        </div>
                    )
                })}
            </div>
            <Button
                content="Pick Answer"
                type="primary"
                style={styles.button}
                tooltip={!props.responses.length > 0 ? 'Wait for the other players to submit their answers' : null}
                disabled={!props.responses.length || !chosen}
                onClick={() => {
                    props.submitPick(chosen.playerId)
                }}
            />
        </div>
    )
}