import React, { useState, useEffect } from 'react'
import { NamePicker } from './components/NamePicker';
import { Vestibule } from './components/Vestibule';
import './App.css';

const URL = 'ws://localhost:3030'

const App = () => {

  const [ error, setError ] = useState('');
  const [ currentRoom, setCurrentRoom ] = useState(undefined);
  const [ openRooms, setOpenRooms ] = useState([]);
  const [ ws, setWs ] = useState(new WebSocket(URL)); 
  const [ userName, setUserName]  = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    ws.onopen = () => {
      // on connecting, log it to the console.
      console.log('connected');
      setIsConnected(true);
      // ws.send(JSON.stringify({ action: 'getOpenRooms'}));
    }

    ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
      console.log("message received on frontend: ", message);
      // check the message type so you know what to do.
      if (message.type === 'error'){
        console.log("error: ", message.errorMessage);
        setError(message.errorMessage);
      } else {
        setError('');
      };
      
      if (message.type === 'openRooms'){
        console.log("new rooms!: ", message.openRooms);
        setOpenRooms(Object.keys(message.openRooms));

      } else if (message.type === 'userCreated'){
        console.log("success!: ", message.userName);
        setUserName(message.userName);

      } else if (message.type === 'roomUpdate'){
        // do whatever you're going to do here.

      } else if (message.type === 'joinedRoom'){
        setCurrentRoom(message.room);

      }
    }

    ws.onclose = () => {
      console.log('disconnected, trying to reconnect.')
      // automatically try to reconnect on connection loss
      setWs({ ws: new WebSocket(URL)});
    }
  }, [ws, setWs, userName, openRooms, setOpenRooms]);

    return (
      <div className="content">
        {
          error.length ? <p className="error">{error}</p> : null
        }
        {
          userName ? 
            currentRoom ? 
              <div>
                <p>{currentRoom.name}</p>
                <h2>in-room interface</h2>
                <p>back button to exit</p>
                <p>chat interface</p>
                <p>list of members.</p>
              </div> :
              <Vestibule
                ws={ws}
                isConnected={isConnected}
                setError={setError}
                openRooms={openRooms}
              />
          : <NamePicker ws={ws} isConnected={isConnected} setError={setError} />
        }
      </div>
    )
  }

  export default App;