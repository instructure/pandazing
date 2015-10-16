import _ from 'underscore';
import async from 'async';

import Player from './Player';

var map1 = [
'WWWWWWWWWWWWWWWWWWWWWWW',
'W____W________________W',
'W____W_S______________W',
'W_S__W___wwwww________W',
'W________wwwww________W',
'W________wwwww________W',
'W________wwwww________W',
'W________wwwww___W__S_W',
'W______________S_W____W',
'W________________W____W',
'WWWWWWWWWWWWWWWWWWWWWWW'];

var map2 = [
'S___S',
'___S_',
'__W__',
'_S___',
'__S__'];

export default class Game {
  constructor() {
    this.tick = this.tick.bind(this);
    this.entities = [];
    this.reset();
  }

  reset() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.entities.forEach(e => e.destroy(this));
    this.entities = [];
    this.map = this.parseMap(map1);
  }

  run(players, cb) {
    this.reset();
    // find the defined starting positions and randomly shuffle the players onto
    // them.
    var starts = _.flatten(this.map).filter(cell => cell.spawn);
    _.shuffle(starts).slice(0, players.length).forEach((start, i) => {
      var player = players[i];
      this.spawn(new Player(i + 1, start, player.source));
    });

    this.tick();
  }

  spawn(entity) {
    this.entities.push(entity);
    return entity;
  }

  tick() {
    if (this.aborted) {
      return;
    }

    async.eachSeries(this.entities, (e, cb) => {
      e.tick(this, cb);
    }, err => {
      // TODO: err
      if (err)
        console.log(err);
      var [alive, dead] = _.partition(this.entities, e => e.alive);
      this.entities = alive;
      dead.forEach(e => e.destroy(this));

      var players = this.entities.filter(e => e instanceof Player);
      if (players.length < 2) {
        console.log(`winner: Player ${players[0].playerId}`);
      } else {
        setTimeout(this.tick, 200);
      }

      if (this.onupdate) {
        this.onupdate(this);
      }
    });
  }

  abort() {
    this.aborted = true;
  }

  getCell(pos) {
    var cell = (this.map[pos.y] || [])[pos.x];
    if (!cell) {
      cell = { type: 'wall' };
    }
    return cell;
  }

  getEntities(pos, type) {
    return this.entities.filter(e =>
      e._id !== pos._id && e.x === pos.x && e.y === pos.y &&
      (!type || e.type === type));
  }

  parseMap(strings) {
    return strings.map((row, y) =>
      Array.prototype.map.call(row, (cell, x) =>
        Object.assign({x, y}, this.parseCell(cell))
    ));
  }

  parseCell(cell) {
    switch(cell)
    {
      case '_': return { type: 'empty', sprite: 'empty' };
      case 'W': return { type: 'wall', sprite: 'wall' };
      case 'w': return { type: 'water', sprite: 'water' };
      case 'S': return { type: 'empty', sprite: 'empty', spawn: true };
      default: throw `invalid map character: ${cell}`;
    }
  }

  static dummyAi() {
    return `
      function takeTurn() {
        doNothing();
      }
      `;
  }

  static aiTemplate() {
    return (
`/* Welcome to Pandazing!
 * The goal of the game is to zap the other players while not getting zapped yourself.
 * To do this, you'll have to write a javascript bot.
 *
 * Each turn, your takeTurn function will be called with the current state
 * of the world. You'll then need to evaluate your options and choose your move.
 */
function takeTurn(map, entities, me) {
  /* map is a two-dimensional array of objects representing the game tiles.
     For instance, a 2x2 map would look like:
       [
         [{ x: 0, y: 0, type: 'empty' }, { x: 1, y: 0, type: 'wall' }],
         [{ x: 0, y: 1, type: 'empty' }, { x: 1, y: 1, type: 'water' }]
       ]

     The easiest way to read the map is to call map.at(x, y), which will
     return the type of tile at that location, or null if out of bounds.
     In this example map.at(1, 0) would return 'wall', while map.at(4, 4)
     would return null.
  */

  /* entities is an array of all the live entities on the board.
     This includes Players, Bolts, and Explosions. Each entity contains
     information about its position on the board, what direction it is facing,
     and what type it is. For instance:
       [{ x: 1, y: 3, type: 'Player', playerId: 1, facing: 'east' },
        { x: 3, y: 7, type: 'Bolt', facing: 'north' }]

     You can get a list of all entities at a map location by calling
     entities.at(x, y). So entities.at(3, 7) would return
       [{ x: 3, y: 7, type: 'Bolt', facing: 'north' }]
   */

   /* The 3rd parameter, me, is another copy of the entity representing your
      own player. For instance it might be:
        { x: 1, y: 3, type: 'Player', playerId: 2, facing: 'south' }
    */

   /* The only way to influence the game is through actions. You can take
      one action per turn. The available actions are:
        turnRight()   // turn 90 degrees right, e.g. east to south
        turnLeft()    // turn 90 degrees left, e.g. north to west
        moveForward() // move one square forward. if something is in the way do nothing
        fire()        // fire a bolt in the direction you are facing
        doNothing()   // do nothing this turn

      Taking multiple actions, or not taking any action within 1 second,
      will disqualify you.

      Be careful! Bolts move twice as fast as players do.

      You can call console.log("any message") to log debug information to
      the web inspector console.
    */

  if (Math.random() > 0.7) {
    turnRight();
  } else if (Math.random() > 0.7) {
    turnLeft();
  } else if (Math.random() > 0.8) {
    fire();
  } else {
    moveForward();
  }
}
`);
  }
}
