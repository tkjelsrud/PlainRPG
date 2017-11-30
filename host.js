import WebSocket from 'ws'

import {
  Player,
  World,
} from './server'

const DEBUG = true

const world = new World

function debug(message) {
  if (DEBUG) {
    console.log(message)
  }
}

function handleMessage(message, connection) {
  let player = world.population.findPlayerByConnection(connection)

  switch (message.type) {
    case 'login': {
      // TODO: verify login
      player = new Player(message.name, connection)
      player.send({type: 'login', success: true, text: `Welcome, ${player.name}!`, playerName: player.name})
      world.playerLogin(player)
      debug(`${player.name} logged in`)
      break
    }
    case 'chat':
      world.chat(player, message.channel, message.text)
      debug(`chat from ${player.name}: [${message.channel}] ${message.text}`)
      break
    case 'move':
      world.move(player, message.dir)
      debug(`${player.name} moving from ${player.room} -> ${message.dir}`)
      break
    case 'partyInvite':
      world.population.partyInvite(player, message.player)
      debug(`${player.name} inviting ${message.player} to party`)
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
