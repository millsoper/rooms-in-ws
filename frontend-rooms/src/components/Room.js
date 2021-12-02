import React, { useState, useCallback } from 'react';

export const Room = (
    { setPage,
    currentRoom,
    userMessages,
    isConnected,
    userName,
    setError,
    ws }
    ) => {
        console.log("userMessages: ", userMessages);
    const [text, setText] = useState('');

    const clickHandler = useCallback(() => {
        if (text.length){
            if (isConnected){
                const message = { action: 'newMessage', userName, roomName: currentRoom.name, text };
                console.log("message: ", message);
                ws.send(JSON.stringify(message));
            } else {
                setError('WebSocket has disconnected -- please try again.')
            }
        }
    }, [ws, text]);

    return (
        <div>
            <button className="button" onClick={() => { setPage('vestibule')}}>back</button>
            <p>{currentRoom.name}</p>
            <p>Members in Room:</p>
            <ul>
                {currentRoom && currentRoom.members &&
                 currentRoom.members.map(( member, i) => {
                    return <li>{member}</li>
                })}
            </ul>

            <div className="messageFrame">
                {
                    userMessages.map(message => {
                        return (
                            <p>
                                <span className="label">{`${message.sender}:`}</span>
                                {message.text}
                            </p>
                        )
                    })
                }
                <div className="messageToolbar">
                    <label htmlFor="text">
                        <input
                        className="textInput"
                        placeholder="Send a message"
                        id="text"
                        type="text"
                        value={text}
                        onChange={(e) => {setText(e.target.value)}}
                        />
                    </label>
                    <button className="button" onClick={clickHandler}>{`>`}</button>
                </div>
            </div>
        </div>
    )
}