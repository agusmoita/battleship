import React, { Component } from 'react';
import _ from 'lodash';
import StartBoard from './StartBoard';
import Ship from './Ship';
import './Start.css';

class Start extends Component {
    componentDidMount() {
        this.props.restart()
    }
    updateShips = (row, col) => {
        this.props.call(row,col)
    }
    change = (id) => {
        this.props.change(id)
    }
    start = (e) => {
        e.preventDefault()
        const allCells = _.flattenDepth(this.props.ships.map(s => s.cells))
        const valid = allCells.every(c => {
            return c.row !== null && c.col !== null
        })
        if (valid) this.props.history.push('/play')
    }
    render() {
        return (
            <div className="Start">
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
                </div>
                <StartBoard selectCell={this.updateShips} ships={this.props.ships} />
                <a href="" onClick={this.start}>Start</a>
            </div>
        )
    }
}

export default Start;
