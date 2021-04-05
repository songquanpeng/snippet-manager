import React, { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TopBar from './TopBar';
import TagList from './TagList';
import SnippetList from './SnippetList';
import Snippet from './Snippet';
import { style } from '../utils/constant';
import useSettingForm from '../hooks/settingForm';
import { Context } from '../store';

import { loadSetting, saveSetting } from '../utils/setting';
import { Api, refreshToken } from '../utils/api';
import Toast from './Toast';
import { toastType } from '../utils/constant';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    padding: theme.spacing(3),
    marginLeft: style.snippetListWidth,
    width: '100%',
    height: '100%',
  },
}));

function Layout() {
  const [state, dispatch] = useContext(Context);
  const [setting, setSetting, handleInputChange] = useSettingForm(
    state.Setting
  );

  useEffect(() => {
    loadSetting(dispatch);
  }, []);

  // After the state is changed, update setting.
  useEffect(() => {
    // TODO: Looks like this useEffect will be called on initialized
    if (state.Setting.username !== '') {
      setSetting(state.Setting);
      Api(state, dispatch);
    }
  }, [state.Setting]);

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <TopBar />
      <TagList />
      <SnippetList />
      <main className={classes.content}>
        <Toolbar />
        <Snippet />
      </main>
      <Dialog
        open={state.SettingDialog}
        onClose={() => {
          dispatch({ type: 'SET_SETTING_DIALOG', payload: false });
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Setting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tips: you can use a localhost server.
          </DialogContentText>
          <TextField
            margin="dense"
            name="username"
            label="Username"
            type="text"
            value={setting.username}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="password"
            label="Password"
            type="password"
            value={setting.password}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="server"
            label="Server Address"
            type="url"
            value={setting.server}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              let [success, message, _] = await refreshToken(
                { Setting: setting },
                dispatch
              );
              let type = toastType.error;
              if (success) {
                message = 'Your setting is okay.';
                type = toastType.success;
              }
              dispatch({
                type: 'SHOW_TOAST',
                payload: {
                  message,
                  type,
                  duration: success ? 3000 : 6000,
                },
              });
            }}
            color="primary"
          >
            Test
          </Button>
          <Button
            onClick={() => {
              saveSetting(setting, dispatch);
              dispatch({
                type: 'SHOW_TOAST',
                payload: {
                  message: 'Your settings have been saved in local storage.',
                  type: toastType.success,
                  duration: 3000,
                },
              });
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Toast />
    </div>
  );
}

export default Layout;
