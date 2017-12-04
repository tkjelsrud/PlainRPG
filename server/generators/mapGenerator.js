import {
  DIR_S, DIR_N, DIR_E, DIR_W,
} from './utils'

export default class MapGenerator {
  constructor(settings) {
    this.settings = settings
  }

  room(x, y) {
    return {
      name: 'Room',
      x,
      y,
      exits: {},
    }
  }

  getDelta(dir) {
    return {
      [DIR_S]: {x: 0, y: 1},
      [DIR_N]: {x: 0, y: -1},
      [DIR_E]: {x: 1, y: 0},
      [DIR_W]: {x: -1, y: 0},
    }[dir]
  }

  reverseDir(dir) {
    return {
      [DIR_S]: DIR_N,
      [DIR_N]: DIR_S,
      [DIR_E]: DIR_W,
      [DIR_W]: DIR_E,
    }[dir]
  }

  connectRooms(r1, r2) {
    if (r1.x === r2.x - 1) {
      r1.exits[DIR_E] = r2.id
      r2.exits[DIR_W] = r1.id
    }
    if (r1.x === r2.x + 1) {
      r1.exits[DIR_W] = r2.id
      r2.exits[DIR_E] = r1.id
    }
    if (r1.y === r2.y - 1) {
      r1.exits[DIR_S] = r2.id
      r2.exits[DIR_N] = r1.id
    }
    if (r1.y === r2.y + 1) {
      r1.exits[DIR_N] = r2.id
      r2.exits[DIR_S] = r1.id
    }
  }

  findRoomAt(x, y) {
    return this.rooms.find(r => r.x === x && r.y === y)
  }

  randomRoom() {
    return this.rooms[Math.floor(Math.random() * this.rooms.length)]
  }

  getNeighbor(room, dir) {
    const delta = this.getDelta(dir)
    return this.findRoomAt(room.x + delta.x, room.y + delta.y)
  }

  disconnectRoom(r) {
    const neighbors = [DIR_S, DIR_N, DIR_E, DIR_W]
    neighbors.forEach(dir => {
      const room = this.getNeighbor(this.rooms, r, dir)
      if (room) {
        delete room.exits[this.reverseDir(dir)]
      }
    })
  }

  withinShape({width, height, shape, x, y}) {
    switch (shape) {
      case 'box': {
        const borderW = Math.ceil(width / 4)
        const borderH = Math.ceil(height / 4)
        return (x < borderW || x >= width - borderW) || (y < borderH || y >= height - borderH)
      }
    }
    return true
  }

  createRooms() {
    const {width, height} = this.settings
    const rooms = []
    let id = 0
    const cells = width * height
    for (let i = 0; i < cells; i++) {
      const r = this.room(i % width, Math.floor(i / height))
      if (this.withinShape({...this.settings, x: r.x, y: r.y})) {
        rooms.push({
          ...r,
          id: id++
        })
      }
    }

    return rooms
  }

  generate() {
    return []
  }

  render() {
    this.rooms = this.createRooms(this.settings)
    this.generate()
    return this.rooms
  }
}
