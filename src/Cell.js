import React, { Component } from "react";
import './Cell.css';

export default class Cell extends Component {
    clickear = () => {
        this.props.handle(this.props.row, this.props.col)
    }
    render() {
        let fill = '';
        switch (this.props.data) {
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
            <span className={`Cell ${fill}`} onClick={this.clickear}></span>
        );
    }
}