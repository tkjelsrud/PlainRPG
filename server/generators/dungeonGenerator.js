import DepthFirst from './depthFirst'
import Kruskals from './kruskals'
import RandomPrim from './randomPrim'

import {
  disconnectRoom,
} from './utils'

function generateType(settings) {
  let gen
  switch (settings.type) {
    case 'depthFirst':
      gen = new DepthFirst(settings)
      break
    case 'kruskals':
      gen = new Kruskals({
        ...settings,
        loopChance: 0,
      })
      break
    case 'randomPrim': {
      gen = new RandomPrim(settings)
      break
    }
  }
  return gen.render()
}

function purgeDeadEnds(rooms, chance) {
  for (let i = rooms.length - 1; i > 0; i--) {
    const room = rooms[i]
    if (Object.keys(room.exits).length <= 1 && Math.random() < chance) {
      disconnectRoom(rooms, room)
      rooms.splice(i, 1)
    }
  }
}

export default function generate(settings) {
  const rooms = generateType(settings)

  // purgeDeadEnds(rooms, 0.6)

  const map = rooms.map(r => ({
    id: r.id,
    pos: [r.x, r.y],
    exits: r.exits,
    name: 'Room',
  }))

  // console.log(rooms)

  return map
}
