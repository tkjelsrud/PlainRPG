import Population from './Population'
import {staticRoomData} from './rooms'

export default class World {
  constructor(name, connection) {
    this.population = new Population
  }

  roomInfo(room) {
    return {
      type: 'roomInfo',
      ...staticRoomData(room),
      players: this.population.playersInRoom(room),
    }
  }

  findConnectedRoom(room, dir) {
    const roomInfo = this.roomInfo(room)
    const exit = roomInfo.exits.find(e => e.dir === dir)
    if (exit) {
      return this.roomInfo(exit.room)
    }
    else {
      // TODO
      console.warn('invalid move from', room, '->', dir)
    }
  }

  sendRoomInfo(room) {
    const roomInfo = this.roomInfo(room)
    return {
      ...roomInfo,
      players: roomInfo.players.map(p => p.name)
    }
  }

  playerLogin(player) {
    this.population.addPlayer(player)

    player.room = 0 // TODO: persist and retrieve

    this.population.broadcastLogin(player)

    player.send(this.sendRoomInfo(player.room))
  }

  chat(sender, channel, text) {
    let recipients = []
    if (channel === 'global') {
      recipients = this.population.players
    }
    if (channel === 'room') {
      recipients = this.population.playersInRoom(sender.room)
    }
    if (channel === 'party') {
      const party = this.population.findParty(sender)
      if (party) {
        recipients = party.players
      }
    }

    recipients.forEach(recipient => {
      recipient.send({
        type: 'chat',
        channel,
        player: sender.name,
        // room: sender.room,
        text
      })
    })
  }

  move(player, dir) {
    const roomInfo = this.findConnectedRoom(player.room, dir)
    if (roomInfo) {
      const newRoomId = roomInfo.id
      this.population.broadcastMove(player, player.room, newRoomId)

      player.room = newRoomId

      player.send(this.sendRoomInfo(newRoomId))
    }
  }
}
