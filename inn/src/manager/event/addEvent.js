import React, { Component } from 'react';
import { connect } from 'react-redux';
// import DatePicker from 'react-datepicker';
import { DatePicker, TimePicker } from 'react-md';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import TimezonePicker from 'react-timezone';
import validator from 'validator';
import ReactTooltip from 'react-tooltip';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { bindActionCreators } from 'redux';
import bootbox from 'bootbox';
import FileDragAndDrop from 'react-file-drag-and-drop';
import classNames from 'classnames';
import Geosuggest from 'react-geosuggest';
import { Prompt } from 'react-router';

import imgFileUpload from '../../img/file-upload-img.png';
import StepNavBar from '../common/stepNavBar';
import innovecsysApiService from '../../common/core/api';
import timezoneJson from '../../common/core/timezones';
import Sprite from '../../img/sprite.svg';

import {
  generateUniqueId,
  showWarningToast
} from '../../common/core/common-functions';
import {
  addPhoto,
  createEventDirectory,
  deleteEventImage
} from '../../common/core/aws-s3';
import {
  actionAddEvent,
  actionActiveEvent,
  actionManagerAccess,
  editEvent,
  uploadImageToAwsServer,
  actionGetAllCategory,
  showLoader,
  hideLoader,
  actionCreateCategory
} from '../../common/action/index';
import Config from '../../common/core/config';

var timeZoneOptions = [];
Object.keys(timezoneJson).forEach(function(key) {
  var val = timezoneJson[key];
  timeZoneOptions.push({
    value: val,
    label: key
  });
});

let $ = require('jquery');

