import React, { Component } from 'react'

import {
} from '.'

export default class PartyEntry extends Component {
  static propTypes = {
    player: React.PropTypes.object,
    onClick: React.PropTypes.func,
    isSelected: React.PropTypes.bool,
    isMe: React.PropTypes.bool,
    isLeader: React.PropTypes.bool,
  }

  buttons() {
    // if (this.props.isSelected && !this.props.isMe) {
    //   return (
    //     <div>
    //       <button type="button" style={{cursor: 'pointer'}}>I</button>
    //     </div>
    //   )
    // }
  }

  leaderIcon() {
    return (
      <span style={{fontSize: '11px'}}>👑</span>
    )
  }

  render() {
    const backgroundColor = this.props.isSelected ? '#eee' : 'transparent'
    return (
      <div style={{display: 'flex', cursor: 'pointer', backgroundColor}} onClick={::this.props.onClick}>
        <div style={{padding: '2px 0', display: 'flex', width: '100%'}}>
          <div style={{flex: 1}}>{this.props.player.name} {this.props.isLeader && this.leaderIcon()}</div>
          {this.buttons()}
        </div>
      </div>
    )
  }
}
