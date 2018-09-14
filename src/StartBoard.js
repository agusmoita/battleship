import React, { Component } from "react";
import './Board.css';
import Cell from './Cell';

export default class StartBoard extends Component {
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
        const cells = [
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
            ship.cells.forEach((cell) => {
                if (cell.row !== null && cell.row !== null)
                    cells[cell.row][cell.col] = 1
            })
        })
        this.setState({
            cells
        })
    }
    handleClick = (row, col) => {
        this.props.selectCell(row, col)
    }
    render() {
        return (
            <div className="Board-Container">
                <h3>Place ships</h3>
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
                                        player
                                        handle={this.handleClick}
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