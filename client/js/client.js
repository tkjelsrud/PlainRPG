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
        this.debug('message:', event.data)
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

  userText(text, channel) {
    this.debug('sending user text', text)

    this.send({
      type: 'userText',
      channel,
      text,
    })
  }

  incoming(cb) {
    this.appCallback = cb
  }
}
