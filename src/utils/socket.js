import constants from '../constants';
import openSocket from 'socket.io-client';
const socket = openSocket();

const sockets = {
    mouseMove(payload) {
        socket.emit(constants.MOUSE_MOVE, payload);
    },
    mouseClick(payload) {
        socket.emit(constants.MOUSE_CLICK, payload);
    }
}

export default sockets;

