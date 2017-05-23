import * as types from '../actions/ActionType';

const search = (state = [], action = {}) => {
  switch (action.type) {
  case types.SEARCH_RESULTS:
    return action.documentSearchResult;
  default: return state;
  }
};

export default search;
