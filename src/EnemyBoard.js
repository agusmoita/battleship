import React, { Component } from "react";
import _ from 'lodash';
import './Board.css';
import Cell from './Cell';

export default class EnemyBoard extends Component {
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
        lastHit: null,
        ships: [{
                id: 1,
                length: 3,
                direction: 'horizontal',
                cells: [{
                        row: 0,
                        col: 0,
                        hit: false
                    },
                    {
                        row: 0,
                        col: 1,
                        hit: false
                    },
                    {
                        row: 0,
                        col: 2,
                        hit: false
                    },
                ],
                destroyed: false
            },
            {
                id: 2,
                length: 3,
                direction: 'vertical',
                cells: [{
                        row: 3,
                        col: 7,
                        hit: false
                    },
                    {
                        row: 4,
                        col: 7,
                        hit: false
                    },
                    {
                        row: 5,
                        col: 7,
                        hit: false
                    },
                ],
                destroyed: false
            }
        ]
    }
    componentDidCatch() {
        this.props.history.push('/')
    }
    componentDidMount() {
        this.updateBoard()
    }
    sleep() {
        return new Promise(resolve => setTimeout(resolve, 300));
    }
    updateBoard = () => {
        const ships = this.state.ships;
        const cells = this.state.cells;
        ships.forEach((ship) => {
            const destroyed = ship.destroyed
            ship.cells.forEach((cell) => {
                let fill = 1;
                if (destroyed) fill = 4
                else if (cell.hit) fill = 3
                cells[cell.row][cell.col] = fill
            })
        })
        this.setState({
            cells
        })
        if (_.every(ships, 'destroyed')) {
            this.props.finish(true)
        }
    }
    handleClick = (row, col) => {
        if (!this.props.myTurn) {
            const cells = this.state.cells;
            const cell = cells[row][col];
            if (cell < 2) {
                if (cell === 0) {
                    cells[row][col] = 2;
                    this.setState({
                        lastHit: 'water',
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
                    let last = 'hit'
                    if (_.every(ship.cells, 'hit')) {
                        ship.destroyed = true
                        last = 'destroyed'
                    }

                    this.setState({
                        lastHit: last,
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
                <h3>CPU Board</h3>
                <div className="Board"> 
                {
                    this.state.cells.map((row, i) => {
                        return row.map((cell, col) => {
                            return ( 
                                <Cell 
                                key={`${i} ${col}`}
                                row={i}
                                col={col}
                                data={cell}
                                handle={this.handleClick}
                                />
                                )
                            })
                        })
                    } 
                </div>
                < div> { this.state.lastHit } </div>
            </div>
        );
    }
}