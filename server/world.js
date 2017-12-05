import uuid from 'uuid'

import dungeonGenerator from './generators/dungeonGenerator'
import overworldData from './overworldData'

import {
  Map,
  Player,
  Population,
} from '.'

export default class World {
  constructor() {
    this.population = new Population()
    this.overworld = new Map(overworldData)
    this.dungeons = []
  }

  sendRoomInfo(player) {
    return {
      type: 'roomInfo',
      ...player.room,
      players: this.population.playersInRoom(player.room).map(p => ({name: p.name}))
    }
  }

  async playerLogin(player) {
    this.population.addPlayer(player)

    const playerData = await this.loadPlayer(player)
    let map = this.findMap(playerData.mapId)
    let room
    if (map) {
      room = map.findRoom(playerData.roomId)
    }
    else {
      map = this.overworld
      room = map.entrance
    }
    this.changeMap(player, map, room)

    this.population.broadcastLogin(player)
  }

  getPlayer(loginName) {
    return new Player(loginName)
  }

  loadPlayer(player) {
    return player.load()
  }

  sendPlayerLocation(player) {
    player.send([
      {
        type: 'map',
        map: player.map.serialize()
      },
      this.sendRoomInfo(player),
    ])
  }

  changeMap(player, map, room) {
    this.population.changeMap(player, map, room)
    this.sendPlayerLocation(player)
    // TODO: broadcast
  }

  findMap(mapId) {
    if (mapId === this.overworld.id) return this.overworld
    return this.dungeons.find(d => d.id === mapId)
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

      player.move(destination)

      player.send(this.sendRoomInfo(player))
    }

    else {
      // TODO
      console.warn('invalid move from', player.room, '->', dir)
    }
  }

  enterRandomDungeon(player) {
    const party = this.population.findParty(player)
    if (!party || party.leader === player) {
      const map = this.createRandomDungeon()
      const players = party ? party.players : [player]
      players.forEach(p => {
        this.changeMap(p, map, map.entrance)
      })
    }
  }

  createRandomDungeon() {
    const rooms = dungeonGenerator({
      type: 'randomPrim',
      width: 6,
      height: 6,
      shape: 'box',
      removeDeadends: 0.35,
      poke: 0.15,
    })
    const map = new Map({
      id: uuid.v4(),
      name: 'Random Dungeon',
      rooms,
    })
    this.dungeons.push(map)
    return map
  }
}
