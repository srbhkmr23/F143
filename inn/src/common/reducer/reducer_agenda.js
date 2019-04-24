import {
  GET_SPEAKER_LIST_FOR_AGENDA,
  GET_ALL_AGENDA_BY_EVENT
} from '../action/index';

const INITIAL_STATE = { agendaList: [], speakerList: [] };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_SPEAKER_LIST_FOR_AGENDA:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.speakerList = action.payload.data.resourceData;
      }
      return state;

    case GET_ALL_AGENDA_BY_EVENT:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.agendaList = action.payload.data.resourceData;
      }
      return state;
    // case EVENT_EDIT:
    //   if (action.payload && action.payload.eventId) {
    //     state.editEvent = action.payload;
    //   }
    //   return state;

    // case ADD_NEW_EVENT:
    //   if (action.payload && action.payload.eventId) {
    //     state.addEvent = action.payload;
    //   }
    //   return state;
    default:
      return state;
  }
}
