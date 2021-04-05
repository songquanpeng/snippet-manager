import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/snippets/markdown';
import 'ace-builds/src-noconflict/theme-solarized_light';

import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

import Highlight from 'react-highlight';
import marked from 'marked';
import { Context } from '../store';

import { snippet2draft, draft2snippet } from '../utils/editor';
import { toastType } from '../utils/constant';
import { getSnippet, updateSnippet } from '../utils/api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Snippet() {
  const [state, dispatch] = useContext(Context);
  const [editor, setEditor] = useState({
    theme: 'solarized_light',
    fontSize: 18,
    show: false,
  });
  const [snippet, setSnippet] = useState({
    Language: '',
    Code: '',
    Tags: '',
    Description: '',
    Title: '',
    ID: '',
  });
  const [renderedDescription, setRenderedDescription] = useState('');
  const [draft, setDraft] = useState();

  useEffect(() => {
    loadEditorConfig(editor, setEditor);
  }, []);

  useEffect(() => {
    setRenderedDescription(marked(snippet.Description));
  }, [snippet]);

  useEffect(() => {
    (async () => {
      let [ok, snippet] = await getSnippet(state);
      if (ok) {
        setSnippet(snippet);
      }
    })();
  }, [state.CurrentSnippet]);

  const marginRight = 8;
  const marginBottom = 8;

  const showEditorDialog = () => {
    setEditor({ ...editor, show: true });
    setDraft(snippet2draft(snippet));
  };

  const applyChange = async () => {
    let newSnippet = draft2snippet(draft);
    newSnippet = { ...snippet, ...newSnippet };
    setSnippet(newSnippet);
    if (snippet.Description !== newSnippet.Description) {
      setRenderedDescription(marked(newSnippet.Description));
    }
    let [ok, message] = await updateSnippet(newSnippet);
    toast(
      ok ? 'Snippet has been updated.' : message,
      ok ? toastType.success : toastType.error
    );
  };

  const toast = (message, type) => {
    if (type === undefined) {
      type = toastType.success;
    }
    dispatch({
      type: 'SHOW_TOAST',
      payload: {
        message,
        type,
        duration: type === toastType.error ? 6000 : 2000,
      },
    });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.Code);
      toast('Snippet copied.');
    } catch (e) {
      toast(e, toastType.error);
    }
  };

  const loadEditorConfig = () => {
    let theme = localStorage.getItem('theme');
    if (!theme) {
      theme = editor.theme;
    }
    let fontSize = localStorage.getItem('fontSize');
    fontSize = parseInt(fontSize);
    if (!fontSize) {
      fontSize = editor.fontSize;
    }
    setEditor({
      ...editor,
      theme,
      fontSize,
    });
  };

  const onChange = (newValue) => {
    let draft = newValue;
    localStorage.setItem('editorContent', draft);
    setDraft(draft);
  };

  return (
    <>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            // TODO: delete
          }}
          style={{ marginRight, marginBottom }}
        >
          Delete Snippet
        </Button>
        <Button
          variant="contained"
          style={{ marginRight, marginBottom }}
          onClick={showEditorDialog}
        >
          Edit Snippet
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={copy}
          style={{ marginRight, marginBottom }}
        >
          Copy Code
        </Button>
      </div>
      <Paper style={{ padding: 16 }}>
        <Typography variant="h4" gutterBottom>
          {snippet.Title}
        </Typography>
        <Highlight className={snippet.Language}>{snippet.Code}</Highlight>
        <div
          dangerouslySetInnerHTML={{
            __html: renderedDescription,
          }}
        />
      </Paper>
      <Dialog
        fullScreen
        open={editor.show}
        onClose={() => {
          setEditor({ ...editor, show: false });
        }}
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
              onClick={() => {
                setEditor({ ...editor, show: false });
              }}
              aria-label="close"
            >
              <CloseIcon style={{ fill: '#000' }} />
            </IconButton>
            <IconButton aria-label="save" color="inherit" onClick={applyChange}>
              <SaveIcon style={{ fill: '#000' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <AceEditor
          style={{ width: '100%', height: '100%' }}
          mode={'markdown'}
          theme={editor.theme}
          name={'editor'}
          onChange={onChange}
          value={draft}
          fontSize={editor.fontSize}
          setOptions={{ useWorker: false }}
        />
      </Dialog>
    </>
  );
}
export default Snippet;
