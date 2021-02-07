import React from 'react';
import Button from '@material-ui/core/Button';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/snippets/markdown';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/snippets/java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/snippets/python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/snippets/c_cpp';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/snippets/html';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/snippets/sh';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/snippets/typescript';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/snippets/css';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/snippets/sql';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/snippets/golang';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/snippets/csharp';
import 'ace-builds/src-noconflict/theme-solarized_light';

import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import { Input } from '@material-ui/core';

let snackTimeout = undefined;

class Snippet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      theme: 'solarized_light',
      fontSize: 18,
      snippet: {
        language: 'javascript',
        title: '',
        code: '',
        description: '',
      },
      oldSnippet: {
        language: '',
        title: '',
        code: '',
        description: '',
      },
      showSnackbar: false,
      snackMessage: 'Hi',
      readOnly: true,
    };
  }

  async componentDidMount() {
    this.loadEditorConfig();
  }

  delete = async () => {
    // TODO: send delete request
    // TODO: switch page
    this.message('Snippet has been deleted.');
  };

  reset = () => {
    let snippet = this.state.oldSnippet;
    this.setState({ snippet });
    this.message('Snippet has been reset.');
  };

  switchEditState = () => {
    let readOnly = !this.state.readOnly;
    this.setState({ readOnly });
    if (readOnly) {
      this.message('Edit disabled.');
    } else {
      this.message('Edit enabled.');
    }
  };

  submit = async () => {
    // TODO: send update request
    this.message('Snippet has been updated.');
  };

  copy = async () => {
    try {
      await navigator.clipboard.writeText(this.state.snippet.code);
      this.message('Snippet copied.');
    } catch (e) {
      this.message(e);
    }
  };

  onTitleChange = (e) => {
    let snippet = { ...this.state.snippet };
    snippet.title = e.target.value;
    this.setState({ snippet });
  };

  onCodeChange = (newValue) => {
    let snippet = { ...this.state.snippet };
    snippet.code = newValue;
    localStorage.setItem('editorContent', snippet.code);
    this.setState({ snippet });
  };

  loadEditorConfig() {
    let theme = localStorage.getItem('theme');
    if (!theme) {
      theme = this.state.theme;
    }
    let fontSize = localStorage.getItem('fontSize');
    fontSize = parseInt(fontSize);
    if (!fontSize) {
      fontSize = this.state.fontSize;
    }
    this.setState({
      theme,
      fontSize,
    });
  }

  renderEditor() {
    return (
      <>
        <AceEditor
          style={{ width: '100%' }}
          mode={this.state.snippet.language}
          theme={this.state.theme}
          name={'editor'}
          readOnly={this.state.readOnly}
          onChange={this.onCodeChange}
          value={this.state.snippet.code}
          fontSize={this.state.fontSize}
          setOptions={{ useWorker: false }}
        />
      </>
    );
  }

  message(message) {
    this.setState({
      showSnackbar: true,
      snackMessage: message,
    });
    clearTimeout(snackTimeout);
    snackTimeout = setTimeout(() => {
      this.setState({
        showSnackbar: false,
      });
    }, 3000);
  }

  renderSnackbar() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={this.state.showSnackbar}
        message={this.state.snackMessage}
      />
    );
  }

  renderTopPanel() {
    const marginRight = 8;
    const marginBottom = 8;
    return (
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={this.delete}
          style={{ marginRight, marginBottom }}
        >
          Delete Snippet
        </Button>
        <Button
          variant="contained"
          onClick={this.reset}
          style={{ marginRight, marginBottom }}
        >
          Reset Change
        </Button>
        <Button
          variant="contained"
          style={{ marginRight, marginBottom }}
          onClick={this.switchEditState}
        >
          {this.state.readOnly ? 'Enable Edit' : 'Disable Edit'}
        </Button>
        <Button
          variant="contained"
          style={{ marginRight, marginBottom }}
          onClick={this.submit}
        >
          Submit Change
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={this.copy}
          style={{ marginRight, marginBottom }}
        >
          Copy Code
        </Button>
      </div>
    );
  }

  render() {
    return (
      <>
        {this.renderTopPanel()}
        <Input
          id="title"
          placeholder="Input snippet title here."
          style={{ marginBottom: 8 }}
          fullWidth={true}
          value={this.state.snippet.title}
          onChange={this.onTitleChange}
          readOnly={this.state.readOnly}
        />
        {this.renderEditor()}
        <Paper>{this.state.snippet.description}</Paper>
        {this.renderSnackbar()}
      </>
    );
  }
}

export default Snippet;
