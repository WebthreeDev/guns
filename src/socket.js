import io from 'socket.io-client';
import enviroment from './env';

const socket = io(enviroment().socket);

export default socket;