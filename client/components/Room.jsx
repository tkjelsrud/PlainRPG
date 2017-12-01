import React, { Component } from 'react'

import {
  Map,
  Navigation,
  PartyList,
  PlayerList,
} from '.'

export default class Room extends Component {
  static propTypes = {
    roomInfo: React.PropTypes.object,
    onMove: React.PropTypes.func,
    onInvite: React.PropTypes.func,
    myPlayer: React.PropTypes.object,
    party: React.PropTypes.object,
    map: React.PropTypes.object,
  }

  render() {
    const {name, exits, players} = this.props.roomInfo
    return (
      <div>
        <h3>{name}</h3>
        <div style={{marginBottom: 6}}>
          <Map
            map={this.props.map}
            myRoom={this.props.roomInfo.id}
          />
        </div>
        <Navigation exits={exits} onMove={::this.props.onMove} />
        {
          !!this.props.party.players.length && (
            <div style={{marginTop: 10}}>
              <div style={{fontWeight: 'bold'}}>Party:</div>
              <PartyList
                party={this.props.party}
                myPlayer={this.props.myPlayer}
              />
            </div>
          )
        }
        <div style={{marginTop: 10}}>
          <div style={{fontWeight: 'bold'}}>Players in room:</div>
          <PlayerList
            players={players}
            myPlayer={this.props.myPlayer}
            onInvite={::this.props.onInvite}
          />
        </div>
      </div>
    )
  }
}
