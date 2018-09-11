import React, { Component } from 'react';
import './App.css';
import Board from './Board';

class App extends Component {
  state = {
    myTurn: true
  }
  changeTurn = () => {
    this.setState({
      myTurn: !this.state.myTurn
    })
  }
  render() {
    return (
      <div className="App">
        <Board player={true} myTurn={this.state.myTurn} selectCell={this.changeTurn} />
        <Board player={false} myTurn={!this.state.myTurn} selectCell={this.changeTurn} />
      </div>
    );
  }
}

export default App;
