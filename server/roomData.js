const DIR_N = 'n'
const DIR_S = 's'
const DIR_E = 'e'
const DIR_W = 'w'

export default [
  {
    id: 0,
    name: 'Marketplace',
    exits: [
      {dir: DIR_S, room: 1},
    ],
  },
  {
    id: 1,
    name: 'Town well',
    exits: [
      {dir: DIR_N, room: 0},
      {dir: DIR_E, room: 2},
    ],
  },
  {
    id: 2,
    name: 'Bakery',
    exits: [
      {dir: DIR_W, room: 1},
    ],
  },
]
