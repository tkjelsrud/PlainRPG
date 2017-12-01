import React, { Component } from 'react'

import {
} from '.'

const MAP_SIZE = [160, 160]
const ROOM_SIZE = 24
const SPACING = 2
const PADDING = 4
const WALL_THICKNESS = 3
const DOOR_INSET = 6

export default class Map extends Component {
  static propTypes = {
    map: React.PropTypes.object,
    myRoom: React.PropTypes.number,
  }

  roomRect(pos, inset = 0) {
    return [
      PADDING + pos[0] * (ROOM_SIZE + SPACING) + inset,
      PADDING + pos[1] * (ROOM_SIZE + SPACING) + inset,
      ROOM_SIZE - 1 - 2 * inset,
      ROOM_SIZE - 1 - 2 * inset
    ]
  }

  roomDoor(pos, dir, inset = 0) {
    if (dir === 's') {
      const x = PADDING + pos[0] * (ROOM_SIZE + SPACING) + DOOR_INSET + inset
      const y = PADDING + pos[1] * (ROOM_SIZE + SPACING) + ROOM_SIZE - 1 - WALL_THICKNESS
      const w = ROOM_SIZE - 1 - 2 * DOOR_INSET - 2 * inset
      const h = SPACING + 1 + 2 * WALL_THICKNESS

      return [x, y, w, h]
    }

    if (dir === 'e') {
      const x = PADDING + pos[0] * (ROOM_SIZE + SPACING) + ROOM_SIZE - 1 - WALL_THICKNESS
      const y = PADDING + pos[1] * (ROOM_SIZE + SPACING) + DOOR_INSET + inset
      const w = SPACING + 1 + 2 * WALL_THICKNESS
      const h = ROOM_SIZE - 1 - 2 * DOOR_INSET - 2 * inset

      return [x, y, w, h]
    }
  }

  drawMap() {
    const c = this.refs.canvas
    if (c) {
      const ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.width, c.height)

      // map backing
      this.props.map.rooms.forEach(r => {
        ctx.fillStyle = '#000'

        ctx.beginPath()
        ctx.rect(
          ...this.roomRect(r.pos)
        )
        ctx.fill()

        Object.keys(r.exits).forEach(e => {
          if (['n', 'w'].includes(e)) return

          ctx.beginPath()
          ctx.rect(
            ...this.roomDoor(r.pos, e)
          )
          ctx.fill()
        })
      })

      // rooms
      this.props.map.rooms.forEach(r => {
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.rect(
          ...this.roomRect(r.pos, WALL_THICKNESS)
        )
        ctx.fill()

        Object.keys(r.exits).forEach(e => {
          if (['n', 'w'].includes(e)) return

          ctx.beginPath()
          ctx.rect(
            ...this.roomDoor(r.pos, e, WALL_THICKNESS)
          )
          ctx.fill()
        })

        if (r.id === this.props.myRoom) {
          ctx.fillStyle = '#395'
          ctx.beginPath()
          ctx.rect(
            ...this.roomRect(r.pos, Math.floor(ROOM_SIZE / 4))
          )
          ctx.fill()
        }
      })
    }
  }

  render() {
    this.drawMap()

    const backgroundColor = this.props.isSelected ? '#eee' : 'transparent'
    return (
      <div>
        <canvas ref="canvas" width={MAP_SIZE[0]} height={MAP_SIZE[1]} style={{width: 160, height: 160, backgroundColor: '#dadada'}}/>
      </div>
    )
  }
}
