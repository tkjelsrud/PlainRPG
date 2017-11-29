import {staticRoomData} from './rooms'

export default class World {
  constructor(name, connection) {
    this.players = []

    this.pingInterval = setInterval(() => {
      this.players.forEach(player => {
        const connection = player.connection
        if (!connection.isConnected) {
          player.connected = false
          this.broadcastDisconnect(player)
          return connection.terminate()
        }

        connection.isConnected = false
        connection.ping('', false, true)
      })
      this.players = this.players.filter(p => p.connected)
    }, 5000)
  }

  playersInRoom(room) {
    return this.players.filter(p => p.room === room).map(p => p.name)
  }

  roomInfo(room) {
    return {
      type: 'roomInfo',
      ...staticRoomData(room),
      players: this.playersInRoom(room),
    }
  }

  broadcastLogin(player) {
    this.players.forEach(recipient => {
      if (recipient !== player) {
        recipient.send({type: 'playerLoggedIn', player: player.name, room: player.room})
      }
    })
  }

  broadcastDisconnect(player) {
    this.players.forEach(recipient => {
      recipient.send({type: 'playerLoggedOut', player: player.name, room: player.room})
    })
  }

  findPlayer(connection) {
    return this.players.find(p => p.connection === connection)
  }

  addPlayer(player) {
    this.players.push(player)

    const connection = player.connection

    connection.isConnected = true
    connection.on('pong', () => connection.isConnected = true)

    connection.on('close', () => {
      player.disconnect()
      console.log(player.name, 'disconnected')
      this.players = this.players.filter(p => p !== player)
      this.broadcastDisconnect(player)
    })
  }

  playerLogin(player) {
    this.addPlayer(player)

    player.room = 0 // TODO: persist and retrieve

    this.broadcastLogin(player)

    player.send(this.roomInfo(player.room))

    // setTimeout(() => player.send({type: 'text', text: 'Enjoying yourself here?'}), 2000)
  }

  chat(sender, channel, text) {
    this.players.forEach(recipient => {
      if (channel === 'global' || recipient.room === sender.room) {
        recipient.send({
          type: 'chat',
          channel,
          player: sender.name,
          // room: sender.room,
          text
        })
      }
    })
  }
}
