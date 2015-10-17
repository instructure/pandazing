import React from 'react';
import Ace from 'react-ace';

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
    const { program } = this.props;
    const disabled = !program;

    return (
      <div>
        <div className={Styles.title_box}>
        <label className={Styles.label}>Bot Name:</label>

        <input type='text'
          onChange={this.rename}
          disabled={disabled}
          className={Styles.input}
          value={program && program.name} />
        </div>
        <Ace
          mode="javascript"
          theme="tomorrow_night_bright"
          height="25em"
          width="60em"
          readOnly={disabled}
          value={program && program.source}
          onChange={this.props.onChange}
          tabSize={2}
          editorProps={{$blockScrolling: Infinity}} />

      </div>
    );
  }
}
