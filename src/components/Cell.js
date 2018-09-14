import React, { Component } from "react";
import './Cell.css';
import constants from '../util/constants';

export default class Cell extends Component {
  render() {
    const { data, handle, row, col} = this.props;
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
        className={`Cell ${fill}`} 
        onClick={
          () => {handle(row, col)}
        }
      ></span>
    );
  }
}