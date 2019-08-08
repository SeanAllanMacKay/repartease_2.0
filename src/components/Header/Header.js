import React, { useState, useContext } from 'react';

import GameContext from '../../context/GameContext'

import { Button } from '../Button'
import { Icon, Drawer } from 'antd'

import style from '../../styles/index'
import LeaveGame from '../LeaveGame';

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
    },
    button: {
        position: 'absolute',
        right: '10px',
        fontSize: '1.75em',
        color: 'white'
    },
    drawerItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    drawerItemLine: {
        flex: 1,
        height: '16px',
        margin: '0 5px',
        borderBottom: '1px dashed grey'
    }
}

export default (props) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const game = useContext(GameContext)
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                Repartease
            </h1>
            {
                game && game.active &&

                <Button 
                    style={styles.button}
                    type='link'
                    content={<Icon type="ordered-list" />}
                    onClick={() => {
                        setMenuOpen(true)
                    }}
                />
            }
            <Drawer
                title='Scoreboard'
                placement='top'
                onClose={() => {
                    setMenuOpen(false)
                }}
                visible={menuOpen}
                closable={false}
            >
                {
                    game && game.players
                        .sort((a, b) => {
                            return a.points > b.points ? 1 : a.points < b.points ? -1 : 0
                        })
                        .map(player => {
                            return (
                                <div style={styles.drawerItemContainer}>
                                    <p>{player.name}</p>
                                    <div 
                                        style={styles.drawerItemLine}
                                    />
                                    <p>{player.points}</p>
                                </div>
                            )
                        })
                }
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        padding: '10px 0',
                        display: 'flex',
                        justifyContent: 'center',
                        borderTop: '1px solid lightgrey'
                    }}
                >
                    <LeaveGame/>
                </div>
            </Drawer>
        </div>
    )
}