const constants = {
  DATA: {
    BLANK: 0,
    SHIP: 1,
    WATER: 2,
    HIT: 3,
    DESTROY: 4
  },
  FILL: {
    BLANK: '',
    WATER: 'water',
    SHIP: 'ship',
    HIT: 'hit',
    DESTROY: 'destroy'
  },
  SHOT: {
    WATER: 'water',
    HIT: 'hit',
    DESTROY: 'ship destroyed'
  }
}

export default constants;