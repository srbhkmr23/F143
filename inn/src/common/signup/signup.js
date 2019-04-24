import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Flip from 'react-reveal/Flip';
import Slide from 'react-reveal/Slide';
import validator from 'validator';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import Select from 'react-select';

import { actionUserSignUp, actionGetAllCategory } from '../action';
import { ZoomInAndOut, setCookie } from '../core/common-functions';
import SelectionList from '../core/selectionList';
import Config from '../../common/core/config';

import '../../css/style.css';
import 'react-select/dist/react-select.css';

import logo_w from '../../img/innovecsys-w.png';
import Sprite from '../../img/sprite.svg';

// import Dialog from 'material-ui/Dialog';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import DatePicker from 'react-datepicker';

import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

import { DatePicker } from 'react-md';
import 'react-datepicker/dist/react-datepicker.css';
// import 'react-md/dist/react-md.amber-blue.min.css';

import Geosuggest from 'react-geosuggest';
import ValidatePass from '../change-password/validate-password';
import $ from 'jquery';

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

const customContentStyle = {
  width: '100%',
  maxWidth: 'none'
};

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userFirstName: '',
      isUserFirstNameValid: false,
      userFirstNameErrorMessage: '',
      userFirstNameActive: false,

      userLastName: '',
      isUserLastNameValid: false,
      userLastNameErrorMessage: '',
      userLastNameActive: false,

      userMobileNumber: '',
      isUserMobileNumberValid: false,
      userMobileNumberErrorMessage: '',
      userMobileNumberActive: false,

      userPassword: '',
      isUserPasswordValid: false,
      userPasswordErrorMessage: '',
      userPasswordActive: false,

      userEmail: '',
      isUserEmailValid: false,
      userEmailErrorMessage: '',
      userEmailActive: false,

      userProfession: '',
      isUserProfessionValid: false,
      userProfessionErrorMessage: '',
      userProfessionActive: false,

      userInterest: '',
      isUserInterestValid: false,
      userInterestErrorMessage: '',
      userInterestActive: false,

      userOrganization: '',
      isUserOrganizationValid: false,
      userOrganizationErrorMessage: '',
      userOrganizationActive: false,

      userDOB: null,
      isUserDOBValid: false,
      userDOBErrorMessage: '',
      userDOBActive: false,

      userGender: 'male',

      userAddress: '',
      isUserAddressValid: false,
      userAddressErrorMessage: '',
      userAddressActive: false,

      userAllCategoryList: [],
      selectedUserCategoryList: [],
      showDOBDatePicker: false,
      showModal: false,
      totalAvailableInterest: 0,
      openBusinessList: false
    };
    this._geoSuggest;
    this.openLandingPage = this.openLandingPage.bind(this);
    this.onSignUpFormSubmit = this.onSignUpFormSubmit.bind(this);
    this.onDOBSelect = this.onDOBSelect.bind(this);
    this.onLocationFocus = this.onLocationFocus.bind(this);
    this.validateLocation = this.validateLocation.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.onLocationSelect = this.onLocationSelect.bind(this);
    this.onSelectCategory = this.onSelectCategory.bind(this);
    this.userProfessionChange = this.userProfessionChange.bind(this);
  }

  componentDidMount() {
    console.log('this._geoSuggest', this._geoSuggest);
    // userAllCategory
    let totalAvailableInterest = 0;
    this.props.actionGetAllCategory().then(
      res => {
        console.log('res', res);
        if (res && res.payload) {
          let categoryList = res.payload.data.resourceData || [];
          let selectedUserCategoryList = [];
          categoryList.map(categoryObj => {
            let catObj = {};
            catObj['id'] = categoryObj.categoryId;
            catObj['listOfIdAndName'] = [];
            selectedUserCategoryList.push(catObj);
            categoryObj['selectedIds'] = [];
            totalAvailableInterest += categoryObj.subCategoryRes.length;
          });

          this.setState(
            {
              userAllCategoryList: categoryList,
              selectedUserCategoryList: selectedUserCategoryList,
              totalAvailableInterest: totalAvailableInterest
            },
            () => {
              console.log(
                'this.state.selectedUserCategoryList',
                this.state.selectedUserCategoryList
              );
            }
          );
        }
      },
      err => {
        console.log('err', err);
      }
    );
  }

  navigateToUrlPage = pageUrl => {
    // this.props.history.push(pageUrl);
    this.props.navigateToUrlPage(pageUrl);
  };

  // redirect to landing page
  openLandingPage() {
    // this.props.history.push('/');
    // this.props.openLandingPage()
    this.props.navigateToUrlPage('/');
  }

  onSelectCategory(categoryObj, subCategoryObj) {
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

    console.log(
      'this.state.userAllCategoryList',
      this.state.userAllCategoryList
    );

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

  // set state value on field change
  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  handleUserInputWithFirstCapital(e) {
    const name = e.target.name;
    let value = e.target.value;
    const regExp = new RegExp(Config.regExp_alphaNumeric);
    value = value.charAt(0).toUpperCase() + value.slice(1);
    if (value === '' || regExp.test(value) === true) {
      this.setState({
        [name]: value
      });
    }
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

  onDOBSelect(date) {
    this.setState({ userDOB: date });
  }

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

  validatePassword(value) {
    let errMessage;
    // if (!value.toString().trim().length) {
    //   errMessage = 'Password is required';
    //   this.setState({
    //     isUserPasswordValid: false,
    //     userPasswordErrorMessage: errMessage,
    //     userPasswordActive: false
    //   });
    //   return 0;
    // }

    if (ValidatePass(value)) {
      this.setState({
        isUserPasswordValid: false,
        userPasswordErrorMessage: ValidatePass(value),
        userPasswordActive: false
      });
      return 0;
    } else {
      this.setState({
        isUserPasswordValid: true,
        userPasswordErrorMessage: '',
        userPasswordActive: false
      });
      return 1;
    }
  }

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

  validateProfession(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Profession is required';
      this.setState({
        isUserProfessionValid: false,
        userProfessionErrorMessage: errMessage,
        userProfessionActive: false
      });
      return 0;
    }

    this.setState({
      isUserProfessionValid: true,
      userProfessionErrorMessage: '',
      userProfessionActive: false
    });
    return 1;
  }

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

  validateDOB(value) {
    // alert()
    console.log(value);
    let errMessage;
    if (value == null) {
      errMessage = 'DOB is not valid';
      this.setState({
        isUserDOBValid: false,
        userDOBErrorMessage: errMessage,
        userDOBActive: false
      });
      return 0;
    }

    this.setState({
      isUserDOBValid: true,
      userDOBErrorMessage: '',
      userDOBActive: false
    });
    return 1;
  }

  validateAddress(value) {
    let errMessage;
    if (!value.toString().trim().length) {
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
      userAddressActive: false
    });
    return 1;
  }

  ///////////////// location field validation

  onLocationChange(value) {
    console.log(value);
    this.setState({
      userAddress: value
    });
  }

  onLocationSelect(suggest) {
    console.log(suggest);
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

  ////////////

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

  // create signup object
  onSignUpFormSubmit() {
    console.log(this.state.userProfession);
    if (
      this.state.isUserFirstNameValid != true ||
      this.state.isUserLastNameValid != true ||
      this.state.isUserMobileNumberValid != true ||
      this.state.isUserPasswordValid != true ||
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

    let userSignUpObject = {};
    userSignUpObject['firstName'] = this.state.userFirstName;
    userSignUpObject['lastName'] = this.state.userLastName;
    userSignUpObject['mobileNumber'] = this.state.userMobileNumber;
    userSignUpObject['password'] = this.state.userPassword;
    userSignUpObject['email'] = this.state.userEmail;
    userSignUpObject['profession'] = this.state.userProfession;
    userSignUpObject['interest'] = [];
    userSignUpObject['organisation'] = this.state.userOrganization;
    userSignUpObject['dob'] = this.state.userDOB;
    userSignUpObject['gender'] = this.state.userGender;
    userSignUpObject['address'] = this.state.userAddress;
    userSignUpObject['userTypeId'] = 1;
    userSignUpObject['listOfCategoryId'] = localCategoryList || [];

    console.log('userSignUpObject', userSignUpObject);

    let sendDataObj = {
      firstName: userSignUpObject['firstName'],
      lastName: userSignUpObject['lastName'],
      email: userSignUpObject['email'],
      userName: '',
      oldPassword: '',
      password: userSignUpObject['password'],
      coverPhotoId: '',
      profilePhotoId: '',
      mobile: userSignUpObject['mobileNumber'],
      profession: [userSignUpObject['profession']],
      interest: [],
      organization: userSignUpObject['organisation'],
      dateOfBirth: userSignUpObject['dob'],
      gender: userSignUpObject['gender'],
      companyId: '',
      addressRequest: {
        detailedLocation:
          userSignUpObject['address'] instanceof Object
            ? userSignUpObject['address'].description
            : userSignUpObject['address'],
        city: '',
        state: '',
        country: '',
        latitude: '',
        longitude: ''
      },
      userTypeId: userSignUpObject['userTypeId'],
      listOfCategoryId: userSignUpObject['listOfCategoryId']
    };

    console.log('sendDataObj', sendDataObj);
    this.props.actionUserSignUp(sendDataObj).then(
      res => {
        console.log('res', res);
        if (res.payload && res.payload.data && res.payload.data.status == 200)
          this.resetForm();
      },
      err => {
        console.log('err', err);
      }
    );
  }

  resetForm() {
    let selectedUserCategoryList = [];
    this.state.userAllCategoryList.map(categoryObj => {
      let catObj = {};
      catObj['id'] = categoryObj.categoryId;
      catObj['listOfIdAndName'] = [];
      selectedUserCategoryList.push(catObj);
      categoryObj['selectedIds'] = [];
    });

    this._geoSuggest.clear();
    this.setState(
      {
        userFirstName: '',
        isUserFirstNameValid: false,
        userFirstNameErrorMessage: '',
        userFirstNameActive: false,

        userLastName: '',
        isUserLastNameValid: false,
        userLastNameErrorMessage: '',
        userLastNameActive: false,

        userMobileNumber: '',
        isUserMobileNumberValid: false,
        userMobileNumberErrorMessage: '',
        userMobileNumberActive: false,

        userPassword: '',
        isUserPasswordValid: false,
        userPasswordErrorMessage: '',
        userPasswordActive: false,

        userEmail: '',
        isUserEmailValid: false,
        userEmailErrorMessage: '',
        userEmailActive: false,

        userProfession: '',
        isUserProfessionValid: false,
        userProfessionErrorMessage: '',
        userProfessionActive: false,

        userInterest: '',
        isUserInterestValid: false,
        userInterestErrorMessage: '',
        userInterestActive: false,

        userOrganization: '',
        isUserOrganizationValid: false,
        userOrganizationErrorMessage: '',
        userOrganizationActive: false,

        userDOB: null,
        isUserDOBValid: false,
        userDOBErrorMessage: '',
        userDOBActive: false,
        userGender: 'male',
        userAddress: '',
        isUserAddressValid: false,
        userAddressErrorMessage: '',
        userAddressActive: false,
        selectedUserCategoryList,
        userAllCategoryList: this.state.userAllCategoryList
      },
      () => {
        console.log(
          'selectedUserCategoryList-->',
          this.state.selectedUserCategoryList
        );
        console.log('userAllCategoryList-->', this.state.userAllCategoryList);
      }
    );
  }

  showInterestModal = () => {
    this.setState({
      showModal: true
    });
  };

  closeInterestModal = () => {
    let self = this;
    let count = 0;
    self.state.selectedUserCategoryList.map(catObj => {
      count += catObj.listOfIdAndName.length;
    });

    if (count == 0) {
      self.setState({
        userInterest: '',
        isUserInterestValid: false,
        userInterestErrorMessage: 'Interest is required',
        userInterestActive: false,
        showModal: false
      });
      return;
    }

    self.setState({
      userInterest: count,
      isUserInterestValid: true,
      userInterestErrorMessage: '',
      userInterestActive: false,
      showModal: false
    });
  };

  ////////////////////  datepicker

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
    this.setState({ showDOBDatePicker: visible });
  };

  userProfessionChange(userProfession) {
    if (userProfession) {
      this.setState({ userProfession: userProfession.value });
    } else {
      this.setState({ userProfession: '' });
    }
  }

  handleMobileInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      this.setState({ [name]: value });
    }
  }

  onRgisterClick = () => {
    this.props.onRgisterClick();
  };

  render() {
    return (
      <div className="main-page ">
        {' '}
        {/*overflowHidden*/}
        {/* <ToastContainer
          autoClose={3000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        /> */}
        <ReactTooltip effect="solid" type="error" place="bottom" />
        {/* <Slide left duration={1000}> */}
        <div className="registration-page">
          <div className="signup">
            <div className="formField-content">
              <div className="signup-content">
                <div className="logo" onClick={this.openLandingPage}>
                  <img src={logo_w} alt="" className="img-responsive" />
                </div>
                <div className="form-panel content-center">
                  <h3 className="lead text-white text-left">
                    Register for new account
                  </h3>

                  <div className="form-row">
                    <div className="form-col pr-2">
                      <div
                        className={classNames('form-group ripple', {
                          tbError:
                            this.state.userFirstNameErrorMessage.length > 0,
                          tbFocus: this.state.userFirstNameActive
                        })}
                      >
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#userIco`} />
                          </svg>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="First Name"
                          name="userFirstName"
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
                          tabIndex="1"
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
                    <div className="col-sm-6 pl-2">
                      <div
                        className={classNames('form-group ripple', {
                          tbError:
                            this.state.userLastNameErrorMessage.length > 0,
                          tbFocus: this.state.userLastNameActive
                        })}
                      >
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#userIco`} />
                          </svg>
                        </span>
                        <input
                          type="text"
                          className="form-control"
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
                          tabIndex="2"
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

                  <div className="form-row">
                    <div className="form-col pr-2">
                      <div
                        className={classNames('form-group ripple', {
                          tbError:
                            this.state.userMobileNumberErrorMessage.length > 0,
                          tbFocus: this.state.userMobileNumberActive
                        })}
                      >
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#mobileIco`} />
                          </svg>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Mobile"
                          name="userMobileNumber"
                          maxLength="13"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event => this.handleMobileInput(event)}
                          onBlur={e =>
                            this.validateMobileNumber(
                              this.state.userMobileNumber
                            )
                          }
                          value={this.state.userMobileNumber}
                          data-tip={this.state.userMobileNumberErrorMessage}
                          tabIndex="3"
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
                    <div className="col-sm-6 pl-2">
                      <div
                        className={classNames('form-group ripple', {
                          tbError:
                            this.state.userPasswordErrorMessage.length > 0,
                          tbFocus: this.state.userPasswordActive
                        })}
                      >
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#lockIco`} />
                          </svg>
                        </span>
                        <input
                          type="password"
                          autoComplete="new-password"
                          maxLength="20"
                          className="form-control"
                          placeholder="Password"
                          name="userPassword"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event => this.handleUserInput(event)}
                          onBlur={e =>
                            this.validatePassword(this.state.userPassword)
                          }
                          value={this.state.userPassword}
                          data-tip={this.state.userPasswordErrorMessage}
                          tabIndex="4"
                        />
                        {this.state.userPasswordErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isUserPasswordValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-col pr-2">
                      <div
                        className={classNames('form-group ripple', {
                          tbError: this.state.userEmailErrorMessage.length > 0,
                          tbFocus: this.state.userEmailActive
                        })}
                      >
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#envelopIco`} />
                          </svg>
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          name="userEmail"
                          onFocus={event => {
                            this.onControlFocus(event);
                            this.setState({
                              openBusinessList: false
                            });
                          }}
                          onChange={event => this.handleUserInput(event)}
                          onBlur={e => this.validateEmail(this.state.userEmail)}
                          value={this.state.userEmail}
                          data-tip={this.state.userEmailErrorMessage}
                          tabIndex="5"
                          onKeyDown={e => {
                            let keyCode = e.keyCode || e.which;
                            if (keyCode === 9) {
                              //Open business drop down
                              this.setState({
                                openBusinessList: true
                              });
                            }
                          }}
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

                    <div className="col-sm-6 pl-2">
                      <div
                        className="form-group"
                        // className={classNames('form-group ripple', {
                        //   tbError:
                        //     this.state.userProfessionErrorMessage.length > 0,
                        //   tbFocus: this.state.userProfessionActive
                        // })}
                      >
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#briefcaseIco`} />
                          </svg>
                        </span>
                        {/* <Select
                        name="userProfession"
                        value={this.state.userProfession}
                        options={statusOptions}
                        onChange={this.userProfessionChange.bind(this)}
                        placeholder="Profession"
                      /> */}

                        <SelectionList
                          data={statusOptions}
                          name="userProfession"
                          value={this.state.userProfession}
                          onChange={this.userProfessionChange}
                          placeholder="Profession"
                          ref={img => (this.businessSelect = img)}
                          open={this.state.openBusinessList}
                        />

                        {/*onFocus={event => this.onControlFocus(event)}
                        onBlur={e =>
                            this.validateProfession(this.state.userProfession)
                          }
                          value={this.state.userProfession}
                          data-tip={this.state.userProfessionErrorMessage}

                         this.state.userProfessionErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isUserProfessionValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>

                      {/*<input
                          type="text"
                          className="form-control"
                          placeholder="Profession"
                          name="userProfession"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event => this.handleUserInput(event)}
                          onBlur={e =>
                            this.validateProfession(this.state.userProfession)
                          }
                          value={this.state.userProfession}
                          data-tip={this.state.userProfessionErrorMessage}
                        />*/}
                        {/* {this.state.userProfessionErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isUserProfessionValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}*/}
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-col pr-2">
                      <div
                        className={classNames('form-group ripple', {
                          tbError:
                            this.state.userInterestErrorMessage.length > 0,
                          tbFocus: this.state.userInterestActive
                        })}
                      >
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#typeIco`} />
                          </svg>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Interest"
                          name="userInterest"
                          readOnly
                          onFocus={event => this.onControlFocus(event)}
                          onClick={() => {
                            this.showInterestModal();
                          }}
                          // onChange={event => this.handleUserInput(event)}
                          onBlur={e => {
                            this.validateInterest(this.state.userInterest);
                            //Close business drop down
                            this.setState({
                              openBusinessList: false
                            });
                          }}
                          value={this.state.userInterest}
                          data-tip={this.state.userInterestErrorMessage}
                          data-toggle="modal"
                          data-target="#myModal"
                          tabIndex="7"
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
                    <div className="col-sm-6 pl-2">
                      <div
                        className={classNames('form-group ripple', {
                          tbError:
                            this.state.userOrganizationErrorMessage.length > 0,
                          tbFocus: this.state.userOrganizationActive
                        })}
                      >
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#buildingIco`} />
                          </svg>
                        </span>
                        <input
                          type="text"
                          className="form-control"
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
                          tabIndex="8"
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

                  <div className="form-row">
                    <div className="form-col pr-2">
                      <div
                        className={classNames('form-group ', {
                          tbError: this.state.userDOBErrorMessage.length > 0,
                          tbFocus: this.state.userDOBActive
                        })}
                        data-tip={this.state.userDOBErrorMessage}
                      >
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#calanderIco`} />
                          </svg>
                        </span>
                        {/* <input
                            type="text"
                            className="form-control"
                            placeholder="Date of Birth"
                            name="userDOB"
                            onFocus={event => this.onControlFocus(event)}
                            onChange={event => this.handleUserInput(event)}
                            onBlur={e => this.validateDOB(this.state.userDOB)}
                            value={this.state.userDOB}
                            data-tip={this.state.userDOBErrorMessage}
                          /> */}
                        {/* <DatePicker
                          className="form-control"
                          name="userDOB"
                          placeholderText="Date of Birth"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={this.onDOBSelect}
                          onBlur={e => this.validateDOB(this.state.userDOB)}
                          selected={this.state.userDOB}
                        /> */}

                        <input
                          type="text"
                          maxLength="80"
                          className="form-control input-control"
                          placeholder="Date of Birth"
                          name="userDOB"
                          readOnly
                          onFocus={event => {
                            this.onControlFocus(event);
                            this.showDOBDate();
                          }}
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
                          onBlur={e => this.validateDOB(this.state.userDOB)}
                          tabIndex="9"
                        />

                        <DatePicker
                          calendarClassName="cls-signup-datepicker"
                          id="date-picker-controlled"
                          label="Select date"
                          visible={this.state.showDOBDatePicker}
                          className="md-cell cls-dob-datepicker"
                          autoOk={true}
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
                    <div className="col-sm-6 pl-2">
                      <div className="maleFemaleBtn flex-row">
                        <div className="male">
                          <input
                            type="radio"
                            id="a"
                            checked={this.state.userGender === 'male'}
                            value="male"
                            name="userGender"
                            onChange={event => this.handleUserInput(event)}
                            tabIndex="10"
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
                            checked={this.state.userGender === 'female'}
                            value="female"
                            name="userGender"
                            onChange={event => this.handleUserInput(event)}
                            tabIndex="11"
                          />
                          <label className="checkmark" htmlFor="b">
                            Female
                          </label>
                          <svg>
                            <use xlinkHref={`${Sprite}#female`} />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-col width-100 pr-15">
                      <div
                        className={classNames('form-group width-100 ', {
                          tbError:
                            this.state.userAddressErrorMessage.length > 0,
                          tbFocus: this.state.userAddressActive
                        })}
                        data-tip={this.state.userAddressErrorMessage}
                      >
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#map-pinIco`} />
                          </svg>
                        </span>
                        {/* <input
                            type="text"
                            className="form-control"
                            placeholder="Address"
                            name="userAddress"
                            onFocus={event => this.onControlFocus(event)}
                            onChange={event => this.handleUserInput(event)}
                            onBlur={e =>
                              this.validateAddress(this.state.userAddress)
                            }
                            value={this.state.userAddress}
                            data-tip={this.state.userAddressErrorMessage}
                          /> */}
                        <Geosuggest
                          ref={el => (this._geoSuggest = el)}
                          name="userAddress"
                          inputClassName="form-control"
                          onChange={this.onLocationChange}
                          onSuggestSelect={this.validateLocation}
                          onFocus={this.onLocationFocus}
                          onBlur={this.validateLocation}
                          tabIndex="12"
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

                  <div className="footer-btn text-right">
                    <button
                      className="btn btn-dark o-border ripple"
                      type="button"
                      onClick={this.onSignUpFormSubmit}
                    >
                      REGISTER
                    </button>

                    <div className="backTo_RL text-center pt-80">
                      <a
                        href="javascript:void(0);"
                        onClick={() => this.onRgisterClick()}
                      >
                        Go to Login?
                      </a>
                    </div>
                  </div>

                  {/* <div className="social-div text-right">
                    <span className="textSpan block">
                      Or you can login with
                    </span>
                    <ul className="social">
                      <li>
                        <a href="" className="text-white">
                          <i className="fa fa-linkedin lin" />
                        </a>
                      </li>
                      <li>
                        <a href="" className="text-white">
                          <i className="fa fa-twitter twt" />
                        </a>
                      </li>
                      <li>
                        <a href="" className="text-white">
                          <i className="fa fa-facebook fb" />
                        </a>
                      </li>
                    </ul>
                  </div> */}
                </div>
              </div>
            </div>

            {/* <div className="info-content">
              <div className="text-details">
                <div className="content-center h-100">
                  <div className="left-sec">
                    <h2>Lorem Ipsum is simply dummy text</h2>
                    <p className="mt-25">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, Lorem Ipsum is
                      simply dummy text of the printing and typesetting
                      industry. Lorem Ipsum has been the industry's standard
                      dummy text ever since the 1500s,
                    </p>
                    <span className="btn btn-dark mt-15">
                      <span
                        className="btn-login"
                        onClick={() => this.navigateToUrlPage('/login')}
                      >
                        LOGIN
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        {/* </Slide> */}
        {/*  <!-- Modal Start -->*/}
        {this.renderInterestModal()}
        {/*  <!-- Modal End -->*/}
      </div>
    );
  }

  renderInterestModal = () => {
    return (
      <Dialog
        open={this.state.showModal}
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
          <p className="headCheck">
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
          </p>
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

              {/* <div className="panel panel-default">
                    <div className="panel-heading relative">
                      <h4 className="panel-title ">
                        <a
                          data-toggle="collapse"
                          data-parent="#accordion"
                          href="#collapse6"
                        >
                          Other
                        </a>
                        <a
                          href="javascript:void(0)"
                          className="btn btnSuccess btnAdd "
                        >
                          ADD
                        </a>
                      </h4>
                    </div>
                    <div
                      id="collapse6"
                      className="panel-collapse collapse panel-content"
                    >
                      <div className="panel-body">
                        <div className="formcategoryDiv">
                          <div className="row">
                            <div className="col-sm-6 col-md-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Category Name"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-6 col-md-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Subcategory Name"
                                />
                              </div>
                            </div>
                            <div className="col-sm-6 col-md-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Subcategory Name"
                                />
                              </div>
                            </div>
                            <div className="col-sm-6 col-md-4">
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Subcategory Name"
                                />
                              </div>
                            </div>
                          </div>
                          <a
                            href="javascript:void(0);"
                            className="subcategoriesLink"
                          >
                            add more subcategories
                          </a>
                        </div>
                      </div>
                    </div>
                  </div> */}
            </div>
          </div>
        </DialogContent>

        {/* <DialogActions className="mdl-footer">
              <button
                type="button"
                className="btn btnSuccess btnCancel"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btnInfo btnSave"
                data-dismiss="modal"
              >
                Save
              </button>
          </DialogActions> */}
      </Dialog>
    );
  };
}

const mapStateToProps = function(state) {
  return {
    signupInfo: state.userSignUpInfo,
    userAllCategory: state.userAllCategory
  };
};

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actionUserSignUp: actionUserSignUp,
      actionGetAllCategory: actionGetAllCategory
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
