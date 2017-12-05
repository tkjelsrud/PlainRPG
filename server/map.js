export default class Map {
  constructor({id, name, rooms}) {
    this.id = id
    this.name = name
    this.rooms = rooms
    this.entrance = this.rooms[0]
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
