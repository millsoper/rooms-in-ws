const broadcastToRoomMembers = ({ connections, room, message }) => {
  if (room){
    for (let member in room.members){
      connections[member].socket.send(message);
    }
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
  USER_CREATED: 'userCreated'
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
    