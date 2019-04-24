import { combineReducers } from 'redux';
// import socketIOClient from 'socket.io-client';
// import config from '../core/config';

// import { socket } from '../core/socketIO';
import { Set_Profile_Data, USER_SIGNUP, GET_ALL_CATEGORY } from '../action';
import EventReducer from './reducer_event';
import UserReducer from './reducer_user';
import SpeakerReducer from './reducer_speaker';
import SponsorReducer from './reducer_sponsor';
import AgendaReducer from './reducer_agenda';
import ManagerAccessReducer from './reducer_manager_access';
import UserProfileData from './reducer_profile';
import AdminReducer from './reducer_admin';
import LoaderReducer from './reducer_loader';
import DiscountReducer from './reducer_discount';
import PublicApiReduce from './reducer_public_api';
import MemberReduce from './reducer_member';
import CommentReduce from './reducer_comment';
import NotificationReducer from './reducer_notificaiton';
import CategoryReducer from './reducer_category';

function profileData(state = [], action) {
  switch (action.type) {
    case Set_Profile_Data:
      return action.data;
    default:
      return state;
  }
}

function userSignUp(state = [], action) {
  switch (action.type) {
    case USER_SIGNUP:
      console.log('action', action);
    // return action.data;
    default:
      return state;
  }
}

function userAllCategory(state = [], action) {
  switch (action.type) {
    case GET_ALL_CATEGORY:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.userAllCategory = action.payload.data.resourceData;
      }
      //console.log('state', state);
      return Object.assign({}, state);
    default:
      return state;
  }
}

// let socket = socketIOClient(config.API_URL_Node);

const appReducer = combineReducers({
  state: (state = {}) => state,
  // socket: socket,
  profileData: UserReducer,
  userSignUpInfo: userSignUp,
  userInfo: UserReducer,
  events: EventReducer,
  speakers: SpeakerReducer,
  sponsors: SponsorReducer,
  agenda: AgendaReducer,
  managerAccess: ManagerAccessReducer,
  userAllCategory: userAllCategory,
  userProfileData: UserProfileData,
  admin: AdminReducer,
  loader: LoaderReducer,
  discount: DiscountReducer,
  enquiryResponse: PublicApiReduce,
  member: MemberReduce,
  comment: CommentReduce,
  notification: NotificationReducer,
  newCategory: CategoryReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
