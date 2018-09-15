import React, { Component } from 'react';
import './Ship.css'
import Block from './Block';
import constants from '../util/constants'

class Ship extends Component {
  handleClick = () => {
    this.props.select(this.props.ship.id)
  }
  render() {
    const { ship } = this.props
    const isCurrent = this.props.current ? 'current' : ''
    return (
      <div onClick={this.handleClick} className={`Ship ${ship.direction} ${isCurrent}`}>
        {
          ship.blocks.map((block, i) => {
            return (
              <Block
                key={`${ship.id} ${i}`}
                data={constants.DATA.SHIP}
                row={block.row}
                col={block.col}
                player
                handleClick={()=>{}}
              />
            )
          })
        }
      </div>
    )
  }
}

export default Ship;