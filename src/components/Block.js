import React, { Component } from "react";
import './Block.css';
import constants from '../util/constants';

class Block extends Component {
    render() {
        const { data, handleClick, row, col } = this.props;
        const { DATA, FILL } = constants
        let fill = FILL.BLANK;
        switch (data) {
            case DATA.SHIP:
                if (this.props.player) fill = FILL.SHIP;
                break;
            case DATA.WATER:
                fill = FILL.WATER;
                break;
            case DATA.HIT:
                fill = FILL.HIT;
                break;
            case DATA.DESTROY:
                fill = FILL.DESTROY;
                break;
            default:
                break;
        }
        return ( 
            <span 
                className={`Block ${fill}`}
                onClick={
                    () => { handleClick(row, col) }
                }
            ></span>
        );
    }
}

export default Block;