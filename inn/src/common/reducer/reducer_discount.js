import {
  CREATE_DISCOUNT,
  GET_DISCOUNT,
  CREATE_COUPON,
  DELETE_COUPON,
  UPDATE_COUPON,
  CREATE_OFFER,
  DELETE_OFFER,
  UPDATE_OFFER,
  CREATE_GENERAL_DISCOUNT,
  DELETE_GENERAL_DISCOUNT,
  UPDATE_GENERAL_DISCOUNT
} from '../action/index';

const INITIAL_STATE = {
  discountData: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_DISCOUNT:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        console.log('Discount Create successfully.');
      }
      return state;
    case CREATE_GENERAL_DISCOUNT:
      if (action.payload && action.payload.data) {
        console.log('discount Create successfully.');
      }
      return state;
    case UPDATE_GENERAL_DISCOUNT:
      if (action.payload && action.payload.data) {
        console.log('discount updated successfully.');
      }
      return state;
    case DELETE_GENERAL_DISCOUNT:
      if (action.payload && action.payload.data) {
        console.log('discount deleted successfully.');
      }
      return state;
    case CREATE_COUPON:
      if (action.payload && action.payload.data) {
        console.log('coupon Create successfully.');
      }
      return state;
    case UPDATE_COUPON:
      if (action.payload && action.payload.data) {
        console.log('coupon updated successfully.');
      }
      return state;
    case DELETE_COUPON:
      if (action.payload && action.payload.data) {
        console.log('coupon deleted successfully.');
      }
      return state;

    case CREATE_OFFER:
      if (action.payload && action.payload.data) {
        console.log('offer Create successfully.');
      }
      return state;
    case UPDATE_OFFER:
      if (action.payload && action.payload.data) {
        console.log('offer updated successfully.');
      }
      return state;
    case DELETE_OFFER:
      if (action.payload && action.payload.data) {
        console.log('offer deleted successfully.');
      }
      return state;

    case GET_DISCOUNT:
      if (
        action.payload &&
        action.payload.data &&
        action.payload.data.resourceData
      ) {
        state.discountData = action.payload.data.resourceData;
      }
      return state;

    default:
      return state;
  }
}
