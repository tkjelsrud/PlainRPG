import React, { Component } from 'react'

import {
  PartyEntry,
} from '.'

export default class PartyList extends Component {
  static propTypes = {
    party: React.PropTypes.object,
    myPlayer: React.PropTypes.object,
  }

  state = {
    selected: null,
  }

  select(selected) {
    this.setState({selected})
  }

  render() {
    const me = this.props.myPlayer
    const sorted = this.props.party.players
      .filter(p => p.name !== me.name)
      .sort((a, b) => a.name.localeCompare(b.name))

    sorted.unshift(me)

    return (
      <div style={{}}>
        {sorted.map((p, i) => <PartyEntry
          key={i}
          player={p}
          isMe={p === this.props.myPlayer.name}
          isSelected={this.state.selected === p}
          isLeader={this.props.party.leader === p.name}
          onClick={evt => this.select(p)}
        />)}
      </div>
    )
  }
}
