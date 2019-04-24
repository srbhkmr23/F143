import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Transition from 'react-transition-group/Transition';
import { ErrorToaster, SuccessToaster } from '../toaster/index';
import * as Cookie from 'es-cookie';
import moment from 'moment';
import Config from '../../common/core/config';
// import stripe  from 'stripe';
// import stripe from 'https://js.stripe.com/v3/';

const handleApiError = errorMessage => {
  toast.error(<ErrorToaster message={errorMessage} />, {
    position: toast.POSITION.TOP_RIGHT,
    hideProgressBar: true
  });
};

const showSuccessToast = message => {
  toast.success(<SuccessToaster message={message} />, {
    position: toast.POSITION.TOP_RIGHT,
    hideProgressBar: true
  });
};

export const showWarningToast = message => {
  toast.warn(<ErrorToaster message={message} />, {
    position: toast.POSITION.TOP_RIGHT,
    hideProgressBar: true
  });
};

const ZoomInAndOut = ({ children, position, ...props }) => (
  <Transition
    {...props}
    timeout={200}
    onEnter={node => node.classList.add('zoomIn', 'animate')}
    onExit={node => {
      node.classList.remove('zoomIn', 'animate');
      node.classList.add('zoomOut', 'animate');
    }}
  >
    {children}
  </Transition>
);

const setCookie = (key, value) => {
  Cookie.set(key, JSON.stringify(value));
};

const getCookie = key => {
  return Cookie.get(key);
};

const removeCookie = key => {
  Cookie.remove(key);
};

/*const getSpeakerThumbImage = fileUrl => {
  try {
    let _fileUrl = fileUrl;
    // _fileUrl = _fileUrl.replace('innovecsystest', 'innovecsystestresized');
    _fileUrl = _fileUrl.replace('://', ':////');
    _fileUrl = _fileUrl.replace(Config.S3BucketName, Config.S3ResizeBucketName);
    var _fileUrlArray = _fileUrl.split('//');
    _fileUrlArray[_fileUrlArray.length - 2] =
      _fileUrlArray[_fileUrlArray.length - 2] + '/373x233';
    let finalLink = _fileUrlArray.join('/');
    return finalLink;
  } catch (error) {
    return fileUrl;
  }
};

const getSpeakerSmallThumbImage = fileUrl => {
  try {
    let _fileUrl = fileUrl;
    // _fileUrl = _fileUrl.replace('innovecsystest', 'innovecsystestresized');
    _fileUrl = _fileUrl.replace('://', ':////');
    _fileUrl = _fileUrl.replace(Config.S3BucketName, Config.S3ResizeBucketName);
    var _fileUrlArray = _fileUrl.split('//');
    _fileUrlArray[_fileUrlArray.length - 2] =
      _fileUrlArray[_fileUrlArray.length - 2] + '/200x200';
    let finalLink = _fileUrlArray.join('/');
    return finalLink;
  } catch (error) {
    return fileUrl;
  }
};

const getSponsorThumbImage = fileUrl => {
  try {
    let _fileUrl = fileUrl;
    // _fileUrl = _fileUrl.replace('innovecsystest', 'innovecsystestresized');
    _fileUrl = _fileUrl.replace('://', ':////');
    _fileUrl = _fileUrl.replace(Config.S3BucketName, Config.S3ResizeBucketName);
    var _fileUrlArray = _fileUrl.split('//');
    _fileUrlArray[_fileUrlArray.length - 2] =
      _fileUrlArray[_fileUrlArray.length - 2] + '/200x200';
    let finalLink = _fileUrlArray.join('/');
    return finalLink;
  } catch (error) {
    return fileUrl;
  }
};

const getSponsorBigImage = fileUrl => {
  try {
    let _fileUrl = fileUrl;
    // _fileUrl = _fileUrl.replace('innovecsystest', 'innovecsystestresized');
    _fileUrl = _fileUrl.replace('://', ':////');
    _fileUrl = _fileUrl.replace(Config.S3BucketName, Config.S3ResizeBucketName);
    var _fileUrlArray = _fileUrl.split('//');
    _fileUrlArray[_fileUrlArray.length - 2] =
      _fileUrlArray[_fileUrlArray.length - 2] + '/373x233';
    let finalLink = _fileUrlArray.join('/');
    return finalLink;
  } catch (error) {
    return fileUrl;
  }
};*/

export const getImageName = fileUrl => {
  try {
    let _fileUrl = fileUrl;
    var _fileUrlArray = _fileUrl.split('/');
    let imgName = _fileUrlArray[_fileUrlArray.length - 1];
    return imgName;
  } catch (error) {
    return;
  }
};

export const getMomentObjFromIsoDate = input => {
  const _input = input;
  return moment()
    .utc()
    .set({
      year: _input.year,
      month: _input.monthValue - 1,
      date: _input.dayOfMonth,
      hour: _input.hour,
      minute: _input.minute,
      second: _input.second
    });
};

// dec2hex :: Integer -> String
const dec2hex = dec => {
  return ('0' + dec.toString(16)).substr(-2);
};

// generateId :: Integer -> String
export const generateUniqueId = len => {
  let arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
};

export const CreateStripeObject = stripeKey => {
  // console.log("stripe object ", stripe);
  // return Stripe(stripeKey);
};

const displayThumbImage = (fileUrl, albumName, thumbSize) => {
  try {
    let _fileUrl = fileUrl;
    _fileUrl = _fileUrl.replace(Config.S3BucketName, Config.S3ResizeBucketName);
    _fileUrl = _fileUrl.replace(albumName, albumName + thumbSize);
    let finalLink = _fileUrl;
    return finalLink;
  } catch (error) {
    return fileUrl;
  }
};

export {
  handleApiError,
  ZoomInAndOut,
  setCookie,
  getCookie,
  removeCookie,
  showSuccessToast,
  displayThumbImage
};
