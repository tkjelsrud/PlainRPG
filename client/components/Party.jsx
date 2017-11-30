import React, { Component } from 'react'

import {
  PartyEntry,
} from '.'

export default class Party extends Component {
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
    return (
      <div style={{}}>
        <div style={{fontWeight: 'bold'}}>Party:</div>
        {this.props.party.players.map((p, i) => <PartyEntry
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
