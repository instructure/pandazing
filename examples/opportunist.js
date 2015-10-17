function takeTurn(map, entities, me) {
  if (facingEnemy(map, entities, me) && canFire(map, entities, me)) {
    fire();
    return;
  }

  if (Math.random() > 0.9) {
    turnRight();
  } else if (Math.random() > 0.9) {
    turnLeft();
  } else {
    var fwd = forward(me, me.facing);
    if (map.at(fwd.x, fwd.y) === 'empty') {
      moveForward();
    } else {
      turnLeft();
    }
  }
}

function includes(arr, item) {
  return arr.filter(function(i) { return i === item; }).length > 0;
}

function canFire(map, entities, me) {
  return entities.filter(function(e) { return e.type === 'Bolt' && e.playerId === me.playerId }).length === 0;
}

function forward(pos, facing) {
  var x = pos.x, y = pos.y;
  switch (facing) {
    case 'north':
      return { x: x, y: y - 1 };
    case 'west':
      return { x: x - 1, y: y };
    case 'east':
      return { x: x + 1, y: y };
    case 'south':
      return { x: x, y: y + 1 };
  }
}

function facingEnemy(map, entities, me) {
  function enemyPresent(x, y) {
    return entities.at(x, y, 'Player').length > 0;
  }

  var pos = forward(me, me.facing);
  while (includes(['empty', 'water'], map.at(pos.x, pos.y))) {
    if (enemyPresent(pos.x, pos.y))
      return true;
    pos = forward(pos, me.facing);
  }

  return false;
}
