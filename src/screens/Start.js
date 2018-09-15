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
  updateShips = (row, col) => {
    this.props.call(row,col)
  }
  change = (id) => {
    this.props.change(id)
  }
  setRef = (element) => {
    this.nameInput = element;
  }
  start = (e) => {
    e.preventDefault()
    const name = this.nameInput ? this.nameInput.value : null;
    if (name) {
      this.props.setName(name)
      const allCells = _.flattenDepth(this.props.ships.map(s => s.cells))
      const valid = allCells.every(c => {
        return c.row !== null && c.col !== null
      })
      if (valid) this.props.history.push('/play')
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
              this.props.ships.map(s => {
                const isCurrent = this.props.current === s.id
                return (
                  <Ship 
                  key={s.id} 
                  ship={s}
                  change={this.change}
                  current={isCurrent}
                  />
                  )
                })
              }
            <p className="help">Click to select</p>
            <p className="help">Click on selected to change direction</p>
          </div>
          <StartBoard selectCell={this.updateShips} ships={this.props.ships} />
        </div>
        <div className="center">
          <a href="" onClick={this.start}>Start game</a>
        </div>
      </div>
    )
  }
}

export default Start;
