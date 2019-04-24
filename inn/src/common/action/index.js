import moment from 'moment';
import innovecsysApiService from '../core/api';
import {
  createEventDirectory,
  addPhoto,
  deleteEventImage
} from '../core/aws-s3';

/** action types **/
export const Set_Profile_Data = 'Set_Profile_Data';
export const USER_LOGOUT = 'USER_LOGOUT';
export const GET_ALL_EVENTS = 'GET_ALL_EVENTS';
export const EVENT_EDIT = 'EVENT_EDIT';
export const USER_LOGIN = 'USER_LOGIN';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const ADD_NEW_EVENT = 'ADD_NEW_EVENT';
export const ACTIVE_EVENT = 'ACTIVE_EVENT';
export const GET_ALL_SPEAKERS = 'GET_ALL_SPEAKERS';
export const GET_ALL_USERS = 'GET_ALL_USERS';
export const GET_ALL_SPONSORS = 'GET_ALL_SPONSORS';
export const SET_ALL_SPONSORS_ACTIVE_EVENT = 'SET_ALL_SPONSORS_ACTIVE_EVENT';
export const SET_ALL_SPEAKERS_ACTIVE_EVENT = 'SET_ALL_SPEAKERS_ACTIVE_EVENT';
export const GET_SPEAKER_LIST_FOR_AGENDA = 'GET_SPEAKER_LIST_FOR_AGENDA';
export const GET_ALL_SPEAKERS_BY_EVENT = 'GET_ALL_SPEAKERS_BY_EVENT';
export const GET_ALL_SPONSORS_BY_EVENT = 'GET_ALL_SPONSORS_BY_EVENT';
export const GET_ALL_AGENDA_BY_EVENT = 'GET_ALL_AGENDA_BY_EVENT';
export const PUBLISH_EVENT = 'PUBLISH_EVENT';
export const USER_SIGNUP = 'USER_SIGNUP';
export const SET_IS_EDIT_EVENT_FLAG = 'SET_IS_EDIT_EVENT_FLAG';
export const GET_PUBLIC_USER_EVENTS = 'GET_PUBLIC_USER_EVENTS';
export const MANAGER_ACCESS = 'MANAGER_ACCESS';
export const ASYNCH_ADD_EVENT_IMAGE_UPLOAD = 'ASYNCH_ADD_EVENT_IMAGE_UPLOAD';
export const GET_ALL_CATEGORY = 'GET_ALL_CATEGORY';
export const FETCH_EVENTS = 'FETCH_EVENTS';
export const DELETE_MEDIA_URL = 'DELETE_MEDIA_URL';
export const MEMBER_EVENT_DETAILS_OBJECT = 'MANAGER_EVENT_DETAILS_OBJECT';
export const MEMBER_EVENT_DETAILS_OBJECT_DATA =
  'MEMBER_EVENT_DETAILS_OBJECT_DATA';
export const NEW_UPLOADED_MEDIA = 'NEW_UPLOADED_MEDIA';
export const NEW_UPLOADED_MEDIA_UPDATE = 'NEW_UPLOADED_MEDIA_UPDATE';
export const APPEND_MEDIA_URL = 'APPEND_MEDIA_URL';
export const GET_DASHBOARD_DATA = 'GET_DASHBOARD_DATA';
export const GET_PROFILE_DATA_BY_ID = 'GET_PROFILE_DATA_BY_ID';
export const UPDATE_PROFILE_DATA_BY_ID = 'UPDATE_PROFILE_DATA_BY_ID';
export const RESET_TOKEN = 'RESET_TOKEN';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const GET_ALL_MANAGERS = 'GET_ALL_MANAGERS';
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const GET_UPCOMING_EVENTS = 'GET_UPCOMING_EVENTS';
export const SHOW_LOADER = 'SHOW_LOADER';
export const HIDE_LOADER = 'HIDE_LOADER';
export const CREATE_DISCOUNT = 'CREATE_DISCOUNT';
export const GET_DISCOUNT = 'GET_DISCOUNT';
export const SEND_ENQUIRY = 'SENT_ENQUIRY';
export const SET_JOIN_EVENT_MEMBERS = 'SET_JOIN_EVENT_MEMBERS';
export const GET_EVENT_AMOUNT_TO_PAY = 'GET_EVENT_AMOUNT_TO_PAY';
export const GET_COMMENTS_BY_EVENT_ID = 'GET_COMMENTS_BY_EVENT_ID';
export const SET_COMMENTS_BY_EVENT_ID = 'SET_COMMENTS_BY_EVENT_ID';
export const SET_LIKE_BY_EVENT_ID = 'SET_LIKE_BY_EVENT_ID';
export const SET_MEMBER_ACTIVE_SUMMARY = 'SET_MEMBER_ACTIVE_SUMMARY';
export const GET_MANAGER_SELECTED_EVENT_DETAILS =
  'GET_MANAGER_SELECTED_EVENT_DETAILS';
