import {
  GET_ALL_SPEAKERS,
  SET_ALL_SPEAKERS_ACTIVE_EVENT,
  GET_ALL_SPEAKERS_BY_EVENT
} from '../action/index';

import { getCookie, setCookie } from '../core/common-functions';
const INITIAL_STATE = {
  all: [],
  speakerListActiveEvent:
    getCookie('speakerListActiveEvent') == undefined
      ? []
      : JSON.parse(getCookie('speakerListActiveEvent')),
  speakersByEvent: []
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ALL_SPEAKERS:
      let speakerArray = [];
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.all = action.payload.data.resourceData;
      }
      return state;

    case SET_ALL_SPEAKERS_ACTIVE_EVENT:
      if (action.payload) {
        state.speakerListActiveEvent = action.payload;
      }
      setCookie(
        'speakerListActiveEvent',
        Object.assign([], state.speakerListActiveEvent)
      );
      return state;

    case GET_ALL_SPEAKERS_BY_EVENT:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.speakersByEvent = action.payload.data.resourceData;
      }
      return state;
    default:
      return state;
  }
}
