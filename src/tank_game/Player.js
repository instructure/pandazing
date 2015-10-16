import Entity from './Entity';
import Bullet from './Bullet';

var template = `
onmessage = function(msg) {
  takeTurn(msg.data);
}

function moveForward() {
  postMessage({turn: 'moveForward'});
}

function turnRight() {
  postMessage({turn: 'turnRight'});
}
function turnLeft() {
  postMessage({turn: 'turnLeft'});
}

function fire() {
  postMessage({turn: 'fire'});
}

function doNothing() {
  postMessage({turn: 'nothing'});
}

`;

// This isn't totally safe from people messing with things... see the `jailed`
// npm module for a better sandbox using iframes as well as web workers.
class PlayerWorker {
  constructor(code) {
    var blob = new Blob([template, code]);
    this.blobURL = window.URL.createObjectURL(blob);
    this.worker = new Worker(this.blobURL);
  }

  takeTurn(inputState, cb) {
    this.worker.onmessage = function(msg) {
      // TODO: safeguard against:
      // * making more than one move per turn
      // * calling postMessage directly with bad data
      // * better error handling
      var response = msg.data;
      cb(response);
    };

    this.worker.onerror = function(err) {
      throw `got worker error ${err}`;
    };

    this.worker.postMessage(inputState);
  }

  shutdown() {
    window.URL.revokeObjectURL(this.blobURL);
    this.worker.terminate();
  }
}

export default class Player extends Entity {
  constructor(i, startPos, source) {
    super(startPos);
    this.playerId = i;
    this.worker = new PlayerWorker(source);
  }

  tick(game, cb) {
    this.worker.takeTurn(null, turn => {
      this.evaluateMove(game, turn);
      super.tick(game, cb);
    });
  }

  destroy() {
    super.destroy();
    this.worker.shutdown();
  }

  get type() {
    return `tank-${this.playerId}-${this.facing}`;
  }

  damage(weapon) {
    this.destroy();
  }

  evaluateMove(game, turn) {
    if (!turn) {
      // TODO: disqualify?
      return;
    }

    const facings = ['north', 'east', 'south', 'west'];
    var vector = Entity.vector(this.facing);

    switch(turn.turn) {
    case 'moveForward':
      var newPos = {x: this.x + vector.x, y: this.y + vector.y};
      if (game.getCell(newPos).type === 'empty' &&
          game.getEntities(newPos).length === 0) {
        // TODO: disqualify rather than just no-op the move?
        Object.assign(this, newPos);
      }
      break;
    case 'turnRight':
      this.facing = facings[this.realMod(facings.indexOf(this.facing) + 1, facings.length)];
      break;
    case 'turnLeft':
      this.facing = facings[this.realMod(facings.indexOf(this.facing) - 1, facings.length)];
      break;
    case 'fire':
      var bulletPos = {x: this.x + vector.x, y: this.y + vector.y, facing: this.facing};
      var bullet = new Bullet(bulletPos);
      if (bullet.check(game)) {
        game.spawn(bullet);
      }
      break;
    case 'nothing':
      break;
    }
  }

  // yay
  realMod(n, m) {
    return ((n % m) + m) % m;
  }
}
