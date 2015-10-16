import Entity from './Entity';

export default class Bullet extends Entity {
  get sprite() {
    return `bullet-${this.facing}`;
  }

  tick(game, cb) {
    var vector = Entity.vector(this.facing);
    var newPos = {x: this.x + vector.x, y: this.y + vector.y};
    Object.assign(this, newPos);
    this.check(game);
    super.tick(game, cb);
  }

  check(game) {
    if (game.getCell(this).type !== 'empty') {
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
