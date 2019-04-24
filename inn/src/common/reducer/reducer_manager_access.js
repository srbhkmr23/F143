import { MANAGER_ACCESS } from '../action/index';
import { getCookie, setCookie } from '../core/common-functions';

// const INITIAL_STATE = getCookie("userInfo")
//   ? JSON.parse(getCookie("userInfo"))
//   : null;

const INITIAL_STATE = getCookie('managerAccess')
  ? JSON.parse(getCookie('managerAccess'))
  : {
      accessCreateEvent: true,
      accessEventSpeakers: false,
      accessEventMedia: false,
      accessEventAgenda: false,
      accessEventSponsors: false,
      accessEventDiscount: false
    };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case MANAGER_ACCESS:
      if (
        action instanceof Object &&
        action.payload.hasOwnProperty('accessCreateEvent') == true
      ) {
        state.accessCreateEvent = action.payload.accessCreateEvent;
      }

      if (
        action instanceof Object &&
        action.payload.hasOwnProperty('accessEventSpeakers') == true
      ) {
        state.accessEventSpeakers = action.payload.accessEventSpeakers;
      }

      if (
        action instanceof Object &&
        action.payload.hasOwnProperty('accessEventMedia') == true
      ) {
        state.accessEventMedia = action.payload.accessEventMedia;
      }

      if (
        action instanceof Object &&
        action.payload.hasOwnProperty('accessEventAgenda') == true
      ) {
        state.accessEventAgenda = action.payload.accessEventAgenda;
      }

      if (
        action instanceof Object &&
        action.payload.hasOwnProperty('accessEventSponsors') == true
      ) {
        state.accessEventSponsors = action.payload.accessEventSponsors;
      }

      if (
        action instanceof Object &&
        action.payload.hasOwnProperty('accessEventDiscount') == true
      ) {
        state.accessEventDiscount = action.payload.accessEventDiscount;
      }

      console.log(state);
      setCookie('managerAccess', state);
      return state;

    default:
      return state;
  }
}
