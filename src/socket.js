import io from 'socket.io-client';
<<<<<<< HEAD

const socket = io(`http://${window.location.hostname}:5000`);

export default socket;
=======
const socket = io(process.env.REACT_APP_SOCKETURL);

export default socket;

>>>>>>> cc33113837511a14168a96683deddbd545bcf1d8
