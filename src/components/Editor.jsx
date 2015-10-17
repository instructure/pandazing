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
        <Title>MAKE YOUR PANDA BOT</Title>
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
        <div className={Styles.title_box}>
          <label className={Styles.label}>Bot Name:</label>

          <input type='text'
            onChange={this.rename}
            disabled={disabled}
            className={Styles.input}
            value={program && program.name} />

          <Button disabled={!uid} onClick={this.props.onCreate}>
            [+] New Bot
          </Button>
        </div>
        <div className={Styles.botlist}>
          <div>
            <select size={10}
                    value={program && program.name}
                    onChange={this.props.onSelect}>
              { this.props.userAis.map(ai =>
                <option key={ai.name} value={ai.name}>{ai.name}</option>) }
            </select>
          </div>
          <div className={Styles.actions}>
            <Button disabled={!program} onClick={this.props.onPlay}>Test Bot</Button>
          </div>
        </div>
      </div>
    );
  }
}
