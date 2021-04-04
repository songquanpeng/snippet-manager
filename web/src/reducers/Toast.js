const Toast = (state, action) => {
  switch (action.type) {
    case 'SHOW_TOAST':
      return {
        ...state,
        ...action.payload,
        open: true,
      };
    case 'CLOSE_TOAST':
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
};

export default Toast;
