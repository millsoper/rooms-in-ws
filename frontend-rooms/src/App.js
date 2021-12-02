import React, { useState, useEffect } from 'react'
import { NamePicker } from './components/NamePicker';
import { Vestibule } from './components/Vestibule';
import './App.css';

const URL = 'ws://localhost:3030'

const App = () => {
  const PAGES = { VESTIBULE: 'vestibule', NAME_PICKER: 'namePicker', INSIDE_ROOM: 'insideRoom'};

  const [ error, setError ] = useState('');
  const [ currentRoom, setCurrentRoom ] = useState(undefined);
  const [ openRooms, setOpenRooms ] = useState([]);
  const [ ws, setWs ] = useState(new WebSocket(URL)); 
  const [ userName, setUserName]  = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [ page, setPage ] = useState(PAGES.NAME_PICKER);

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
        setOpenRooms(message.openRooms);

      } else if (message.type === 'userCreated'){
        console.log("success!: ", message.userName);
        setUserName(message.userName);
        setPage(PAGES.VESTIBULE);
      } else if (message.type === 'roomUpdate'){
        // do whatever you're going to do here.

      } else if (message.type === 'roomJoined'){
        setCurrentRoom(message.room);
        setPage(PAGES.INSIDE_ROOM);
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
          isConnected ? <p>connected</p> : <p>Not connected</p>
        }
        {
          error.length ? <p className="error">{error}</p> : null
        }
        { page === PAGES.INSIDE_ROOM &&
              <div>
                <button className="button" onClick={() => { setPage(PAGES.VESTIBULE)}}>back</button>
                <p>{currentRoom.name}</p>
                <p>Members in Room:</p>
                <ul>
                    {currentRoom && currentRoom.members &&
                    currentRoom.members.map(( member, i) => {
                      return <li>{member}</li>
                    })}
                </ul>
              </div>
        } 
        { page === PAGES.VESTIBULE &&
              <Vestibule
                ws={ws}
                isConnected={isConnected}
                setError={setError}
                openRooms={openRooms}
              />
        }
        { page === PAGES.NAME_PICKER &&
          <NamePicker ws={ws} isConnected={isConnected} setError={setError} />
        }
      </div>
    )
  }

  export default App;