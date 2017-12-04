// import roomData from './roomData'
import dungeonGenerator from './generators/dungeonGenerator'

const roomData = dungeonGenerator({
  type: 'randomPrim',
  width: 6,
  height: 6,
  shape: 'box',
})

export function staticRoomData(room) {
  return {...roomData.find(r => r.id === room)}
}

export function serializeMap() {
  return roomData
}