export const GET_MEMBER_ALL_EVENTS = 'GET_MEMBER_ALL_EVENTS';
export const GET_NOTIFICATION = 'GET_NOTIFICATION';
export const UPDATE_NOTIFICATION_PAGE_NUMBER =
  'UPDATE_NOTIFICATION_PAGE_NUMBER';
export const SET_NOTIFICATION_CLICKED = 'SET_NOTIFICATION_CLICKED';
export const SET_NOTIFICATION_READ = 'SET_NOTIFICATION_READ';
export const GET_NOTIFICATION_FROM_SOCKET = 'GET_NOTIFICATION_FROM_SOCKET';
export const PAY_AND_SUBSCRIBE_EVENT = 'PAY_AND_SUBSCRIBE_EVENT';
export const CREATE_COUPON = 'CREATE_COUPON';
export const DELETE_COUPON = 'DELETE_COUPON';
export const UPDATE_COUPON = 'UPDATE_COUPON';
export const CREATE_OFFER = 'CREATE_OFFER';
export const DELETE_OFFER = 'DELETE_OFFER';
export const UPDATE_OFFER = 'UPDATE_OFFER';
export const CREATE_GENERAL_DISCOUNT = 'CREATE_GENERAL_DISCOUNT';
export const DELETE_GENERAL_DISCOUNT = 'DELETE_GENERAL_DISCOUNT';
export const UPDATE_GENERAL_DISCOUNT = 'UPDATE_GENERAL_DISCOUNT';
export const CREATE_CATEGORY = 'CREATE_CATEGORY';
export const CHANGE_USER_ACTIVE_STATUS = 'CHANGE_USER_ACTIVE_STATUS';
export const GET_ALL_MEMBER_PLAN = 'GET_ALL_MEMBER_PLAN';
export const EVENT_NOTIFICATION_TO_MEMBERS = 'EVENT_NOTIFICATION_TO_MEMBERS';
export const SET_BUY_EVENT_DETAILS = 'SET_BUY_EVENT_DETAILS';
export const SET_UNSUBSCRIBE = 'SET_UNSUBSCRIBE';

/** action creators **/
export function setProfileData(data) {
  return { type: 'Set_Profile_Data', data };
}

export function showLoader() {
  const request = new Promise(function(resolve, reject) {
    resolve(true);
  });
  return {
    type: SHOW_LOADER,
    payload: request
  };
}

export function hideLoader() {
  const request = new Promise(function(resolve, reject) {
    resolve(false);
  });
  return {
    type: HIDE_LOADER,
    payload: request
  };
}
export function userLogin(userName, password) {
  const request = innovecsysApiService('login', { userName, password });
  return {
    type: USER_LOGIN,
    payload: request
  };
}

export function updateUserInfo(userInfoObj) {
  return {
    type: UPDATE_USER_INFO,
    payload: userInfoObj
  };
}

export function actionUserSignUp(userData) {
  const request = innovecsysApiService('signup', userData);
  return {
    type: USER_SIGNUP,
    payload: request
  };
}

export function getAllEvents(sendObject) {
  const request = innovecsysApiService('getAllEvents', sendObject);

  return {
    type: GET_ALL_EVENTS,
    payload: request
  };
}

export function actionManagerSelectedEventDetails(eventId) {
  const request = innovecsysApiService('managerSelectedEventDetails', {
    eventId
  });

  return {
    type: GET_MANAGER_SELECTED_EVENT_DETAILS,
    payload: request
  };
}

