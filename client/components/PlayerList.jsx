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
    return (
      <div style={{}}>
        <div style={{fontWeight: 'bold'}}>Players in room:</div>
        {this.props.players.map((p, i) => <PlayerEntry
          key={i}
          player={{name: p}}
          isMe={p === this.props.myPlayer.name}
          isSelected={this.state.selected === p}
          onClick={evt => this.select(p)}
          onInvite={() => this.props.onInvite(p)}
        />)}
      </div>
    )
  }
}
