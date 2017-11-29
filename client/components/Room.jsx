import React, { Component } from 'react'

import {
  PlayerList,
} from '.'

export default class Room extends Component {
  static propTypes = {
    roomInfo: React.PropTypes.object,
  }

  render() {
    return (
      <div>
        <h3>{this.props.roomInfo.name}</h3>
        <div style={{fontWeight: 'bold'}}>Players:</div>
        <PlayerList players={this.props.roomInfo.players} />
      </div>
    )
  }
}
