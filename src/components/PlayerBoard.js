import React, { Component } from "react";
import _ from 'lodash';
import './Board.css';
import Block from './Block';
import LastShot from "./LastShot";
import Columns from './Columns';
import Rows from './Rows';
import CONST from '../util/constants';

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
    ships: []
  }
  componentDidMount() {
    const ships = this.props.ships;
    const blocks = this.state.blocks;
    ships.forEach((ship) => {
      ship.blocks.forEach((block) => {
        blocks[block.row][block.col] = CONST.DATA.SHIP;
      })
    })
    this.setState({
      lastShot: null,
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
        let fill = CONST.DATA.SHIP;
        if (destroyed) fill = CONST.DATA.DESTROY
        else if (block.hit) fill = CONST.DATA.HIT
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
  // isStraight = (row, col) => {
  //   const { lastHitCoords } = this.state
  //   const newRow = lastHitCoords.row
  //   const newCol = lastHitCoords.col

  //   if (row < newRow && col !== newCol) return false;
  //   if (row > newRow && col !== newCol) return false;
  //   if (col < newCol && row !== newRow) return false;
  //   if (col > newCol && row !== newRow) return false;
  //   if (row === newRow && col === newCol) return false;
  //   return true;
  // }
  // check = (row, col, r, c) => {
  //   const blocks = this.state.blocks;
  //   if (r < row && blocks[r+1][c] === CONST.DATA.WATER) return false;
  //   if (r > row && blocks[r-1][c] === CONST.DATA.WATER) return false;
  //   if (c < col && blocks[r][c+1] === CONST.DATA.WATER) return false;
  //   if (c > col && blocks[r][c-1] === CONST.DATA.WATER) return false;
    
  //   return true
  // }
  updateProbs = (probs, x, y) => {
    const blocks = this.state.blocks
    if (0 <= x - 1 && blocks[x - 1][y] < CONST.DATA.WATER) {
      probs[x - 1][y] += 1
    }
    if (x + 1 <= CONST.BOARD_SIZE - 1 && blocks[x + 1][y] < CONST.DATA.WATER) {
      probs[x + 1][y] += 1
    }
    if (0 <= y - 1 && blocks[x][y - 1] < CONST.DATA.WATER) {
      probs[x][y - 1] += 1
    }
    if (y + 1 <= CONST.BOARD_SIZE - 1 && blocks[x][y + 1] < CONST.DATA.WATER) {
      probs[x][y + 1] += 1
    }
    
  }
  indexToBlock = index => {
    let i = index + 1
    let row = Math.trunc(i / 10)
    let col = (i % 10) - 1
    return [row, col];
  }
  getShot = (probs) => {
    const posibilities = _(probs).flatten().map((p, index) => {
      let [row, col] = this.indexToBlock(index);
      return {
        row,
        col,
        prob: p
      }
    }).filter(p => p.prob > 0).orderBy('prob', 'desc').value()
    return _.head(posibilities);
  }
  calculateShot = () => {
    const probs = [
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
    ]
    const blocks = this.state.blocks
    blocks.forEach((row, x) => {
      row.forEach((block, y) => {
        if (block === CONST.DATA.HIT) {
          this.updateProbs(probs, x, y)
        }
      })
    })
    const shot = this.getShot(probs);
    if (shot) {
      return [shot.row, shot.col];
    } else {
      return [_.random(0, CONST.BOARD_SIZE - 1), _.random(0, CONST.BOARD_SIZE - 1)]
    }
  }
  shoot = () => {
    if (!this.props.myTurn) {
      const blocks = this.state.blocks
      const shot = this.calculateShot();
      const [row, col] = shot
      const block = blocks[row][col];
      if (block >= CONST.DATA.WATER) {
        this.shoot()
      } else {
        if (block === CONST.DATA.BLANK) {
          blocks[row][col] = CONST.DATA.WATER;
          this.setState({
            lastShot: CONST.SHOT.WATER,
            blocks
          })
        } else {
          const ships = this.state.ships;
          const ship = ships.find(s => {
            return this.shipAreIn(s, row, col)
          })
          this.findShipBlock(ship, row, col).hit = true
          let last = CONST.SHOT.HIT
          if (ship.blocks.every(block => block.hit)) {
            ship.destroyed = true
            last = CONST.SHOT.DESTROY
          }
          this.setState({
            lastShot: last,
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