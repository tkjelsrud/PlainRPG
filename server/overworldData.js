import {DIR_S, DIR_N, DIR_E, DIR_W} from './direction'

export default [
  {
    id: 0,
    name: 'Marketplace',
    pos: [1, 0],
    exits: {
      [DIR_S]: 1,
    },
  },
  {
    id: 1,
    name: 'Town well',
    pos: [1, 1],
    exits: {
      [DIR_N]: 0,
      [DIR_E]: 8,
      [DIR_W]: 6,
      [DIR_S]: 7,
    },
  },
  {
    id: 2,
    name: 'Bakery',
    pos: [3, 1],
    exits: {
      [DIR_W]: 8,
      [DIR_E]: 3,
      [DIR_S]: 5,
    },
  },
  {
    id: 3,
    name: 'Armory',
    pos: [4, 1],
    exits: {
      [DIR_W]: 2,
      [DIR_S]: 4,
    },
  },
  {
    id: 4,
    name: 'Smith',
    pos: [4, 2],
    exits: {
      [DIR_N]: 3,
      [DIR_W]: 5,
      [DIR_E]: 10,
    },
  },
  {
    id: 5,
    name: 'Bank',
    pos: [3, 2],
    exits: {
      [DIR_E]: 4,
      [DIR_N]: 2,
    },
  },
  {
    id: 6,
    name: 'Shrine',
    pos: [0, 1],
    exits: {
      [DIR_E]: 1,
      [DIR_N]: 9,
    },
  },
  {
    id: 7,
    name: 'City Exit',
    pos: [1, 2],
    exits: {
      [DIR_N]: 1,
    },
  },
  {
    id: 8,
    name: 'Market Road',
    pos: [2, 1],
    exits: {
      [DIR_W]: 1,
      [DIR_E]: 2,
    },
  },
  {
    id: 9,
    name: 'Graveyard',
    pos: [0, 0],
    exits: {
      [DIR_S]: 6,
    },
  },
  {
    id: 10,
    name: 'Back Alley',
    pos: [5, 2],
    exits: {
      [DIR_W]: 4,
    },
  },
]
