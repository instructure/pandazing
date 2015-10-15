import React from 'react';
import Ace from 'react-ace';

require('brace/mode/javascript');
require('brace/theme/chrome');

export default class Editor extends React.Component {
  render() {
    return (
      <div>
        <input type='text'
          onChange={this.props.onRename}
          value={this.props.program.name} />
        <Ace
          mode="javascript"
          theme="chrome"
          height="15em"
          value={this.props.program.source}
          onChange={this.props.onChange}
          tabSize={2}
          editorProps={{$blockScrolling: true}} />
      </div>
    );
  }
}
