import React, { Component } from 'react'

import {
} from '.'

export default class PlayerEntry extends Component {
  static propTypes = {
    player: React.PropTypes.object,
    onClick: React.PropTypes.func,
    isSelected: React.PropTypes.bool,
  }

  render() {
    const backgroundColor = this.props.isSelected ? '#eee' : 'transparent'
    return (
      <div style={{display: 'flex', cursor: 'pointer', backgroundColor}} onClick={::this.props.onClick}>
        <div style={{padding: '2px 0'}}>{this.props.player.name}</div>
      </div>
    )
  }
}
