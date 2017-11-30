import React, { Component } from 'react'

import {
} from '.'

const COLORS = {
  me: '#cce7f7',
  selected: '#eee',
}

export default class PlayerEntry extends Component {
  static propTypes = {
    player: React.PropTypes.object,
    onClick: React.PropTypes.func,
    onInvite: React.PropTypes.func,
    isSelected: React.PropTypes.bool,
    isMe: React.PropTypes.bool,
  }

  canInvite() {
    return this.props.isSelected && !this.props.isMe
  }

  leaderIcon() {
    return (
      <span style={{fontSize: '11px'}}>👑</span>
    )
  }

  buttons() {
    if (this.canInvite()) {
      return (
        <div>
          <button type="button" style={{cursor: 'pointer'}} onClick={::this.props.onInvite}>I</button>
        </div>
      )
    }
  }

  getBackgroundColor() {
    if (this.props.isMe) return COLORS.me
    if (this.props.isSelected) return COLORS.selected
    return 'transparent'
  }

  render() {
    const backgroundColor = this.getBackgroundColor()
    return (
      <div style={{display: 'flex', cursor: 'pointer', backgroundColor}} onClick={::this.props.onClick}>
        <div style={{padding: '2px 0', display: 'flex', width: '100%'}}>
          <div style={{flex: 1}}>{this.props.player.name}</div>
          {this.buttons()}
        </div>
      </div>
    )
  }
}
