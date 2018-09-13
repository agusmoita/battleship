import React, { Component } from "react";
import _ from 'lodash';
import './Board.css';
import Cell from './Cell';

export default class PlayerBoard extends Component {
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
        ships: this.props.ships
    }
    componentDidMount() {
        this.updateBoard()
    }
    sleep() {
        return new Promise(resolve => setTimeout(resolve, 300));
    }
    componentDidUpdate(prevProps) {
        if (this.props.myTurn !== prevProps.myTurn && this.props.myTurn === false) {
            this.sleep().then(() => {
                this.handleClick(_.random(0, 9), _.random(0, 9))
            })
        }
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
            this.props.finish(false)
        }
    }
    handleClick = (row, col) => {
        if (!this.props.myTurn) {
            const cells = this.state.cells;
            const cell = cells[row][col];
            if (cell >= 2) {
                this.handleClick(_.random(0, 9), _.random(0, 9))
            } else {
                if (cell === 0) {
                    cells[row][col] = 2;
                    this.setState({
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
                    if (_.every(ship.cells, 'hit')) {
                        ship.destroyed = true
                    }

                    this.setState({
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
                <h3>Player Board</h3>
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
                                player={true}
                                handle={() => {}}
                                />
                                )
                        })
                    })
                } 
                </div>
            </div>
        );
    }
}