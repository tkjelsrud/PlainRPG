const DIR_N = 'n'
const DIR_S = 's'
const DIR_E = 'e'
const DIR_W = 'w'

export default [
  {
    id: 0,
    name: 'Marketplace',
    exits: {
      [DIR_S]: 1,
    },
  },
  {
    id: 1,
    name: 'Town well',
    exits: {
      [DIR_N]: 0,
      [DIR_E]: 2,
    },
  },
  {
    id: 2,
    name: 'Bakery',
    exits: {
      [DIR_W]: 1,
    },
  },
]
