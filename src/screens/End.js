import React from 'react';
import { Link } from 'react-router-dom';
import './End.css'

const End = (props) => {
  return (
    <div className="End center">
      { props.children }
      <Link to="/">Play again</Link>
    </div>
  )
}

export default End;