import React, { Component } from 'react'

import {
} from '.'

export default class PartyEntry extends Component {
  static propTypes = {
    player: React.PropTypes.object,
    isMe: React.PropTypes.bool,
    isSelected: React.PropTypes.bool,
    isLeader: React.PropTypes.bool,
    onClick: React.PropTypes.func,
  }

  playerIcon() {
    if (this.props.isLeader) {
      return (
        <span style={{fontSize: '11px'}}>👑</span>
      )
    }
  }

  render() {
    const backgroundColor = this.props.isSelected ? '#eee' : 'transparent'
    return (
      <div style={{display: 'flex', cursor: 'pointer', backgroundColor}} onClick={::this.props.onClick}>
        <div style={{padding: '2px 0', display: 'flex', width: '100%'}}>
          <div style={{flex: 1}}>{this.props.player.name} {this.playerIcon()}</div>
          {/* {this.buttons()} */}
        </div>
      </div>
    )
  }
}
