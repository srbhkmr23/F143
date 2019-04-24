import { GET_ALL_MANAGERS } from '../action/index';
import { getCookie, setCookie } from '../core/common-functions';
import { stat } from 'fs';

const INITIAL_STATE = {
  all: []
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ALL_MANAGERS:
      if (action.payload && action.payload.data) {
        state.all = action.payload.data.resourceData || [];
      }
      return state;

    default:
      return state;
  }
}
