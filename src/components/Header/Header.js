import React, { useState, useContext, createRef } from 'react';

import GameContext from '../../context/GameContext'

import { Button } from '../Button'
import { Icon, Drawer, Input } from 'antd'

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
    gameCode: {
        textAlign: 'center',
        mergin: '15 0 0 0',
        fontSize: '1.85em'
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

    const gameCodeRef = createRef()
    return (
        <>
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
            </div>
            {game &&
                <Drawer
                    title={
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'row'
                            }}
                        >
                            <h3
                                style={{
                                    flex: 1
                                }}
                            >
                                Scoreboard
                            </h3>
                            <div>
                                <Input
                                    style={{
                                        color: style.color.primary,
                                        backgroundColor: 'none',
                                        border: 'none',
                                        outline: 0,
                                        fontSize: '1.25em',
                                        textAlign: 'right'
                                    }}
                                    onClick={() => {
                                        gameCodeRef.current.select()
                                        document.execCommand('copy');
                                        gameCodeRef.current.blur()
                                    }}
                                    ref={gameCodeRef}
                                    value={`${game.gameCode}`}
                                />
                            </div>
                        </div>
                    }
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
                        <LeaveGame
                            onClick={() => {
                                props.removeGame()
                                setMenuOpen(false)
                            }}
                        />
                    </div>
                </Drawer>
            }
        </>
    )
}