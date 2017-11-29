import React, { Component } from 'react'
import moment from 'moment'

// import '../sass/index.scss'
import Client from '../js/client'

import {
  GameInput,
  MessageLog,
  Room,
} from '.'

export default class App extends Component {
  state = {
    client: null,
    messageLog: [],
    roomInfo: {
      id: null,
      players: [],
      name: '',
    }
  }

  addToRoom(player) {
    this.setState({roomInfo: {
      ...this.state.roomInfo,
      players: [...this.state.roomInfo.players, player]
    }})
  }

  removeFromRoom(player) {
    this.setState({roomInfo: {
      ...this.state.roomInfo,
      players: this.state.roomInfo.players.filter(p => p !== player)
    }})
  }

  componentDidMount() {
    const client = new Client
    this.setState({client})

    const playerName = `Player_${Math.floor(Math.random()*900 + 100)}`

    client.connect()
      .then(() => {
        this.logMessage({type: 'info', text: 'Logging in...'})
        client.login(playerName)
      })

    client.incoming(::this.handleMessage)
  }

  handleMessage(message) {
    switch (message.type) {
      case 'text':
        console.log('!!!!!!!!!!!!!!!!!!recd type text', message)
        this.logMessage({type: 'info', text: message.text})
        break
      case 'login':
        if (message.success) {
          this.logMessage({type: 'info', text: message.text})
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
        }
        break
      case 'roomInfo':
        const {id, name, players} = message
        this.setState({roomInfo: {id, name, players}})
        break
      case 'chat':
        const {player, channel, text} = message
        this.logMessage({type: 'chat', channel, player, text})
        break
      default:
        console.error('Unknown message type:', message.type)
    }
  }

  logMessage(message) {
    this.setState({messageLog: [
      ...this.state.messageLog,
      {
        ...message,
        timestamp: moment(),
      },
    ]})
  }

  userText({text, channel}) {
    // this.logMessage(`>> ${text}`)
    this.state.client.userText(text, channel)
  }

  render() {
    return (
      <div style={{display: 'flex', fontFamily: 'sans-serif'}}>
        <div style={{flex: 1}}>
          <h3>Lemuria Online</h3>
          <MessageLog messages={this.state.messageLog} />
          <div style={{marginTop: 6}}>
            <GameInput onSubmit={::this.userText} />
          </div>
        </div>
        <div style={{width: 200, marginLeft: 10}}>
          <Room roomInfo={this.state.roomInfo} />
        </div>
      </div>
    )
  }
}