export function getAllSpeakers() {
  const request = innovecsysApiService('getAllSpeakers', {});

  return {
    type: GET_ALL_SPEAKERS,
    payload: request
  };
}

export function getAllUsers() {
  const request = innovecsysApiService('getAllUsers', {});

  return {
    type: GET_ALL_USERS,
    payload: request
  };
}

export function actionGetAllSpeakersByEvent(eventId) {
  const request = innovecsysApiService('getSpeakersOfEvent', { eventId });
  return {
    type: GET_ALL_SPEAKERS_BY_EVENT,
    payload: request
  };
}

export function actionSetAllSpeakersActiveEvent(speakerList) {
  const request = speakerList;

  return {
    type: SET_ALL_SPEAKERS_ACTIVE_EVENT,
    payload: request
  };
}

export function getAllSponsors() {
  const request = innovecsysApiService('getAllSponsors', {});

  return {
    type: GET_ALL_SPONSORS,
    payload: request
  };
}

export function actionGetAllSponsorsByEvent(eventId) {
  const request = innovecsysApiService('getSponsorsOfEvent', { eventId });
  return {
    type: GET_ALL_SPONSORS_BY_EVENT,
    payload: request
  };
}

export function actionSetAllSponsorsActiveEvent(sponsorList) {
  const request = sponsorList;
  return {
    type: SET_ALL_SPONSORS_ACTIVE_EVENT,
    payload: request
  };
}

export function editEvent(eventObj) {
  const request = eventObj;
  return {
    type: EVENT_EDIT,
    payload: request
  };
}

export function actionAddEvent(eventObj) {
  const request = eventObj;

  return {
    type: ADD_NEW_EVENT,
    payload: request
  };
}

export function actionActiveEvent(eventObj) {
  const request = eventObj;

  return {
    type: ACTIVE_EVENT,
    payload: request
  };
}

export function actionGetPublicUserEvents(searchObject) {
  const request = innovecsysApiService('getUserEventsByNode', searchObject);

  return {
    type: GET_PUBLIC_USER_EVENTS,
    payload: request
  };
}

export function fetchEvents(fromDate, toDate, pageNumber, pageSize) {
  const request = innovecsysApiService('fetchEvents', {
    fromDate,
    toDate,
    pageNumber,
    pageSize
  });

  return {
    type: FETCH_EVENTS,
    payload: request
  };
}

export function resetPassword(email) {
  const request = innovecsysApiService('forgotpassword', { email });

  return {
    type: RESET_PASSWORD,
    payload: request
  };
}

export function tokenResetPassword(token) {
  console.log(token);
  const request = innovecsysApiService('tokenResetPassword', { token });
  return {
    type: RESET_TOKEN,
    payload: request
  };
}

export function updatePassword(userObj) {
  const request = innovecsysApiService('updatePassword', userObj);
  return {
    type: UPDATE_PASSWORD,
    payload: request
  };
}

/**
 * To get speakers list by EeventId, store data in agenda reducer
 * @param {String} eventId
 */
export function actionGetSpeakersForAgenda(eventId) {
  const request = innovecsysApiService('getSpeakersOfEvent', { eventId });

  return {
    type: GET_SPEAKER_LIST_FOR_AGENDA,
    payload: request
  };
}
/**
 * To get all agenda list by event-Id
 * @param {String} eventId
 */
export function actionGetAllAgendaOfEvent(eventId) {
  const request = innovecsysApiService('getAllAgendaOfEvent', { eventId });

  return {
    type: GET_ALL_AGENDA_BY_EVENT,
    payload: request
  };
}

export function publishEvent(eventId) {
  const request = innovecsysApiService('publishEvent', { eventId });
  return {
    type: PUBLISH_EVENT,
    payload: request
  };
}

export function actionGetAllCategory() {
  const request = innovecsysApiService('getAllCategory');

  return {
    type: GET_ALL_CATEGORY,
    payload: request
  };
}

/**
 * Set IsEditEvent flag on reducer_event file, this flag using in stepNavBar.js file to manage navigation for update-event or add-event, By default this action set flag to false in case none paramerter passed.
 * @param {*} boolValue
 */
