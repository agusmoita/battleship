import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import Game from './Game';
import EndWin from './EndWin';
import EndLose from './EndLose';
import EndSurrender from './EndSurrender';
import Start from './Start';
import ships from './ships';
import _ from 'lodash';

class App extends Component {
  state = {
    currentShip: 1,
    ships
  }
  restart = () => {
    console.log('hhh')
    this.setState({
      currentShip: 1,
      ships: this.state.ships.map(s => {
        return {
          ...s,
          cells: s.cells.map(c => {
            return {
              ...c,
              hit: false
            }
          }),
          destroyed: false
        }
      })
    })
  }
  changeCurrentShip = (id) => {
    if (id === this.state.currentShip) {
      this.setState({
        ships: this.state.ships.map(s => {
          if (s.id === this.state.currentShip) {
            s.direction = s.direction === 'horizontal' ? 'vertical' : 'horizontal';
          }

          return s;
        })
      })
    } else {
      this.setState({
        currentShip: id
      })
    }
  }
  updateShips = (row, col) => {
    let valid = [];
    const { currentShip, ships } = this.state;
    const ship = ships.find(s => s.id === currentShip)
    const otherShips = ships.filter(s => s.id !== currentShip)
    const allCells = _.flattenDepth(otherShips.map(s => s.cells))
    let coords = [];
    const { length, direction } = ship;
    for (let index = 0; index < length; index++) {
      coords[index] = {
        row: (direction === 'horizontal' ? row : row + index),
        col: (direction === 'vertical' ? col : col + index),
        hit: false
      }
      valid[index] = allCells.every(c => {
        return (c.row !== coords[index].row || c.col !== coords[index].col);
      })
    }
    if (valid.every(v => v)) {
      ship.cells = coords
      this.setState({
        ships: ships.map(s =>
          (s.id === ship.id) ?
          ship :
          s
          )
      })
    }
  }
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact render={(props) => (
            <Start {...props} restart={this.restart} call={this.updateShips} ships={this.state.ships} current={this.state.currentShip} change={this.changeCurrentShip}/>
          )} />
          <Route path="/play" render={(props) => (
            <Game {...props} ships={this.state.ships} />
          )} />
          <Route path="/win" component={EndWin} />
          <Route path="/lose" component={EndLose} />
          <Route path="/surrender" component={EndSurrender} />
        </Switch>
      </div>
    )
  }
}

export default App;
