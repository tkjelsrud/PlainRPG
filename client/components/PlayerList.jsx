import React, { Component } from 'react'

import {
  PlayerEntry,
} from '.'

export default class PlayerList extends Component {
  static propTypes = {
    players: React.PropTypes.array,
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
        {this.props.players.map((p, i) => <PlayerEntry
          key={i}
          player={{name: p}}
          isSelected={this.state.selected === p}
          onClick={evt => this.select(p)}
        />)}
      </div>
    )
  }
}
