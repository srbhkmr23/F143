import socketIOClient from 'socket.io-client';

import config from './config';

export let socket = socketIOClient(config.API_URL_Node);
//console.log('socket ', socket);

export const sendNotification = data => {
  //console.log('sending notification ', data);

  socket.emit('notification', data);
};

// socket.onconnect(() => {
//   console.log('on connect triggered ++++++++++++++++++++');
// });

// socket.on('connect', () => {
//   console.log('connection stablished', socket.id);
// });

// socket.on('notification', notification => {
//   console.log('notification recieved', notification);
// });
