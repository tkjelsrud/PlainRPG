import {OPEN} from 'ws'

export default class Player {
  constructor(name) {
    this.connection = null
    this.connected = false
    this.name = name
    this.room = null
  }

  send(message) {
    if (this.connection.readyState === OPEN) {
      this.connection.send(JSON.stringify(message))
    }
  }
}
