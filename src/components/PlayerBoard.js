import React, { Component } from "react";
import _ from 'lodash';
import './Board.css';
import Cell from './Cell';
import LastShot from "./LastShot";
import Columns from './Columns';
import Rows from './Rows';
import constants from '../util/constants';

export default class PlayerBoard extends Component {
  state = {
    cells: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    lastShot: null,
    ships: []
  }
  componentDidMount() {
    const ships = this.props.ships;
    const cells = this.state.cells;
    ships.forEach((ship) => {
      ship.cells.forEach((cell) => {
        cells[cell.row][cell.col] = constants.DATA.SHIP;
      })
    })
    this.setState({
      lastShot: null,
      cells,
      ships
    })
  }
  sleep() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
  componentDidUpdate(prevProps) {
    if (this.props.myTurn !== prevProps.myTurn && this.props.myTurn === false) {
      this.sleep().then(() => {
        this.handleClick(_.random(0, 9), _.random(0, 9))
      })
    }
  }
  updateBoard = () => {
    const ships = this.state.ships;
    const cells = this.state.cells;
    ships.forEach((ship) => {
      const destroyed = ship.destroyed
      ship.cells.forEach((cell) => {
        let fill = constants.DATA.SHIP;
        if (destroyed) fill = constants.DATA.DESTROY
        else if (cell.hit) fill = constants.DATA.HIT
        cells[cell.row][cell.col] = fill
      })
    })
    this.setState({
      cells
    })
    if (_.every(ships, 'destroyed')) {
      this.props.finish(false)
    }
  }
  handleClick = (row, col) => {
    if (!this.props.myTurn) {
      const cells = this.state.cells;
      const cell = cells[row][col];
      if (cell >= constants.DATA.WATER) {
        this.handleClick(_.random(0, 9), _.random(0, 9))
      } else {
        if (cell === constants.DATA.BLANK) {
          cells[row][col] = constants.DATA.WATER;
          this.setState({
            lastShot: constants.SHOT.WATER,
            cells
          })
        } else {
          const ships = this.state.ships;
          const ship = ships.find(s => {
            return (s.cells.find(c => {
              return c.row === row && c.col === col
            }) !== undefined)
          })
          ship.cells.find(c => {
            return c.row === row && c.col === col
          }).hit = true
          let last = constants.SHOT.HIT
          if (_.every(ship.cells, 'hit')) {
            ship.destroyed = true
            last = constants.SHOT.DESTROY
          }
          this.setState({
            lastShot: last,
            ships: ships.map(s =>
              (s.id === ship.id) ?
              ship :
              s
            )
          })
          this.updateBoard()
        }
        this.props.selectCell()
      }
    }
  }
  render() {
    return (
      <div>
        <h3>My Ships</h3>
        <div className="Board">
          <Columns />
          <Rows />
          <div className="Board-Cells">
            {
              this.state.cells.map((row, i) => {
                return row.map((cell, col) => {
                  return (
                    <Cell 
                      key={`${i} ${col}`}
                      row={i}
                      col={col}
                      data={cell}
                      player={true}
                      handle={() => {}}
                    />
                  )
                })
              })
            }
          </div>
        </div>
        <LastShot shot={this.state.lastShot} />
      </div>
    );
  }
}