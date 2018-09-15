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
        this.shoot(_.random(0, 9), _.random(0, 9))
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
  shoot = (row, col) => {
    if (!this.props.myTurn) {
      const blocks = this.state.blocks;
      const block = blocks[row][col];
      if (block >= constants.DATA.WATER) {
        this.shoot(_.random(0, 9), _.random(0, 9))
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
            // return (s.blocks.find(b => {
            //   return b.row === row && b.col === col
            // }) !== undefined)
          })
          this.findShipBlock(ship, row, col).hit = true
          let last = constants.SHOT.HIT
          if (ship.blocks.every(block => block.hit)) {
            ship.destroyed = true
            last = constants.SHOT.DESTROY
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