class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadFileSize: 5242880,
      eventId: '',
      eventName: '',
      startDate: null,
      endDate: null,
      sponsorsList: [],
      speakersList: [],
      address: {
        detailedLocation: '',
        city: '',
        state: '',
        country: '',
        latitude: '',
        longitude: ''
      },
      duration: '',
      eventNameErrorMessage: '',
      isEventNameValid: false,
      eventNameActive: false,
      uploadedFile: '',

      venue: '',
      isVenueValid: false,
      venueErrorMessage: '',
      venueActive: false,

      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,

      eventFee: '',
      isEventFeeValid: false,
      eventFeeErrorMessage: '',
      eventFeeActive: false,

      description: '',
      isDescriptionValid: false,
      descriptionErrorMessage: '',
      descriptionActive: false,

      isStartDateValid: false,
      startDateErrorMessage: '',
      startDateActive: false,

      isEndDateValid: false,
      endDateErrorMessage: '',
      endDateActive: false,

      newCategory: '',
      isNewCategoryValid: false,
      newCategoryErrorMessage: '',
      newCategoryActive: false,

      newSubCategory: '',
      isNewSubCategoryValid: false,
      newSubCategoryErrorMessage: '',
      newSubCategoryActive: false,

      fileUploadProgress: 0,
      bannerImageAWSURL: '', //AWS image url will store here, get this url after upload banner on AWS, and send this url in event data
      bannerUploadInProgress: false,
      uploadingImageData: '', //Store banner imanger object that will pass to aws for upload
      bannerImageSource: '', //Store banner image source data to show in image tab
      showStartDatePicker: false,
      showEndDatePicker: false,

      eventCategory: '',
      isEventCategoryValid: false,
      eventCategoryErrorMessage: '',
      eventCategoryActive: false,

      userAllCategoryList: [],
      selectedUserCategoryList: [],

      catOptions: '',

      subCatOptions: '',
      eventSubCategory: [],
      isEventSubCategoryValid: false,
      eventSubCategoryErrorMessage: '',
      eventSubCategoryActive: false,
      prompt: false,
      deleteIco: true,
      isVenueChanged: false,
      newBannerImageAWSURL: ''
    };

    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onClickAddEvent = this.onClickAddEvent.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onEventFeeChange = this.onEventFeeChange.bind(this);
    this.onTimeZoneChange = this.onTimeZoneChange.bind(this);
    this.onControlFocus = this.onControlFocus.bind(this);
    this.validateEventName = this.validateEventName.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.onLocationFocus = this.onLocationFocus.bind(this);
    this.validateLocation = this.validateLocation.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.setFileUploadProgress = this.setFileUploadProgress.bind(this);
    this.validateCategory = this.validateCategory.bind(this);
    this.validateSubCategory = this.validateSubCategory.bind(this);
  }

  componentWillUnmount() {}

  componentWillMount() {
    if (this.state.timeZone == 'Asia/Calcutta') {
      this.setState({ timeZone: 'Asia/Kolkata' });
    }
    this.props.actionGetAllCategory().then(
      res => {
        console.log('res', res);
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
      },
      err => {
        console.log('err', err);
      }
    );
  }

  setPromptFlag() {
    this.setState({
      prompt: true
    });
  }

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

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

  handleDrop(dataTransfer) {
    this.setState({ deleteIco: false });
    this.setPromptFlag();
    let _this = this;

    if (dataTransfer && dataTransfer.files && dataTransfer.files[0]) {
      if (dataTransfer.files[0].size <= this.state.uploadFileSize) {
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
          // createEventDirectory(Config.S3AlbumForBanner, function(result) {
          //   if (result.directoryStatus) {
          console.log('directory created');
          let fileName = targetElement.files[0].name;
          let fileNameArray = fileName.split('.');
          fileNameArray[fileNameArray.length - 2] =
            _this.props.userInfo.id + '_' + generateUniqueId();
          fileName = fileNameArray.join('.');
          console.log();
          addPhoto(
            Config.S3AlbumForBanner,
            targetElement,
            fileName,
            null,
            (error, data) => {
              console.log('upload success', error, data);
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
                  // bannerImageAWSURL,
                  isFormChanged: true,
                  deleteIco: true
                });
              }
            },
            _this.setFileUploadProgress
          );
          //   } else {
          //     console.log('directory creation failed');
          //   }
          // });
        } catch (e) {
          console.log(e.message);
        }
        //END Uploading banner image on AWS server
      } else {
        showWarningToast("Can't upload file more then 5 MB");
      }
    }
  }

  removeEventBanner(AWSFileURL) {
    this.setPromptFlag();
    this.setState({
      open: this.state.open,
      bannerImageSource: ''
      // bannerImageURL: '',
      //bannerImageAWSURL: ''
    });
    this.deleteBannerImageFromAWS(AWSFileURL);
  }

  uploadImageDataInAWS(eventId) {
    if (
      this.state.uploadingImageData &&
      this.state.uploadingImageData.files &&
      this.state.uploadingImageData.files[0]
    ) {
      const targetElement = this.state.uploadingImageData;
      const value = this.state.uploadingImageData.files[0];
      let _this = this;
      // this.setState({
      //   uploadedFile: value,
      //   fileUploadProgress: 0,
      //   bannerImageAWSURL: imgLoadSpinner,
      //   bannerUploadInProgress: true
      // });
      try {
        // const eventId = this.props.events.editEvent.eventId;
        createEventDirectory(eventId, function(result) {
          if (result.directoryStatus) {
            console.log('directory created');
            let fileName = targetElement.files[0].name;
            let fileNameArray = fileName.split('.');
            fileNameArray[fileNameArray.length - 2] = 'banner';
            fileName = fileNameArray.join('.');
            addPhoto(
              eventId,
              targetElement,
              fileName,
              null,
              (error, data) => {
                console.log('upload success', error, data);
                _this.setState({
                  bannerUploadInProgress: false
                });
                if (error) {
                  return;
                }
                if (data.Location) {
                  const bannerImageAWSURL = data.Location;
                  _this.setState({
                    bannerImageAWSURL,
                    isFormChanged: true
                  });
                }
              },
              _this.setFileUploadProgress
            );
          } else {
            console.log('directory creation failed');
          }
        });
        // checkEventFolderExistance(eventId, function(error, data, awsObj) {
        //   console.log(error, data);
        //   console.log('awsObj', awsObj);
        // });
      } catch (e) {
        console.log(e.message);
      }
    }
  }

  onInputChange(event) {
    this.setPromptFlag();
    const name = event.target.name;
    const value = event.target.value;
    let controlErrorMessage = name + 'ErrorMessage';
    this.setState({
      [name]: value,
      [controlErrorMessage]: ''
    });
  }

  onEventFeeChange(event) {
    this.setPromptFlag();
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
  }
  /*  onEventFeeChange(event) {
    this.setPromptFlag();
    const name = event.target.name;
    const regExp = new RegExp(/^[1-9][0-9]*$/);
    //const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    let value = event.target.value;
    let controlErrorMessage = name + 'ErrorMessage';
    if (value === '' || value > 0 || regExp.test(value) === true) {
      this.setState({
        [name]: value,
        [controlErrorMessage]: ''
      });
    }
  }*/

  /*onTimeZoneChange(timeZone) {
    this.setPromptFlag();
    this.setState({
      timeZone: timeZone
    });
  }*/

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
    console.log('eventNameActive', this.state.eventNameActive);
    ReactTooltip.hide();
  }

  onClickAddEvent(event) {
    console.log('Df');
    let _this = this;
    const saveAndNavigate = () => {
      _this.isFormValid(response => {
        if (response == false) {
          console.log('failed');
          return;
        } else {
          _this.submitForm(event);
        }
      });
    };

    if (this.state.bannerUploadInProgress) {
      bootbox.confirm(
        'Banner still uploading , Please wait or cancel the update.',
        result => {
          if (result === true) {
            saveAndNavigate();
          }
        }
      );
    } else {
      saveAndNavigate();
    }

    // this.isFormValid(response => {
    //   if (response == false) {
    //     return;
    //   } else {
    //     this.submitForm(event);
    //   }
    // });
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

    /* if (!this.state.isEventCategoryValid) {
      if (this.state.eventCategoryErrorMessage == '') {
        this.setState(
          {
            eventCategoryErrorMessage: 'Event Category is required'
          },
          () => {
            ReactTooltip.show(this.refs.eventCategory);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.category);
      callback(false);
      return;
    }*/

    // all fields are valid now return true
    callback(true);
    return;
  }

  onSelectCategory(categoryObj, subCategoryObj) {
    console.log(categoryObj);
    console.log(subCategoryObj);

    // get match category object  with selected object
    this.state.selectedUserCategoryList.map((item, index) => {
      if (item.id == categoryObj.categoryId) {
        let matched = false;

        // get match object with selected subcategory object
        item.listOfIdAndName.map((obj, innerIndex) => {
          // if match subcategory then remove
          if (obj.id == subCategoryObj.subCategoryId) {
            matched = true;
            item.listOfIdAndName.splice(innerIndex, 1);
            categoryObj['selectedIds'].splice(innerIndex, 1);
          }
        });

        // if not match then add subcategory
        if (matched == false) {
          let subObj = {
            id: subCategoryObj.subCategoryId
          };
          item.listOfIdAndName.push(subObj);
          categoryObj['selectedIds'].push(subCategoryObj.subCategoryId);
        }
      }
    });

    this.setState({
      userAllCategoryList: this.state.userAllCategoryList,
      selectedUserCategoryList: this.state.selectedUserCategoryList
    });

    console.log(
      'this.state.selectedUserCategoryList',
      this.state.selectedUserCategoryList
    );

    /* console.log(
      'this.state.userAllCategoryList',
      this.state.userAllCategoryList
    );*/
  }

  submitForm(event) {
    console.log('reached');

    let self = this;
    if (this.props.userInfo && this.props.userInfo.id) {
      // this.props.showLoader();
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
      //let bannerImageURL = this.state.bannerImageAWSURL;
      let mediaImageURLs = [];
      let categoryId = this.state.eventCategory;
      console.log(categoryId);
      let subCatIds = this.state.eventSubCategory.map(function(subCat) {
        return subCat.value;
      });

      console.log(subCatIds);

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
            : '',
        longitude:
          this.state.venue instanceof Object
            ? this.state.venue.location.lng.toString()
            : ''
      };

      let sponsorsList = this.state.sponsorsList;
      let speakersList = this.state.speakersList;

      let startTimeWithZone = this.getDateTimeInZoneFormat(
        moment(startTimestamp).format('YYYY-MM-DD')
      );
      let endTimeWithZone = this.getDateTimeInZoneFormat(
        moment(endTimestamp).format('YYYY-MM-DD')
      );

      //To delete existing image from AWS

      if (this.state.newBannerImageAWSURL) {
        console.log(
          'THIS.STATE****************',
          this.state.newBannerImageAWSURL
        );
        this.deleteBannerImageFromAWS(this.state.bannerImageAWSURL);
      }

      if (this.state.bannerImageSource == '') {
        console.log('THIS.STATE****************', this.state.bannerImageAWSURL);
        bannerImageURL = '';
        this.deleteBannerImageFromAWS(this.state.bannerImageAWSURL);
      }

      let addNewEvent = {
        createrUserId,
        eventName,
        startTimestamp: startTimeWithZone, //moment(startTimestamp).valueOf(), ///startTimestamp.utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        endTimestamp: endTimeWithZone, //moment(endTimestamp).valueOf(),//.format('YYYY-MM-DD[T]HH:mm:ss.SSS'), //endTimestamp.utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        venue,
        timeZone,
        duration,
        fees,
        description,
        address,
        sponsorsList,
        speakersList,
        bannerImageURL,
        mediaResponseList: mediaImageURLs,
        categoryId,
        subCatIds
      };

      console.log('addNewEvent', addNewEvent);

      if (this.state.eventCategory == 'Other') {
        this.createNewCategory(addNewEvent, self);
      } else {
        this.apiRequest(addNewEvent, self);
      }
    } else {
      console.log('user id not found');
    }

    // innovecsysApiService("addEvent",{})
  }

  apiRequest = (addNewEvent, self) => {
    this.props.showLoader();
    innovecsysApiService('addEvent', addNewEvent).then(result => {
      this.props.hideLoader();
      if (result.data && result.data.status && result.data.status === 200) {
        if (result.data.resourceId) {
          addNewEvent.eventId = result.data.resourceId;
          self.props.actionAddEvent(Object.assign({}, addNewEvent));
          self.props.actionActiveEvent(Object.assign({}, addNewEvent));

          // make nevigation enable
          this.props.actionManagerAccess({
            accessEventSpeakers: true
          });

          let eventObj = Object.assign({}, addNewEvent);
          eventObj['eventId'] = result.data.resourceId;
          console.log('result.data.resourceData', result.data.resourceId);
          this.props.editEvent(eventObj);
          this.props.actionActiveEvent(eventObj);

          self.setState(
            {
              prompt: false //Disable prompt and navigate to user
            },
            () => self.props.history.push('/manager/speakerList')
          );

          // self.props.history.push('/manager/speakerList');
        }
      }
    });
  };

  createNewCategory = (addNewEvent, self) => {
    let newCategory = this.state.newCategory;
    let newSubCategory = this.state.newSubCategory;

    console.log('newCategory', newCategory);
    console.log('newSubCategory', newSubCategory);

    let newSubCategoryList = newSubCategory.split(',') || [];

    console.log('newSubCategoryList', newSubCategoryList);

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

    console.log('sendObject', sendObject);
    this.props.actionCreateCategory(sendObject).then(res => {
      console.log('res', res);
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
    this.setState({ startDate: date });
  }

  onEndDateChange(date) {
    this.setState({ endDate: date });
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
    console.log('validate sub category', value);
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

  validateVenue(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Venue is required';
      this.setState({
        isVenueValid: false,
        venueErrorMessage: errMessage,
        venueActive: false
      });
      return;
    }

    this.setState({
      isVenueValid: true,
      venueErrorMessage: '',
      venueActive: false
    });
    return 1;
  }

  validateEventFee(value) {
    console.log(value);
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

  ///////////////// location field validation

  onLocationChange(value) {
    this.setPromptFlag();
    console.log(value);
    // this.setState({
    //   venue: value
    // });
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
    console.log(value);
    this.setPromptFlag();
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
        venueActive: false
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

    if (typeof value == 'object' && !value.hasOwnProperty('location')) {
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
          onLocationKeyDown: false
        },
        () => {
          console.log('this.state.venue===>', this.state.venue);
        }
      );
    } else {
      this.setState(
        {
          isVenueValid: true,
          venueErrorMessage: '',
          venueActive: false,
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
    this.setState({
      showEndDatePicker: true
    });
  };

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

    if (this.state.startDate == null) {
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
    }

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

    // minDate={
    //   this.state.startDate
    //     ? this.state.startDate
    //     : new Date()
    // }

    if (this.state.startDate == null) {
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
    }

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

  search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].categoryId === nameKey) {
        return myArray[i].subCategoryRes;
      }
    }
    return [];
  }

  categoryChange(eventCategory) {
    this.setPromptFlag();
    // alert()
    if (eventCategory) {
      this.setState({
        eventCategory: eventCategory.value,
        eventSubCategory: ''
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
          // this.validateSubCategory();
          this.setState({
            isEventSubCategoryValid: false,
            eventSubCategoryErrorMessage: ''
          });
        }
      }
    );
  }

  subCategoryChange(eventSubCategory) {
    this.setPromptFlag();
    console.log('sub category change', eventSubCategory);
    this.setState({ eventSubCategory: eventSubCategory });
    this.validateSubCategory(eventSubCategory);
  }

  render() {
    return (
      <div className="main-container">
        <ReactTooltip effect="solid" type="error" place="bottom" />
        <Prompt
          when={this.state.prompt}
          message="You may lost any unsaved data, click cancel to stay on the same screen and click on next button  to save the changes."
        />
        <div id="app" />
        <div className="inner-page">
          <StepNavBar
            navigateToUrlPage={this.navigateToUrlPage}
            tabName="addEvent"
            isEditEvent={this.props.events.isEditEvent}
          />
          <div className="events-page ev-select">
            <div className="create-event">
              <div className="row">
                <div className="col-md-6 pr-0 form-card">
                  {/*<form className="form-card">*/}
                  <div className="col-md-12">
                    <div
                      className={classNames('form-group cls-relative ripple', {
                        tbError: this.state.eventNameErrorMessage.length > 0,
                        tbFocus: this.state.eventNameActive
                      })}
                    >
                      <label htmlFor="eventName">Event Name</label>
                      <input
                        type="text"
                        maxLength="80"
                        className="form-control input-control"
                        id="eventName"
                        name="eventName"
                        placeholder="Event name"
                        value={this.state.eventName}
                        onChange={event => this.onInputChange(event)}
                        onFocus={event => this.onControlFocus(event)}
                        onBlur={e =>
                          this.validateEventName(this.state.eventName)
                        }
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
                          // showTimeSelect

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
                          />
                        */}

                      <input
                        type="text"
                        maxLength="80"
                        className="form-control input-control"
                        placeholder="Start Date"
                        name="startDate"
                        ref="startDate"
                        readOnly
                        onFocus={event => {
                          this.onControlFocus(event);
                          this.showStartDate();
                        }}
                        onClick={event => {
                          this.onControlFocus(event);
                          this.showStartDate();
                        }}
                        value={
                          this.state.startDate
                            ? moment(this.state.startDate).format(
                                'MMMM DD, YYYY'
                              )
                            : ''
                        }
                        data-tip={this.state.startDateErrorMessage}
                      />

                      <DatePicker
                        id="date-picker-controlled"
                        label="Select date"
                        visible={this.state.showStartDatePicker}
                        className="md-cell cls-add-event-datepicker"
                        textFieldClassName="hide"
                        autoOk={true}
                        value={
                          this.state.startDate
                            ? moment(this.state.startDate).toDate()
                            : null
                        }
                        onChange={this.handleChangeStartDate}
                        onVisibilityChange={(visible, e) =>
                          this.handleVisibilityChangeStartDate(visible, e)
                        }
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
                          // showTimeSelect
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
                        placeholder="End Date"
                        name="endDate"
                        ref="endDate"
                        readOnly
                        onFocus={event => {
                          this.onControlFocus(event);
                          this.showEndDate();
                        }}
                        onClick={event => {
                          this.onControlFocus(event);
                          this.showEndDate();
                        }}
                        value={
                          this.state.endDate
                            ? moment(this.state.endDate).format('MMMM DD, YYYY')
                            : ''
                        }
                        data-tip={this.state.endDateErrorMessage}
                      />

                      <DatePicker
                        id="date-picker-controlled"
                        label="Select date"
                        visible={this.state.showEndDatePicker}
                        className="md-cell cls-add-event-datepicker"
                        textFieldClassName="hide"
                        autoOk={true}
                        value={
                          this.state.endDate
                            ? moment(this.state.endDate).toDate()
                            : null
                        }
                        onChange={this.handleChangeEndDate}
                        onVisibilityChange={this.handleVisibilityChangeEndDate}
                      />

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
                      {/* <input
                          type="text"
                          className="form-control input-control"
                          id="venue"
                          name="venue"
                          placeholder="Venue"
                          onChange={event => this.onInputChange(event)}
                          value={this.state.venue}
                          onFocus={event => this.onControlFocus(event)}
                          onBlur={e => this.validateVenue(this.state.venue)}
                          data-tip={this.state.venueErrorMessage}
                        /> */}
                      <Geosuggest
                        name="userAddress"
                        inputClassName="form-control input-control "
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
                    <div className="form-group cls-relative">
                      <label htmlFor="timeZone">Time Zone</label>
                      <Select
                        className="selectCategoryInput input-control"
                        name="timeZone"
                        value={this.state.timeZone}
                        options={timeZoneOptions}
                        placeholder="Select Timezone..."
                        onChange={this.onTimeZoneChange}
                      />
                      {/* <TimezonePicker
                          defaultValue={this.state.timeZone}
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
                          className="form-control input-control"
                        />*/}
                      <i className="fa fa-check tbCheck" />
                    </div>
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
                        onChange={event => this.onEventFeeChange(event)}
                        onFocus={event => this.onControlFocus(event)}
                        onBlur={e => this.validateEventFee(this.state.eventFee)}
                        data-tip={this.state.eventFeeErrorMessage}
                        value={this.state.eventFee}
                        maxLength="7"
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
                                      this.state.newBannerImageAWSURL
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
                          onChange={event => this.onInputChange(event)}
                          onFocus={event => this.onControlFocus(event)}
                          onBlur={e =>
                            this.validateDescription(this.state.description)
                          }
                          data-tip={this.state.descriptionErrorMessage}
                          value={this.state.description}
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
                <a className="btnTag mb-20" onClick={this.onClickAddEvent}>
                  <i className="fa fa-arrow-right" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/*this.renderInterestModal()*/}
      </div>
    );
  }
  renderInterestModal = () => {
    return (
      <div className="modal fade" id="myModal" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content InterestModal">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
              <h4 className="modal-title text-center">YOUR INTERESTS</h4>
            </div>

            <div className="modal-body">
              <div className="panel-group" id="accordion">
                {this.state.userAllCategoryList.map((categoryObj, index) => {
                  return (
                    <div key={index} className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          <a
                            data-toggle="collapse"
                            data-parent="#accordion"
                            href={'#' + categoryObj.categoryId}
                          >
                            {categoryObj.categoryName}
                          </a>
                        </h4>
                      </div>

                      <div
                        id={categoryObj.categoryId}
                        className="panel-collapse collapse in panel-content"
                        className={classNames(
                          'panel-collapse collapse panel-content',
                          {
                            in: index == 0
                          }
                        )}
                      >
                        <div className="panel-body">
                          <div className="chooseStudy">
                            <div className="row">
                              {categoryObj.subCategoryRes.map(
                                (subcategoryObj, subIndex) => {
                                  return (
                                    <div
                                      key={subIndex}
                                      className="col-sm-6 col-md-4"
                                    >
                                      <div>
                                        <input
                                          type="checkbox"
                                          className="custom-checkbox"
                                          id={subcategoryObj.subCategoryId}
                                          name={subcategoryObj.subCategoryId}
                                          checked={
                                            categoryObj.selectedIds.indexOf(
                                              subcategoryObj.subCategoryId
                                            ) >= 0
                                              ? true
                                              : false
                                          }
                                          onChange={() =>
                                            this.onSelectCategory(
                                              categoryObj,
                                              subcategoryObj
                                            )
                                          }
                                        />
                                        <label
                                          className="checkbox-custom-label"
                                          htmlFor={subcategoryObj.subCategoryId}
                                        >
                                          {subcategoryObj.subCategoryName}
                                        </label>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

function mapStateToProps(state) {
  return { userInfo: state.profileData, events: state.events };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actionAddEvent,
      actionActiveEvent,
      actionManagerAccess,
      editEvent,
      uploadImageToAwsServer,
      actionGetAllCategory,
      showLoader,
      hideLoader,
      actionCreateCategory
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEvent);

// window.onbeforeunload = function(events) {
//   var prevent = false;
//   if(events && events.emit)
//     events.emit('will-leave', {
//       preventDefault: function(reason) {
//         prevent = reason;
//       }
//     });
//   if (prevent) return prevent;
// };
