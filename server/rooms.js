import roomData from './roomData'

export function staticRoomData(room) {
  return {...roomData.find(r => r.id === room)}
}

export function serializeMap() {
  return roomData
}
