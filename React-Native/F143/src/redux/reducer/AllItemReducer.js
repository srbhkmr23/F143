import { combineReducers } from 'redux';

const INITIAL_STATE = {
  allItemList: null,
};

const allItemReducer = (state = INITIAL_STATE, action) => {
  console.log('action', action)
  switch (action.type) {
    case 'SET_ALL_ITEM':
     state.allItemList = action.payload;
    //  state = JSON.parse(JSON.stringify(state));
    state = Object.assign({}, state);

     console.log('new state', state)
     return state
     break;
    default:
      return state
  }
};

export default combineReducers({
  allItemList: allItemReducer,
});