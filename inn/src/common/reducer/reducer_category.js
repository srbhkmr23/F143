import { CREATE_CATEGORY } from '../action/index';

const INITIAL_STATE = {
  newCategoryList: []
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_CATEGORY:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.newCategoryList = action.payload.data.resourceData;
      }
      return state;
    default:
      return state;
  }
}
