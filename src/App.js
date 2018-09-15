import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import Game from './screens/Game';
import EndWon from './screens/EndWon';
import EndLost from './screens/EndLost';
import EndSurrender from './screens/EndSurrender';
import Start from './screens/Start';
import ships from './util/ships';
import _ from 'lodash';
import constants from './util/constants';

class App extends Component {
  state = {
    currentShip: 1,
    myShips: ships,
    playerName: ''
  }
  restart = () => {
    this.setState({
      currentShip: 1,
      myShips: this.state.myShips.map(ship => {
        return {
          ...ship,
          blocks: ship.blocks.map(c => {
            return {
              row: null,
              col: null,
              hit: false
            }
          }),
          destroyed: false
        }
      })
    })
  }
  setName = (name) => {
    this.setState({
      playerName: name
    })
  }
  changeCurrentShip = (id) => {
    if (id === this.state.currentShip) {
      this.setState({
        myShips: this.state.myShips.map(ship => {
          if (ship.id === this.state.currentShip) {
            ship.direction = ship.direction === 'horizontal' ? 'vertical' : 'horizontal';
          }
          return ship;
        })
      })
    } else {
      this.setState({
        currentShip: id
      })
    }
  }
  getOtherShipsBlocks = () => {
    const { currentShip, myShips } = this.state;
    const otherShips = myShips.filter(ship => ship.id !== currentShip)
    return _.flattenDepth(otherShips.map(ship => ship.blocks))
  }
  canPlaceInCoords = (row, col) => {
    return this.getOtherShipsBlocks().every(block => {
      return (
        (block.row !== row || block.col !== col) &&
        (row <= (constants.BOARD_SIZE - 1) && col <= (constants.BOARD_SIZE - 1))
      );
    })
  }
  placeShip = (row, col) => {
    let valid = [];
    const { currentShip, myShips } = this.state;
    const ship = myShips.find(s => s.id === currentShip)
    let coords = [];
    const { length, direction } = ship;
    for (let index = 0; index < length; index++) {
      coords[index] = {
        row: (direction === 'horizontal' ? row : row + index),
        col: (direction === 'vertical' ? col : col + index),
        hit: false
      }
      valid[index] = this.canPlaceInCoords(coords[index].row, coords[index].col)
    }
    if (valid.every(v => v)) {
      ship.blocks = coords
      this.setState({
        myShips: myShips.map(s =>
          (s.id === ship.id) 
            ? ship 
            : s
          )
      })
    }
  }
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact render={(props) => (
            <Start {...props} 
              restart={this.restart} 
              place={this.placeShip} 
              ships={this.state.myShips} 
              current={this.state.currentShip} 
              change={this.changeCurrentShip}
              setName={this.setName}
            />
          )} />
          <Route path="/play" render={(props) => (
            <Game {...props} ships={this.state.myShips} player={this.state.playerName} />
          )} />
          <Route path="/won" component={EndWon} />
          <Route path="/lost" component={EndLost} />
          <Route path="/surrender" component={EndSurrender} />
        </Switch>
      </div>
    )
  }
}

export default App;
