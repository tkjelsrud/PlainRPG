const SOCKET_ADDRESS = 'ws://localhost:8090'
const DEBUG = true

export default class Client {
  constructor() {
    this.socket = null
    this.appCallback = null
    this.isLoggedIn = false
  }

  debug(...message) {
    if (DEBUG) {
      console.log('DEBUG:', ...message)
    }
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(SOCKET_ADDRESS)

      this.socket.onopen = event => {
        this.debug('socket opened')
        resolve()
      }

      this.socket.onmessage = event => {
        this.debug('messages:', event.data)
        const message = JSON.parse(event.data)

        switch (message.type) {
          case 'login':
            this.isLoggedIn = message.success
            break
        }

        if (this.appCallback) {
          this.appCallback(message)
        }
      }
    })
  }

  incoming(cb) {
    this.appCallback = cb
  }

  send(message) {
    this.debug('sending:', message)
    this.socket.send(JSON.stringify(message))
  }

  login(name) {
    this.debug('logging in as', name)

    this.send({
      type: 'login',
      name,
    })
  }

  chat(text, channel) {
    this.debug('sending chat', text)

    this.send({
      type: 'chat',
      channel,
      text,
    })
  }

  move(dir) {
    this.debug('moving', dir)

    this.send({
      type: 'move',
      dir,
    })
  }

  partyInvite({name}) {
    this.debug('inviting', name, 'to party')

    this.send({
      type: 'partyInvite',
      player: name,
    })
  }
}
