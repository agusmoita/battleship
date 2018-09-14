import React from 'react'
import './LastShot.css';

const LastShot = (props) => {
  return (
    (props.shot !== null)
    ?
      <div className="center lastShot"> 
          { props.shot } 
      </div>
    :
      null
  )
}

export default LastShot;