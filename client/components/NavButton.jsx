import React, { Component } from 'react'

import {
} from '.'

const STYLES = {
  true: {
    backgroundColor: '#ccc',
    cursor: 'pointer',
  },
  false: {
    backgroundColor: '#efefef',
    color: '#999',
  }
}

export default class NavButton extends Component {
  static propTypes = {
    value: React.PropTypes.string,
    enabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
  }

  render() {
    return (
      <div
        onClick={() => (this.props.enabled && this.props.onClick())}
        style={{
          width: 24,
          height: 24,
          lineHeight: '24px',
          textTransform: 'uppercase',
          ...STYLES[this.props.enabled]
        }}
      >
        {this.props.value}
      </div>
    )
  }
}
