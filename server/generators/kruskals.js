import {shuffle} from 'lodash'

import MapGenerator from './mapGenerator'

import {
  DIR_S, DIR_E,
} from './utils'

export default class Kruskals extends MapGenerator {
  findSection(room) {
    return this.sections.find(s => s.includes(room))
  }

  joinSections(section1, section2) {
    this.sections = [
      ...this.sections.filter(s => s !== section1 && s !== section2),
      [...section1, ...section2]
    ]
  }

  generate() {
    const walls = []
    this.rooms.forEach(r => {
      const east = this.findRoomAt(r.x + 1, r.y)
      if (east) walls.push({x: r.x, y: r.y, dir: DIR_E})
      const south = this.findRoomAt(r.x, r.y + 1)
      if (south) walls.push({x: r.x, y: r.y, dir: DIR_S})
    })
    this.sections = this.rooms.map(r => [r])

    shuffle(walls).forEach(w => {
      const r1 = this.findRoomAt(w.x, w.y)
      const delta = this.getDelta(w.dir)
      const r2 = this.findRoomAt(w.x + delta.x, w.y + delta.y)
      const section1 = this.findSection(r1)
      const section2 = this.findSection(r2)
      const differentSections = section1 !== section2
      if (differentSections || Math.random() < this.settings.loopChance) {
        this.connectRooms(r1, r2)
        if (differentSections) {
          this.joinSections(section1, section2)
        }
      }
    })
  }
}
