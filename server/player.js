import {OPEN} from 'ws'
import db from './db'

export default class Player {
  constructor(name) {
    this.connection = null
    this.connected = false
    this.name = name
    this.map = null
    this.room = null
  }

  send(messages) {
    const arr = Array.isArray(messages) ? messages : [messages]
    if (this.connection.readyState === OPEN) {
      this.connection.send(JSON.stringify(arr))
    }
  }

  create() {
    const data = {
      name: this.name,
      mapId: '0',
      roomId: 0,
    }

    db.get('players').push(data).write()

    return Promise.resolve(data)
  }

  async load() {
    let data = db.get('players').find({name: this.name}).value()
    if (!data) {
      // create player
      data = await this.create()
    }

    // TODO: set stuff like stats

    return Promise.resolve(data)
  }

  update(changes) {
    db.get('players').find({name: this.name}).assign(changes).write()
  }

  save() {
    this.update({mapId: this.map.id, roomId: this.room.id})
  }

  move(destination) {
    this.room = destination
    this.update({roomId: destination.id})
  }
}
