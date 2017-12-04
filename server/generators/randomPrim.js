import MapGenerator from './mapGenerator'

import {
  DIR_S, DIR_E,
} from './utils'

export default class RandomPrim extends MapGenerator {
  findWalls({x, y}) {
    return this.walls.reduce((acc, w) => {
      if ((w.r1.x === x && w.r1.y === y) || (w.r2.x === x && w.r2.y === y)) {
        acc.push(w)
      }
      return acc
    }, [])
  }

  dig(room, pendingWalls, visited) {
    visited[room.id] = true
    const roomWalls = this.findWalls(room)
    pendingWalls.push(...roomWalls)
    while (pendingWalls.length) {
      const index = Math.floor(Math.random() * pendingWalls.length)
      const {r1, r2} = pendingWalls.splice(index, 1)[0]
      const r1visited = !!visited[r1.id]
      const r2visited = !!visited[r2.id]
      if (r1visited + r2visited === 1) {
        this.connectRooms(r1, r2)
        const target = r1visited ? r2 : r1
        this.dig(target, pendingWalls, visited)
      }
    }
  }

  generate() {
    const walls = []
    this.rooms.forEach(r => {
      const east = this.getNeighbor(r, DIR_E)
      if (east) walls.push({r1: r, r2: east})
      const south = this.getNeighbor(r, DIR_S)
      if (south) walls.push({r1: r, r2: south})
    })

    this.walls = walls

    this.dig(this.randomRoom(), [], {})
  }
}
