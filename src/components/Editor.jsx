import React from 'react';
import Ace from 'react-ace';

require('brace/mode/javascript');
require('brace/theme/chrome');

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
        <input type='text'
          onChange={this.rename}
          disabled={disabled}
          value={program && program.name} />
        <Ace
          mode="javascript"
          theme="chrome"
          height="15em"
          readOnly={disabled}
          value={program && program.source}
          onChange={this.props.onChange}
          tabSize={2}
          editorProps={{$blockScrolling: true}} />
      </div>
    );
  }
}
