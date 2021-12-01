import React, { useState, useEffect } from 'react'

const URL = 'ws://localhost:3030'

export const Rooms = () => {

  const [ newRoomName, setNewRoomName ] = useState('');
  const [ joinRoomName, setJoinRoomName ] = useState('');
  const [ openRooms, setOpenRooms ] = useState([]);
  const [ ws, setWs ] = useState(new WebSocket(URL)); 
  const [ userName, setUserName]  = useState('');

  useEffect(() => {
    ws.onopen = () => {
      // on connecting, log it to the console.
      console.log('connected');
      // ws.send(JSON.stringify({ action: 'getOpenRooms'}));
    }

    ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
      console.log("message received on frontend: ", message);
      // check the message type so you know what to do.
      if (message.type === 'error'){
        console.log("error: ", message.error);
        // you have an error and need to display it for the user.
        
      } else if (message.type === 'openRooms'){
        console.log("new rooms!: ", message.openRooms);
        setOpenRooms(Object.keys(message.openRooms));

      } else if (message.type === 'roomUpdate'){
        // do whatever you're going to do here.

      } else if (message.type === 'roomJoined'){
        // do whatever you're going to do here.

      }
    }

    ws.onclose = () => {
      console.log('disconnected, trying to reconnect.')
      // automatically try to reconnect on connection loss
      setWs({ ws: new WebSocket(URL)});
    }
  }, [ws, setWs, userName, openRooms, setOpenRooms]);

  const joinRoom = (ws, userName, joinRoomName) => {
    const message = JSON.stringify({ action: 'joinRoom', userName, roomName: joinRoomName});
    ws.send(message);
  }

  const createRoom = (ws, userName, newRoomName) => {
    const message = JSON.stringify({ action: 'createRoom', userName, roomName: newRoomName});
    ws.send(message);
  }

    return (
      <div>
        <p>{`Your username: ${userName}`}</p> 

        {
          // select a username. you have to do this first. you have to register the name also. 

          // now you should see an interface for joining a room, or creating a room.
          // and also a list of open rooms.

          // finally, when you successfully join, you should see the room, with a way to exit.
        }
      </div>
    )
  }