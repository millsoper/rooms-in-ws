const WebSocket = require('ws');
const utils = require('./utils');

const MESSAGE_TYPES = utils.MESSAGE_TYPES;
const ACTIONS = utils.ACTIONS;

// completely arbitrary.
const MAX_NUMBER_OF_ROOM_MEMBERS = 5;

const wss = new WebSocket.Server({port: 3030});

const rooms = {};

const openRooms = {};

const connections = {};

wss.on('connection', function connection(ws) {
  console.log('received connection.');
  // we save this for later.
  let storedUsername = '';
  // immmediately send back the list of open rooms.
  ws.send(JSON.stringify({ type: MESSAGE_TYPES.OPEN_ROOMS, openRooms }));

  ws.on('message', function incoming(data) {
    const parsedData = JSON.parse(data);

    // ACTION: create a new connection.
    if (parsedData.action === ACTIONS.CREATE_USER) {
      // store the name to use when clearing out when they disconnect.
      const userName = parsedData.userName;
      storedUsername = userName;
      // If that username is already registered, send an error.
      if (connections[userName]) {
        const error = JSON.stringify({ type: MESSAGE_TYPES.ERROR, errorMessage: 'A user is already using that name right now. Please try another one.'});
        ws.send(error);
      } else {
        // otherwise, store the socket.
        connections[userName] = { socket: ws, room: undefined};
      }
    }
    // ACTION: create a new room.
    else if (parsedData.action === ACTIONS.CREATE_ROOM) {
      const roomName = parsedData.roomName;
      const userName = parsedData.userName;
      const isOpenRoom = parsedData.isOpenRoom;

      // in theory, we're blocking the user from creating an existing room, but best to be safe on both ends.
      if (rooms[roomName]) {
        ws.send(JSON.stringify({ type: 'error', errorMessage: 'A room already exists with that name. Try creating a room with a different name.'}))
      } else {
        rooms[roomName] = { messages: [], members: [ userName ], isOpenRoom };
        connections[userName].room = roomName;

        // if it's an open room, add it to the list.
        // store the websocket for broadcasting later.
        if (isOpenRoom) {
          openRooms[roomName];
        }

        ws.send(JSON.stringify({ type: 'joinedRoom', room: rooms[roomName] }));
        utils.broadcastToAllUsers({ wss, message: { type: 'openRooms', openRooms }});
      }

    // ACTION: join existing game.
    } else if (parsedData.action === ACTIONS.JOIN_ROOM) {
      const roomName = parsedData.roomName;
      const userName = parsedData.userName;
      
      console.log(`${userName} is joining the room ${roomName}!`);
      // if the game exists, move forward.
      if (rooms[roomName]){
        // we've arbitrarily set the room size limit at 5.
        // in reality, maybe you want to let the users set the limit, within reason.
        let numberOfRoomMembers = rooms[roomName].members.length;
        // Make sure the room isn't full.
        if (numberOfRoomMembers < MAX_NUMBER_OF_ROOM_MEMBERS){
          // add the new user to the existing room
          rooms[roomName].members.push(userName);
          // if the room is full, remove it from the available open games.
          // if people get accidentally disconnected, we don't move it back but that could get written in.
          if (rooms[roomName].isOpenRoom
              && rooms[roomName].members.length === MAX_NUMBER_OF_ROOM_MEMBERS){
            openRooms[roomName] = undefined;
            //broadcast so that the lists are updated
            const message = JSON.stringify({ type: MESSAGE_TYPES.OPEN_ROOMS, openRooms });
            utils.broadcastToAllUsers({ wss, message });
          }

          const roomJoinedMessage = JSON.stringify(
            { type: MESSAGE_TYPES.ROOM_JOINED,
              room: rooms[roomName ]
            }
          );

          // send the room data back to everyone in the room.
          utils.broadcastToRoomMembers({ connections, room: rooms[roomName], message: roomJoinedMessage });
        } else {
          const errorMessage = { type: MESSAGE_TYPES.ERROR, errorMessage: 'That game is already full. Try joining another game, or create your own.'};
          ws.send(JSON.stringify(errorMessage));
        }
      } else {
        // if there is no game associated with the code, send an error.
        const errorMessage = { type: MESSAGE_TYPES.ERROR, errorMessage: 'There is no game associated with that code. Please enter a different code, or create a new game.'};
        ws.send(JSON.stringify(errorMessage));
      }
    } else if (parsedData.action === ACTIONS.NEW_MESSAGE) {
      // There's no security on this. People could send messages to rooms they aren't in.
      const roomName = parsedData.roomName;
      const userName = parsedData.userName;
      const incomingMessage = parsedData.message;
      const outgoingMessage = { type: MESSAGE_TYPES.NEW_MESSAGE, message: incomingMessage, sender: userName };
      utils.broadcastToRoomMembers({ connections, room: rooms[roomName], message: outgoingMessage });

    } else if (parsedData.action === ACTIONS.LEAVE_ROOM) {
      // this is pretty limited. lots of people will just be disconnected, by mistake or on purpose.
      // it's more here to show the basic method.
      const roomName = parsedData.roomName;
      const userName = parsedData.userName;
      // Remove the room reference from the user
      connections[userName].room = undefined;
      // Remove the user from the room.
      rooms[roomName].members = rooms[roomName].members.filter(member => member !== userName);
      // if it's an open room, put it back on the list!
      if (rooms[roomName].isOpenRoom){
        openRooms[roomName] = rooms[roomName];
        const message = JSON.stringify({ type: MESSAGE_TYPES.OPEN_ROOMS, openRooms });
        utils.broadcastToAllUsers({ wss, message });
      }
      // now broadcast it back.
      const message = JSON.stringify({ type: MESSAGE_TYPES.ROOM_UPDATE, room: rooms[roomName]});
      utils.broadcastToRoomMembers({ connections, room: rooms[roomName], message });
    }
  });
  ws.on('close', function close(){
    // here we actually do remove people from the rooms they were in.
    const roomToClear = connections[storedUsername].room;
    rooms[roomToClear].members = rooms[roomToClear].members.filter(member => member !== userName);
    connections[storedUsername] = undefined;
    console.log(`socket closed, ${savedPlayer} removed from room.`);
  });
});
