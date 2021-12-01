import './App.css';
import React from 'react';
import { Rooms } from './components/Rooms';

const App = () => {
  return (
    <div className="App">
        <Rooms playerName={playerName}/>
    </div>
  );
}

export default App;