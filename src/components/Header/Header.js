import React from 'react';

import style from '../../styles/index'

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '55px',
        backgroundColor: style.color.primary,
    },
    title: {
        color: 'white',
        padding: 0,
        margin: '5px 0',
    }
}

export default (props) => {
    return (
        <div
            style={styles.container}
        >
            <h1
                style={styles.title}
            >
                Repartease
            </h1>
        </div>
    )
}