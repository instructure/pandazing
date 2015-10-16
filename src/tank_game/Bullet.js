import Entity from './Entity';

class Explosion extends Entity {
  get type() {
    return 'explosion';
  }

  tick(game) {
    super.tick(game);
    this.destroy();
  }
}

export default class Bullet extends Entity {
  get type() {
    return `bullet-${this.facing}`;
  }

  tick(game) {
    super.tick(game);
    var vector = Entity.vector(this.facing);
    var newPos = {x: this.x + vector.x, y: this.y + vector.y};
    Object.assign(this, newPos);
    this.check(game);
  }

  check(game) {
    if (game.getCell(this).type !== 'empty') {
      this.destroy();
      return false;
    }
    var hits = game.getEntities(this);
    if (hits.length > 0) {
      hits.forEach(h => h.damage(this));
      game.spawn(new Explosion(this));
      this.destroy();
      return false;
    }
    return true;
  }
}
