import Entity from './Entity';

export default class Bolt extends Entity {
  constructor(pos, player) {
    super(pos);
    this.playerId = player.playerId;
  }

  get sprite() {
    return `bolt-${this.facing}`;
  }

  tick(game, cb) {
    var vector = Entity.vector(this.facing);
    var newPos = {x: this.x + vector.x, y: this.y + vector.y};
    Object.assign(this, newPos);
    this.check(game);
    super.tick(game, cb);
  }

  serialize() {
    return Object.assign(super.serialize(), {
      playerId: this.playerId
    });
  }

  check(game) {
    if (game.getCell(this).type === 'wall') {
      this.destroy(game);
      return false;
    }
    var hits = game.getEntities(this);
    if (hits.length > 0) {
      hits.forEach(h => h.damage(game, this));
      this.destroy(game);
      return false;
    }
    return true;
  }
}
