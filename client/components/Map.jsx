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

  roomOffset(pos) {
    return {
      top: PADDING + pos[1] * (ROOM_SIZE + SPACING),
      left: PADDING + pos[0] * (ROOM_SIZE + SPACING)
    }
  }

  roomRect(pos, inset = 0) {
    const {top, left} = this.roomOffset(pos)
    return [
      left + inset,
      top + inset,
      ROOM_SIZE - 2 * inset,
      ROOM_SIZE - 2 * inset
    ]
  }

  roomDoor(pos, dir, inset = 0) {
    const {top, left} = this.roomOffset(pos)
    const doorWidth = ROOM_SIZE - 2 * DOOR_INSET - 2 * inset
    const doorDepth = SPACING + 2 * WALL_THICKNESS + 1

    if (dir === 's') {
      const x = left + DOOR_INSET + inset
      const y = top + ROOM_SIZE - WALL_THICKNESS - 1
      return [x, y, doorWidth, doorDepth]
    }

    if (dir === 'e') {
      const x = left + ROOM_SIZE - WALL_THICKNESS - 1
      const y = top + DOOR_INSET + inset
      return [x, y, doorDepth, doorWidth]
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
          // as long as everything's connected both ways in a grid, we can skiip north and west, and only draw south and east
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

    return (
      <div>
        <canvas ref="canvas" width={MAP_SIZE[0]} height={MAP_SIZE[1]} style={{width: 160, height: 160, backgroundColor: '#dadada'}}/>
      </div>
    )
  }
}
