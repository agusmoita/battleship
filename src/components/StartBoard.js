import React, { Component } from "react";
import './Board.css';
import Block from './Block';
import Columns from './Columns';
import Rows from "./Rows";
import constants from '../util/constants';

export default class StartBoard extends Component {
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
    ]
  }
  componentDidMount() {
    this.updateBoard()
  }
  componentDidUpdate(prevProps) {
    if (prevProps.ships !== this.props.ships) {
      this.updateBoard()
    }
  }
  updateBoard = () => {
    const blocks = [
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
    const ships = this.props.ships;
    ships.forEach((ship) => {
      ship.blocks.forEach((block) => {
        if (block.row !== null && block.row !== null)
          blocks[block.row][block.col] = constants.DATA.SHIP;
      })
    })
    this.setState({
      blocks
    })
  }
  handleClick = (row, col) => {
    this.props.clickOnBlock(row, col)
  }
  render() {
    return (
      <div className="Board-Container">
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
                      player
                      handleClick={this.handleClick}
                    />
                  )
                })
              })
            }
          </div>
        </div>
      </div>
    );
  }
}