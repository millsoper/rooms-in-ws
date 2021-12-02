import React, { useCallback, useState } from 'react';

export const NamePicker = ({ ws, isConnected, setError }) => {
    const [ name, setName ] = useState('');
    const clickHandler = useCallback(() => {
        if (name.length){
            if (isConnected){
                const message = { action: 'createUser', userName: name }
                console.log("message: ", message);
                ws.send(JSON.stringify(message));
            } else {
                setError('WebSocket has disconnected -- please try again.')
            }
        } else {
            setError('Please enter a user name.');
        }
    }, [ws, name]);
    
    return (
        <div>
            <p>Choose a username to get started.</p>
            <label htmlFor="username">
                <input
                className="textInput"
                placeholder="choose a username"
                id="username"
                type="text"
                value={name}
                onChange={(e) => {setName(e.target.value)}}
                />
            </label>
            <button className="button" onClick={clickHandler}>get started</button>
        </div>
    )
}