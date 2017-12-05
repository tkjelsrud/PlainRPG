export default class Map {
  constructor(rooms) {
    this.rooms = rooms
  }

  findConnectedRoom(room, dir) {
    const exit = room.exits[dir]
    if (exit !== undefined) {
      return this.findRoom(exit)
    }
  }

  findRoom(id) {
    return this.rooms.find(r => r.id === id)
  }

  serialize() {
    return {
      rooms: this.rooms
    }
  }
}
