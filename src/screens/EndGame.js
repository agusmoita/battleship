import React from 'react';
import { Link } from 'react-router-dom';
import './EndGame.css'

const EndGame = (props) => {
  return (
    <div className="EndGame center">
      { props.children }
      <Link to="/">Restart</Link>
    </div>
  )
}

export default EndGame;