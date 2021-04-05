const SnippetList = (state, action) => {
  switch (action.type) {
    case 'SET_SNIPPET_LIST':
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};

export default SnippetList;
