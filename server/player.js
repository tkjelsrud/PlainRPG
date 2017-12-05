import {OPEN} from 'ws'

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
}
