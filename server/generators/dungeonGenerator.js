import DepthFirst from './depthFirst'
import Kruskals from './kruskals'
import RandomPrim from './randomPrim'

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

  gen.poke(settings.poke)

  gen.generate()

  gen.removeDeadends(settings.removeDeadends)

  return gen.render()
}

export default function generate(settings) {
  const rooms = generateType(settings)

  const map = rooms.map(r => ({
    id: r.id,
    pos: [r.x, r.y],
    exits: r.exits,
    name: 'Room',
  }))

  // console.log(rooms)

  return map
}
