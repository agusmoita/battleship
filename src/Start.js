import React, { Component } from 'react';
import { Link } from "react-router-dom";
import StartBoard from './StartBoard';
import Ship from './Ship';

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
    render() {
        return (
            <div>
                <div>
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
                <Link to="/play">Iniciar</Link>
            </div>
        )
    }
}

export default Start;
