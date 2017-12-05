import {shuffle} from 'lodash'

import MapGenerator from './mapGenerator'

import {
  DIR_S, DIR_N, DIR_E, DIR_W,
} from '../direction'

export default class DepthFirst extends MapGenerator {
  dig(room, visited) {
    if (!visited[room.id]) {
      visited[room.id] = true
      const directions = shuffle([DIR_S, DIR_N, DIR_E, DIR_W])
      directions.forEach(d => {
        const dirDelta = this.getDelta(d)
        const target = this.findRoomAt(room.x + dirDelta.x, room.y + dirDelta.y)
        if (target && !visited[target.id]) {
          this.connectRooms(room, target)
          this.dig(target, visited)
        }
      })
    }
  }

  generate() {
    this.dig(this.randomRoom(), {})
  }
}
