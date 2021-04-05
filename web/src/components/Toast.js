import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Context } from '../store';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Toast() {
  const [state, dispatch] = useContext(Context);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch({ type: 'CLOSE_TOAST', payload: {} });
  };

  return (
    <Snackbar
      open={state.Toast.open}
      autoHideDuration={state.Toast.duration}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={state.Toast.type}>
        {state.Toast.message}
      </Alert>
    </Snackbar>
  );
}
