import React, { Component } from 'react';

class Ship extends Component {
    change = () => {
        this.props.change(this.props.ship.id)
    }
    render() {
        const { ship } = this.props
        return (
            <div onClick={this.change} >
                {ship.id} {ship.length}
            </div>
        )
    }
}

export default Ship;