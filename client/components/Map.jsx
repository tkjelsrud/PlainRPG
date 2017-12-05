import React, { Component } from 'react'

import {
} from '.'

const CONFIGS = {
  MAZE: {
    MAP_SIZE: [160, 160],
    PADDING: 4,

    ROOM_SIZE: 27,
    SPACING: -2,
    WALL_THICKNESS: 2,
    DOOR_INSET: 6,
  },
  ROOMS: {
    MAP_SIZE: [160, 160],
    PADDING: 4,

    ROOM_SIZE: 22,
    SPACING: 4,
    WALL_THICKNESS: 2,
    DOOR_INSET: 8,
  },
}

const RATIO = window.devicePixelRatio

export default class Map extends Component {
  static propTypes = {
    map: React.PropTypes.object,
    myRoom: React.PropTypes.number,
  }

  state = {
    mapType: Object.keys(CONFIGS)[0]
  }

  config() {
    return CONFIGS[this.state.mapType]
  }

  roomOffset(pos) {
    const {PADDING, ROOM_SIZE, SPACING} = this.config()
    return {
      top: PADDING + pos[1] * (ROOM_SIZE + SPACING),
      left: PADDING + pos[0] * (ROOM_SIZE + SPACING)
    }
  }

  roomRect(pos, inset = 0) {
    const {ROOM_SIZE} = this.config()
    const {top, left} = this.roomOffset(pos)
    return [
      left + inset,
      top + inset,
      ROOM_SIZE - 2 * inset,
      ROOM_SIZE - 2 * inset
    ]
  }

  roomDoor(pos, dir, inset = 0) {
    const {ROOM_SIZE, DOOR_INSET, SPACING, WALL_THICKNESS} = this.config()
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
    const {ROOM_SIZE, WALL_THICKNESS} = this.config()
    const c = this.refs.canvas
    if (c) {
      const ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.setTransform(RATIO, 0, 0, RATIO, 0, 0)

      // map backing
      this.props.map.rooms.forEach(r => {
        ctx.fillStyle = '#000'

        ctx.beginPath()
        ctx.rect(
          ...this.roomRect(r.pos)
        )
        ctx.fill()

        Object.keys(r.exits).forEach(e => {
          // as long as everything's connected both ways in a grid, we can skip north and west, and only draw south and east
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

  changeMapType(mapType) {
    this.setState({mapType})
  }

  render() {
    this.drawMap()

    const {MAP_SIZE} = this.config()
    const [w, h] = MAP_SIZE

    return (
      <div>
        <canvas ref="canvas" width={w * RATIO} height={h * RATIO} style={{width: w, height: h, backgroundColor: '#dadada'}}/>
        <select style={{border: '1px solid #999', marginTop: 4}} onChange={evt => this.changeMapType(evt.target.value)}>
          {Object.keys(CONFIGS).map(t => (
            <option key={t} value={t}>{t.toLowerCase()}</option>
          ))}
        </select>
      </div>
    )
  }
}
