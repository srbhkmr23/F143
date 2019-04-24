import {
  USER_LOGIN,
  RESET_PASSWORD,
  UPDATE_PASSWORD,
  GET_PROFILE_DATA_BY_ID,
  USER_LOGOUT,
  GET_ALL_USERS,
  UPDATE_USER_INFO
} from '../action/index';
import { getCookie, removeCookie, setCookie } from '../core/common-functions';
import { stat } from 'fs';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

const INITIAL_STATE = getCookie('userInfo')
  ? JSON.parse(getCookie('userInfo'))
  : null;

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_LOGIN:
      if (action.payload && action.payload.data) return action.payload.data;
      return state;

    case UPDATE_USER_INFO:
      if (action.payload) {
        const object = action.payload;
        let _userInfo = getCookie('userInfo')
          ? JSON.parse(getCookie('userInfo'))
          : null;
        for (const key in object) {
          if (object.hasOwnProperty(key)) {
            const element = object[key];
            _userInfo[key] = element;
            state[key] = element;
          }
        }
        setCookie('userInfo', _userInfo);
      }
      return Object.assign({}, state);
    // return state;

    case USER_LOGOUT:
      removeCookie('userInfo');
      state = null;
      return state;

    case RESET_PASSWORD:
    case UPDATE_PASSWORD:
      return state;

    case GET_ALL_USERS:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.all = action.payload.data.resourceData;
      }
      return Object.assign({}, state);
    // return state;

    case GET_PROFILE_DATA_BY_ID:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData &&
        action.payload.data.resourceData.profilePhotoURL
      ) {
        state.profilePhotoURL =
          action.payload.data.resourceData.profilePhotoURL;
      }

      return Object.assign({}, state);
    // return state;

    default:
      return state;
  }
}
