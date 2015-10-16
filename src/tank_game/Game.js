import _ from 'underscore';
import async from 'async';

import Player from './Player';

var map1 = [
'_________WW__WW_________',
'_WWWWW____________WWWWW_',
'_W___W______S_____W___W_',
'_W____________________W_',
'_W___W____________W___W_',
'_WW_WW___WW__WW___WW_WW_',
'_________W____W_________',
'___S________________S___',
'_________W____W_________',
'_________WW__WW_________',
'_WW_WW____________WW_WW_',
'_W___W____________W___W_',
'_W____________________W_',
'_W___W_____S______W___W_',
'_WWWWW____________WWWWW_',
'_________WW__WW_________'];

var map2 = [
'S___S',
'___S_',
'__W__',
'_S___',
'__S__'];

export default class Game {
  constructor() {
    this.entities = [];
    this.reset();
  }

  reset() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.entities.forEach(e => e.destroy());
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

    this.timer = setInterval(this.tick.bind(this), 500);
  }

  spawn(entity) {
    this.entities.push(entity);
    return entity;
  }

  tick() {
    async.eachSeries(this.entities, (e, cb) => {
      e.tick(this, cb);
    }, err => {
      // TODO: err
      if (err)
        console.log(err);
      var [alive, dead] = _.partition(this.entities, e => e.alive);
      this.entities = alive;
      dead.forEach(e => e.destroy());

      var players = this.entities.filter(e => e instanceof Player);
      if (players.length < 2) {
        console.log('winner: ', players[0]);
        clearInterval(this.timer);
      }

      if (this.onupdate) {
        this.onupdate(this);
      }
    });
  }

  abort() {
    clearInterval(this.timer);
  }

  getCell(pos) {
    var cell = (this.map[pos.y] || [])[pos.x];
    if (!cell) {
      cell = { type: 'oob' };
    }
    return cell;
  }

  getEntities(pos) {
    return this.entities.filter(e =>
      e._id !== pos._id && e.x === pos.x && e.y === pos.y);
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
      case '_': return { type: 'empty' };
      case 'W': return { type: 'wall' };
      case 'S': return { type: 'empty', spawn: true };
      // case '1': return { type: 'tank', player: 1, facing: 'east' };
      default: throw `invalid map character: ${cell}`;
    }
  }
}
