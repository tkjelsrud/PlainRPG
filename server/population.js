import {
  Player,
} from '.'

export default class Population {
  constructor() {
    this.players = []
    this.parties = []

    this.pingInterval = setInterval(() => {
      this.players.forEach(player => {
        const connection = player.connection
        if (!connection.isConnected) {
          console.log(player.name, 'timed out')
          return this.disconnectPlayer(player)
        }

        connection.isConnected = false
        connection.ping('', false, true)
      })
      this.players = this.players.filter(p => p.connected)
    }, 5000)
  }

  addPlayer(player) {
    if (!this.players.includes(player)) {
      this.players.push(player)
    }

    const connection = player.connection

    connection.isConnected = true
    connection.on('pong', () => { connection.isConnected = true })

    connection.on('close', () => {
      console.log(player.name, 'disconnected')
      this.disconnectPlayer(player)
    })

    connection.on('error', e => {
      console.log('socket error', e)
      this.disconnectPlayer(player)
    })
  }

  disconnectPlayer(player) {
    this.leaveParty(player)
    player.connected = false
    this.players = this.players.filter(p => p !== player)
    this.broadcastDisconnect(player)
    player.connection.terminate()
  }

  findPlayerByConnection(connection) {
    return this.players.find(p => p.connection === connection)
  }

  findPlayerByName(name) {
    return this.players.find(p => p.name === name)
  }

  playersInRoom(room) {
    return this.players.filter(p => p.room === room)
  }

  findParty(player) {
    return this.parties.find(p => p.players.includes(player))
  }

  serializePlayer(player) {
    const {name} = player
    return {
      name,
    }
  }

  partyInvite(fromPlayer, toPlayerName) {
    const toPlayer = this.findPlayerByName(toPlayerName)

    if (fromPlayer === toPlayer) return console.warn('player tried to invite themselves to a party')

    const recipientParty = this.findParty(toPlayer)

    if (recipientParty) return console.warn('player tried to invite someone already in a party')

    let party = this.findParty(fromPlayer)
    if (party) {
      if (party.players.includes(toPlayer)) return console.warn('player tried to invite a player already in the party')
      if (party.leader !== fromPlayer) return console.warn('non-leader tried to invite to existing party')

      party.players.push(toPlayer)
    }
    else {
      party = {
        leader: fromPlayer,
        players: [fromPlayer, toPlayer]
      }
      this.parties.push(party)
    }
    this.broadcastParty(party)
  }

  leaveParty(player) {
    const party = this.findParty(player)
    if (party) {
      party.players = party.players.filter(p => p !== player)
    }
  }

  changeMap(player, map, room) {
    player.map = map
    player.room = room
    player.save()
  }

  // broadcast
  broadcastLogin(player) {
    this.players.forEach(recipient => {
      if (recipient !== player) {
        recipient.send({type: 'playerLoggedIn', player: this.serializePlayer(player), room: player.room.id})
      }
    })
  }

  broadcastDisconnect(player) {
    this.players.forEach(recipient => {
      recipient.send({type: 'playerLoggedOut', player: this.serializePlayer(player), room: player.room.id})
    })
  }

  broadcastMove(player, fromRoom, toRoom) {
    const fromList = this.playersInRoom(fromRoom)
    const toList = this.playersInRoom(toRoom)
    const recipients = [...fromList, ...toList]
    recipients.forEach(recipient => {
      if (recipient !== player) {
        recipient.send({type: 'playerMoved', player: this.serializePlayer(player), from: fromRoom.id, to: toRoom.id})
      }
    })
  }

  broadcastParty(party) {
    party.players.forEach(recipient => {
      recipient.send({
        type: 'partyInfo',
        leader: party.leader.name,
        players: party.players.map(this.serializePlayer)
      })
    })
  }
}
