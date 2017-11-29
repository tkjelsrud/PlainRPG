import React, { Component } from 'react'

import {
} from '.'

const COLORS = {
  info: '#b1b1b1',
  login: '#92aff5',
  logout: '#92aff5',
  channel: '#50bd50',
  player: '#50bd50',
  chat: '#50bd50',
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
        text = `${message.player} logged in`
        break
      case 'logout':
        text = `${message.player} logged out`
        break
      case 'chat':
      console.log(message)
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

    return null
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
