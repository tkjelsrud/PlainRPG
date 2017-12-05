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

  handleMessage(message) {
    this.debug('message:', message)
    switch (message.type) {
      case 'login':
        this.isLoggedIn = message.success
        break
    }

    if (this.appCallback) {
      this.appCallback(message)
    }
  }

  connect() {
    this.socket = new WebSocket(`ws://${location.hostname}:8264`)

    this.socket.onmessage = event => {
      const messages = JSON.parse(event.data)
      messages.forEach(::this.handleMessage)
    }

    return new Promise(resolve => {
      this.socket.onopen = () => {
        this.debug('socket opened')
        resolve()
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

  enterRandomDungeon() {
    this.debug('entering random dungeon')

    this.send({
      type: 'enterRandomDungeon',
    })
  }
}
