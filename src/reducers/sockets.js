import io from "socket.io-client";

export const socket = io('/game')

export const events = {
    startGame: 'start-game',
    joinGame: 'join-game',
    reJoinGame: 'rejoin-game'
}

export const emit = (event, data) => {
    switch(event){
        case events.startGame:
            socket.emit(events.startGame, data)
            break;
        case events.joinGame:
            socket.emit(events.joinGame, data)
            break;
        case events.reJoinGame:
            socket.emit(events.reJoinGame, data)
            break;
        default:
            break;
    }
}