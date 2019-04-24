import {
  GET_MEMBER_ALL_EVENTS,
  SET_JOIN_EVENT_MEMBERS,
  GET_EVENT_AMOUNT_TO_PAY,
  SET_MEMBER_ACTIVE_SUMMARY,
  GET_ALL_MEMBER_PLAN,
  SET_BUY_EVENT_DETAILS,
  SET_UNSUBSCRIBE
} from '../action/index';

const INITIAL_STATE = {
  joinEventMembers: [],
  eventAmountToPAy: {},
  memberActiveSummary: {},
  allEvents: [],
  memberPlans: [],
  buyEventDetails: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_JOIN_EVENT_MEMBERS:
      if (action.payload) {
        state.joinEventMembers = action.payload;
      }
      return state;
    case GET_EVENT_AMOUNT_TO_PAY:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.eventAmountToPAy = action.payload.data.resourceData;
      }
      return state;

    case SET_MEMBER_ACTIVE_SUMMARY:
      if (action.payload) {
        state.memberActiveSummary = action.payload || {};
      }
      return state;

    case GET_MEMBER_ALL_EVENTS:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.allEvents = action.payload.data.resourceData || {};
      }
      return state;

    case GET_ALL_MEMBER_PLAN:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.memberPlans = action.payload.data.resourceData || [];
      }
      return state;
    case SET_BUY_EVENT_DETAILS:
      if (action.payload) {
        state.buyEventDetails = action.payload || {};
      }
      return state;
    case SET_UNSUBSCRIBE:
      return state;
    default:
      return state;
  }
}
