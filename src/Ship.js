import React, { Component } from 'react';
import './Ship.css'
import Cell from './Cell';

class Ship extends Component {
    change = () => {
        this.props.change(this.props.ship.id)
    }
    render() {
        const { ship } = this.props
        return (
            <div onClick={this.change} className={`Ship ${ship.direction}`}>
                {
                    ship.cells.map((c, i) => {
                        return (
                            <Cell 
                                key={`${ship.id} ${i}`}
                                data={1}
                                player
                                row={c.row}
                                col={c.col}
                                handle={()=>{}}
                            />
                        )
                    })
                }
            </div>
        )
    }
}

export default Ship;