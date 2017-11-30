import React, { Component } from 'react'

import {
  NavButton,
} from '.'

export default class Navigation extends Component {
  static propTypes = {
    exits: React.PropTypes.array,
    onMove: React.PropTypes.func,
  }

  open(dir) {
    return this.props.exits && !!this.props.exits.find(e => e.dir === dir)
  }

  navRow(exits) {
    return (
      <div style={{display: 'flex', width: 76, justifyContent: 'space-between'}}>
        {
          exits.map((dir, i) => <NavButton key={i} value={dir} enabled={this.open(dir)} onClick={() => this.props.onMove(dir)} />)
        }
      </div>
    )
  }

  render() {
    return (
      <div style={{textAlign: 'center', height: 76, display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
        {this.navRow([null, 'n', null])}
        {this.navRow(['w', null, 'e'])}
        {this.navRow([null, 's', null])}
      </div>
    )
  }
}
