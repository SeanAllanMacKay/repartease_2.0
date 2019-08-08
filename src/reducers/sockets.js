import io from "socket.io-client";

export const socket = io('/game')

export const events = {
    startGame: 'start-game',
    joinGame: 'join-game',
    leaveGame: 'disconnect',
    allIn: 'all-in',
    submitResponse: 'submit-response'
}

export const emit = (event, data) => {
    switch(event){
        case events.startGame:
            socket.emit(events.startGame, data)
            break;
        case events.joinGame:
            socket.emit(events.joinGame, data)
            break;
        case events.allIn:
            socket.emit(events.allIn, data)
            break;
        case events.submitResponse:
            socket.emit(events.submitResponse, data)
            break;
        case events.leaveGame:
            socket.emit(events.leaveGame)
            break;
        default:
            break;
    }
}