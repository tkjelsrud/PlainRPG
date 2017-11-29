import {OPEN} from 'ws'

export default class Player {
  constructor(name, connection) {
    this.connection = connection
    this.connected = true
    this.name = name
    this.room = null
  }

  disconnect() {
    this.connected = false
  }

  send(message) {
    if (this.connection.readyState === OPEN) {
      this.connection.send(JSON.stringify(message))
    }
  }
}