export function setEditEventFlag(boolValue = false) {
  return {
    type: SET_IS_EDIT_EVENT_FLAG,
    payload: boolValue
  };
}

export function actionManagerAccess(access) {
  return {
    type: MANAGER_ACCESS,
    payload: access
  };
}

export function actionMemberEventDetailsObject(eventObJ) {
  return {
    type: MEMBER_EVENT_DETAILS_OBJECT,
    payload: eventObJ
  };
}

export function actionGetMemberAllEvents(memberUserId) {
  const request = innovecsysApiService('memberAllEvents', { memberUserId });

  return {
    type: GET_MEMBER_ALL_EVENTS,
    payload: request
  };
}

export function actionMemberEventDetailsObjectData(dataObject) {
  const request = innovecsysApiService(
    'memberSelectedEventDetails',
    dataObject
  );

  return {
    type: MEMBER_EVENT_DETAILS_OBJECT_DATA,
    payload: request
  };
}

export function actionDashboardData(eventId) {
  const request = innovecsysApiService('getDashboardItems');

  return {
    type: GET_DASHBOARD_DATA,
    payload: request
  };
}

export function actiongGetProfileDataById(userId) {
  const request = innovecsysApiService('getProfileDataById', { userId });

  return {
    type: GET_PROFILE_DATA_BY_ID,
    payload: request
  };
}

export function actiongUpdateProfileDataById(userProfileData) {
  const request = innovecsysApiService('updateProfileById', userProfileData);

  return {
    type: UPDATE_PROFILE_DATA_BY_ID,
    payload: request
  };
}

export function actionGetUpcomingEvents(sendObj) {
  const request = innovecsysApiService('getUpcomingEvents', sendObj);

  return {
    type: GET_UPCOMING_EVENTS,
    payload: request
  };
}

export function actionCreateDiscount(discountData) {
  const request = innovecsysApiService('createDiscount', discountData);

  return {
    type: CREATE_DISCOUNT,
    payload: request
  };
}

export function actionCreateGeneralDiscount(discountrData) {
  const request = innovecsysApiService('createGeneralDiscount', discountrData);

  return {
    type: CREATE_GENERAL_DISCOUNT,
    payload: request
  };
}

export function actionUpdateGeneralDiscount(discountrData) {
  const request = innovecsysApiService('updateGeneralDiscount', discountrData);

  return {
    type: UPDATE_GENERAL_DISCOUNT,
    payload: request
  };
}

export function actionDeleteGeneralDiscount(discountrData) {
  const request = innovecsysApiService('deleteGeneralDiscount', discountrData);

  return {
    type: DELETE_GENERAL_DISCOUNT,
    payload: request
  };
}

export function actionCreateCoupon(couponData) {
  const request = innovecsysApiService('createCoupon', couponData);

  return {
    type: CREATE_COUPON,
    payload: request
  };
}

export function actionUpdateCoupon(couponData) {
  const request = innovecsysApiService('updateCoupon', couponData);

  return {
    type: UPDATE_COUPON,
    payload: request
  };
}

export function actionDeleteCoupon(couponData) {
  const request = innovecsysApiService('deleteCoupon', couponData);

  return {
    type: DELETE_COUPON,
    payload: request
  };
}

export function actionCreateOffer(offerData) {
  const request = innovecsysApiService('createOffer', offerData);

  return {
    type: CREATE_OFFER,
    payload: request
  };
}

export function actionUpdateOffer(offerData) {
  const request = innovecsysApiService('updateOffer', offerData);

  return {
    type: UPDATE_OFFER,
    payload: request
  };
}

export function actionDeleteOffer(offerData) {
  const request = innovecsysApiService('deleteOffer', offerData);

  return {
    type: DELETE_OFFER,
    payload: request
  };
}

export function actionGetDiscount(eventId) {
  const request = innovecsysApiService('getDiscount', { eventId });

  return {
    type: GET_DISCOUNT,
    payload: request
  };
}

export function actionSetJoinEventMembers(members) {
  return {
    type: SET_JOIN_EVENT_MEMBERS,
    payload: members
  };
}

export function actionGetEventAmountToPay(eventMemberDetails) {
  const request = innovecsysApiService('eventAmountToPay', eventMemberDetails);
  return {
    type: GET_EVENT_AMOUNT_TO_PAY,
    payload: request
  };
}

