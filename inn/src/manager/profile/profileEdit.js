import React, { Component } from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import validator from 'validator';
import classNames from 'classnames';
import { DatePicker } from 'react-md';
import Select from 'react-select';
import FileDragAndDrop from 'react-file-drag-and-drop';
import Geosuggest from 'react-geosuggest';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';

import {
  actiongGetProfileDataById,
  actionGetAllCategory,
  actiongUpdateProfileDataById
} from '../../common/action/index';
import { createEventDirectory, addPhoto } from '../../common/core/aws-s3';
import {
  generateUniqueId,
  showWarningToast
} from '../../common/core/common-functions';
import Img from '../../common/core/img';

import logo from '../../img/innovecsyslogoblack.png';
import lights from '../../img/lights.jpg';
import nature from '../../img/nature.jpg';
import event_1 from '../../img/event_1.jpg';
import profileImg from '../../img/profileImg.png';
import adminuser from '../../img/admin-user.png';
import fourColimg from '../../img/fourColimg.png';
import uerDefault from '../../img/user_default.jpg';
import Sprite from '../../img/sprite.svg';

var statusOptions = [
  {
    value: 'Industrial and manufacturing',
    label: 'Industrial and manufacturing'
  },
  {
    value: 'Business and Financial Operations',
    label: 'Business and Financial Operations'
  },
  { value: 'Computer and Mathematical', label: 'Computer and Mathematical' },
  {
    value: 'Architecture and Engineering',
    label: 'Architecture and Engineering'
  },
  {
    value: 'Life, Physical, and Social Science',
    label: 'Life, Physical, and Social Science'
  },
  {
    value: 'Community and Social Service',
    label: 'Community and Social Service'
  },
  { value: 'Legal', label: 'Legal' },
  {
    value: 'Law Enforcement and Armed Forces',
    label: 'Law Enforcement and Armed Forces'
  },
  {
    value: 'Education, Training, and Library',
    label: 'Education, Training, and Library'
  },
  { value: 'Science and technology', label: 'Science and technology' },
  {
    value: 'Arts, Design, Entertainment, Sports, and Media',
    label: 'Arts, Design, Entertainment, Sports, and Media'
  },
  {
    value: 'Healthcare Practitioners and Technical',
    label: 'Healthcare Practitioners and Technical'
  },
  { value: 'Protective Service', label: 'Protective Service' },
  {
    value: 'Food Preparation and Serving Related',
    label: 'Food Preparation and Serving Related'
  },
  {
    value: 'Building and Grounds Cleaning and Maintenance',
    label: 'Building and Grounds Cleaning and Maintenance'
  },
  { value: 'Personal Care and Service', label: 'Personal Care and Service' },
  { value: 'Sales and Related', label: 'Sales and Related' },
  {
    value: 'Office and Administrative Support',
    label: 'Office and Administrative Support'
  },
  {
    value: 'Farming, Fishing, and Forestry',
    label: 'Farming, Fishing, and Forestry'
  },
  {
    value: 'Construction and Extraction',
    label: 'Construction and Extraction'
  },
  {
    value: 'Installation, Maintenance, and Repair',
    label: 'Installation, Maintenance, and Repair'
  },
  { value: 'Transportation', label: 'Transportation' }
];

class ProfileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadFileSize: 5368709120,
      userProfileData: {},
      userAllCategoryList: [],
      selectedUserCategoryList: [],
      subCategoryIdsForOffNotification: [],
      eventIdsForOffNotification: [],
      innovecsysNotification: '',
      selectedSubscribeNotificationSubCat: [],
      selectedSubscribeNotificationEvent: [],
      selectedInnovecsysNotification: '',

      userFirstName: '',
      isUserFirstNameValid: false,
      userFirstNameErrorMessage: '',
      userFirstNameActive: false,

      userLastName: '',
      isUserLastNameValid: false,
      userLastNameErrorMessage: '',
      userLastNameActive: false,

      userGender: 'male',

      userDOB: null,
      isUserDOBValid: false,
      userDOBErrorMessage: '',
      userDOBActive: false,

      userProfession: '',
      isUserProfessionValid: false,
      userProfessionErrorMessage: '',
      userProfessionActive: false,

      userOrganization: '',
      isUserOrganizationValid: false,
      userOrganizationErrorMessage: '',
      userOrganizationActive: false,

      userInterest: '',
      isUserInterestValid: false,
      userInterestErrorMessage: '',
      userInterestActive: false,

      userMobileNumber: '',
      isUserMobileNumberValid: false,
      userMobileNumberErrorMessage: '',
      userMobileNumberActive: false,

      userEmail: '',
      isUserEmailValid: false,
      userEmailErrorMessage: '',
      userEmailActive: false,

      userAddress: '',
      isUserAddressValid: false,
      userAddressErrorMessage: '',
      userAddressActive: false,

      showDOBDatePicker: false,
      showInterestModal: false,
      imageUplodInProgress: false,
      userImageAWSURL: '',
      fileUploadProgress: 0,
      totalAvailableInterest: 0
    };

    this.onSelectCategory = this.onSelectCategory.bind(this);
    this.onLocationFocus = this.onLocationFocus.bind(this);
    this.validateLocation = this.validateLocation.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.onLocationSelect = this.onLocationSelect.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.setFileUploadProgress = this.setFileUploadProgress.bind(this);
  }

  componentWillMount() {}

  componentWillReceiveProps(res) {
    try {
      let userProfileData = JSON.parse(JSON.stringify(res.userProfileData));

      let selectedUserCategory = [];
      let totalAvailableInterest = 0;

      let userAllCategoryList =
        JSON.parse(JSON.stringify(res.userAllCategoryList)) || [];

      userAllCategoryList.forEach(categoryObj => {
        let obj = {};
        obj['id'] = categoryObj.categoryId;
        obj['listOfIdAndName'] = [];
        totalAvailableInterest += categoryObj.subCategoryRes.length;
        userProfileData.listOfCategoryId.forEach(innerCategoryObj => {
          if (innerCategoryObj.id == categoryObj.categoryId) {
            obj['listOfIdAndName'] = innerCategoryObj.listOfIdAndName;
          }
        });
        selectedUserCategory.push(obj);
      });

      let notificationResponse = {};
      let subCategoryIdsForOffNotification = [];
      let eventIdsForOffNotification = [];
      let innovecsysNotification = '';

      if (userProfileData.notificationResponse) {
        subCategoryIdsForOffNotification =
          userProfileData.notificationResponse[
            'subCategoryIdsForOffNotification'
          ] || {};
        eventIdsForOffNotification =
          userProfileData.notificationResponse['eventIdsForOffNotification'] ||
          {};
        innovecsysNotification =
          userProfileData.notificationResponse['innovecsysNotification'];
      }

      this.setState(
        {
          userProfileData: userProfileData,
          userAllCategoryList: userAllCategoryList,
          selectedUserCategoryList: selectedUserCategory || [], //res.userProfileData.listOfCategoryId || [],
          userFirstName: userProfileData.firstName || '',
          isUserFirstNameValid: true,
          userFirstNameErrorMessage: '',
          userLastName: userProfileData.lastName || '',
          isUserLastNameValid: true,
          userLastNameErrorMessage: '',
          userGender: userProfileData.gender || '',
          userDOB: userProfileData.dateOfBirth || null,
          isUserDOBValid: true,
          userDOBErrorMessage: '',
          userProfession: userProfileData.profession[0] || '',
          userOrganization: userProfileData.organization || '',
          isUserOrganizationValid: true,
          userOrganizationErrorMessage: '',
          userOrganizationActive: false,
          userInterest: '',
          isUserInterestValid: true,
          userInterestErrorMessage: '',
          userMobileNumber: userProfileData.mobile || '',
          isUserMobileNumberValid: true,
          userMobileNumberErrorMessage: '',
          userEmail: userProfileData.email || '',
          isUserEmailValid: true,
          userEmailErrorMessage: '',
          userAddress: res.userProfileData.addressResponse
            ? res.userProfileData.addressResponse.detailedLocation
            : '',
          isUserAddressValid: true,
          userAddressErrorMessage: '',
          userImageAWSURL: userProfileData.profilePhotoURL,
          totalAvailableInterest: totalAvailableInterest,
          subCategoryIdsForOffNotification:
            subCategoryIdsForOffNotification || {},
          eventIdsForOffNotification: eventIdsForOffNotification || {},
          innovecsysNotification: innovecsysNotification,
          selectedInnovecsysNotification: innovecsysNotification,
          selectedSubscribeNotificationEvent: [],
          selectedSubscribeNotificationSubCat: []
        },
        () => {
          this.closeInterestModal();
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {}

  onControlFocus(e) {
    const name = e.target.name;

    let controlErrorMessage = name + 'ErrorMessage';
    let controlActive = name + 'Active';
    this.setState({
      [controlErrorMessage]: '',
      [controlActive]: true
    });
    ReactTooltip.hide();
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  handleUserInputWithFirstCapital(e) {
    const name = e.target.name;
    let value = e.target.value;
    value = value.charAt(0).toUpperCase() + value.slice(1);
    this.setState({ [name]: value });
  }

  handleUserAlphabetInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[a-zA-Z]*$/);
    if (value === '' || regExp.test(value) === true) {
      this.setState({ [name]: value });
    }
  }

  handleUserAlphabetInputWithSpace(e) {
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[a-zA-Z ]*$/);
    if (value === '' || regExp.test(value) === true) {
      this.setState({ [name]: value });
    }
  }

  handleUserNumericInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      this.setState({ [name]: value });
    }
  }

  ////////////////////////// first name

  validateFirstName(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'First name is required';
      this.setState({
        isUserFirstNameValid: false,
        userFirstNameErrorMessage: errMessage,
        userFirstNameActive: false
      });
      return 0;
    }

    this.setState({
      isUserFirstNameValid: true,
      userFirstNameErrorMessage: '',
      userFirstNameActive: false
    });
    return 1;
  }

  //////////////////////////// last name
  validateLastName(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Last name is required';
      this.setState({
        isUserLastNameValid: false,
        userLastNameErrorMessage: errMessage,
        userLastNameActive: false
      });
      return 0;
    }

    this.setState({
      isUserLastNameValid: true,
      userLastNameErrorMessage: '',
      userLastNameActive: false
    });
    return 1;
  }

  ///////////////////////// profession

  userProfessionChange(userProfession) {
    if (userProfession) {
      this.setState({ userProfession: userProfession.value });
    } else {
      this.setState({ userProfession: '' });
    }
  }

  /////////////////////////// organisation

  validateOrganisation(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Organization is required';
      this.setState({
        isUserOrganizationValid: false,
        userOrganizationErrorMessage: errMessage,
        userOrganisationActive: false
      });
      return 0;
    }

    this.setState({
      isUserOrganizationValid: true,
      userOrganizationErrorMessage: '',
      userOrganizationActive: false
    });
    return 1;
  }

  ///////////////////////////// mobile

  validateMobileNumber(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Mobile number is required';
      this.setState({
        isUserMobileNumberValid: false,
        userMobileNumberErrorMessage: errMessage,
        userMobileNumberActive: false
      });
      return 0;
    }

    if (value.toString().trim().length < 4) {
      errMessage = 'Mobile number should be minimum 4 characters';
      this.setState({
        isUserMobileNumberValid: false,
        userMobileNumberErrorMessage: errMessage,
        userMobileNumberActive: false
      });
      return 0;
    }

    this.setState({
      isUserMobileNumberValid: true,
      userMobileNumberErrorMessage: '',
      userMobileNumberActive: false
    });
    return 1;
  }

  ////////////////////////////// Email
  validateEmail(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Email is required';
      this.setState({
        isUserEmailValid: false,
        userEmailErrorMessage: errMessage,
        userEmailActive: false
      });
      return;
    }

    if (!validator.isEmail(value)) {
      errMessage = `Email is not valid`;
      this.setState({
        isUserEmailValid: false,
        userEmailErrorMessage: errMessage,
        userEmailActive: false
      });
      return;
    }

    this.setState({
      isUserEmailValid: true,
      userEmailErrorMessage: '',
      userEmailActive: false
    });
  }

  /////////////////////////// interest

  showInterestModal = () => {
    this.setState({
      showInterestModal: true
    });
  };

  closeInterestModal = () => {
    let self = this;
    let count = 0;
    self.state.selectedUserCategoryList.map(catObj => {
      count += catObj.listOfIdAndName.length;
    });

    console.log(
      'self.state.selectedUserCategoryList',
      self.state.selectedUserCategoryList
    );

    if (count == 0) {
      self.setState({
        userInterest: '',
        isUserInterestValid: false,
        userInterestErrorMessage: 'Interest is required',
        userInterestActive: false,
        showInterestModal: false
      });
      return;
    }

    self.setState({
      userInterest: count,
      isUserInterestValid: true,
      userInterestErrorMessage: '',
      userInterestActive: false,
      showInterestModal: false
    });
  };

  validateInterest(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Interest is required';
      this.setState({
        isUserInterestValid: false,
        userInterestErrorMessage: errMessage,
        userInterestActive: false
      });
      return 0;
    }

    this.setState({
      isUserInterestValid: true,
      userInterestErrorMessage: '',
      userInterestActive: false
    });
    return 1;
  }

  onSelectCategory(categoryObj, subCategoryObj) {
    // get match category object  with selected object
    console.log(
      'this.state.selectedUserCategoryList',
      this.state.selectedUserCategoryList
    );

    console.log('categoryObj', categoryObj);
    console.log('subCategoryObj', subCategoryObj);

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

    this.countInterest();
  }

  onSelectAllSubCategory = (categoryObj, isChecked) => {
    try {
      categoryObj.subCategoryRes.forEach(subCat => {
        if (categoryObj.selectedIds.indexOf(subCat.subCategoryId) < 0) {
          categoryObj.selectedIds.push(subCat.subCategoryId);
        }
      });

      if (isChecked == false) {
        categoryObj.selectedIds = [];
      }

      this.state.selectedUserCategoryList.map((item, index) => {
        if (item.id == categoryObj.categoryId) {
          item.listOfIdAndName = [];

          categoryObj.selectedIds.forEach(subcatid => {
            item.listOfIdAndName.push({ id: subcatid });
          });
        }
      });

      this.setState({
        userAllCategoryList: this.state.userAllCategoryList,
        selectedUserCategoryList: this.state.selectedUserCategoryList
      });
      this.countInterest();
    } catch (err) {
      console.log(err);
    }
  };

  onSelectAllCategory = isChecked => {
    try {
      this.state.userAllCategoryList.map(categoryObj => {
        categoryObj.subCategoryRes.forEach(subCat => {
          if (categoryObj.selectedIds.indexOf(subCat.subCategoryId) < 0) {
            categoryObj.selectedIds.push(subCat.subCategoryId);
          }
        });
        if (isChecked == false) {
          categoryObj.selectedIds = [];
        }

        this.state.selectedUserCategoryList.map((item, index) => {
          if (item.id == categoryObj.categoryId) {
            item.listOfIdAndName = [];

            categoryObj.selectedIds.forEach(subcatid => {
              item.listOfIdAndName.push({ id: subcatid });
            });
          }
        });
      });

      this.setState({
        userAllCategoryList: this.state.userAllCategoryList,
        selectedUserCategoryList: this.state.selectedUserCategoryList
      });
      this.countInterest();
    } catch (err) {
      console.log(err);
    }
  };

  countInterest = () => {
    try {
      let self = this;
      let count = 0;
      self.state.selectedUserCategoryList.map(catObj => {
        count += catObj.listOfIdAndName.length;
      });

      if (count == 0) {
        self.setState({
          userInterest: ''
        });
        return;
      }

      self.setState({
        userInterest: count
      });
    } catch (err) {
      console.log(err);
    }
  };

  ///////////////////////// Date of birth
  showDOBDate = () => {
    this.setState({ showDOBDatePicker: true });
  };

  handleChangeDOBDate = (value, dateValue, event, self) => {
    self.setState({
      userDOB: dateValue,
      isUserDOBValid: true,
      userDOBErrorMessage: '',
      userDOBActive: false
    });
  };
  handleVisibilityChangeDOBDate = visible => {
    this.setState({ showDOBDatePicker: visible, userDOBActive: false });
  };

  ///////////////// location field validation

  onLocationChange(value) {
    this.setState({
      userAddress: value
    });
  }

  onLocationSelect(suggest) {
    this.setState({
      userAddress: suggest
    });
  }

  onLocationFocus() {
    this.setState({
      userAddressErrorMessage: '',
      userAddressActive: true
    });
    ReactTooltip.hide();
  }

  validateLocation(value) {
    let errMessage;
    if (value == undefined || value == '') {
      errMessage = 'Address is required';
      this.setState({
        isUserAddressValid: false,
        userAddressErrorMessage: errMessage,
        userAddressActive: false
      });
      return 0;
    }

    this.setState({
      isUserAddressValid: true,
      userAddressErrorMessage: '',
      userAddressActive: false,
      userAddress: value
    });
    return 1;
  }

  setFileUploadProgress(progressValue) {
    this.setState({
      fileUploadProgress: progressValue
    });
  }

  handleDrop(dataTransfer) {
    let _this = this;

    if (dataTransfer && dataTransfer.files && dataTransfer.files[0]) {
      if (dataTransfer.files[0].size <= this.state.uploadFileSize) {
        _this.setState({
          imageUplodInProgress: true,
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
          createEventDirectory('userprofile', function(result) {
            if (result.directoryStatus) {
              console.log('directory created');
              let fileName = targetElement.files[0].name;
              let fileNameArray = fileName.split('.');
              fileNameArray[fileNameArray.length - 2] =
                _this.props.userInfo.id + '_' + generateUniqueId();
              fileName = fileNameArray.join('.');
              addPhoto(
                'userprofile',
                targetElement,
                fileName,
                null,
                (error, data) => {
                  console.log('upload success', error, data);
                  _this.setState({
                    imageUplodInProgress: false
                  });
                  if (error) {
                    return;
                  }
                  if (data.Location) {
                    const userImageAWSURL = data.Location;
                    _this.setState({
                      userImageAWSURL
                      // isFormChanged: true
                    });
                  }
                },
                _this.setFileUploadProgress
              );
            } else {
              console.log('directory creation failed');
            }
          });
        } catch (e) {
          console.log(e.message);
        }
        //END Uploading banner image on AWS server
      } else {
        showWarningToast("Can't upload file more then 5 MB");
      }
    }
  }

  /////////////////////////////// on submit

  onUpdateProfile = () => {
    if (
      this.state.isUserFirstNameValid != true ||
      this.state.isUserLastNameValid != true ||
      this.state.isUserMobileNumberValid != true ||
      // this.state.isUserPasswordValid != true ||
      this.state.isUserEmailValid != true ||
      // this.state.isUserProfessionValid != true ||
      this.state.isUserInterestValid != true ||
      this.state.isUserOrganizationValid != true ||
      this.state.isUserDOBValid != true ||
      this.state.isUserAddressValid != true
    ) {
      console.log('All fields not valid');
      return;
    }

    // send only selected category
    let localCategoryList = [];
    localCategoryList = this.state.selectedUserCategoryList.filter(
      (categoryObj, index) => {
        return categoryObj.listOfIdAndName.length > 0;
      }
    );

    let userEditProfileObject = {};
    userEditProfileObject['firstName'] = this.state.userFirstName;
    userEditProfileObject['lastName'] = this.state.userLastName;
    userEditProfileObject['mobileNumber'] = this.state.userMobileNumber;
    // userEditProfileObject['password'] = this.state.userPassword;
    userEditProfileObject['email'] = this.state.userEmail;
    userEditProfileObject['profession'] = this.state.userProfession;
    userEditProfileObject['interest'] = [];
    userEditProfileObject['organisation'] = this.state.userOrganization;
    userEditProfileObject['dob'] = this.state.userDOB;
    userEditProfileObject['gender'] = this.state.userGender;
    userEditProfileObject['address'] = this.state.userAddress;
    userEditProfileObject['userTypeId'] = 1;
    userEditProfileObject['listOfCategoryId'] = localCategoryList || [];

    console.log('userEditProfileObject', userEditProfileObject);

    let sendDataObj = {
      userId: this.props.userId,
      firstName: userEditProfileObject['firstName'],
      lastName: userEditProfileObject['lastName'],
      email: userEditProfileObject['email'],
      userName: '',
      //   oldPassword: '',
      //   password: userEditProfileObject['password'],
      coverPhotoURL: '',
      profilePhotoURL: this.state.userImageAWSURL,
      mobile: userEditProfileObject['mobileNumber'],
      profession: [userEditProfileObject['profession']],
      interest: [],
      organization: userEditProfileObject['organisation'],
      dateOfBirth: userEditProfileObject['dob'],
      gender: userEditProfileObject['gender'],
      companyId: '',
      addressRequest: {
        detailedLocation:
          userEditProfileObject['address'] instanceof Object
            ? userEditProfileObject['address'].description
            : userEditProfileObject['address'],
        city: '',
        state: '',
        country: '',
        latitude: '',
        longitude: ''
      },
      userTypeId: userEditProfileObject['userTypeId'],
      listOfCategoryId: userEditProfileObject['listOfCategoryId']
    };

    console.log('sendDataObj', sendDataObj);

    this.props.actiongUpdateProfileDataById(sendDataObj).then(
      res => {
        console.log('res', res);
        this.props.refresProfileData();
        // if (res.payload.data.status == 200) this.resetForm();
      },
      err => {
        console.log('err', err);
      }
    );
  };

  render() {
    const userImageAWSURL = this.state.userImageAWSURL;
    const profileImage = userImageAWSURL ? userImageAWSURL : uerDefault;
    return (
      <div className="modal fade" id="myModal" role="dialog">
        <ReactTooltip effect="solid" type="error" place="bottom" />
        <div className="modal-dialog profileEditModal modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                <span className="ico-close">
                  <svg>
                    <use xlinkHref={`${Sprite}#close`} />
                  </svg>
                </span>
              </button>
              <h4 className="modal-title text-center">EDIT PROFILE</h4>
            </div>

            <div className="modal-body">
              <div className="probannerBg" />
              <div className="editProfile-Sec">
                <div className="editProfileImg">
                  <FileDragAndDrop onDrop={this.handleDrop}>
                    <Img src={userImageAWSURL} default={uerDefault} />
                    {/* <img src={userImageAWSURL ? userImageAWSURL :profileImg} className="" alt="" /> */}
                    <input
                      id="fileSelector"
                      type="file"
                      className="hide"
                      accept="image/*"
                      ref={fileInput => (this.fileInput = fileInput)}
                      onChange={event => {
                        const evt = event;
                        this.handleDrop(evt.target);
                      }}
                    />
                    <div
                      className={
                        this.state.imageUplodInProgress
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
                    <a
                      onClick={() => this.fileInput.click()}
                      className="editIcon"
                    >
                      <span className="ico-pen">
                        <svg>
                          <use xlinkHref={`${Sprite}#penIco`} />
                        </svg>
                      </span>
                    </a>
                  </FileDragAndDrop>
                </div>
                <form className="form-card">
                  <div className="row">
                    <div className="col-sm-6 col-md-6">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError:
                              this.state.userFirstNameErrorMessage.length > 0,
                            tbFocus: this.state.userFirstNameActive
                          }
                        )}
                      >
                        <label htmlFor="eventName">First Name </label>
                        <input
                          type="text"
                          className="form-control input-control"
                          name="userFirstName"
                          placeholder="First Name"
                          maxLength="50"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event =>
                            this.handleUserInputWithFirstCapital(event)
                          }
                          onBlur={e =>
                            this.validateFirstName(this.state.userFirstName)
                          }
                          value={this.state.userFirstName}
                          data-tip={this.state.userFirstNameErrorMessage}
                        />

                        {this.state.userFirstNameErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isUserFirstNameValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError:
                              this.state.userLastNameErrorMessage.length > 0,
                            tbFocus: this.state.userLastNameActive
                          }
                        )}
                      >
                        <label htmlFor="eventName">Last Name </label>
                        <input
                          type="text"
                          className="form-control input-control"
                          placeholder="Last Name"
                          name="userLastName"
                          maxLength="50"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event =>
                            this.handleUserInputWithFirstCapital(event)
                          }
                          onBlur={e =>
                            this.validateLastName(this.state.userLastName)
                          }
                          value={this.state.userLastName}
                          data-tip={this.state.userLastNameErrorMessage}
                        />
                        {this.state.userLastNameErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isUserLastNameValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 col-md-6">
                      <div className="form-group cls-relative ripple">
                        <label htmlFor="eventName">Gender </label>
                        <div className="maleFemaleBtn flex-row">
                          <div className="male">
                            <input
                              type="radio"
                              id="a"
                              value="male"
                              checked={this.state.userGender === 'male'}
                              name="userGender"
                              onChange={event => this.handleUserInput(event)}
                            />
                            <label className="checkmark" htmlFor="a">
                              Male
                            </label>
                            <svg>
                              <use xlinkHref={`${Sprite}#male`} />
                            </svg>
                          </div>
                          <div className="female">
                            <input
                              type="radio"
                              id="b"
                              value="female"
                              checked={this.state.userGender === 'female'}
                              name="userGender"
                              onChange={event => this.handleUserInput(event)}
                            />
                            <label className="checkmark" htmlFor="b">
                              Female
                            </label>
                            <svg>
                              <use xlinkHref={`${Sprite}#female`} />
                            </svg>
                          </div>
                        </div>
                        {/* <input
                          type="text"
                          className="form-control input-control"
                          id=""
                          name=""
                          placeholder="Lorem"
                        /> */}
                        {/* <i className="fa fa-check tbCheck" /> */}
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                      <div
                        className={classNames('form-group cls-relative', {
                          tbError: this.state.userDOBErrorMessage.length > 0,
                          tbFocus: this.state.userDOBActive
                        })}
                        data-tip={this.state.userDOBErrorMessage}
                      >
                        <label htmlFor="eventName">Date of Birth </label>
                        <input
                          type="text"
                          maxLength="80"
                          className="form-control input-control"
                          placeholder="Date of Birth"
                          name="userDOB"
                          readOnly
                          onClick={event => {
                            this.onControlFocus(event);
                            this.showDOBDate();
                          }}
                          value={
                            this.state.userDOB
                              ? moment(this.state.userDOB).format(
                                  'MMMM DD, YYYY'
                                )
                              : ''
                          }
                        />

                        <DatePicker
                          id="date-picker-controlled"
                          label="Select date"
                          visible={this.state.showDOBDatePicker}
                          className="md-cell cls-edit-dob-datepicker"
                          animateInline={false}
                          textFieldClassName="hide"
                          onChange={(value, dateValue, even) =>
                            this.handleChangeDOBDate(
                              value,
                              dateValue,
                              even,
                              this
                            )
                          }
                          onVisibilityChange={
                            this.handleVisibilityChangeDOBDate
                          }
                          maxDate={new Date()}
                        />

                        {this.state.userDOBErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isUserDOBValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 col-md-6">
                      <div className="form-group cls-relative ">
                        {/* <label for="eventName">Profession </label>
                        <input
                          type="text"
                          className="form-control input-control"
                          id=""
                          name=""
                          placeholder="Lorem"
                        />
                        <i className="fa fa-check tbCheck" /> */}
                        <label htmlFor="eventName">Profession</label>
                        <Select
                          name="userProfession"
                          value={this.state.userProfession}
                          options={statusOptions}
                          onChange={this.userProfessionChange.bind(this)}
                          placeholder="Profession"
                        />
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError:
                              this.state.userOrganizationErrorMessage.length >
                              0,
                            tbFocus: this.state.userOrganizationActive
                          }
                        )}
                      >
                        <label htmlFor="eventName">Organization </label>
                        <input
                          type="text"
                          className="form-control input-control"
                          maxLength="100"
                          placeholder="Organization"
                          name="userOrganization"
                          maxLength="100"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event => this.handleUserInput(event)}
                          onBlur={e =>
                            this.validateOrganisation(
                              this.state.userOrganization
                            )
                          }
                          value={this.state.userOrganization}
                          data-tip={this.state.userOrganizationErrorMessage}
                        />
                        {this.state.userOrganizationErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isUserOrganizationValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 col-md-6">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError:
                              this.state.userInterestErrorMessage.length > 0,
                            tbFocus: this.state.userInterestActive
                          }
                        )}
                      >
                        <label htmlFor="eventName">Interests </label>
                        <input
                          type="text"
                          className="form-control input-control"
                          placeholder="Interest"
                          name="userInterest"
                          readOnly
                          onFocus={event => {
                            this.onControlFocus(event);
                          }}
                          onClick={() => {
                            this.showInterestModal();
                          }}
                          onBlur={e =>
                            this.validateInterest(this.state.userInterest)
                          }
                          value={this.state.userInterest}
                          data-tip={this.state.userInterestErrorMessage}
                        />

                        {this.state.userInterestErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isUserInterestValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError:
                              this.state.userMobileNumberErrorMessage.length >
                              0,
                            tbFocus: this.state.userMobileNumberActive
                          }
                        )}
                      >
                        <label htmlFor="eventName">Phone </label>
                        <input
                          type="text"
                          className="form-control input-control"
                          placeholder="Mobile"
                          name="userMobileNumber"
                          maxLength="13"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event => this.handleUserNumericInput(event)}
                          onBlur={e =>
                            this.validateMobileNumber(
                              this.state.userMobileNumber
                            )
                          }
                          value={this.state.userMobileNumber}
                          data-tip={this.state.userMobileNumberErrorMessage}
                        />
                        {this.state.userMobileNumberErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isUserMobileNumberValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 col-md-6">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError:
                              this.state.userEmailErrorMessage.length > 0,
                            tbFocus: this.state.userEmailActive
                          }
                        )}
                      >
                        <label htmlFor="eventName">Email </label>
                        <input
                          type="text"
                          className="form-control input-control"
                          placeholder="Email"
                          name="userEmail"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event => this.handleUserInput(event)}
                          onBlur={e => this.validateEmail(this.state.userEmail)}
                          value={this.state.userEmail}
                          data-tip={this.state.userEmailErrorMessage}
                        />
                        {this.state.userEmailErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isUserEmailValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                      <div
                        className={classNames('form-group cls-relative', {
                          tbError:
                            this.state.userAddressErrorMessage.length > 0,
                          tbFocus: this.state.userAddressActive
                        })}
                        data-tip={this.state.userAddressErrorMessage}
                      >
                        {/* <label for="eventName">Address </label>
                        <input
                          type="text"
                          className="form-control input-control"
                          id=""
                          name=""
                          placeholder="Lorem"
                        />  */}
                        <label htmlFor="eventName">Address </label>
                        <Geosuggest
                          ref={el => (this._geoSuggest = el)}
                          name="userAddress"
                          inputClassName="form-control input-control"
                          onChange={this.onLocationChange}
                          onSuggestSelect={this.validateLocation}
                          onFocus={this.onLocationFocus}
                          onBlur={this.validateLocation}
                          initialValue={
                            this.state.userAddress instanceof Object
                              ? this.state.userAddress.description
                              : this.state.userAddress
                          }
                        />

                        {this.state.userAddressErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isUserAddressValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="subscribSettingDiv">
                <div className="panel-group">
                  <div className="panel panel-default">
                    <div
                      className="panel-heading"
                      data-toggle="collapse"
                      href="#collapse1"
                    >
                      <h4 className="panel-title">
                        Subscription Settings
                        <a className="pull-right">
                          <span className="ico-rightarrow">
                            <svg>
                              <use xlinkHref={`${Sprite}#rightarrowIco`} />
                            </svg>
                          </span>
                        </a>
                      </h4>
                    </div>
                    <div id="collapse1" className="panel-collapse collapse">
                      <div className="panel-body">
                        {this.renderSubscribeNotifications()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btnSuccess btnSave ml-10 ripple"
                  onClick={() => this.onUpdateProfile()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.renderInterestModal()}
      </div>
    );
  }

  renderInterestModal = () => {
    return (
      <Dialog
        open={this.state.showInterestModal}
        keepMounted
        onClose={this.closeInterestModal}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth={'md'}
        className="InterestModal"
      >
        <DialogTitle className="mdl-header">
          {'YOUR INTERESTS'}
          <span
            className="ico-close pull-right"
            onClick={() => {
              this.closeInterestModal();
            }}
          >
            <svg>
              <use xlinkHref={`${Sprite}#close`} />
            </svg>
          </span>
          <span className="headCheck">
            <input
              type="checkbox"
              className="customSelect-checkbox"
              id="selAllCat"
              name="selAllCat"
              onChange={event => this.onSelectAllCategory(event.target.checked)}
              checked={
                this.state.userInterest == this.state.totalAvailableInterest
                  ? true
                  : false
              }
            />
            <label className="checkbox-customSelect-label" htmlFor="selAllCat">
              select all
            </label>
          </span>
        </DialogTitle>

        <DialogContent className="mdl-body">
          <div>
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

                        <span className="pull-right">
                          <input
                            type="checkbox"
                            className="customSelect-checkbox"
                            id={'selall' + categoryObj.categoryId}
                            name={'selall' + categoryObj.categoryId}
                            onChange={event =>
                              this.onSelectAllSubCategory(
                                categoryObj,
                                event.target.checked
                              )
                            }
                            checked={
                              categoryObj.selectedIds.length ==
                              categoryObj.subCategoryRes.length
                                ? true
                                : false
                            }
                          />

                          <label
                            className="checkbox-customSelect-label"
                            htmlFor={'selall' + categoryObj.categoryId}
                          >
                            select all
                          </label>
                        </span>
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
        </DialogContent>
      </Dialog>
    );
  };

  onClickEvent = eventId => {
    let selectedSubscribeNotificationEvent = this.state
      .selectedSubscribeNotificationEvent;
    let index = selectedSubscribeNotificationEvent.indexOf(eventId);
    if (index >= 0) {
      selectedSubscribeNotificationEvent.splice(index, 1);
    } else {
      selectedSubscribeNotificationEvent.push(eventId);
    }
    this.setState({ selectedSubscribeNotificationEvent });

    console.log(
      'selectedSubscribeNotificationEvent',
      selectedSubscribeNotificationEvent
    );
  };

  onClickSubCategory = subCatId => {
    let selectedSubscribeNotificationSubCat = this.state
      .selectedSubscribeNotificationSubCat;
    let index = selectedSubscribeNotificationSubCat.indexOf(subCatId);
    if (index >= 0) {
      selectedSubscribeNotificationSubCat.splice(index, 1);
    } else {
      selectedSubscribeNotificationSubCat.push(subCatId);
    }
    this.setState({ selectedSubscribeNotificationSubCat });

    console.log(
      'selectedSubscribeNotificationSubCat',
      selectedSubscribeNotificationSubCat
    );
  };

  arrayIntersection = (arr1, arr2) => {
    return arr1
      .filter(x => !arr2.includes(x))
      .concat(arr2.filter(x => !arr1.includes(x)));
  };

  onClickInnovecsysNotification = () => {
    this.setState({
      selectedInnovecsysNotification: !this.state.selectedInnovecsysNotification
    });
    // this.state.selectedInnovecsysNotification =
  };

  renderSubscribeNotifications = () => {
    return (
      <div>
        {Object.keys(this.state.eventIdsForOffNotification).map(
          (eventId, eventIndex) => {
            return (
              <div className="reUnsubscribText">
                <button
                  type="button"
                  className={classNames('btn btnSubscribe ml-10 ripple', {
                    active:
                      this.state.selectedSubscribeNotificationEvent.indexOf(
                        eventId
                      ) >= 0
                  })}
                  onClick={() => this.onClickEvent(eventId)}
                >
                  Subscribe
                </button>

                <span className="ml-10">
                  {/* Re-Unsubscribe to the lorem ipsum Event */}

                  {this.state.eventIdsForOffNotification[eventId]}
                </span>
              </div>
            );
          }
        )}

        {Object.keys(this.state.subCategoryIdsForOffNotification).map(
          (subCatId, subCatIndex) => {
            return (
              <div className="reUnsubscribText">
                <button
                  type="button"
                  className={classNames('btn btnSubscribe ml-10 ripple', {
                    active:
                      this.state.selectedSubscribeNotificationSubCat.indexOf(
                        subCatId
                      ) >= 0
                  })}
                  onClick={() => this.onClickSubCategory(subCatId)}
                >
                  Subscribe
                </button>
                <span className="ml-10">
                  {/* Re-Unsubscribe to the lorem ipsum2 Event */}

                  {this.state.subCategoryIdsForOffNotification[subCatId]}
                </span>
              </div>
            );
          }
        )}

        {this.state.innovecsysNotification == false ? (
          <div className="reUnsubscribText">
            <button
              type="button"
              className="btn btnSubscribe ml-10 ripple"
              className={classNames('btn btnSubscribe ml-10 ripple', {
                active: this.state.selectedInnovecsysNotification == true
              })}
              onClick={() => this.onClickInnovecsysNotification()}
            >
              Subscribe
            </button>
            <span className="ml-10">
              Subscribe to any emails from innovacsys
            </span>
          </div>
        ) : null}
      </div>
    );
  };

  // renderSubscribeNotifications = () => {
  //   return (
  //     <div>
  //       {this.state.eventIdsForOffNotification.map((event, eventIndex) => {
  //         return (
  //           <div className="reUnsubscribText">
  //             <span className="">Re-Unsubscribe to the lorem ipsum Event</span>
  //             <button type="button" className="btn btnSubscribe ml-10 ripple">
  //               Subscribe
  //             </button>
  //           </div>
  //         );
  //       })}

  //       {this.state.subCategoryIdsForOffNotification.map(
  //         (subCat, subCatIndex) => {
  //           return (
  //             <div className="reUnsubscribText">
  //               <span className="">
  //                 Re-Unsubscribe to the lorem ipsum2 Event
  //               </span>
  //               <button type="button" className="btn btnSubscribe ml-10 ripple">
  //                 Subscribe
  //               </button>
  //             </div>
  //           );
  //         }
  //       )}
  //     </div>
  //   );
  // };
}

function mapStateToProps(state) {
  return {
    userInfo: state.profileData
    // userProfileData: state.userProfileData
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actiongGetProfileDataById: actiongGetProfileDataById,
      actionGetAllCategory: actionGetAllCategory,
      actiongUpdateProfileDataById: actiongUpdateProfileDataById
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);
// export default ProfileEdit;
