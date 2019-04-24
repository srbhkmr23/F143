import {
  GET_ALL_EVENTS,
  GET_MANAGER_SELECTED_EVENT_DETAILS,
  ADD_NEW_EVENT,
  EVENT_EDIT,
  ACTIVE_EVENT,
  SET_IS_EDIT_EVENT_FLAG,
  GET_PUBLIC_USER_EVENTS,
  ASYNCH_ADD_EVENT_IMAGE_UPLOAD,
  FETCH_EVENTS,
  DELETE_MEDIA_URL,
  MEMBER_EVENT_DETAILS_OBJECT,
  MEMBER_EVENT_DETAILS_OBJECT_DATA,
  NEW_UPLOADED_MEDIA,
  NEW_UPLOADED_MEDIA_UPDATE,
  APPEND_MEDIA_URL,
  GET_DASHBOARD_DATA,
  GET_UPCOMING_EVENTS,
  PAY_AND_SUBSCRIBE_EVENT,
  EVENT_NOTIFICATION_TO_MEMBERS
} from '../action/index';
import { getCookie, setCookie } from '../core/common-functions';
import { stat } from 'fs';

const INITIAL_STATE = {
  all: [],
  managerSelectedEventDetails: {},
  addEvent: {},
  editEvent: {},
  isEditEvent: false,
  GET_PUBLIC_USER_EVENTS: [],
  eventlist: [],
  activeEvent:
    getCookie('activeEvent') == undefined
      ? {}
      : JSON.parse(getCookie('activeEvent')),
  eventMediaList: [],
  memberEventDetailsObject: {},
  memberEventDetailsObjectData: {},
  newUploadedMedia: [],
  countList: {},
  upcomingEvents: []
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_ALL_EVENTS:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.all = action.payload.data.resourceData;
        //Sort code to eventlist by EventName property alphabetically
        // let tempArray = action.payload.data.resourceData;
        // tempArray.sort(function(a, b) {
        //   const aString = String(a.eventName).toUpperCase();
        //   const bString = String(b.eventName).toUpperCase();
        //   if (aString < bString) return -1;
        //   if (aString > bString) return 1;
        //   return 0;
        // });
        // state.all = tempArray;
        //END Sort code to eventlist by EventName property alphabetically
      }
      return state;

    case GET_MANAGER_SELECTED_EVENT_DETAILS:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.managerSelectedEventDetails = action.payload.data.resourceData;
      }
      return state;

    case EVENT_EDIT:
      if (action.payload && action.payload.eventId) {
        state.editEvent = action.payload;
        state.isEditEvent = true;
      }
      return state;

    case ADD_NEW_EVENT:
      if (action.payload && action.payload.eventId) {
        state.isEditEvent = false;
        state.addEvent = action.payload;
      }
      return state;

    case ACTIVE_EVENT:
      if (action.payload && action.payload.eventId) {
        state.activeEvent = action.payload;
        if (state.activeEvent.mediaResponseList)
          state.eventMediaList = state.activeEvent.mediaResponseList;
        // else state.eventMediaList = [];
      } else {
        state.activeEvent = action.payload;
      }
      setCookie('activeEvent', Object.assign({}, state.activeEvent));
      return state;

    case SET_IS_EDIT_EVENT_FLAG:
      if (action.payload || action.payload === false) {
        state.isEditEvent = action.payload;
      }
      return state;

    case GET_PUBLIC_USER_EVENTS:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.publicUserEvents = action.payload.data.resourceData;
      }
      return state;

    case ASYNCH_ADD_EVENT_IMAGE_UPLOAD:
      return state;

    case FETCH_EVENTS:
      if (action.payload && action.payload.data.resourceData) {
        state.eventlist = action.payload.data.resourceData;
        return state;
      }
      return state;

    case DELETE_MEDIA_URL:
      for (let index = 0; index < state.eventMediaList.length; index++) {
        const element = state.eventMediaList[index];
        if (element.mediaURL === action.payload) {
          state.eventMediaList.splice(index, 1);
          break;
        }
      }
      return state;

    case MEMBER_EVENT_DETAILS_OBJECT:
      if (action.payload && action.payload._id) {
        state.memberEventDetailsObject = action.payload || {};
      }
      return state;

    case MEMBER_EVENT_DETAILS_OBJECT_DATA:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.memberEventDetailsObjectData =
          action.payload.data.resourceData || {};
      }
      return state;

    case NEW_UPLOADED_MEDIA:
      if (action.payload) state.newUploadedMedia = action.payload || [];
      return state;

    case APPEND_MEDIA_URL:
      if (action.payload) {
        if (state.activeEvent && !state.activeEvent.mediaResponseList)
          state.activeEvent.mediaResponseList = [];
        state.activeEvent.mediaResponseList.push(action.payload);
        state.eventMediaList = state.activeEvent.mediaResponseList;
      }
      return state;

    case GET_DASHBOARD_DATA:
      if (action.payload && action.payload.data.resourceData) {
        state.countList = action.payload.data.resourceData;
        return state;
      }
      return state;

    case GET_UPCOMING_EVENTS:
      if (action.payload && action.payload.data.resourceData) {
        state.upcomingEvents = action.payload.data.resourceData;
        return state;
      }
      return state;
    case EVENT_NOTIFICATION_TO_MEMBERS:
      return state;

    case PAY_AND_SUBSCRIBE_EVENT:
    default:
      return state;
  }
}
