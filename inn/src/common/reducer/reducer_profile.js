import {
  GET_PROFILE_DATA_BY_ID,
  UPDATE_PROFILE_DATA_BY_ID,
  CHANGE_USER_ACTIVE_STATUS
} from '../action/index';

import { getCookie, setCookie } from '../core/common-functions';

const INITIAL_STATE = {
  all: [],
  userProfileDataById:
    getCookie('userProfileDataById') == undefined
      ? {}
      : JSON.parse(getCookie('userProfileDataById'))
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_PROFILE_DATA_BY_ID:
      let userProfileData = {};
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.userProfileDataById = action.payload.data.resourceData;
      }
      setCookie(
        'userProfileDataById',
        Object.assign({}, state.userProfileDataById)
      );
      return state;

    case UPDATE_PROFILE_DATA_BY_ID:
      return state;
    case CHANGE_USER_ACTIVE_STATUS:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.all = action.payload.data.resourceData;
      }
      return state;

    default:
      return state;
  }
}
