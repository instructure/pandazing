import React from 'react';
import Ace from 'react-ace';

import Title from './Title.jsx';
import Button from './Button.jsx';

import Styles from './Editor.css';

require('brace/mode/javascript');
require('brace/theme/tomorrow_night_bright');

export default class Editor extends React.Component {
  constructor() {
    super();
    this.rename = this.rename.bind(this);
  }

  rename(event) {
    this.props.onRename(event.target.value);
  }

  render() {
    const { program, uid } = this.props;
    const disabled = !program;

    return (
      <div className={Styles.root}>
        <div className={Styles.main}>
          <div className={Styles.header}>
            <Title>MAKE YOUR PANDA BOT</Title>
            <div className={Styles.botName}>
              <label className={Styles.label}>Bot Name:</label>
              <input type='text'
                onChange={this.rename}
                disabled={disabled}
                className={Styles.input}
                value={program && program.name} />
            </div>
          </div>
          <Ace
            mode="javascript"
            theme="tomorrow_night_bright"
            height="22em"
            width="60em"
            readOnly={disabled}
            value={program && program.source}
            onChange={this.props.onChange}
            tabSize={2}
            editorProps={{$blockScrolling: Infinity}} />
        </div>
        <div className={Styles.actions}>
          <Button onClick={this.props.onPlay}>Test</Button>
          <Button onClick={this.props.onReturn}>Go Back</Button>
        </div>
      </div>
    );
  }
}
