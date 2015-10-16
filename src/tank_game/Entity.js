var lastId = 0;

export default class Entity {
  constructor(pos) {
    this.x = pos.x;
    this.y = pos.y;
    this.facing = pos.facing || 'north';
    this.alive = true;
    this._id = ++lastId;
  }

  destroy() {
    this.alive = false;
  }

  tick(game, cb) {
    cb();
  }

  damage(weapon) {
    // by default damage does nothing
  }

  static vector(facing) {
    switch(facing) {
      case 'north': return {x: 0, y: -1};
      case 'south': return {x: 0, y: 1};
      case 'east': return {x: 1, y: 0};
      case 'west': return {x: -1, y: 0};
      default: throw `invalid facing: ${facing}`;
    }
  }
}
