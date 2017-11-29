import React, { Component } from 'react'

import {
  LogLine,
} from '.'

export default class MessageLog extends Component {
  static propTypes = {
    messages: React.PropTypes.array,
  }

  componentDidUpdate() {
    const log = this.refs.log
    log.scrollTop = log.scrollHeight
  }

  // onScroll() {
  //   this.props.handleScroll( this.refs.elem.scrollTop )
  // }

  render() {
    return (
      <div ref="log" style={{backgroundColor: '#333', color: '#f8f8f8', height: 420, overflowY: 'scroll'}}>
        {this.props.messages.map((m, i) => <LogLine key={i} message={m} />)}
      </div>
    )
  }
}
