import React, { Component } from 'react'

import {
} from '.'

const COLORS = {
  info: '#b1b1b1',
  login: '#b6c9f9',
  logout: '#b6c9f9',
  roomInfo: '#92aff5',
  channel: '#50bd50',
  player: '#50bd50',
  chat: '#99e099',
  move: '#426ae6',
  joinParty: '#78e267',
  leaveParty: '#78e267',
  unknown: '#787b1b',
}

export default class LogLine extends Component {
  static propTypes = {
    message: React.PropTypes.object,
  }

  parseMessage(message) {
    let text = null
    const color = COLORS[message.type] || 'inherit'
    switch (message.type) {
      case 'info':
        text = message.text
        break
      case 'login':
        text = `${message.player.name} logged in`
        break
      case 'logout':
        text = `${message.player.name} logged out`
        break
      case 'roomInfo':
        text = `You entered ${message.room}`
        break
      case 'move':
        text = `${message.player.name} ${message.entered ? 'entered' : 'left'} the room`
        break
      case 'joinParty':
        text = 'You have joined a party'
        break
      case 'leaveParty':
        text = `${message.player.name} left the party`
        break
      case 'chat':
        return (
          <span>
            <span style={{color: COLORS.channel, marginRight: 4}}>[{message.channel}]</span>
            <span style={{color: COLORS.player, marginRight: 4}}>{message.player}:</span>
            <span style={{color: COLORS.chat}}>{message.text}</span>
          </span>
        )
        break
      default:
        text = message.text
        break
    }

    if (text) {
      return (
        <span style={{color}}>{text}</span>
      )
    }

    return (
      <span style={{color: COLORS.unknown}}>{JSON.stringify(message)}</span>
    )
  }

  render() {
    const content = this.parseMessage(this.props.message)

    return (
      <div style={{display: 'flex', alignItems: 'baseline'}}>
        <div style={{padding: 2, fontSize: '10px', color: '#aaa'}}>{this.props.message.timestamp.format('HH:mm:ss')}</div>
        <div style={{padding: 2}}>{content}</div>
      </div>
    )
  }
}
