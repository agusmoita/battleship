import React, { Component } from 'react';
import './App.css';
import Board from './Board';

class App extends Component {
  state = {
    nombre: 'Augusto Moita'
  }
  render() {
    return (
      <div className="App">
        <Board />
      </div>
    );
  }
}

export default App;
