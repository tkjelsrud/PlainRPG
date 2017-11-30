import React, { Component } from 'react'
import keycode from 'keycode'

import {
} from '.'

export default class LogLine extends Component {
  static propTypes = {
    message: React.PropTypes.object,
    onSubmit: React.PropTypes.func,
    onToggleChannel: React.PropTypes.func,
  }

  submit() {
    const input = this.refs.userInput
    this.props.onSubmit({channel: this.refs.channel.value, text: input.value})
    input.value = ''
  }

  toggleChannel() {
    const selector = this.refs.channel
    selector.selectedIndex++
    if (selector.selectedIndex === -1) selector.selectedIndex = 0
  }

  keyDown(evt) {
    if (evt.keyCode === keycode('enter')) this.submit()
    if (evt.keyCode === keycode('tab')) {
      evt.preventDefault()
      this.toggleChannel()
    }
  }

  render() {
    return (
      <div style={{display: 'flex'}}>
        <select ref="channel" style={{border: '1px solid #999'}}>
          <option value="room">Room</option>
          <option value="party">Party</option>
          <option value="global">Global</option>
        </select>
        <input ref="userInput" type="text" style={{flex: 1, margin: '0 6px', fontSize: '14px'}} onKeyDown={::this.keyDown} />
        <button
          type="button"
          onClick={::this.submit}
          style={{fontSize: '14px', fontWeight: 'bold', padding: '4px 20px'}}
        >
          Send
        </button>
      </div>
    )
  }
}
