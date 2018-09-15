import React, { Component } from 'react';
import _ from 'lodash';
import StartBoard from '../components/StartBoard';
import Ship from '../components/Ship';
import './Start.css';

class Start extends Component {
  nameInput = null;
  componentDidMount() {
    this.props.restart()
  }
  placeShip = (row, col) => {
    this.props.place(row,col)
  }
  change = (id) => {
    this.props.change(id)
  }
  setRef = (element) => {
    this.nameInput = element;
  }
  allShipsPlaced = () => {
    return _.flattenDepth(this.props.ships.map(ship => ship.blocks))
      .every(block => {
        return block.row !== null && block.col !== null
      })
  }
  startGame = (e) => {
    e.preventDefault()
    const name = this.nameInput ? this.nameInput.value : null;
    if (name) {
      this.props.setName(name)
      if (this.allShipsPlaced()) this.props.history.push('/play')
    }
    else {
      this.nameInput.focus()
    }
  }
  render() {
    return (
      <div className="Start">
        <div className="center">
          <input type="text" name="name" placeholder="Your name" ref={this.setRef}/>
        </div>
        <div className="content">
          <div className="Ships">
            {
              this.props.ships.map(ship => {
                const isCurrent = this.props.current === ship.id
                return (
                  <Ship 
                    key={ship.id} 
                    ship={ship}
                    select={this.change}
                    current={isCurrent}
                  />
                )
              })
            }
            <p className="help">Click to select</p>
            <p className="help">Click on selected to change direction</p>
          </div>
          <StartBoard clickOnBlock={this.placeShip} ships={this.props.ships} />
        </div>
        <div className="center">
          <a href="" onClick={this.startGame}>Start game</a>
        </div>
      </div>
    )
  }
}

export default Start;
