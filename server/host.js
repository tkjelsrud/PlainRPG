import {
  World,
} from '.'

const DEBUG = true

const world = new World()

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
      const loginName = message.name

      player = world.population.findPlayerByName(loginName)
      if (player) {
        debug(`disconnecting reconnecting player ${loginName}`)
        world.population.disconnectPlayer(player)
      }

      player = world.population.getPlayer(loginName)
      player.connection = connection
      player.connected = true

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
      debug(`${player.name} moving from ${player.room.id} -> ${message.dir}`)
      break
    case 'partyInvite':
      world.population.partyInvite(player, message.player)
      debug(`${player.name} inviting ${message.player} to party`)
      break
    // case 'enterRandomDungeon': {
    //   debug(`${player.name} entering random dungeon`)
    //   const map = world.createRandomDungeon()
    //   world.population.changeMap(player, map)
    //   break
    // }
  }
}

export default function socketHost(wss) {
  wss.on('connection', ws => {
    ws.on('message', message => {
      handleMessage(JSON.parse(message), ws)
    })
  })
}
