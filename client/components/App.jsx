import React, { Component } from 'react'
import moment from 'moment'
import queryString from 'query-string'

// import '../sass/index.scss'
import Client from '../js/client'

import {
  GameInput,
  MessageLog,
  Room,
} from '.'

const MAX_LOG_ENTRIES = 100

export default class App extends Component {
  state = {
    client: null,
    messageLog: [],
    myPlayer: {
      playerName: '',
    },
    map: {
      rooms: [],
    },
    party: {
      leader: null,
      players: [],
    },
    roomInfo: {
      id: null,
      players: [],
      name: '',
    }
  }

  componentDidMount() {
    const client = new Client()
    this.setState({client})

    const parsed = queryString.parse(location.search)
    const playerName = parsed.name || `Player_${Math.floor(Math.random() * 900 + 100)}`

    client.connect()
      .then(() => {
        this.logMessage({type: 'info', text: 'Logging in...'})
        client.login(playerName)
      })

    client.incoming(::this.handleMessage)
  }

  addToRoom(player) {
    this.setState({roomInfo: {
      ...this.state.roomInfo,
      players: [...this.state.roomInfo.players, player]
    }})
  }

  removeFromRoom({name}) {
    this.setState({roomInfo: {
      ...this.state.roomInfo,
      players: this.state.roomInfo.players.filter(p => p.name !== name)
    }})
  }

  removeFromParty(player) {
    if (this.state.party.players.find(p => p.name === player.name)) {
      this.setState({party: {
        ...this.state.party,
        players: this.state.party.players.filter(p => p.name !== player.name)
      }})
      this.logMessage({type: 'leaveParty', player})
    }
  }

  playerMoved({player, from, to}) {
    if (to === this.state.roomInfo.id) {
      this.logMessage({type: 'move', player, entered: true})
      this.addToRoom(player)
    }
    else if (from === this.state.roomInfo.id) {
      this.logMessage({type: 'move', player, entered: false})
      this.removeFromRoom(player)
    }
  }

  roomInfo({id, name, players, exits}) {
    this.setState({roomInfo: {id, name, players, exits}})
    this.logMessage({type: 'roomInfo', room: name})
  }

  partyInfo({leader, players}) {
    if (!this.state.party.players.length) this.logMessage({type: 'joinParty'})
    this.setState({party: {leader, players}})
  }

  mapInfo({map}) {
    this.setState({
      map
    })
  }

  handleMessage(message) {
    switch (message.type) {
      case 'text':
        this.logMessage({type: 'info', text: message.text})
        break
      case 'login':
        if (message.success) {
          this.logMessage({type: 'info', text: `Welcome, ${message.playerName}!`})
          this.setState({myPlayer: {name: message.playerName}})
        }
        else {
          // TODO
        }
        break
      case 'playerLoggedIn':
        this.logMessage({type: 'login', player: message.player})
        if (message.room === this.state.roomInfo.id) {
          this.addToRoom(message.player)
        }
        break
      case 'playerLoggedOut':
        this.logMessage({type: 'logout', player: message.player})
        if (message.room === this.state.roomInfo.id) {
          this.removeFromRoom(message.player)
          this.removeFromParty(message.player)
        }
        break
      case 'playerMoved':
        this.playerMoved(message)
        break
      case 'roomInfo':
        this.roomInfo(message)
        break
      case 'partyInfo':
        this.partyInfo(message)
        break
      case 'map':
        this.mapInfo(message)
        break
      case 'chat': {
        const {player, channel, text} = message
        this.logMessage({type: 'chat', channel, player, text})
        break
      }
      default:
        console.error('Unknown message type:', message.type)
    }
  }

  logMessage(message) {
    const entry = {
      ...message,
      timestamp: moment(),
    }

    const entries = [...this.state.messageLog, entry]
    this.setState({messageLog: entries.slice(Math.max(entries.length - MAX_LOG_ENTRIES, 0), entries.length)})
  }

  chat({text, channel}) {
    this.state.client.chat(text, channel)
  }

  onMove(dir) {
    this.state.client.move(dir)
  }

  onInvite(player) {
    this.state.client.partyInvite(player)
  }

  enterRandomDungeon() {
    this.state.client.enterRandomDungeon()
  }

  render() {
    return (
      <div style={{display: 'flex', fontFamily: 'sans-serif'}}>
        <div style={{flex: 1}}>
          <h3>Lemuria Online</h3>
          <MessageLog messages={this.state.messageLog} />
          <div style={{marginTop: 6}}>
            <GameInput
              onSubmit={::this.chat}
              isInParty={!!this.state.party.players.length}
            />
          </div>
        </div>
        <div style={{width: 200, marginLeft: 10}}>
          <Room
            roomInfo={this.state.roomInfo}
            map={this.state.map}
            onMove={::this.onMove}
            party={this.state.party}
            myPlayer={this.state.myPlayer}
            onInvite={::this.onInvite}
            enterRandomDungeon={::this.enterRandomDungeon}
          />
        </div>
      </div>
    )
  }
}
