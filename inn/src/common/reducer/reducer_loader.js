import { SHOW_LOADER, HIDE_LOADER } from '../action/index';

let INITIAL_STATE = {
  showLoader: false
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_LOADER:
      // console.log(' in show loader');
      if (action.payload) {
        state.showLoader = true;
      }
      return { ...state };

    case HIDE_LOADER:
      //console.log(' in hide loader');
      if (action.payload || action.payload === false) {
        state.showLoader = false;
      }
      return { ...state };
    default:
      return { ...state };
  }
}
