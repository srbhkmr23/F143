import {
  GET_COMMENTS_BY_EVENT_ID,
  SET_COMMENTS_BY_EVENT_ID,
  SET_LIKE_BY_EVENT_ID
} from '../action/index';

const INITIAL_STATE = {
  allComments: []
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_COMMENTS_BY_EVENT_ID:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.allComments = action.payload.data.resourceData;
      }
      return state;

    case SET_COMMENTS_BY_EVENT_ID:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        console.log('Comment created successfully');
      }
      return state;

    case SET_LIKE_BY_EVENT_ID:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        console.log(
          'like created successfully',
          action.payload.data.resourceData
        );
      }
      return state;

    default:
      return state;
  }
}
