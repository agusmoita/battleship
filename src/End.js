import React from 'react';
import { Link } from 'react-router-dom';

const End = (props) => {
    return (
        <div>
            { props.children }
            <Link to="/">Volver</Link>
        </div>
    )
}

export default End;