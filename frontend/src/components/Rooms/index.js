import React, { useState, useEffect } from 'react'

const URL = 'ws://localhost:3030'

export const Rooms = () => {

  const [ newRoomName, setNewRoomName ] = useState('');
  const [ currentRoom, setCurrentRoom ] = useState(undefined);
  const [ userIsRegistered, setUserIsRegistered ] = useState(false);
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
          userIsRegistered ? 
            currentRoom ? 
              <div>
                <h2>in-room interface</h2>
                <p>back button to exit</p>
                <p>chat interface</p>
                <p>list of members.</p>
              </div> :
              <div> 
                <h2>choose a room interface</h2>
                <label htmlFor="joinRoomName">
                  <input
                    placeholder="room to join"
                    id="joinRoomName"
                    type="text"
                    value={joinRoomName}
                    onChange={(e) => {setJoinRoomName(e.target.value)}}
                  />
                </label>
                <label htmlFor="newRoomName">
                  <input
                    placeholder="name for new room"
                    id="newRoomName"
                    type="text"
                    value={newRoomName}
                    onChange={(e) => {setNewRoomName(e.target.value)}}
                  />
                </label>
              </div>
          : <div>
            <label htmlFor="username">
            <input
              placeholder="choose a username"
              id="username"
              type="text"
              value={userName}
              onChange={(e) => {setUserName(e.target.value)}}
            />
            </label>
            <button className="button" onClick={() => { }}>get started</button>
            Name interface. Set a username and wait for confirmation that it registered.
            </div>
        }
      </div>
    )
  }