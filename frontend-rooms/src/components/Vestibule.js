import React, { useState } from 'react';

export const Vestibule = ({ ws, isConnected, setError }) => {
    const INTERFACES = { JOIN_ROOM: 'joinRoom', CREATE_ROOM: 'createRoom' };
    const [ joinRoomName, setJoinRoomName ] = useState('');
    const [ newRoomName, setNewRoomName ] = useState('');
    const [ selectedInterface, setSelectedInterface ] = useState(INTERFACES.JOIN_ROOM)
    console.log("selectedInterface: ", selectedInterface);
    return (
    <div className="roomFormWrapper"> 
        <h2>join a room to play!</h2>
        <div className="radioSet">
            <div className="radioOption">
            <label htmlFor={INTERFACES.JOIN_ROOM}>
                <input
                    type="radio"
                    id={INTERFACES.JOIN_ROOM}
                    name="join_or_create"
                    value={INTERFACES.JOIN_ROOM}
                    onChange={(e) => setSelectedInterface(e.target.value)}
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
                        <button className="button">join room</button>
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
                        <button className="button">create room</button>
                    </div>: null
                }
            </div>
        </div>

    </div>
    )
};