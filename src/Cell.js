import React, { Component } from "react";
import './Cell.css';

export default class Cell extends Component {
    render() {
        const { data, handle, row, col} = this.props;
        let fill = '';
        switch (data) {
            case 1:
                if (this.props.player) fill = 'ship';
                break;
            case 2:
                fill = 'water';
                break;
            case 3:
                fill = 'hit';
                break;
            case 4:
                fill = 'destroy';
                break;
        
            default:
                break;
        }
        return (
            <span 
                className={`Cell ${fill}`} 
                onClick={
                    () => {handle(row, col)}
                }
            ></span>
        );
    }
}