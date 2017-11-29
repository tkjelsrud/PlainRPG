import WebSocket from 'ws'

import {
  Player,
  World,
} from './server'

const world = new World

function handleMessage(message, connection) {
  let player = world.findPlayer(connection)

  switch (message.type) {
    case 'login': {
      // TODO: verify login
      player = new Player(message.name, connection)
      world.playerLogin(player)
      player.send({type: 'login', success: true, text: `Welcome, ${player.name}!`})

      console.log(`${player.name} logged in`)

      break
    }
    case 'userText':
      world.chat(player, message.channel, message.text)

      console.log(`user text from ${player.name}: ${message.text}`)

      break
  }
}

export default function run() {
  const wss = new WebSocket.Server({ port: 8090 });
  console.log('WebSocket server started')

  wss.on('connection', ws => {
    ws.on('message', message => {
      handleMessage(JSON.parse(message), ws)
    })
  })
}
