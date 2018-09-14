import React, { Component } from "react";
import _ from 'lodash';
import './Board.css';
import Cell from './Cell';
import shipsTemplate from '../util/ships';
import LastShot from "./LastShot";
import Columns from "./Columns";
import Rows from "./Rows";
import constants from '../util/constants';

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
        lastShot: null,
        ships: []
    }
    componentDidCatch() {
        this.props.history.push('/')
    }
    initShips = () => {
        const ships = shipsTemplate
        const shipsCount = ships.length
        let i = 0;
        while (i < shipsCount) {
            let valid = [];
            const ship = ships[i];    
            const row = _.random(0, 9);
            const col = _.random(0, 9);
            const otherShips = ships.filter(s => s.id !== ship.id)
            const allCells = _.flattenDepth(otherShips.map(s => s.cells))
            let coords = [];
            const { length } = ship;
            const direction = _.sample(['horizontal', 'vertical'])
            for (let index = 0; index < length; index++) {
                coords[index] = {
                    row: (direction === 'horizontal' ? row : row + index),
                    col: (direction === 'vertical' ? col : col + index),
                    hit: false
                }
                valid[index] = allCells.every(c => {
                    return (
                        (c.row !== coords[index].row || c.col !== coords[index].col)
                        &&
                        (coords[index].row <= 9 && coords[index].col <= 9)
                    );
                })
            }
            if (valid.every(v => v)) {
                ship.cells = coords
                ship.direction = direction
                ship.destroyed = false
                ships[i] = ship
                i += 1
            }
        }
        this.setState({
            ships: ships
        })

        return ships;

    }
    componentDidMount() {
        const ships = this.initShips();
        const cells = this.state.cells;
        ships.forEach((ship) => {
            ship.cells.forEach((cell) => {
                cells[cell.row][cell.col] = constants.DATA.SHIP;
            })
        })
        this.setState({
            lastShot: null,
            cells,
            ships
        })
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
                let fill = constants.DATA.SHIP;
                if (destroyed) fill = constants.DATA.DESTROY;
                else if (cell.hit) fill = constants.DATA.HIT;
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
            if (cell < constants.DATA.WATER) {
                if (cell === constants.DATA.BLANK) {
                    cells[row][col] = constants.DATA.WATER;
                    this.setState({
                        lastShot: constants.SHOT.WATER,
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
                    let last = constants.SHOT.HIT
                    if (_.every(ship.cells, 'hit')) {
                        ship.destroyed = true
                        last = constants.SHOT.DESTROY
                    }

                    this.setState({
                        lastShot: last,
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
                <h3>Enemy Ships</h3>
                <div className="Board">
                <Columns />
                    <Rows />
                    <div className="Board-Cells">
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
                </div>
                <LastShot shot={this.state.lastShot} />
            </div>
        );
    }
}