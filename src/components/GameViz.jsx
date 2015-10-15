import React from 'react';
import Sprite from './Sprite.jsx';

import Styles from './GameViz.css';

export default class GameViz extends React.Component {
  componentDidMount() {
    // HAX
    this.timer = setInterval(this.forceUpdate.bind(this), 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    var styles = {
      height: this.props.game.map.length + 'em',
      width: this.props.game.map[0].length + 'em'
    };
    return (
      <div className={Styles.root} style={styles}>
      {
        this.props.game.map.map((row, y) =>
          row.map((cell, x) =>
            <Sprite key={[x, y]} x={x} y={y} type={cell.type} />
        ))
      }
      {
        this.props.game.entities.map(e =>
          <Sprite key={e._id} x={e.x} y={e.y} type={e.type} />
        )
      }
      </div>
    );
  }
}
