import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Game.css';
import Board from './Board'

class Game extends Component {
    state = {
        myTurn: true,
        playing: true,
        win: null
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
        this.props.history.push(win ? '/win' : '/lose')
    }
    render() {
      return (
        <div className="Game">
            <h1>Turno de { this.state.myTurn ? 'Jugador' : 'CPU' }</h1>
            <div className="Boards">
                <Board player={true} myTurn={this.state.myTurn} selectCell={this.changeTurn} finish={this.finishGame} />
                <Board player={false} myTurn={!this.state.myTurn} selectCell={this.changeTurn} finish={this.finishGame} />
            </div>
            <Link to="/surrender">Rendirse</Link>
        </div>
      );
    }
}

export default Game;
