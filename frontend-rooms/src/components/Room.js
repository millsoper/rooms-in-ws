import React from 'react';

export const Room = ({ setPage, currentRoom }) => {
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
        </div>
    )
}