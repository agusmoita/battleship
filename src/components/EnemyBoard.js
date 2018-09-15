import React, { Component } from "react";
import _ from 'lodash';
import './Board.css';
import Block from './Block';
import shipsTemplate from '../util/ships';
import LastShot from "./LastShot";
import Columns from "./Columns";
import Rows from "./Rows";
import constants from '../util/constants';

export default class EnemyBoard extends Component {
  state = {
    blocks: [
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
  getOtherShipsBlocks = (ships, currentShip) => {
    const otherShips = ships.filter(ship => ship.id !== currentShip)
    return _.flattenDepth(otherShips.map(ship => ship.blocks))
  }
  canPlaceInCoords = (ships, ship, row, col) => {
    return this.getOtherShipsBlocks(ships, ship.id).every(block => {
      return (
        (block.row !== row || block.col !== col) &&
        (row <= (constants.BOARD_SIZE - 1) && col <= (constants.BOARD_SIZE - 1))
      );
    })
  }
  placeShips = () => {
    const ships = shipsTemplate
    const shipsCount = ships.length
    let i = 0;
    while (i < shipsCount) {
      let valid = [];
      const ship = ships[i];    
      const row = _.random(0, 9);
      const col = _.random(0, 9);
      let coords = [];
      const { length } = ship;
      const direction = _.sample(['horizontal', 'vertical'])
      for (let index = 0; index < length; index++) {
        coords[index] = {
          row: (direction === 'horizontal' ? row : row + index),
          col: (direction === 'vertical' ? col : col + index),
          hit: false
        }
        valid[index] = this.canPlaceInCoords(ships, ship, coords[index].row, coords[index].col)
      }
      if (valid.every(v => v)) {
        ship.blocks = coords
        ship.direction = direction
        ship.destroyed = false
        ships[i] = ship
        i += 1
      }
    }
    this.setState({
      ships: ships
    })

    return ships;
  }
  componentDidMount() {
    const ships = this.placeShips();
    const blocks = this.state.blocks;
    ships.forEach((ship) => {
      ship.blocks.forEach((block) => {
        blocks[block.row][block.col] = constants.DATA.SHIP;
      })
    })
    this.setState({
      lastShot: null,
      blocks,
      ships
    })
  }
  updateBoard = () => {
    const ships = this.state.ships;
    const blocks = this.state.blocks;
    ships.forEach((ship) => {
      const destroyed = ship.destroyed
      ship.blocks.forEach((block) => {
        let fill = constants.DATA.SHIP;
        if (destroyed) fill = constants.DATA.DESTROY;
        else if (block.hit) fill = constants.DATA.HIT;
        blocks[block.row][block.col] = fill
      })
    })
    this.setState({
      blocks
    })
    if (ships.every(ship => ship.destroyed)) {
      this.props.finish(true)
    }
  }
  shoot = (row, col) => {
    if (!this.props.myTurn) {
      const blocks = this.state.blocks;
      const block = blocks[row][col];
      if (block < constants.DATA.WATER) {
        if (block === constants.DATA.BLANK) {
          blocks[row][col] = constants.DATA.WATER;
          this.setState({
            lastShot: constants.SHOT.WATER,
            blocks
          })
        } else {
          const ships = this.state.ships;
          const ship = ships.find(s => {
            return (s.blocks.find(c => {
              return c.row === row && c.col === col
            }) !== undefined)
          })
          ship.blocks.find(c => {
            return c.row === row && c.col === col
          }).hit = true
          let last = constants.SHOT.HIT
          if (_.every(ship.blocks, 'hit')) {
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
        this.props.clickOnBlock()
      }
    }
  }
  render() {
    return (
      <div>
        <h3>Enemy Ships</h3>
        <div className="Board">
          <Columns />
          <Rows />
          <div className="Board-Blocks">
            {
              this.state.blocks.map((row, i) => {
                return row.map((block, col) => {
                  return ( 
                    <Block 
                      key={`${i} ${col}`}
                      row={i}
                      col={col}
                      data={block}
                      handleClick={this.shoot}
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