export function actionGetCommentsByEventId(eventId) {
  const request = innovecsysApiService('getCommentsByEventId', { eventId });
  return {
    type: GET_COMMENTS_BY_EVENT_ID,
    payload: request
  };
}

export function actionSetCommentByEventId(commentData) {
  const request = innovecsysApiService('setCommentByEventId', commentData);
  return {
    type: SET_COMMENTS_BY_EVENT_ID,
    payload: request
  };
}

export function actionSetLikeByEventId(likeData) {
  const request = innovecsysApiService('setLikeByEventId', likeData);
  return {
    type: SET_LIKE_BY_EVENT_ID,
    payload: request
  };
}

export function actionSetMemberActiveSummary(agendaDetails) {
  return {
    type: SET_MEMBER_ACTIVE_SUMMARY,
    payload: agendaDetails
  };
}

export function actionCreateCategory(categoryData) {
  const request = innovecsysApiService('createCategory', categoryData);
  return {
    type: CREATE_CATEGORY,
    payload: request
  };
}

export function actionChangeUserActiveStatus(userId) {
  console.log(userId);
  const request = innovecsysApiService('changeUserActiveStatus', { userId });
  return {
    type: CHANGE_USER_ACTIVE_STATUS,
    payload: request
  };
}

export function actionGetAllMemberPlan() {
  const request = innovecsysApiService('getAllMemberPlan');
  return {
    type: GET_ALL_MEMBER_PLAN,
    payload: request
  };
}

export function actionEventNotificationToMembers(eventId) {
  const request = innovecsysApiService('eventNotificationToMembers', {
    eventId
  });
  return {
    type: EVENT_NOTIFICATION_TO_MEMBERS,
    payload: request
  };
}

export function actionSetBuyEventDetails(details) {
  return {
    type: SET_BUY_EVENT_DETAILS,
    payload: details
  };
}

export function actionUnsubscribe(details) {
  const request = innovecsysApiService('unsubscribe', details);
  return {
    type: SET_UNSUBSCRIBE,
    payload: request
  };
}

/**
 * function to upload image on aws server when addEvent next button clicked and component unmounted.
 * @param {*} eventId
 * @param {*} bannerImageReference
 * @param {*} event
 */

