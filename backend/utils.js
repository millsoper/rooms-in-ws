const broadcastToRoomMembers = ({ connections, room, message }) => {
  if (room){
    room.members.forEach(member => {
      let socket = connections[member].socket;
      socket && socket.send(message);
    })
  }
}

const broadcastToAllUsers = ({ message, wss }) => {
  wss.clients.forEach(client => client.send(message));
}

const MESSAGE_TYPES = {
  ERROR: 'error',
  OPEN_ROOMS: 'openRooms',
  ROOM_UPDATE: 'roomUpdate',
  ROOM_JOINED: 'roomJoined',
  USER_CREATED: 'userCreated',
  NEW_MESSAGE: 'newMessage'
}

const ACTIONS = {
  JOIN_ROOM: 'joinRoom',
  CREATE_ROOM: 'createRoom',
  CREATE_USER: 'createUser',
  NEW_MESSAGE: 'newMessage',
  LEAVE_ROOM: 'leaveRoom',
}

module.exports = { 
  ACTIONS,
  broadcastToAllUsers,
  broadcastToRoomMembers,
  MESSAGE_TYPES,
};
    