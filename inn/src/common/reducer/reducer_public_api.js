import { SEND_ENQUIRY } from '../action';

export default function(state = [], action) {
  switch (action.type) {
    case SEND_ENQUIRY:
      if (action.payload && action.payload.data) {
        state.enquiry = action.payload.data;
      }
      return { ...state };
    default:
      return state;
  }
}
