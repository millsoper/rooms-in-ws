import React, { useState } from 'react';

export const Vestibule = ({ ws, isConnected, setError, openRooms, currentRoom, setPage }) => {
    const INTERFACES = { JOIN_ROOM: 'joinRoom', CREATE_ROOM: 'createRoom' };
    const [ joinRoomName, setJoinRoomName ] = useState('');
    const [ newRoomName, setNewRoomName ] = useState('');
    const [ isOpenRoom, setIsOpenRoom ] = useState(true);
    const [ selectedInterface, setSelectedInterface ] = useState(INTERFACES.JOIN_ROOM)

    const joinHandler = () => {
        if (isConnected){
            const message = JSON.stringify({ action: INTERFACES.JOIN_ROOM, roomName: joinRoomName});
            ws.send(message);
        } else {
            setError('WebSocket is temporarily disconnected. Please try again.');
        }
    }

    const createHandler = () => {
        if (isConnected){
            const message = JSON.stringify({ action: INTERFACES.CREATE_ROOM, roomName: newRoomName, isOpenRoom });
            ws.send(message);
        } else {
            setError('WebSocket is temporarily disconnected. Please try again.');
        }
    }

    console.log("open rooms: ", openRooms);
    
    return (
    <div className="vestibule">
        <div className="roomFormWrapper"> 
            <h2>join a room to play -- you can only join one at a time.</h2>
            <div className="radioSet">
                <div className="radioOption">
                <label htmlFor={INTERFACES.JOIN_ROOM}>
                    <input
                        type="radio"
                        id={INTERFACES.JOIN_ROOM}
                        name="join_or_create"
                        value={INTERFACES.JOIN_ROOM}
                        onChange={(e) => setSelectedInterface(e.target.value)}
                        checked={selectedInterface === INTERFACES.JOIN_ROOM}
                    />
                    Join a room
                </label>
                    {
                        selectedInterface === INTERFACES.JOIN_ROOM ? 
                        <div className="roomForm">
                            <label htmlFor="joinRoomName">
                                <input
                                    className="textInput"
                                    placeholder="room to join"
                                    id="joinRoomName"
                                    type="text"
                                    value={joinRoomName}
                                    onChange={(e) => {setJoinRoomName(e.target.value)}}
                                />
                            </label>
                            <button className="button" onClick={joinHandler}>join room</button>
                        </div> : null
                    }
                </div>
                <div className="radioOption">
                    <label htmlFor={INTERFACES.CREATE_ROOM}>
                    <input
                        type="radio"
                        id={INTERFACES.CREATE_ROOM}
                        name="join_or_create"
                        value={INTERFACES.CREATE_ROOM}
                        onChange={(e) => setSelectedInterface(e.target.value)}
                        checked={selectedInterface === INTERFACES.CREATE_ROOM}
                    />
                    Create a new room
                    </label>
                    {  
                        selectedInterface === INTERFACES.CREATE_ROOM ? 
                        <div className="roomForm">
                            <label htmlFor="newRoomName">
                                <input
                                    className="textInput"
                                    placeholder="name for new room"
                                    id="newRoomName"
                                    type="text"
                                    value={newRoomName}
                                    onChange={(e) => {setNewRoomName(e.target.value)}}
                                />
                            </label>
                            <button className="button" onClick={createHandler}>create room</button>
                        </div>: null
                    }
                </div>
            </div>

        </div>
        <div className="sidebar">
            { currentRoom && 
                <button onClick={() => { setPage('room')}}>{`Go back to "${currentRoom.name}" >`}</button>
            }
            <div className="openRooms">
            <p className="label">Open Rooms: </p>
            {
                openRooms.length ? 
                    openRooms.map((room, i) => {
                        return <li key={i}>
                                { room }
                                </li>
                    })
                : <p>There are no rooms open right now.</p>
            }
            </div>
        </div>
    </div>
    )
};