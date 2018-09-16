import React, { Component } from "react";
import _ from 'lodash';
import './Board.css';
import Block from './Block';
import LastShot from "./LastShot";
import Columns from './Columns';
import Rows from './Rows';
import constants from '../util/constants';

export default class PlayerBoard extends Component {
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
    hitOnShip: false,
    lastHitCoords: {
      row: null,
      col: null
    },
    ships: []
  }
  componentDidMount() {
    const ships = this.props.ships;
    const blocks = this.state.blocks;
    ships.forEach((ship) => {
      ship.blocks.forEach((block) => {
        blocks[block.row][block.col] = constants.DATA.SHIP;
      })
    })
    this.setState({
      lastShot: null,
      hitOnShip: false,
      lastHitCoords: {
        row: null,
        col: null
      },
      blocks,
      ships
    })
  }
  sleep() {
    return new Promise(resolve => setTimeout(resolve, 400));
  }
  componentDidUpdate(prevProps) {
    if (this.props.myTurn !== prevProps.myTurn && this.props.myTurn === false) {
      this.sleep().then(() => {
        this.shoot()
      })
    }
  }
  updateBoard = () => {
    const ships = this.state.ships;
    const blocks = this.state.blocks;
    ships.forEach((ship) => {
      const destroyed = ship.destroyed
      ship.blocks.forEach((block) => {
        let fill = constants.DATA.SHIP;
        if (destroyed) fill = constants.DATA.DESTROY
        else if (block.hit) fill = constants.DATA.HIT
        blocks[block.row][block.col] = fill
      })
    })
    this.setState({
      blocks
    })
    if (ships.every(ship => ship.destroyed)) {
      this.props.finish(false)
    }
  }
  findShipBlock = (ship, row, col) => {
    return ship.blocks.find(block => {
      return block.row === row && block.col === col
    })
  }
  shipAreIn = (ship, row, col) => {
    return this.findShipBlock(ship, row, col) !== undefined
  }
  isStraight = (row, col) => {
    const { lastHitCoords } = this.state
    const newRow = lastHitCoords.row
    const newCol = lastHitCoords.col

    if (row < newRow && col !== newCol) return false;
    if (row > newRow && col !== newCol) return false;
    if (col < newCol && row !== newRow) return false;
    if (col > newCol && row !== newRow) return false;
    if (row === newRow && col === newCol) return false;
    return true;
  }
  getNearShot = (radius, row, col) => {
    const blocks = this.state.blocks;
    const rowPosibilities = [row - radius, row, row + radius];
    const colPosibilities = [col - radius, col, col + radius];
    const posibilities = []
    rowPosibilities.forEach(r => {
      colPosibilities.forEach(c => {
        if (0 <= r && r <= 9 && 0 <= c && c <= 9) {
          if (this.isStraight(r, c)) {
            if (blocks[r][c] === constants.DATA.BLANK || blocks[r][c] === constants.DATA.SHIP) {
              posibilities.push([r, c])
            }
          }
        }
      })
    })
    const shot = _.sample(posibilities);
    if (shot) {
      return shot;
    } else {
      return this.getNearShot(radius + 1, row, col)
    }
  }
  shoot = () => {
    if (!this.props.myTurn) {
      let row = 0
      let col = 0
      const { blocks, hitOnShip, lastHitCoords } = this.state
      if (hitOnShip) {
        const shot = this.getNearShot(1, lastHitCoords.row, lastHitCoords.col);
        [row, col] = shot
      } else {
        row = _.random(0, 9)
        col = _.random(0, 9)
      }
      const block = blocks[row][col];
      if (block >= constants.DATA.WATER) {
        this.shoot()
      } else {
        if (block === constants.DATA.BLANK) {
          blocks[row][col] = constants.DATA.WATER;
          this.setState({
            lastShot: constants.SHOT.WATER,
            blocks
          })
        } else {
          const ships = this.state.ships;
          const ship = ships.find(s => {
            return this.shipAreIn(s, row, col)
          })
          this.findShipBlock(ship, row, col).hit = true
          let last = constants.SHOT.HIT
          if (ship.blocks.every(block => block.hit)) {
            ship.destroyed = true
            last = constants.SHOT.DESTROY
          }
          const newHit = last === constants.SHOT.HIT
          const newCoords = { row, col }
          this.setState({
            lastShot: last,
            hitOnShip: newHit,
            lastHitCoords: newCoords,
            ships: ships.map(s =>
              (s.id === ship.id) 
                ? ship 
                : s
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
        <h3>My Ships</h3>
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
                      player={true}
                      handleClick={() => {}}
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