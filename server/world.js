import {
  Map,
  Population,
} from '.'
// import dungeonGenerator from './generators/dungeonGenerator'
import overworldData from './overworldData'

export default class World {
  constructor() {
    this.population = new Population()
    this.overworld = new Map(overworldData)
  }

  sendRoomInfo(player) {
    return {
      type: 'roomInfo',
      ...player.room,
      players: this.population.playersInRoom(player.room).map(p => ({name: p.name}))
    }
  }

  playerLogin(player) {
    this.population.addPlayer(player)

    // TODO: persist and retrieve
    const map = this.overworld
    player.map = map
    player.room = map.findRoom(0)

    this.population.broadcastLogin(player)

    player.send([
      this.sendRoomInfo(player),
      {
        type: 'map',
        map: map.serialize()
      },
    ])
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
    const destination = player.map.findConnectedRoom(player.room, dir)
    if (destination) {
      this.population.broadcastMove(player, player.room, destination)

      player.room = destination

      player.send(this.sendRoomInfo(player))
    }

    else {
      // TODO
      console.warn('invalid move from', player.room, '->', dir)
    }
  }

  createRandomDungeon() {
    // const roomData = dungeonGenerator({
    //   type: 'randomPrim',
    //   width: 6,
    //   height: 6,
    //   shape: 'box',
    // })
  }
}
