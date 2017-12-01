import React, { Component } from 'react'

import {
  PlayerEntry,
} from '.'

export default class PlayerList extends Component {
  static propTypes = {
    players: React.PropTypes.array,
    myPlayer: React.PropTypes.object,
    onInvite: React.PropTypes.func,
  }

  state = {
    selected: null,
  }

  select(selected) {
    this.setState({selected})
  }

  render() {
    const sorted = this.props.players.sort((a, b) => a.name.localeCompare(b.name))
    return (
      <div style={{}}>
        {sorted.map((p, i) => <PlayerEntry
          key={i}
          player={p}
          isMe={p.name === this.props.myPlayer.name}
          isSelected={this.state.selected === p}
          onClick={() => this.select(p)}
          onInvite={() => this.props.onInvite(p)}
        />)}
      </div>
    )
  }
}
