import React, { Component } from 'react';
import { connect } from 'react-redux';
// import DatePicker from 'react-datepicker';

import timezone from 'node-google-timezone';
import timezoneJson from '../../common/core/timezones';

import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import TimezonePicker from 'react-timezone';
import ReactTooltip from 'react-tooltip';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import FileDragAndDrop from 'react-file-drag-and-drop';
import bootbox from 'bootbox';
import { DatePicker } from 'react-md';
import Geosuggest from 'react-geosuggest';
import { Prompt } from 'react-router';

// var timezone = require('node-google-timezone');

// import Dialog from 'material-ui/Dialog';
// import FlatButton from 'material-ui/FlatButton';

import imgFileUpload from '../../img/file-upload-img.png';

import StepNavBar from '../common/stepNavBar';
import innovecsysApiService from '../../common/core/api';
import {
  generateUniqueId,
  showWarningToast,
  showSuccessToast
} from '../../common/core/common-functions';
import {
  addPhoto,
  createEventDirectory,
  deleteEventImage,
  deleteResizedEventImage
} from '../../common/core/aws-s3';
import {
  editEvent,
  actionActiveEvent,
  publishEvent,
  actionGetAllCategory,
  showLoader,
  hideLoader,
  actionCreateCategory
} from '../../common/action/index';

import AlertModal from '../../common/alert-box/alert-modal';
import Config from '../../common/core/config';
import Sprite from '../../img/sprite.svg';

let $ = require('jquery');
var timeZoneOptions = [];
Object.keys(timezoneJson).forEach(function(key) {
  var val = timezoneJson[key];
  timeZoneOptions.push({
    value: val,
    label: key
  });
});

var timestamp = 1402629305;

class UpdateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadFileSize: 5242880,
      eventId: '',
      eventName: '',
      eventNameErrorMessage: '',
      isEventNameValid: false,
      eventNameActive: false,

      startDate: null,
      isStartDateValid: true,
      startDateErrorMessage: '',

      endDate: null,
      isEndDateValid: true,
      endDateErrorMessage: '',

      newCategory: '',
      isNewCategoryValid: false,
      newCategoryErrorMessage: '',
      newCategoryActive: false,

      newSubCategory: '',
      isNewSubCategoryValid: false,
      newSubCategoryErrorMessage: '',
      newSubCategoryActive: false,

      venue: '',
      isVenueValid: false,
      venueErrorMessage: '',
      venueActive: false,

      timeZone: '',
      eventFee: '',
      isEventFeeValid: false,
      eventFeeErrorMessage: '',
      eventFeeActive: false,

      description: '',
      isDescriptionValid: false,
      descriptionErrorMessage: '',
      descriptionActive: false,

      categoryFlag: true,

      sponsorsList: [],
      speakersList: [],
      mediaResponseList: [],
      address: {
        detailedLocation: '',
        city: '',
        state: '',
        country: '',
        latitude: '',
        longitude: ''
      },
      duration: '',
      mediaImageURLs: [], // To store event's media links

      isFormChanged: false,
      fileUploadProgress: 0,
      bannerImageAWSURL: '', //AWS image url will store here, get this url after upload banner on AWS, and send this url in event data
      newBannerImageAWSURL: '', // AWS image url that will replace to exiting AWS url when save event in case of update event
      bannerUploadInProgress: false,
      uploadingImageData: '', //Store banner imanger object that will pass to aws for upload
      bannerImageSource: '', //Store banner image source data to show in image tab
      // uplodedImageUrl: '',
      // uploadedFile: '',
      // fileUploadInProgress: false,
      // uploadingImageData: ''
      showStartDatePicker: false,
      showEndDatePicker: false,

      userAllCategoryList: [],
      catOptions: '',
      subCatOptions: '',
      eventCategory: '',
      isEventCategoryValid: false,
      eventCategoryErrorMessage: '',
      eventCategoryActive: false,
      eventSubCategory: [],
      open: false,
      isEventSubCategoryValid: false,
      eventSubCategoryErrorMessage: '',
      eventSubCategoryActive: false,
      prompt: false,
      deleteIco: true
    };

    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onClickUpdateEvent = this.onClickUpdateEvent.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onEventFeeChange = this.onEventFeeChange.bind(this);
    this.onTimeZoneChange = this.onTimeZoneChange.bind(this);

    this.onControlFocus = this.onControlFocus.bind(this);
    this.validateEventName = this.validateEventName.bind(this);

    this.onLocationFocus = this.onLocationFocus.bind(this);
    this.validateLocation = this.validateLocation.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.setFileUploadProgress = this.setFileUploadProgress.bind(this);

    this.setDropDown = this.setDropDown.bind(this);
    // this.publishEvent = this.publishEvent.bind(this);
    this.deleteBannerImageFromAWS = this.deleteBannerImageFromAWS.bind(this);
    this.removeEventBanner = this.removeEventBanner.bind(this);
    this.validateCategory = this.validateCategory.bind(this);
    this.validateSubCategory = this.validateSubCategory.bind(this);
    this.loadEditData = this.loadEditData.bind(this);
  }

  componentWillMount() {
    if (this.state.timeZone == 'Asia/Calcutta') {
      this.setState({ timeZone: 'Asia/Kolkata' });
    }

    this.props.showLoader();
    this.props.actionGetAllCategory().then(
      res => {
        if (res.payload && res.payload.data && res.payload.data.resourceData) {
          let categoryList = res.payload.data.resourceData || [];
          let catOptions = categoryList.map(function(categoryObj) {
            return {
              value: categoryObj.categoryId,
              label: categoryObj.categoryName
            };
          });

          // added other category option

          catOptions.push({
            value: 'Other',
            label: 'Other'
          });

          this.setState({
            catOptions: catOptions,
            userAllCategoryList: categoryList
          });
        }

        this.props.hideLoader();
        this.loadEditData();
      },
      err => {
        console.log('err', err);
        this.loadEditData();
      }
    );
  }

  componentDidMount() {
    this.setState({
      prompt: false
    });
  }

  setPromptFlag() {
    this.setState({
      prompt: true
    });
  }

  getDateTimeInZoneFormatWithGivenZone = (date, zone) => {
    let newTime = moment.tz(date, zone).format('YYYY-MM-DD');
    // console.log("zone", zone)
    // console.log("zone", zone)
    // console.log("newTime+++++++++++++++++++++++++++++++++++++", newTime)
    return newTime;
  };

  loadEditData() {
    this.state.categoryFlag = false;
    // this.props.actionGetAllCategory().then(
    //   res => {
    //     let categoryList = res.payload.data.resourceData || [];
    //     let catOptions = categoryList.map(function (categoryObj) {
    //       return {
    //         value: categoryObj.categoryId,
    //         label: categoryObj.categoryName
    //       };
    //     });
    //     this.setState({
    //       catOptions: catOptions,
    //       userAllCategoryList: categoryList
    //     });
    //   },
    //   err => {
    //     console.log('err', err);
    //   }
    // );
    // this.setDropDown();

    // Set state values on edit
    if (this.props.location.pathname === '/manager/editEvent') {
      if (
        !this.props.events.editEvent ||
        !this.props.events.editEvent.eventId
      ) {
        this.props.history.push('/manager/eventList');
      }
      const updateEventData = this.props.events.editEvent;

      let updateObj = {};
      updateObj.eventId = updateEventData.eventId;
      updateObj.eventName = updateEventData.eventName;
      try {
        //Creating start date object
        const tempStartTime = updateEventData.startTimestamp;
        updateObj.startDate = new Date(
          this.getDateTimeInZoneFormatWithGivenZone(
            tempStartTime,
            updateEventData.timeZone
          )
        ); //new Date(updateEventData.startTimestamp); //moment(updateEventData.startTimestamp); //moment().utc(tempStartTime).local();

        //Creating end date object
        const tempEndTime = updateEventData.endTimestamp;
        updateObj.endDate = new Date(
          this.getDateTimeInZoneFormatWithGivenZone(
            tempEndTime,
            updateEventData.timeZone
          )
        ); //moment(updateEventData.endTimestamp); //moment().utc(tempEndTime).local();
      } catch (e) {}
      // updateObj.endDate = moment(new Date(Date(updateEventData.endTimestamp)).toISOString());
      updateObj.venue = updateEventData.venue;
      updateObj.timeZone = updateEventData.timeZone;
      updateObj.duration = updateEventData.duration;
      updateObj.eventFee = updateEventData.fees;
      updateObj.description = updateEventData.description;
      updateObj.sponsorsList = updateEventData.sponsorsList
        ? updateEventData.sponsorsList
        : [];
      updateObj.speakersList = updateEventData.speakersList
        ? updateEventData.speakersList
        : [];
      updateObj.address = updateEventData.address
        ? updateEventData.address
        : {
            detailedLocation: '',
            city: '',
            state: '',
            country: '',
            latitude: '',
            longitude: ''
          };

      updateObj.isEventNameValid = true;
      updateObj.isVenueValid = true;
      updateObj.isEventFeeValid = true;
      updateObj.isDescriptionValid = true;

      updateObj.bannerImageSource = updateEventData.bannerImageURL
        ? updateEventData.bannerImageURL
        : '';

      updateObj.bannerImageAWSURL = updateEventData.bannerImageURL
        ? updateEventData.bannerImageURL
        : '';

      updateObj.mediaImageURLs = updateEventData.mediaImageURLs
        ? updateEventData.mediaImageURLs
        : [];
      updateObj.mediaResponseList = updateEventData.mediaResponseList
        ? updateEventData.mediaResponseList
        : [];

      var categoryData = updateEventData.categoryResponse;
      if (categoryData) {
        updateObj.eventCategory = categoryData.categoryId;
        this.categoryChange({ value: updateObj.eventCategory }, 2);
        // setTimeout(
        //   function () {
        //     this.categoryChange({ value: updateObj.eventCategory }, 2);
        //   }.bind(this),
        //   400
        // );

        updateObj.eventSubCategory = categoryData.subCategoryRes.map(subCat => {
          if (subCat.subCategoryId) return subCat.subCategoryId;
        });
        this.subCategoryChange(updateObj.eventSubCategory);
        this.state.categoryFlag = true;
      } else {
        updateObj.eventCategory = updateEventData.categoryId;
        this.categoryChange({ value: updateObj.eventCategory }, 2);
        // setTimeout(
        //   function () {
        //     this.categoryChange({ value: updateObj.eventCategory }, 2);
        //   }.bind(this),
        //   400
        // );

        updateObj.eventSubCategory = updateEventData.subCatIds;
        this.subCategoryChange(updateObj.eventSubCategory);
        this.state.categoryFlag = true;
        /*var subCategories = updateEventData.subCatIds;
        var subCatArray   = [];
        console.log(subCategories);
        if(subCategories) {
          for(let i=0; i<subCategories.length; i++) {
            subCatArray.push(subCategories[i]);
          }
        }
        console.log(subCatArray);*/

        /*updateObj.eventSubCategory = updateEventData.subCatIds.map(function(subCat,index) {
          return subCat[index];
        });
       console.log(updateObj.eventSubCategory);*/
      }

      this.setState(updateObj);
      // this.validateSubCategory(updateObj.eventSubCategory);
    }

    $('.geosuggest__input').attr('maxLength', 200);
    //End set state value on edit
    // this.setDropDown();
  }

  setDropDown() {
    let $ = require('jquery');
    var $container = $('.dropdown-menu-event'),
      $list = $('.dropdown-menu-event ul'),
      listItem = $list.find('li');

    $('.dropdown_joinevent .title').click(function() {
      if ($container.height() > 0) {
        closeMenu(this);
      } else {
        openMenu(this);
      }
    });

    $('.dropdown-menu-event li').click(function() {
      closeMenu(this);
    });

    function closeMenu(el) {
      $(el)
        .closest('.dropdown_joinevent')
        .toggleClass('closed')
        .find('.title')
        .text($(el).text());
      $container.css('height', 0);
      $list.css('top', 0);
    }

    function openMenu(el) {
      $(el)
        .parent()
        .toggleClass('closed');

      $container
        .css({
          height: 150
        })
        .mousemove(function(e) {
          var heightDiff = $list.height() / $container.height(),
            offset = $container.offset(),
            relativeY = e.pageY - offset.top,
            top =
              relativeY * heightDiff > $list.height() - $container.height()
                ? $list.height() - $container.height()
                : relativeY * heightDiff;

          $list.css('top', -top);
        });
    }
  }

  // setDropDown() {
  //   let $ = require('jquery');
  //   var $container = $('.timezone-picker'),
  //     $list = $('.timezone-picker ul'),
  //     listItem = $list.find('button');

  //   console.log('$container', $container);
  //   console.log('$list', $list);

  //   $container.css({}).mousemove(function(e) {
  //     var heightDiff = $list.height() / $container.height(),
  //       offset = $container.offset(),
  //       relativeY = e.pageY - offset.top,
  //       top =
  //         relativeY * heightDiff > $list.height() - $container.height()
  //           ? $list.height() - $container.height()
  //           : relativeY * heightDiff;

  //     $list.css('top', -top);
  //   });
  // }

  setFileUploadProgress(progressValue) {
    this.setState({
      fileUploadProgress: progressValue
    });
  }

  deleteBannerImageFromAWS(AWSFileURL) {
    try {
      const _bannerUrl = AWSFileURL;
      const AwsAlbumName = Config.S3AlbumForBanner;
      let _this = this;
      let _bannerUrlArray = _bannerUrl.split('/');
      let AwsFileName = _bannerUrlArray[_bannerUrlArray.length - 1];

      deleteEventImage(AwsAlbumName, AwsAlbumName + '/' + AwsFileName, function(
        error,
        result
      ) {
        if (error) return console.log('delete image callback', error, result);
        if (_this.state.newBannerImageAWSURL === AwsFileName)
          _this.setState({
            newBannerImageAWSURL: ''
          });
      });
    } catch (err) {
      console.log('delete banner image error');
    }
  }

  removeEventBanner(AWSFileURL) {
    this.setPromptFlag();
    this.setState({
      open: this.state.open,
      bannerImageSource: ''
      //bannerImageURL: '',
      //bannerImageAWSURL: ''
    });
  }

  handleDrop(dataTransfer) {
    this.setState({ deleteIco: false });
    this.setPromptFlag();
    let _this = this;

    if (dataTransfer && dataTransfer.files && dataTransfer.files[0]) {
      if (dataTransfer.files[0].size <= this.state.uploadFileSize) {
        //Code to delete event banner
        if (this.state.newBannerImageAWSURL) {
          this.deleteBannerImageFromAWS(this.state.newBannerImageAWSURL);
        }

        _this.setState({
          bannerUploadInProgress: true,
          fileUploadProgress: 0
        });
        let targetElement = Object.assign({}, dataTransfer);
        targetElement.files = Object.assign([], dataTransfer.files);
        // Read source of file that selected to upload as banner
        let reader = new FileReader();
        reader.addEventListener(
          'load',
          () => {
            this.setState({
              bannerImageSource: reader.result // Assigning source of banner image to show as preview
            });
          },
          false
        );
        reader.readAsDataURL(dataTransfer.files[0]);
        // END Read source of file that selected to upload as banner

        //Uploading banner image on AWS server
        try {
          // const eventId = this.props.events.editEvent.eventId;
          /*createEventDirectory(Config.S3AlbumForBanner, function(result) {
            if (result.directoryStatus) {*/
          // console.log('directory created');
          let fileName = targetElement.files[0].name;
          let fileNameArray = fileName.split('.');
          fileNameArray[fileNameArray.length - 2] =
            _this.props.userInfo.id + '_' + generateUniqueId();
          fileName = fileNameArray.join('.');
          addPhoto(
            Config.S3AlbumForBanner,
            targetElement,
            fileName,
            null,
            (error, data) => {
              // console.log('upload success', error, data);
              _this.setState({
                bannerUploadInProgress: false
              });
              if (error) {
                return;
              }
              if (data.Location) {
                const bannerImageAWSURL = data.Location;
                _this.setState({
                  newBannerImageAWSURL: bannerImageAWSURL,
                  isFormChanged: true,
                  deleteIco: true
                });
              }
            },
            _this.setFileUploadProgress
          );
          /*} else {
              console.log('directory creation failed');
            }
          });*/
        } catch (e) {
          console.log(e.message);
        }
        //END Uploading banner image on AWS server
      } else {
        showWarningToast("Can't upload file more then 5 MB");
      }
    }
  }

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

  onInputChange(event) {
    this.setPromptFlag();
    const name = event.target.name;
    const value = event.target.value;
    let controlErrorMessage = name + 'ErrorMessage';
    this.setState({
      [name]: value,
      [controlErrorMessage]: '',
      isFormChanged: true
    });
  }

  onEventFeeChange(event) {
    const name = event.target.name;
    //const regExp = new RegExp(/^[1-9][0-9]*$/);
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    let value = event.target.value;
    let controlErrorMessage = name + 'ErrorMessage';
    let strValue, dotIndex, includeDot, valueAfterDor;
    if (value === '' || value > 0 || regExp.test(value) === true) {
      strValue = value.toString();
      includeDot = strValue.includes('.');
      if (includeDot === true) {
        dotIndex = strValue.indexOf('.');
        valueAfterDor = strValue.substr(dotIndex + 1);
        if (valueAfterDor.length <= 2) {
          this.setState({
            [name]: value.trim(),
            [controlErrorMessage]: ''
          });
        }
      } else {
        this.setState({
          [name]: value.trim(),
          [controlErrorMessage]: ''
        });
      }
    }
    this.setPromptFlag();
  }

  /*  onTimeZoneChange(timeZone) {
    this.setPromptFlag();
   // console.log('timeZone', timeZone);
    this.setState({
      timeZone: timeZone,
      isFormChanged: true
    });
  }
*/
  onTimeZoneChange(value) {
    if (value) {
      this.setState({
        timeZone: value.value
      });
    } else {
      this.setState({
        timeZone: value
      });
    }
  }

  onControlFocus(e) {
    const name = e.target.name;
    let controlErrorMessage = name + 'ErrorMessage';
    let controlActive = name + 'Active';
    this.setState({
      [controlErrorMessage]: '',
      [controlActive]: true
    });
    //console.log('eventNameActive', this.state.eventNameActive);
    ReactTooltip.hide();
  }

  validateEventName(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Event name is required';
      this.setState({
        isEventNameValid: false,
        eventNameErrorMessage: errMessage,
        eventNameActive: false
      });
      return;
    }

    this.setState({
      isEventNameValid: true,
      eventNameErrorMessage: '',
      eventNameActive: false
    });
    return 1;
  }

  validateNewCategory = value => {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Category name is required';
      this.setState({
        isNewCategoryValid: false,
        newCategoryErrorMessage: errMessage,
        newCategoryActive: false
      });
      return;
    }

    this.setState({
      isNewCategoryValid: true,
      newCategoryErrorMessage: '',
      newCategoryActive: false
    });
    return 1;
  };

  validateNewSubCategory = value => {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Sub Category is required';
      this.setState({
        isNewSubCategoryValid: false,
        newSubCategoryErrorMessage: errMessage,
        newSubCategoryActive: false
      });
      return;
    }

    this.setState({
      isNewSubCategoryValid: true,
      newSubCategoryErrorMessage: '',
      newSubCategoryActive: false
    });
    return 1;
  };

  validateCategory(value) {
    // const value = this.state.eventCategory;
    let errMessage;
    if (!value || !value.toString().trim().length) {
      errMessage = 'Event Category is required';
      this.setState({
        isEventCategoryValid: false,
        eventCategoryErrorMessage: errMessage,
        eventCategoryActive: false
      });
      return 0;
    }

    this.setState({
      isEventCategoryValid: true,
      eventCategoryErrorMessage: '',
      eventCategoryActive: false
    });
    return 1;
  }

  validateSubCategory(value) {
    // console.log('validate sub category', value);
    let errMessage;
    if (!value || !value.length) {
      errMessage = 'Event sub category is required';
      this.setState({
        isEventSubCategoryValid: false,
        eventSubCategoryErrorMessage: errMessage,
        eventSubCategoryActive: false
      });
      return 0;
    }

    this.setState({
      isEventSubCategoryValid: true,
      eventSubCategoryErrorMessage: '',
      eventSubCategoryActive: false
    });
    return 1;
  }

  validateStartDate(value) {
    this.setState({
      isStartDateValid: true,
      startDateActive: false
    });
    return 1;
  }

  validateEndtDate(value) {
    this.setState({
      isEndDateValid: true,
      endDateActive: false
    });
    return 1;
  }

  validateEventFee(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Base Price is required';
      this.setState({
        isEventFeeValid: false,
        eventFeeErrorMessage: errMessage,
        eventFeeActive: false
      });
      return;
    }

    this.setState({
      isEventFeeValid: true,
      eventFeeErrorMessage: '',
      eventFeeActive: false
    });
    return 1;
  }

  validateDescription(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Description is required';
      this.setState({
        isDescriptionValid: false,
        descriptionErrorMessage: errMessage,
        descriptionActive: false
      });
      return;
    }

    this.setState({
      isDescriptionValid: true,
      descriptionErrorMessage: '',
      descriptionActive: false
    });
    return 1;
  }

  onClickUpdateEvent(event) {
    let _this = this;
    const saveAndNavigate = () => {
      if (_this.state.isFormChanged == false) {
        // console.log('Form not modified');
        _this.props.history.push('/manager/speakerList');
        return;
      }

      _this.isFormValid(response => {
        if (response == false) {
          return;
        } else {
          _this.submitForm(event);
        }
      });
    };

    if (this.state.bannerUploadInProgress) {
      bootbox.confirm(
        'Are you sure, cancel banner image uploading and leave the page ?',
        result => {
          if (result === true) {
            saveAndNavigate();
          }
        }
      );
    } else {
      saveAndNavigate();
    }
  }

  isFormValid(callback) {
    // validate event name
    if (!this.state.isEventNameValid) {
      if (this.state.eventNameErrorMessage == '') {
        this.setState(
          {
            eventNameErrorMessage: 'Event name is required'
          },
          () => {
            ReactTooltip.show(this.refs.eventName);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.eventName);
      callback(false);
      return;
    }

    // validate start date

    if (!this.state.isStartDateValid) {
      if (this.state.startDateErrorMessage == '') {
        this.setState(
          {
            startDateErrorMessage: 'Start date is required'
          },
          () => {
            ReactTooltip.show(this.refs.startDate);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.startDate);
      callback(false);
      return;
    }

    // validate end date

    if (!this.state.isEndDateValid) {
      if (this.state.endDateErrorMessage == '') {
        this.setState(
          {
            endDateErrorMessage: 'End date is required'
          },
          () => {
            ReactTooltip.show(this.refs.endDate);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.endDate);
      callback(false);
      return;
    }

    // validate venue
    if (!this.state.isVenueValid) {
      if (this.state.venueErrorMessage == '') {
        this.setState(
          {
            venueErrorMessage: 'Venue is required'
          },
          () => {
            ReactTooltip.show(this.refs.venue);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.venue);
      callback(false);
      return;
    }

    // validate event fee
    if (!this.state.isEventFeeValid) {
      if (this.state.eventFeeErrorMessage == '') {
        this.setState(
          {
            eventFeeErrorMessage: 'Base Price is required'
          },
          () => {
            ReactTooltip.show(this.refs.eventFee);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.eventFee);
      callback(false);
      return;
    }

    // validate description
    if (!this.state.isDescriptionValid) {
      if (this.state.descriptionErrorMessage == '') {
        this.setState(
          {
            descriptionErrorMessage: 'Description is required'
          },
          () => {
            ReactTooltip.show(this.refs.description);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.description);
      callback(false);
      return;
    }

    // validate category
    if (!this.state.isEventCategoryValid) {
      if (this.state.eventCategoryErrorMessage === '') {
        this.setState(
          {
            eventCategoryErrorMessage: 'Event Category is required'
          },
          () => {
            ReactTooltip.show(this.refs.category);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.category);
      callback(false);
      return;
    }
    // this.validateSubCategory();

    // validate Sub category
    if (
      this.state.eventCategory != 'Other' &&
      !this.state.isEventSubCategoryValid
    ) {
      if (this.state.eventSubCategoryErrorMessage === '') {
        this.setState(
          {
            eventSubCategoryErrorMessage: 'Event sub category is required'
          },
          () => {
            ReactTooltip.show(this.refs.subCategory);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.subCategory);
      callback(false);
      return;
    }

    // validate new category
    if (this.state.eventCategory == 'Other' && !this.state.isNewCategoryValid) {
      if (this.state.newCategoryErrorMessage === '') {
        this.setState(
          {
            newCategoryErrorMessage: 'New category is required'
          },
          () => {
            ReactTooltip.show(this.refs.newCategory);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.newCategory);
      callback(false);
      return;
    }

    // validate new sub category

    if (
      this.state.eventCategory == 'Other' &&
      !this.state.isNewSubCategoryValid
    ) {
      if (this.state.newSubCategoryErrorMessage === '') {
        this.setState(
          {
            newSubCategoryErrorMessage: 'New category is required'
          },
          () => {
            ReactTooltip.show(this.refs.newSubCategory);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.newSubCategory);
      callback(false);
      return;
    }

    if (this.state.eventCategory == '') {
      showWarningToast('Category is required');
      callback(false);
      return;
    }

    if (
      this.state.eventCategory != 'Other' &&
      this.state.eventSubCategory == ''
    ) {
      showWarningToast('subCategory is required');
      callback(false);
      return;
    }

    // all fields are valid now return true
    callback(true);
    return;
  }

  submitForm(event) {
    console.log('THIS.STATE************************', this.state);

    let self = this;
    if (this.props.userInfo && this.props.userInfo.id) {
      let createrUserId = this.props.userInfo.id;
      let eventName = this.state.eventName;
      let startTimestamp = this.state.startDate;

      let endTimestamp = this.state.endDate;
      let venue =
        this.state.venue instanceof Object
          ? this.state.venue.description
          : this.state.venue;
      let timeZone = this.state.timeZone;
      let duration = this.state.duration;
      let fees = this.state.eventFee;
      let description = this.state.description;
      let address = this.state.address;
      let bannerImageURL = this.state.newBannerImageAWSURL
        ? this.state.newBannerImageAWSURL
        : this.state.bannerImageAWSURL;
      let mediaImageURLs = this.state.mediaImageURLs;
      let categoryId = this.state.eventCategory;

      // check for subcategoryIds
      let subCatIds = this.state.eventSubCategory.map(subCat => {
        if (subCat) {
          if (typeof subCat === 'object') {
            if (subCat.value) return subCat.value;
          } else {
            return subCat;
          }
        }
      });

      let mediaResponseList = this.state.mediaResponseList;

      //To delete existing image from AWS

      if (this.state.newBannerImageAWSURL) {
        console.log(
          'THIS.STATE****************',
          this.state.newBannerImageAWSURL
        );
        this.deleteBannerImageFromAWS(this.state.bannerImageAWSURL);
      }

      if (
        this.state.bannerImageSource ==
        '' /* &&
        this.state.bannerImageAWSURL == '' &&
        this.state.bannerImageURL == ''*/
      ) {
        console.log('THIS.STATE****************', this.state.bannerImageAWSURL);
        bannerImageURL = '';
        this.deleteBannerImageFromAWS(this.state.bannerImageAWSURL);
      }

      let lati = '';
      let logn = '';

      if (this.state.address) {
        lati = this.state.address.latitude;
        logn = this.state.address.longitude;
      }

      address = {
        detailedLocation:
          this.state.venue instanceof Object
            ? this.state.venue.description
            : this.state.venue,
        city: '',
        state: '',
        country: '',
        latitude:
          this.state.venue instanceof Object
            ? this.state.venue.location.lat.toString()
            : lati,
        longitude:
          this.state.venue instanceof Object
            ? this.state.venue.location.lng.toString()
            : logn
      };

      let sponsorsList = this.state.sponsorsList;
      let speakersList = this.state.speakersList;
      let eventId = this.state.eventId;

      // console.log('startTimestampstartTimestampstartTimestamp', startTimestamp);
      /* console.log(
        this.getDateTimeInZoneFormat(
          moment(startTimestamp).format('YYYY-MM-DD')
        )
      );*/

      let startTimeWithZone = this.getDateTimeInZoneFormat(
        moment(startTimestamp).format('YYYY-MM-DD')
      );
      let endTimeWithZone = this.getDateTimeInZoneFormat(
        moment(endTimestamp).format('YYYY-MM-DD')
      );

      let addNewEvent = {
        eventId,
        createrUserId,
        eventName,
        startTimestamp: startTimeWithZone, //moment(startTimestamp).format('YYYY-MM-DD[T]HH:mm:ss.SSS'), //startTimestamp.utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        endTimestamp: endTimeWithZone, //moment(endTimestamp).format('YYYY-MM-DD[T]HH:mm:ss.SSS'), //endTimestamp.utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        venue,
        timeZone,
        duration,
        fees,
        description,
        address,
        sponsorsList,
        speakersList,
        bannerImageURL,
        mediaImageURLs,
        categoryId,
        subCatIds,
        mediaResponseList
      };
      //   console.log('update event', addNewEvent);

      if (this.state.eventCategory == 'Other') {
        this.createNewCategory(addNewEvent, self);
      } else {
        this.apiRequest(addNewEvent, self);
      }
    } else {
      console.log('user id not found');
    }
  }

  apiRequest = (addNewEvent, self) => {
    this.props.showLoader();
    innovecsysApiService('updateEvent', addNewEvent).then(result => {
      if (result.data && result.data.status && result.data.status === 200) {
        try {
          addNewEvent['published'] = this.props.events.activeEvent.published;
        } catch (err) {
          console.log(err);
        }

        self.props.editEvent(addNewEvent);
        self.props.actionActiveEvent(Object.assign({}, addNewEvent));
        self.setState(
          {
            prompt: false //Disable prompt and navigate to user
          },
          () => self.navigateToUrlPage('/manager/speakerList')
        );
      }
      //  console.log('add event result', result);
      self.props.hideLoader();
    });
  };

  createNewCategory = (addNewEvent, self) => {
    let newCategory = this.state.newCategory;
    let newSubCategory = this.state.newSubCategory;

    // console.log('newCategory', newCategory);
    //console.log('newSubCategory', newSubCategory);

    let newSubCategoryList = newSubCategory.split(',') || [];

    //console.log('newSubCategoryList', newSubCategoryList);

    let sendObject = {};
    let createrUserId = this.props.userInfo.id;

    sendObject['creatorUserId'] = createrUserId;
    sendObject['listOfCategory'] = [];

    let categoryObj = {};
    categoryObj['categoryName'] = newCategory || '';
    categoryObj['subCategoryRequests'] = [];
    newSubCategoryList.map(subCatName => {
      let subCat = {};
      subCat['subCategoryName'] = subCatName.toString().trim() || '';
      categoryObj['subCategoryRequests'].push(subCat);
    });

    sendObject['listOfCategory'].push(categoryObj);

    // console.log('sendObject', sendObject);
    this.props.actionCreateCategory(sendObject).then(res => {
      // console.log('res', res);
      if (
        res.payload &&
        res.payload.data &&
        res.payload.data.status == 200 &&
        res.payload.data.resourceData
      ) {
        let newCategoryList = res.payload.data.resourceData || [];
        let newCategoryId = newCategoryList[0].id;
        let newSubCategoryList = [];

        newCategoryList.map(categoryObj => {
          categoryObj.listOfSubcategory.map(subCatObj => {
            newSubCategoryList.push(subCatObj.id);
          });
        });

        addNewEvent['categoryId'] = newCategoryId;
        addNewEvent['subCatIds'] = newSubCategoryList;

        this.apiRequest(addNewEvent, self);
      }
    });
  };

  getDateTimeInZoneFormat = date => {
    return moment.tz(date, this.state.timeZone).valueOf();
  };

  renderInput(props, openCalendar) {
    function clear() {
      props.onChange({ target: { value: '' } });
    }
    return (
      <div>
        <input {...props} />
        <button onClick={openCalendar}>open calendar</button>
        <button onClick={clear}>clear</button>
      </div>
    );
  }

  onStartDateChange(date) {
    this.setState({
      startDate: date,
      isFormChanged: true
    });
  }

  onEndDateChange(date) {
    this.setState({
      endDate: date,
      isFormChanged: true
    });
  }

  ///////////////// location field validation

  onLocationChange(value) {
    this.setPromptFlag();
    // console.log(value);
    this.setState({
      isFormChanged: true
    });
  }

  onLocationKeyDown = event => {
    if (event.keyCode == 9 && event.target.value == '') {
      return;
    }

    this.setState({
      onLocationKeyDown: true
    });
  };

  onLocationFocus() {
    this.setState({
      venueErrorMessage: '',
      venueActive: true
    });
    ReactTooltip.hide();
  }

  validateLocation(value) {
    this.setPromptFlag();
    try {
      var lat = value.location.lat;
      var lng = value.location.lng;
      timezone.data(lat, lng, timestamp, (err, tz) => {
        //  console.log(tz);
        this.onTimeZoneChange(tz.raw_response.timeZoneId);
      });
    } catch (err) {}

    let errMessage;
    if (
      value == undefined ||
      value == '' ||
      (typeof value == 'object' && value.label == '')
    ) {
      errMessage = 'Venue is required';
      this.setState({
        isVenueValid: false,
        venueErrorMessage: errMessage,
        venueActive: false,
        isFormChanged: true
      });
      return 0;
    }

    if (typeof value != 'object' && this.state.onLocationKeyDown == true) {
      errMessage = 'Please select venue from suggestions';
      this.setState({
        isVenueValid: false,
        venueErrorMessage: errMessage,
        venueActive: false
      });
      return 0;
    }

    if (
      typeof value == 'object' &&
      (!value.hasOwnProperty('location') ||
        !value.hasOwnProperty('description'))
    ) {
      errMessage = 'Please select venue from suggestions';
      this.setState({
        isVenueValid: false,
        venueErrorMessage: errMessage,
        venueActive: false
      });
      return 0;
    }

    if (
      this.state.onLocationKeyDown == true ||
      (typeof value == 'object' && value.hasOwnProperty('location'))
    ) {
      this.setState(
        {
          isVenueValid: true,
          venueErrorMessage: '',
          venueActive: false,
          venue: value,
          isFormChanged: true,
          onLocationKeyDown: false
        },
        () => {
          console.log('this.state.venue', this.state.venue);
        }
      );
    } else {
      this.setState(
        {
          isVenueValid: true,
          venueErrorMessage: '',
          venueActive: false,
          isFormChanged: true,
          onLocationKeyDown: false
        },
        () => {
          console.log('this.state.venue', this.state.venue);
        }
      );
    }
    return 1;
  }

  ////////////////////  datepicker

  showStartDate = () => {
    this.setPromptFlag();
    this.setState({ showStartDatePicker: true });
  };

  // handleChangeStartDate = (value, dateValue, event) => {
  //   this.setState({ startDate: moment(dateValue), isFormChanged: true });
  // };
  // handleVisibilityChangeStartDate = visible => {
  //   this.setState({ showStartDatePicker: visible });
  // };

  handleChangeStartDate = (value, dateValue, event) => {
    // minDate={new Date()}
    // maxDate={this.state.endDate}

    // if(dateValue<new Date()){
    //   showWarningToast("Start date can not before today")
    //   return ;
    // }

    this.setState(
      {
        startDate: dateValue,
        isFormChanged: true,
        isStartDateValid: true,
        startDateErrorMessage: '',
        startDateActive: false
      },
      () => {
        // console.log("this.state.startDate",this.state.startDate)
        // alert(this.state.isStartDateValid)
        this.updateStartDate();
        if (this.state.endDateErrorMessage.length > 0) this.updateEndDate();
      }
    );
  };

  updateStartDate = () => {
    let errMessage;
    if (this.state.startDate == null) {
      errMessage = 'Start Date is required';
      this.setState({
        isStartDateValid: false,
        startDateErrorMessage: errMessage,
        startDateActive: false
      });
      return;
    }

    try {
      if (
        this.state.startDate.setHours(0, 0, 0, 0) <
        new Date().setHours(0, 0, 0, 0)
      ) {
        errMessage = 'Start date can not before today';
        this.setState({
          isStartDateValid: false,
          startDateErrorMessage: errMessage,
          startDateActive: false
        });
        return;
      }

      if (
        this.state.endDate != null &&
        this.state.startDate.setHours(0, 0, 0, 0) >
          this.state.endDate.setHours(0, 0, 0, 0)
      ) {
        errMessage = 'Start date can not after end date';
        this.setState({
          isStartDateValid: false,
          startDateErrorMessage: errMessage,
          startDateActive: false
        });
        return;
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({
      isStartDateValid: true,
      startDateErrorMessage: '',
      startDateActive: false
    });
    return 1;
  };

  handleVisibilityChangeStartDate = (visible, e) => {
    let errMessage;
    if (
      this.state.startDate == null &&
      (e.target.type == undefined || e.target.type == 'button')
    ) {
      errMessage = 'Start Date is required';
      this.setState(
        {
          isStartDateValid: false,
          startDateErrorMessage: errMessage,
          startDateActive: false,
          showStartDatePicker: visible
        },
        () => {
          // alert("inv "+ this.state.isStartDateValid)
        }
      );
      return;
    }

    try {
      if (
        this.state.startDate.setHours(0, 0, 0, 0) <
        new Date().setHours(0, 0, 0, 0)
      ) {
        errMessage = 'Start date can not before today';
        this.setState({
          isStartDateValid: false,
          startDateErrorMessage: errMessage,
          startDateActive: false,
          showStartDatePicker: visible
        });
        return;
      }

      if (
        this.state.endDate != null &&
        this.state.startDate.setHours(0, 0, 0, 0) >
          this.state.endDate.setHours(0, 0, 0, 0)
      ) {
        errMessage = 'Start date can not after end date';
        this.setState({
          isStartDateValid: false,
          startDateErrorMessage: errMessage,
          startDateActive: false,
          showStartDatePicker: visible
        });
        return;
      }
    } catch (err) {}

    this.setState(
      {
        isStartDateValid: true,
        startDateErrorMessage: '',
        startDateActive: false,
        showStartDatePicker: visible
      },
      () => {
        // alert("valid",this.state.isStartDateValid)
      }
    );
    return 1;

    console.log('e===>', e.target.type);
  };

  /////////

  showEndDate = () => {
    this.setPromptFlag();
    this.setState({ showEndDatePicker: true });
  };

  // handleChangeEndDate = (value, dateValue, event) => {
  //   this.setState({ endDate: moment(dateValue), isFormChanged: true });
  // };
  // handleVisibilityChangeEndDate = visible => {
  //   this.setState({ showEndDatePicker: visible });
  // };

  handleChangeEndDate = (value, dateValue, event) => {
    this.setState(
      {
        endDate: dateValue,
        isFormChanged: true,
        isEndDateValid: true,
        endDateErrorMessage: '',
        endDateActive: false
      },
      () => {
        this.updateEndDate();
        if (this.state.startDateErrorMessage.length > 0) this.updateStartDate();
      }
    );
  };

  updateEndDate = () => {
    let errMessage;
    if (this.state.endDate == null) {
      errMessage = 'End Date is required';
      this.setState({
        isEndDateValid: false,
        endDateErrorMessage: errMessage,
        endDateActive: false
      });
      return;
    }

    try {
      // if(this.state.startDate == null) {
      if (
        this.state.endDate.setHours(0, 0, 0, 0) <
        new Date().setHours(0, 0, 0, 0)
      ) {
        errMessage = 'End date can not before today';
        this.setState({
          isEndDateValid: false,
          endDateErrorMessage: errMessage,
          endDateActive: false
        });
        return;
      }

      // }

      if (
        this.state.startDate != null &&
        this.state.endDate.setHours(0, 0, 0, 0) <
          this.state.startDate.setHours(0, 0, 0, 0)
      ) {
        errMessage = 'End date can not before start date';
        this.setState({
          isEndDateValid: false,
          endDateErrorMessage: errMessage,
          endDateActive: false
        });
        return;
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({
      isEndDateValid: true,
      endDateErrorMessage: '',
      endDateActive: false
    });
    return 1;
  };

  handleVisibilityChangeEndDate = (visible, e) => {
    let errMessage;
    if (
      this.state.endDate == null &&
      (e.target.type == undefined || e.target.type == 'button')
    ) {
      errMessage = 'End Date is required';
      this.setState(
        {
          isEndDateValid: false,
          endDateErrorMessage: errMessage,
          endDateActive: false,
          showEndDatePicker: visible
        },
        () => {
          // alert("inv "+ this.state.isStartDateValid)
        }
      );
      return;
    }

    try {
      // if(this.state.startDate == null) {
      if (
        this.state.endDate.setHours(0, 0, 0, 0) <
        new Date().setHours(0, 0, 0, 0)
      ) {
        errMessage = 'End date can not before today';
        this.setState({
          isEndDateValid: false,
          endDateErrorMessage: errMessage,
          endDateActive: false,
          showEndDatePicker: visible
        });
        return;
      }
      // }

      if (
        this.state.startDate != null &&
        this.state.endDate.setHours(0, 0, 0, 0) <
          this.state.startDate.setHours(0, 0, 0, 0)
      ) {
        errMessage = 'End date can not before start date';
        this.setState({
          isEndDateValid: false,
          endDateErrorMessage: errMessage,
          endDateActive: false,
          showEndDatePicker: visible
        });
        return;
      }
    } catch (err) {
      console.log(err);
    }

    this.setState(
      {
        isEndDateValid: true,
        endDateErrorMessage: '',
        endDateActive: false,
        showEndDatePicker: visible
      },
      () => {
        // alert("valid",this.state.isStartDateValid)
      }
    );
    return 1;

    // this.setState({ showEndDatePicker: visible });
  };

  // showAlert(eventId) {
  //   $('#alert_modal').modal();
  // }
  // publishEvent() {
  //   let eventId;
  //   if (this.props.events.activeEvent != undefined)
  //     eventId = this.props.events.activeEvent.eventId;

  //   if (eventId == undefined) {
  //     console.log('eventId not found');
  //     return;
  //   }

  //   if (this.props.events.activeEvent.published) {
  //     showWarningToast('Event already published');
  //   } else {
  //     this.props.publishEvent(this.state.eventId);
  //   }
  // }

  search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].categoryId === nameKey) {
        return myArray[i].subCategoryRes;
      }
    }

    return [];
  }

  /*categoryChange(eventCategory,action) {
    console.log(action,eventCategory);
    if(eventCategory){
      /*if(action == 1) {
        this.setState({ eventSubCategory: '',  eventCategory: eventCategory.value});
      } if(action == 2) {
        this.setState({ eventCategory: eventCategory.value});
      }

      this.setState({ eventCategory: eventCategory.value});
      var resultObject = this.search(eventCategory.value,this.state.userAllCategoryList);
      if(resultObject){
        let subCatList = resultObject.map(function (subCategoryObj) {
            return { value: subCategoryObj.subCategoryId, label: subCategoryObj.subCategoryName };
        });
        this.setState({subCatOptions : subCatList});
      }
    } else {
      this.setState({ eventCategory: ''});
    }
  }*/

  categoryChange(eventCategory, action) {
    if (this.state.categoryFlag === true) {
      this.setPromptFlag();
    }
    // console.log('action ', action);
    if (eventCategory) {
      // if (action !== 2) {
      //   this.setState({ eventSubCategory: '' });
      //   this.validateSubCategory();
      // }
      this.setState({
        eventCategory: eventCategory.value,
        isFormChanged: true
      });
      var resultObject = this.search(
        eventCategory.value,
        this.state.userAllCategoryList
      );
      if (resultObject) {
        let subCatList = resultObject.map(function(subCategoryObj) {
          return {
            value: subCategoryObj.subCategoryId,
            label: subCategoryObj.subCategoryName
          };
        });
        this.setState({ subCatOptions: subCatList });
      }
    } else {
      this.setState({
        eventCategory: '',
        subCatOptions: []
      });
    }
    this.setState(
      {
        eventSubCategory: []
      },
      () => {
        this.validateCategory(eventCategory);
        if (this.state.isEventSubCategoryValid == true) {
          // this.validateSubCategory(this.state.eventCategory);
          this.setState({
            isEventSubCategoryValid: false,
            eventSubCategoryErrorMessage: ''
          });
        }
      }
    );
  }

  subCategoryChange(eventSubCategory) {
    if (this.state.categoryFlag === true) {
      this.setPromptFlag();
    }
    // console.log('subCategoryChange', eventSubCategory);
    this.setState({ eventSubCategory: eventSubCategory, isFormChanged: true });
    this.validateSubCategory(eventSubCategory);
  }

  render() {
    // const actions = [
    //   <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
    //   <FlatButton
    //     label="Submit"
    //     primary={true}
    //     keyboardFocused={true}
    //     onClick={this.handleClose}
    //   />
    // ];
    return (
      <div className="main-container">
        <ReactTooltip effect="solid" type="error" place="bottom" />
        <Prompt
          when={this.state.prompt}
          message="You may lost any unsaved data, click cancel to stay on the same screen and click on next button  to save the changes."
        />
        {/* <div>
           <RaisedButton label="Dialog" onClick={this.handleOpen} />
          <Dialog
            title="Dialog With Actions"
            actions={actions}
            modal={false}
            open={this.state.open}
            // onRequestClose={}
          >
            The actions in this window were passed in as an array of React
            objects.
          </Dialog>
        </div> */}
        <div className="inner-page">
          <StepNavBar
            navigateToUrlPage={this.navigateToUrlPage}
            tabName="addEvent"
            publishedEventId={this.state.eventId}
            publishEvent={publishEvent}
            isEditEvent={this.props.events.isEditEvent}
            showAlert={this.showAlert}
          />
          <div className="events-page ev-select">
            <div className="create-event">
              <div className="row">
                <div className="col-md-6 pr-0 form-card">
                  {/* <form className="">*/}
                  <div className="col-md-12">
                    <div
                      className={classNames('form-group cls-relative ripple', {
                        tbError: this.state.eventNameErrorMessage.length > 0,
                        tbFocus: this.state.eventNameActive
                      })}
                    >
                      <label htmlFor="eventName">Event Name </label>
                      <input
                        type="text"
                        maxLength="80"
                        className="form-control input-control"
                        id="eventName"
                        name="eventName"
                        placeholder="Event name"
                        onFocus={event => this.onControlFocus(event)}
                        onChange={event => this.onInputChange(event)}
                        onBlur={e =>
                          this.validateEventName(this.state.eventName)
                        }
                        value={this.state.eventName}
                        data-tip={this.state.eventNameErrorMessage}
                        ref="eventName"
                      />
                      {this.state.eventNameErrorMessage.length > 0 ? (
                        <i className="fa fa-exclamation-triangle alertIcon" />
                      ) : (
                        ''
                      )}
                      {this.state.isEventNameValid == true ? (
                        <i className="fa fa-check tbCheck" />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className={classNames('form-group cls-relative', {
                        tbFocus: this.state.startDateActive,
                        tbError: this.state.startDateErrorMessage.length > 0
                      })}
                    >
                      <label htmlFor="startDate">Start Date</label>

                      {/* <DatePicker
                          calendarClassName="a"
                          className="form-control input-control"
                          fixedHeight
                          selectsStart
                          showMonthDropdown
                          showYearDropdown
                          dateFormat="LL"
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          selected={this.state.startDate}
                          onChange={this.onStartDateChange}
                          placeholderText="Click to select start date"
                          startDate={this.state.startDate}
                          endDate={this.state.endDate}
                          minDate={moment()}
                          readOnly={true}
                          name="startDate"
                          onFocus={event => this.onControlFocus(event)}
                          onBlur={event =>
                            this.validateStartDate(this.state.startDate)
                          }
                        /> */}

                      <input
                        type="text"
                        maxLength="80"
                        className="form-control input-control"
                        readOnly
                        onFocus={event => {
                          this.onControlFocus(event);
                          this.showStartDate();
                        }}
                        onClick={event => {
                          this.onControlFocus(event);
                          this.showStartDate();
                        }}
                        value={moment(this.state.startDate).format(
                          'MMMM DD, YYYY'
                        )}
                        data-tip={this.state.startDateErrorMessage}
                      />

                      <DatePicker
                        label="Select date"
                        visible={this.state.showStartDatePicker}
                        className="md-cell cls-edit-event-datepicker"
                        textFieldClassName="hide"
                        autoOk={true}
                        value={
                          this.state.startDate
                            ? moment(this.state.startDate).toDate()
                            : null
                        }
                        onChange={this.handleChangeStartDate}
                        onVisibilityChange={
                          this.handleVisibilityChangeStartDate
                        }
                        // minDate={new Date()}
                        // maxDate={this.state.endDate.toDate()}
                      />

                      {this.state.isStartDateValid == true ? (
                        <i className="fa fa-check tbCheck" />
                      ) : (
                        ''
                      )}

                      {this.state.startDateErrorMessage.length > 0 ? (
                        <i className="fa fa-exclamation-triangle alertIcon" />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className={classNames('form-group cls-relative', {
                        tbFocus: this.state.endDateActive,
                        tbError: this.state.endDateErrorMessage.length > 0
                      })}
                    >
                      <label htmlFor="endDate">End Date</label>
                      {/* <DatePicker
                          calendarClassName="a"
                          className="form-control input-control"
                          fixedHeight
                          selectsEnd
                          showMonthDropdown
                          showYearDropdown
                          dateFormat="LL"
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          selected={this.state.endDate}
                          onChange={this.onEndDateChange}
                          placeholderText="Click to select end date"
                          startDate={this.state.startDate}
                          endDate={this.state.endDate}
                          minDate={moment()}
                          readOnly={true}
                          name="endDate"
                          onFocus={event => this.onControlFocus(event)}
                          onBlur={event =>
                            this.validateEndtDate(this.state.endDate)
                          }
                        /> */}

                      <input
                        type="text"
                        maxLength="80"
                        className="form-control input-control"
                        readOnly
                        onFocus={event => {
                          this.onControlFocus(event);
                          this.showEndDate();
                        }}
                        onClick={event => {
                          this.onControlFocus(event);
                          this.showEndDate();
                        }}
                        value={moment(this.state.endDate).format(
                          'MMMM DD, YYYY'
                        )}
                        data-tip={this.state.endDateErrorMessage}
                      />

                      <DatePicker
                        label="Select date"
                        visible={this.state.showEndDatePicker}
                        className="md-cell cls-edit-event-datepicker"
                        textFieldClassName="hide"
                        autoOk={true}
                        value={
                          this.state.endDate
                            ? moment(this.state.endDate).format('MMMM DD, YYYY')
                            : null
                        }
                        onChange={this.handleChangeEndDate}
                        onVisibilityChange={this.handleVisibilityChangeEndDate}
                        // minDate={
                        //   this.state.startDate
                        //     ? this.state.startDate.toDate()
                        //     : new Date()
                        // }
                      />

                      {/* minDate={this.state.startDate ? this.state.startDate : new Date()} */}

                      {this.state.isEndDateValid == true ? (
                        <i className="fa fa-check tbCheck" />
                      ) : (
                        ''
                      )}

                      {this.state.endDateErrorMessage.length > 0 ? (
                        <i className="fa fa-exclamation-triangle alertIcon" />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div
                      className={classNames('form-group cls-relative', {
                        tbFocus: this.state.eventCategoryActive,
                        tbError: this.state.eventCategoryErrorMessage.length > 0
                      })}
                      ref="category"
                      data-tip={this.state.eventCategoryErrorMessage}
                    >
                      <label htmlFor="Category">Category</label>
                      <Select
                        className="selectCategoryInput"
                        name="eventCategory"
                        value={this.state.eventCategory}
                        options={this.state.catOptions}
                        onFocus={event => this.onControlFocus(event)}
                        onChange={this.categoryChange.bind(this)}
                        onBlur={e =>
                          this.validateCategory(this.state.eventCategory)
                        }
                        placeholder="Select Category"
                      />
                      {/*<i className="fa fa-check tbCheck" />*/}
                      {this.state.eventCategoryErrorMessage.length > 0 ? (
                        <i className="fa fa-exclamation-triangle alertIcon" />
                      ) : (
                        ''
                      )}
                      {this.state.isEventCategoryValid == true ? (
                        <i className="fa fa-check tbCheck" />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>

                  {this.state.eventCategory != 'Other' ? (
                    <div className="col-md-12">
                      <div
                        className={classNames('form-group cls-relative', {
                          tbFocus: this.state.eventSubCategoryActive,
                          tbError:
                            this.state.eventSubCategoryErrorMessage.length > 0
                        })}
                        ref="subCategory"
                        data-tip={this.state.eventSubCategoryErrorMessage}
                      >
                        <label htmlFor="eventFee">Sub Category</label>
                        <Select
                          name="eventSubCategory"
                          multi
                          value={this.state.eventSubCategory}
                          options={this.state.subCatOptions}
                          onChange={this.subCategoryChange.bind(this)}
                          onBlur={e =>
                            this.validateSubCategory(
                              this.state.eventSubCategory
                            )
                          }
                          placeholder="Select Sub-Category"
                        />
                        {this.state.eventSubCategoryErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isEventSubCategoryValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  ) : null}

                  {(() => {
                    if (this.state.eventCategory == 'Other') {
                      return (
                        <div>
                          <div className="col-md-12">
                            <div
                              className={classNames(
                                'form-group cls-relative ripple',
                                {
                                  tbFocus: this.state.newCategoryActive,
                                  tbError:
                                    this.state.newCategoryErrorMessage.length >
                                    0
                                }
                              )}
                            >
                              <label htmlFor="newCategory">
                                New Category Name{' '}
                              </label>
                              <input
                                type="text"
                                maxLength="80"
                                className="form-control input-control"
                                id="newCategory"
                                name="newCategory"
                                placeholder="New category name"
                                value={this.state.newCategory}
                                onChange={event => this.onInputChange(event)}
                                onFocus={event => this.onControlFocus(event)}
                                onBlur={e =>
                                  this.validateNewCategory(
                                    this.state.newCategory
                                  )
                                }
                                data-tip={this.state.newCategoryErrorMessage}
                                ref="newCategory"
                              />
                              {this.state.newCategoryErrorMessage.length > 0 ? (
                                <i className="fa fa-exclamation-triangle alertIcon" />
                              ) : (
                                ''
                              )}
                              {this.state.isNewCategoryValid == true ? (
                                <i className="fa fa-check tbCheck" />
                              ) : (
                                ''
                              )}
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div
                              className={classNames(
                                'form-group cls-relative ripple',
                                {
                                  tbFocus: this.state.newSubCategoryActive,
                                  tbError:
                                    this.state.newSubCategoryErrorMessage
                                      .length > 0
                                }
                              )}
                            >
                              <label htmlFor="newSubCategory">
                                New Sub Category Names
                              </label>
                              <input
                                type="text"
                                maxLength="80"
                                className="form-control input-control"
                                id="newSubCategory"
                                name="newSubCategory"
                                placeholder="New sub category names"
                                value={this.state.newSubCategory}
                                onChange={event => this.onInputChange(event)}
                                onFocus={event => this.onControlFocus(event)}
                                onBlur={e =>
                                  this.validateNewSubCategory(
                                    this.state.newSubCategory
                                  )
                                }
                                data-tip={this.state.newSubCategoryErrorMessage}
                                ref="newSubCategory"
                              />
                              {this.state.newSubCategoryErrorMessage.length >
                              0 ? (
                                <i className="fa fa-exclamation-triangle alertIcon" />
                              ) : (
                                ''
                              )}
                              {this.state.isNewSubCategoryValid == true ? (
                                <i className="fa fa-check tbCheck" />
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })()}

                  <div className="col-md-12">
                    <div
                      className={classNames(
                        'form-group cls-relative cls-venue',
                        {
                          tbError: this.state.venueErrorMessage.length > 0,
                          tbFocus: this.state.venueActive
                        }
                      )}
                      data-tip={this.state.venueErrorMessage}
                      ref="venue"
                    >
                      <label htmlFor="venue">Venue</label>
                      <Geosuggest
                        name="userAddress"
                        initialValue={
                          this.state.venue instanceof Object
                            ? this.state.venue.description
                            : this.state.venue
                        }
                        inputClassName="form-control input-control"
                        onChange={this.onLocationChange}
                        onSuggestSelect={this.validateLocation}
                        onFocus={this.onLocationFocus}
                        onKeyDown={this.onLocationKeyDown}
                        onBlur={this.validateLocation}
                      />
                      <span className="ico-user">
                        <svg>
                          <use xlinkHref={`${Sprite}#map-pinIco`} />
                        </svg>
                      </span>

                      {this.state.venueErrorMessage.length > 0 ? (
                        <i className="fa fa-exclamation-triangle alertIcon" />
                      ) : (
                        ''
                      )}
                      {this.state.isVenueValid == true ? (
                        <i className="fa fa-check tbCheck" />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group cls-relative dropdown_joinevent closed">
                      <label htmlFor="timeZone">Time Zone</label>
                      <Select
                        className="selectCategoryInput input-control"
                        name="timeZone"
                        id="timeZone"
                        value={this.state.timeZone}
                        options={timeZoneOptions}
                        placeholder="Select Timezone..."
                        onChange={this.onTimeZoneChange}
                      />
                      {/*<TimezonePicker
                          value={this.state.timeZone}
                          onChange={timezone => {
                            const myTimeZone = timezone;
                            this.onTimeZoneChange(myTimeZone);
                          }}
                          inputProps={{
                            placeholder: 'Select Timezone...',
                            name: 'timeZone',
                            id: 'timeZone'
                          }}
                          className="form-control input-control dropdown-menu-event"
                        />*/}

                      <i className="fa fa-check tbCheck" />
                    </div>

                    {/* <div id="content" className="dropdown_joinevt">
                        <div className="dropdown_joinevent closed">

                          <div className="title">Member Name </div>

                            <div className="dropdown-menu-event">

                              <ul>
                                <li>1 member</li>
                                <li>2 members</li>
                                <li>3 members</li>
                                <li>4 members</li>
                                <li>5 members</li>
                                <li>6 members</li>
                                <li>7 members</li>
                              </ul>
                            </div>
                        </div>
                      </div> */}
                  </div>
                  <div className="col-md-12">
                    <div
                      className={classNames('form-group cls-relative ripple ', {
                        tbError: this.state.eventFeeErrorMessage.length > 0,
                        tbFocus: this.state.eventFeeActive
                      })}
                    >
                      <label htmlFor="eventFee">Base Price</label>
                      <input
                        type="text"
                        className="form-control input-control event-fee"
                        id="eventFee"
                        name="eventFee"
                        placeholder="Base Price"
                        onFocus={event => this.onControlFocus(event)}
                        onChange={event => this.onEventFeeChange(event)}
                        onBlur={e => this.validateEventFee(this.state.eventFee)}
                        value={this.state.eventFee}
                        maxLength="7"
                        data-tip={this.state.eventFeeErrorMessage}
                        ref="eventFee"
                      />
                      {this.state.eventFeeErrorMessage.length > 0 ? (
                        <i className="fa fa-exclamation-triangle alertIcon" />
                      ) : (
                        ''
                      )}
                      {this.state.isEventFeeValid == true ? (
                        <i className="fa fa-check tbCheck" />
                      ) : (
                        ''
                      )}
                      <span className="ico-dollar">
                        <svg>
                          <use xlinkHref={`${Sprite}#dollarIco`} />
                        </svg>
                      </span>
                    </div>
                  </div>
                  {/*</form>*/}
                </div>
                <div className="col-md-6">
                  <div className="col-md-12">
                    <div className="file-dragNdrop gal-eff">
                      <div
                        className={`overlay ${
                          this.state.bannerImageSource ? '' : 'hide'
                        }`}
                      >
                        <FileDragAndDrop onDrop={this.handleDrop}>
                          <ul className="social-contact action-tag text-center">
                            {this.state.deleteIco == true ? (
                              <li>
                                <a
                                  onClick={() => {
                                    this.removeEventBanner(
                                      this.state.bannerImageSource
                                    );
                                  }}
                                  className="ml-2"
                                >
                                  {/*<i className="fa fa-trash" />*/}
                                  <span className="ico-delete">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#deleteIco`} />
                                    </svg>
                                  </span>
                                </a>
                              </li>
                            ) : (
                              ''
                            )}

                            <li>
                              <a
                                onClick={() => {
                                  this.imageUploadFileElement.click();
                                }}
                                className="ml-2"
                              >
                                {/*<i className="fa fa-pencil" />*/}
                                <span className="ico-pen">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#penIco`} />
                                  </svg>
                                </span>
                              </a>
                            </li>
                          </ul>
                        </FileDragAndDrop>
                      </div>

                      <FileDragAndDrop onDrop={this.handleDrop}>
                        <div className="uploadFile">
                          <input
                            id="fileSelector"
                            type="file"
                            className="file-upload-input"
                            accept="image/*"
                            onChange={event => {
                              const evt = event;
                              this.handleDrop(evt.target);
                            }}
                            ref={input => (this.imageUploadFileElement = input)}
                          />
                          <div
                            className={
                              this.state.bannerImageSource ? 'hide' : ''
                            }
                          >
                            <div className="imgFileUpload">
                              <img
                                src={imgFileUpload}
                                className="file-upload-img"
                                alt=""
                              />
                            </div>
                            <label>Drag & Drop</label>
                            <p>
                              a file here or <span>browse</span>
                            </p>
                            {this.state.bannerImageSource == '' ? (
                              ''
                            ) : (
                              <p>
                                File Name :{' '}
                                {this.state.uploadedFile &&
                                this.state.uploadedFile.name
                                  ? this.state.uploadedFile.name
                                  : ''}
                              </p>
                            )}
                          </div>
                          <div className="dragNdropImg">
                            <img
                              src={this.state.bannerImageSource}
                              alt={this.state.bannerImageAWSURL}
                              style={{ width: 100 + '%' }}
                              className={
                                this.state.bannerImageSource ? '' : 'hide'
                              }
                            />
                            <div
                              className={
                                this.state.bannerUploadInProgress
                                  ? 'progress'
                                  : 'progress hide'
                              }
                              style={{
                                width: 50 + '%',
                                textAlign: 'center',
                                margin: '5px auto auto auto'
                              }}
                            >
                              <div
                                className="progress-bar progress-bar-warning"
                                role="progressbar"
                                aria-valuenow={this.state.fileUploadProgress}
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{
                                  width: this.state.fileUploadProgress + '%',
                                  color: 'red'
                                }}
                              >
                                {this.state.fileUploadProgress}% Complete
                              </div>
                            </div>
                          </div>
                        </div>
                      </FileDragAndDrop>
                    </div>
                    <form className="form-card mt-25">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError:
                              this.state.descriptionErrorMessage.length > 0,
                            tbFocus: this.state.descriptionActive
                          }
                        )}
                      >
                        <label htmlFor="comment">Description</label>
                        <textarea
                          className="form-control textarea-control add-textarea"
                          rows="5"
                          id="description"
                          name="description"
                          placeholder="Description"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event => this.onInputChange(event)}
                          onBlur={e =>
                            this.validateDescription(this.state.description)
                          }
                          value={this.state.description}
                          data-tip={this.state.descriptionErrorMessage}
                          ref="description"
                        />
                        {this.state.descriptionErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon mr-20" />
                        ) : (
                          ''
                        )}
                        {this.state.isDescriptionValid == true ? (
                          <i className="fa fa-check tbCheck mr-20" />
                        ) : (
                          ''
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="events-page-footer">
              <div className="btnPageNav">
                <a className="btnTag mb-20 hide">
                  <i className="fa fa-arrow-left" aria-hidden="true" />
                </a>
                <a className="btnTag mb-20" onClick={this.onClickUpdateEvent}>
                  <i className="fa fa-arrow-right" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* <AlertModal
          confirmedMe={this.publishEvent}
          eventType="publish"
          alertMessage="Are you sure want to publish?"
        /> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { userInfo: state.profileData, events: state.events };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      editEvent,
      actionActiveEvent,
      publishEvent,
      actionGetAllCategory,
      showLoader,
      hideLoader,
      actionCreateCategory
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEvent);