export function uploadImageToAwsServer(
  eventId,
  bannerImageReference,
  bannerImageSource,
  fileName,
  event
) {
  const request = new Promise((resolve, reject) => {
    if (bannerImageSource) {
      // if (
      //   bannerImageReference &&
      //   bannerImageReference.name &&
      //   bannerImageReference.files[0]
      // ) {
      const targetElement = bannerImageReference;
      // const value = targetElement.files[0];
      // let _this = this;

      try {
        createEventDirectory(eventId, function(result) {
          if (result.directoryStatus) {
            // let fileName = targetElement.files[0].name;
            let fileNameArray = fileName.split('.');
            fileNameArray[fileNameArray.length - 2] = 'banner';
            fileName = fileNameArray.join('.');
            addPhoto(
              eventId,
              bannerImageReference,
              fileName,
              (error, data) => {
                if (error) {
                  reject(error);
                  return;
                }
                if (data.Location) {
                  const bannerImageAWSURL = data.Location;
                  event.bannerImageURL = bannerImageAWSURL;
                  event.startTimestamp = moment(event.startTimestamp)
                    .utc()
                    .format('YYYY-MM-DD[T]HH:mm:ss.SSS');
                  event.endTimestamp = moment(event.endTimestamp)
                    .utc()
                    .format('YYYY-MM-DD[T]HH:mm:ss.SSS');
                  innovecsysApiService('updateEvent', event);
                  resolve(bannerImageAWSURL);
                }
              },
              () => {}
            );
          } else {
            console.log('directory creation failed');
          }
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  });

  return {
    type: ASYNCH_ADD_EVENT_IMAGE_UPLOAD,
    payload: request
  };
}

/**
 * delete media event asyn.
 * @param {*} data
 */
export function actionDeleteMediaEvent(AWSFileURL, eventId, mediaId) {
  const request = new Promise(function(resolve, reject) {
    try {
      const _bannerUrl = AWSFileURL;
      const AwsAlbumName = eventId;
      let _bannerUrlArray = _bannerUrl.split('/');
      let AwsFileName = _bannerUrlArray[_bannerUrlArray.length - 1];

      deleteEventImage(
        AwsAlbumName,
        AwsAlbumName + '//' + AwsFileName,
        function(error, result) {
          if (error) {
            console.log('delete image callback', error, result);
            reject(error);
          }
          // alert("aws file deleted" + AWSFileURL);
          // Created data object to call API
          resolve(AWSFileURL);
          let data = {
            eventId,
            listOfId: [mediaId]
          };
          innovecsysApiService('deleteEventMedia', data)
            .then(function(result) {
              if (result) {
                console.log('delete image callback', error, result);
                // actionDeleteEventMediaFromReducer(AWSFileURL);
                resolve(AWSFileURL);
              }
              //Function will call action and update reducer eventMediaList
            })
            .catch(function(error) {
              reject(error);
            });
        }
      );
    } catch (error) {
      console.log('delete banner image error');
      reject(error);
    }
  });

  return {
    type: DELETE_MEDIA_URL,
    payload: request
  };
}

export function actionDeleteEventMediaFromReducer(AWSFileURL) {
  const request = new Promise(function(resolve, reject) {
    resolve(AWSFileURL);
  });
  return {
    type: DELETE_MEDIA_URL,
    payload: request
  };
}

export function actionNewUploadedMedia(newFileUploadArray) {
  const request = new Promise(function(resolve, reject) {
    resolve(newFileUploadArray);
  });
  return {
    type: NEW_UPLOADED_MEDIA,
    payload: request
  };
}

export function actionNewUploadedMediaUpdate(newFileUploadArray) {
  const request = new Promise(function(resolve, reject) {
    resolve(newFileUploadArray);
  });
  return {
    type: NEW_UPLOADED_MEDIA_UPDATE,
    payload: request
  };
}
export function actionAppendMediaUrl(newMediaObject) {
  const request = new Promise(function(resolve, reject) {
    resolve(newMediaObject);
  });
  return {
    type: APPEND_MEDIA_URL,
    payload: request
  };
}
export function getAllManagers() {
  const request = innovecsysApiService('getAllManagers', {});

  return {
    type: GET_ALL_MANAGERS,
    payload: request
  };
}

export function sendEnquiry(formData) {
  const request = innovecsysApiService('sendEnquiry', formData);

  return {
    type: SEND_ENQUIRY,
    payload: request
  };
}

export function actionGetNotification(
  userId,
  pageNumber,
  pageSize,
  dontUpdatePageNumber
) {
  const request = innovecsysApiService('getNotification', {
    userId,
    pageNumber,
    pageSize
  });
  if (!dontUpdatePageNumber) actionUpdateNotificationPageNumber(pageNumber);
  return {
    type: GET_NOTIFICATION,
    payload: request
  };
}

export function actionUpdateNotificationPageNumber(pageNumber) {
  return {
    type: UPDATE_NOTIFICATION_PAGE_NUMBER,
    payload: pageNumber
  };
}

export function actionSetNotificationsAsClicked(userId, listOfId) {
  const request = innovecsysApiService('setNotificationsAsClicked', {
    userId,
    listOfId
  });

  return {
    type: SET_NOTIFICATION_CLICKED,
    payload: request
  };
}

export function actionSetNotificationsAsRead(userId, notificationId) {
  const request = innovecsysApiService('setNotificationAsRead', {
    userId,
    notificationId
  });

  return {
    type: SET_NOTIFICATION_READ,
    payload: request
  };
}

export function actionGetNotificationFromSocket(notificationData, userId) {
  return {
    type: GET_NOTIFICATION_FROM_SOCKET,
    payload: { notificationData, userId }
  };
}

export function actionPayAndSubscribeEvent(subscribeObj) {
  const request = innovecsysApiService('payAndSubscribeEvent', subscribeObj);

  return {
    type: PAY_AND_SUBSCRIBE_EVENT,
    payload: request
  };
}

export function actionUserLogout() {
  return {
    type: USER_LOGOUT,
    payload: ''
  };
}
