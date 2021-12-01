import React, { useState } from 'react';

export const NameScreen = ({ setPlayerName }) => {
    const [formName, setFormName] = useState('');

    return (
        <div>
            <p>Cribbage for Two</p>
            <p>Pick a username to begin!</p>
            <p>You won't be able to change this later so pick carefully.</p>
            <label htmlFor="username">
            <input
              type="text"
              id={'username'}
              placeholder={'Enter your username...'}
              value={formName}
              onChange={e => { setFormName(e.target.value)}}
            />
            </label>
            <button
                className='button'
                disabled={!formName.length}
                onClick={() => { setPlayerName(formName)}}
            >
                Get started!
            </button>
        </div>
    )
}

export const ChooseGameScreen = ({ userName, setGameName }) => {
    const [newGameName, setNewGameName ] = useState('');
    return (
        <div>
            <p>Time to join a game, {userName}!</p>
            <p>You can join an existing game by entering the game code below, or create a new game.</p>
            <label htmlFor="newGame">
            Game name:&nbsp;
            <input 
                type="text"
                id={'newGame'}
                placeholder="Enter a name for your game"
                value={newGameName}
                onChange={e => { setGameName(e.target.value)}}    
            />
            </label>
            <button
                className='button'
                disabled={!newGameName.length}
                onClick={() => { /* Send this over the websocket and create a new game.*/}}
            >
                Create a new game
            </button>
            <>
                list of the existing games here. 
            </>
        </div>
    ) 

}