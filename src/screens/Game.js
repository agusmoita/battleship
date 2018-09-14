import React, { Component } from 'react';
import './Game.css';
import PlayerBoard from '../components/PlayerBoard'
import EnemyBoard from '../components/EnemyBoard'

class Game extends Component {
  state = {
    myTurn: true,
    playing: true,
    win: false
  }
  
  changeTurn = () => {
    this.setState({
      myTurn: !this.state.myTurn
    })
  }
  finishGame = (win) => {
    this.setState({
      playing: false,
      win
    })
    this.props.history.push(win ? '/won' : '/lost');
  }
  surrender = (e) => {
    e.preventDefault()
    this.setState({
      playing: false,
      win: false
    })
    this.props.history.push('/surrender');
  }
  render() {
    return (
      <div className="Game">
        <h1>Playing: { this.state.myTurn ? 'Player' : 'CPU' }</h1>
        <div className="Boards">
          <PlayerBoard myTurn={this.state.myTurn} selectCell={this.changeTurn} finish={this.finishGame} ships={this.props.ships} />
          <EnemyBoard myTurn={!this.state.myTurn} selectCell={this.changeTurn} finish={this.finishGame} />
        </div>
        <div className="center">
          <a href="" onClick={this.surrender}>Surrender</a>
        </div>
      </div>
    );
  }
}

export default Game;
