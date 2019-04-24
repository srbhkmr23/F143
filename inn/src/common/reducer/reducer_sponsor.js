import {
  GET_ALL_SPONSORS,
  SET_ALL_SPONSORS_ACTIVE_EVENT,
  GET_ALL_SPONSORS_BY_EVENT
} from '../action/index';

import { getCookie, setCookie } from '../core/common-functions';
const INITIAL_STATE = {
  all: [],
  sponsorListActiveEvent:
    getCookie('sponsorListActiveEvent') == undefined
      ? []
      : JSON.parse(getCookie('sponsorListActiveEvent'))
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ALL_SPONSORS:
      let sponsorArray = [];

      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.all = action.payload.data.resourceData;
      }
      // return { all: sponsorArray };
      return state;

    case SET_ALL_SPONSORS_ACTIVE_EVENT:
      if (action.payload) {
        state.sponsorListActiveEvent = action.payload;
      }
      setCookie(
        'sponsorListActiveEvent',
        Object.assign([], state.sponsorListActiveEvent)
      );
      return state;

    case GET_ALL_SPONSORS_BY_EVENT:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.sponsorsByEvent = action.payload.data.resourceData;
      }
      return state;
    default:
      return state;
  }
}
