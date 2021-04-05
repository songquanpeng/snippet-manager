const TagList = (state, action) => {
  console.log('called: ', state, action);
  switch (action.type) {
    case 'SET_TAG_LIST':
      return action.payload;
    default:
      return state;
  }
};

export default TagList;
