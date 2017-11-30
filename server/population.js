export default class Population {
  constructor() {
    this.players = []
    this.parties = []

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

  broadcastMove(player, fromRoomId, toRoomId) {
    const fromRoom = this.playersInRoom(fromRoomId)
    const toRoom = this.playersInRoom(toRoomId)
    const recipients = [...fromRoom, ...toRoom]
    recipients.forEach(recipient => {
      if (recipient !== player) {
        recipient.send({type: 'playerMoved', player: player.name, from: fromRoomId, to: toRoomId})
      }
    })
  }

  broadcastParty(party) {
    party.players.forEach(recipient => {
      recipient.send({
        type: 'partyInfo',
        leader: party.leader.name,
        players: party.players.map(p => ({name: p.name}))
      })
    })
  }
}
