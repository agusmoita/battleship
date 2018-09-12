import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Start extends Component {
    render() {
        return (
            <Link to="/play">Iniciar</Link>
        )
    }
}

export default Start;
