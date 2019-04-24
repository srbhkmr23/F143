import {
  GET_NOTIFICATION,
  SET_NOTIFICATION_CLICKED,
  SET_NOTIFICATION_READ,
  GET_NOTIFICATION_FROM_SOCKET,
  UPDATE_NOTIFICATION_PAGE_NUMBER
} from '../action/index';

const INITIAL_STATE = {
  all: [],
  pageNumber: 1,
  pageSize: 10
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_NOTIFICATION:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        const newData = action.payload.data.resourceData;
        for (let indexParent = 0; indexParent < newData.length; indexParent++) {
          const elementParent = newData[indexParent];
          let counter = 0;
          for (let index = 0; index < state.all.length; index++) {
            const element = state.all[index];
            if (element.notificationId === elementParent.notificationId) {
              state.all[index] = elementParent;
              counter++;
              break;
            }
          }
          if (counter === 0) state.all.push(elementParent);
        }
        state.all.sort((a, b) => {
          let _a = a.createdTimeStamp || 0;
          let _b = b.createdTimeStamp || 0;
          return _b - _a;
        });
      }
      return Object.assign({}, state);

    case UPDATE_NOTIFICATION_PAGE_NUMBER:
      if (action.payload) {
        state.pageNumber = action.payload;
      }
      return state;

    case SET_NOTIFICATION_CLICKED:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        // state.all = action.payload.data.resourceData;
      }
      return state;

    case SET_NOTIFICATION_READ:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        // state.all = action.payload.data.resourceData;
      }
      return state;

    case GET_NOTIFICATION_FROM_SOCKET:
      console.log('GET Notification from socket', action);

      if (action.payload.notificationData) {
        const elementParent = action.payload.notificationData;
        if (
          action.payload.userId &&
          action.payload.userId === elementParent.userId
        ) {
          console.log(
            ' setting notificaiton in array ++++++++++++++++++++++++++'
          );
          let counter = 0;
          for (let index = 0; index < state.all.length; index++) {
            const element = state.all[index];
            if (element.notificationId === elementParent.notificationId) {
              counter++;
              break;
            }
          }
          if (counter === 0) {
            state.all.unshift(elementParent);
            console.log('new notificaiton list ++++++++++++++++', state.all);
          }
        } else {
        }
      }
      state.all.sort((a, b) => {
        let _a = a.createdTimeStamp || 0;
        let _b = b.createdTimeStamp || 0;
        return _b - _a;
      });
      return Object.assign({}, state);
    // return state;

    default:
      return state;
  }
}
