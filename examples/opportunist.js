function takeTurn(map, entities, me) {
  if (facingEnemy(map, entities, me) && canFire(map, entities, me)) {
    fire();
    return;
  }

  if (Math.random() > 0.7) {
    turnRight();
  } else if (Math.random() > 0.7) {
    turnLeft();
  } else {
    moveForward();
  }
}

function includes(arr, item) {
  return arr.filter(function(i) { return i === item; }).length > 0;
}

function canFire(map, entities, me) {
  return entities.filter(function(e) { return e.type === 'Bolt' && e.playerId === me.playerid }).length === 0;
}

function facingEnemy(map, entities, me) {
  var x = me.x;
  var y = me.y;
  function enemyPresent(x, y) {
    return entities.at(x, y, 'Player').length > 0;
  }
  function scan(it) {
    it();
    while (includes(['empty', 'water'], map.at(x, y))) {
      if (enemyPresent(x, y))
        return true;
      it();
    }
  }

  switch (me.facing) {
    case 'north':
      return scan(function() { y -= 1; });
    case 'west':
      return scan(function() { x -= 1; });
    case 'east':
      return scan(function() { x += 1; });
    case 'south':
      return scan(function() { y += 1; });
  }
  return false;
}
