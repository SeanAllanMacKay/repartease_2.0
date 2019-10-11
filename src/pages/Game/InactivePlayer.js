import React, { useState } from 'react';

import { Input } from 'antd'
import { Button } from '../../components/Button'

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    title: {
        fontSize: '2em',
        textAlign: 'center'
    },
    subtitle: {
        color: 'grey',
        fontSize: '1.5em'
    },
    button: {
        height: '70px',
        fontSize: '1.5em',
        marginBottom: '30px',
        width: '100%'
    },
    input: {
        height: '45px',
        margin: '30px 0'
    },
}

export default (props) => {
    const [response, setResponse] = useState('')
    const [submitted, setSubmitted] = useState(false)

    return (
        <>
            {
                submitted ? 
                    <div style={styles.containerStyle}>
                        <h2 style={styles.title}>Submitted!</h2>
                        <h3 style={styles.subtitle}>
                            Sit back and relax
                        </h3>
                    </div>
                    :
                    <div style={styles.containerStyle}>
                        <h2 style={styles.title}>{props.prompt}</h2>
                        <Input 
                            style={styles.input}
                            placeholder="Response"
                            value={response}
                            onChange={({ target: { value } }) => {
                                setResponse(value)
                            }}
                        />
                        <Button
                            content="Submit Response"
                            type="primary"
                            style={styles.button}
                            onClick={() => {
                                if(response) {
                                    props.submitResponse(response)
                                    setSubmitted(true)
                                } 
                            }}
                        />
                    </div>
            }
        </>
    )
}