import React from 'react';
import Button from '@material-ui/core/Button';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/snippets/markdown';
import 'ace-builds/src-noconflict/theme-solarized_light';

import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import Slide from '@material-ui/core/Slide';

let snackTimeout = undefined;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Snippet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      theme: 'solarized_light',
      fontSize: 18,
      snippet: {
        language: 'javascript',
        title: '通过 API 来创建元素',
        code:
          "let hiddenTextArea = document.createElement('textarea');\n" +
          'hiddenTextArea.setAttribute("id", "hiddenTextArea");\n' +
          'hiddenTextArea.style.cssText = "display:hidden;";',
        description:
          '利用 API 来创建元素，除此之外还可以通过构建 HTML 文本来创建元素。',
        tag: '浏览器脚本 HTML API',
      },
      draft: '',
      showSnackbar: false,
      showEditor: false,
      snackMessage: 'Hi',
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

  copy = async () => {
    try {
      await navigator.clipboard.writeText(this.state.snippet.code);
      this.message('Snippet copied.');
    } catch (e) {
      this.message(e);
    }
  };

  onChange = (newValue) => {
    let draft = newValue;
    localStorage.setItem('editorContent', draft);
    this.setState({ draft });
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
      <AceEditor
        style={{ width: '100%', height: '100%' }}
        mode={'markdown'}
        theme={this.state.theme}
        name={'editor'}
        onChange={this.onChange}
        value={this.state.draft}
        fontSize={this.state.fontSize}
        setOptions={{ useWorker: false }}
      />
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
          style={{ marginRight, marginBottom }}
          onClick={this.showEditorDialog}
        >
          Edit Snippet
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

  snippet2draft = (snippet) => {
    return `# ${snippet.title}
Tags: ${snippet.tag}

## Code
\`\`\` ${snippet.language}
${snippet.code}
\`\`\`

## Description
${snippet.description}`;
  };

  draft2snippet = (draft) => {
    let lines = draft.split('\n');
    let firstTripleBacktickPos = 0;
    let secondTripleBacktickPos = 0;
    for (let i = 2; i < lines.length; i++) {
      if (lines[i].trim().startsWith('```')) {
        if (firstTripleBacktickPos === 0) {
          firstTripleBacktickPos = i;
        } else {
          secondTripleBacktickPos = i;
          break;
        }
      }
    }
    let descriptionStartPos = 0;
    for (let i = secondTripleBacktickPos + 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        if (lines[i].trim().startsWith('#')) {
          descriptionStartPos = i + 1;
        } else {
          descriptionStartPos = i;
        }
        break;
      }
    }

    return {
      language: lines[firstTripleBacktickPos].substr(3).trim(),
      title: lines[0].substr(1).trim(),
      code: lines
        .slice(firstTripleBacktickPos + 1, secondTripleBacktickPos)
        .join('\n'),
      description: lines.slice(descriptionStartPos).join('\n'),
      tag: lines[1].split(' ').slice(1).join(' '),
    };
  };

  showEditorDialog = () => {
    this.setState({
      draft: this.snippet2draft(this.state.snippet),
      showEditor: true,
    });
  };

  closeEditorDialog = () => {
    this.setState({
      showEditor: false,
    });
  };

  applyChange = async () => {
    this.setState({
      snippet: this.draft2snippet(this.state.draft),
    });
    // TODO: send update request
    this.message('Snippet has been updated.');
  };

  renderEditorDialog() {
    return (
      <Dialog
        fullScreen
        open={this.state.showEditor}
        onClose={this.closeEditorDialog}
        TransitionComponent={Transition}
      >
        <AppBar
          position={'relative'}
          style={{ background: '#fbf1d3', boxShadow: 'none' }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={this.closeEditorDialog}
              aria-label="close"
            >
              <CloseIcon style={{ fill: '#000' }} />
            </IconButton>
            <IconButton
              aria-label="save"
              color="inherit"
              onClick={this.applyChange}
            >
              <SaveIcon style={{ fill: '#000' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        {this.renderEditor()}
      </Dialog>
    );
  }

  render() {
    return (
      <>
        {this.renderTopPanel()}
        <Paper>{this.state.snippet.title}</Paper>
        <Paper>{this.state.snippet.code}</Paper>
        <Paper>{this.state.snippet.description}</Paper>
        {this.renderSnackbar()}
        {this.renderEditorDialog()}
      </>
    );
  }
}

export default Snippet;
