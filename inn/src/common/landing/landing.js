import React, { Component } from 'react';
// import OwlCarousel from 'react-owl-carousel';
import { ToastContainer } from 'react-toastify';
import validator from 'validator';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import Dialog, {
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle
// } from 'material-ui/Dialog';

import OwlCarousel from 'react-owl-carousel2';

import '../../css/style.css';
import logo from '../../img/innovecsyslogoblack1.png';
import logo_sm from '../../img/innologofortab.png';
import lights from '../../img/lights.jpg';
import nature from '../../img/nature.jpg';
import team1 from '../../img/team1.jpg';
import imgSpeaker from '../../img/team1.jpg';
import imgUserDefault from '../../img/user_default.jpg';
import imgEventDefault from '../../img/def_event.jpg';
import imgEvDefault from '../../img/spEvImg.jpg';
import imgGraphDefault from '../../img/graphImg.jpg';
import Sprite from '../../img/sprite.svg';

import {
  getCookie,
  removeCookie,
  setCookie,
  ZoomInAndOut,
  showWarningToast,
  displayThumbImage
} from '../core/common-functions';

import {
  userLogin,
  getAllSpeakers,
  actionGetUpcomingEvents,
  actionUserLogout
} from '../action';
import ForgotPassword from '../login/forgot-password';
import ChangePassword from '../change-password/change-password';
import Footer from './footer';
import Notification from '../header/notification';
import Img from '../core/img';
import Config from '../../common/core/config';

let $ = require('jquery');

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      userName: '',
      userTypeId: '',
      pageName: '',
      eventDetailsEventId: '',
      activeMenu: 'home',
      showModal: false,
      email: '',
      password: '',
      isEmailValid: false,
      emailErrorMessage: '',
      isPasswordValid: false,
      passwordErrorMessage: '',
      emailActive: false,
      passwordActive: false,
      openDialog: false,
      showChangePassword: false,
      userImage: '',
      speakerList: [],
      showNumberOfSpeaker: 10,
      eventList: [],
      showNumberOfEvent: 3,
      loadingData: false,
      showDashboardMenu: false,
      bucketName: Config.S3BucketName,
      resizedBucketName: Config.S3ResizeBucketName
    };
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
    this.onLoginFormSubmit = this.onLoginFormSubmit.bind(this);
    this.handleEnterKeyUp = this.handleEnterKeyUp.bind(this);
    this.onControlFocus = this.onControlFocus.bind(this);
    this.openDialogHandler = this.openDialogHandler.bind(this);
    this.handleLoginEnterKeyUp = this.handleLoginEnterKeyUp.bind(this);
    this.showChangePasswordHandler = this.showChangePasswordHandler.bind(this);
    this.openDashboard = this.openDashboard.bind(this);
  }

  componentWillMount() {
    this.props.getAllSpeakers();
    this.props.actionGetUpcomingEvents({ pageNumber: 1, pageSize: 500 });
    let userInfo = getCookie('userInfo');
    if (userInfo) {
      //  console.log(userInfo);
      userInfo = JSON.parse(userInfo);
      if (this.props.userInfo && this.props.userInfo.profilePhotoURL) {
        userInfo.profilePhotoURL = this.props.userInfo.profilePhotoURL;
        setCookie('userInfo', userInfo);
      }

      if (userInfo && userInfo.access_token) {
        this.setState({
          userName: userInfo.firstName,
          userImage: userInfo.profilePhotoURL ? userInfo.profilePhotoURL : '',
          userTypeId: userInfo.userTypeId
        });
      }
    }
  }

  componentWillReceiveProps(res) {
    // console.log(res);
    let _this = this;
    /*let userImage = ''
    if(res.userInfo) {
      userImage = res.userInfo.profilePhotoURL ? res.userInfo.profilePhotoURL : '';
    }*/
    this.setState({
      speakerList: res.speakers.all,
      eventList: res.upcomingEvents
      // userImage : userImage
    });

    try {
      if (res.userInfo.profilePhotoURL) {
        this.setState({
          userImage: res.userInfo.profilePhotoURL
            ? res.userInfo.profilePhotoURL
            : imgUserDefault
        });
      }

      if (res.userInfo.userTypeId === 2 || res.userInfo.userTypeId === 3) {
        _this.setState({
          showDashboardMenu: true
        });
      }
    } catch (error) {
      _this.setState({
        showDashboardMenu: false
      });
    }
  }

  componentDidMount() {
    var self = this;
    window.scrollTo(0, 0);
    $(window).scroll(function() {
      var headerVal = $(window).scrollTop();
      if (headerVal > 50) {
        $('#arrowTop').show();
        if (self.state.userName !== '') {
          $('.main-header').addClass('fixedHeader');
          $('.ifContainer')
            .addClass('container-fluid')
            .removeClass('container');
        }
      } else {
        $('#arrowTop').hide();
        $('.main-header').removeClass('fixedHeader');
        $('.ifContainer')
          .removeClass('container-fluid')
          .addClass('container');
      }
    });
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    window.redirectLocation = this.props.location;
  }

  handleClickOutside = event => {
    if (event.target.id == 'loginDiv') {
      this.setState({ showModal: false });
    }
  };

  scrollTop() {
    $('html, body').animate({ scrollTop: 0 }, 600);
  }

  onLogoutClick() {
    removeCookie('userInfo');
    this.setState({ userName: '' });
    this.props.actionUserLogout();
    window.scrollTo(0, 0);
    this.props.history.push('/');
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  searchEvent = value => {
    value = value.toString().trim();

    if (value === '') {
      showWarningToast('Please enter search keyword');
      return;
    }

    if (this.state.userName === '') {
      this.setState({
        pageName: 'searchEvent'
      });
      this.toggleModal();
    } else {
      // this.props.history.push('/member/searchEvent?keyword=' + value);
      this.openSearchEvent(this.state.userTypeId, value);
    }
  };

  handleEnterKeyUp = e => {
    if (e.key == 'Enter') {
      if (this.state.keyword === '') {
        return;
      }
      if (this.state.userName === '') {
        this.setState({
          pageName: 'searchEvent'
        });
        this.toggleModal();
      } else {
        this.openSearchEvent(this.state.userTypeId, this.state.keyword);
      }
    }
  };

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  // set state value on field change
  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const placeholder = e.target.placeholder;
    let controlErrorMessage = name + 'ErrorMessage';
    this.setState({
      [name]: value,
      [controlErrorMessage]: ''
    });
    ReactTooltip.hide();
  }

  //Check enter key press on password field
  handleLoginEnterKeyUp(e) {
    if (e.key === 'Enter') {
      let self = this;
      setTimeout(() => {
        if (self.validateUserPassword(self.state.password) === 1)
          self.onLoginFormSubmit();
      }, 200);
    }
  }

  // create credential object
  onLoginFormSubmit() {
    if (!this.state.isEmailValid) {
      if (this.state.emailErrorMessage === '') {
        this.setState(
          {
            emailErrorMessage: 'Email is required'
          },
          () => {
            ReactTooltip.show(this.refs.email);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.email);
      return;
    }

    if (!this.state.isPasswordValid) {
      if (this.state.passwordErrorMessage === '') {
        this.setState(
          {
            passwordErrorMessage: 'Password is required'
          },
          () => {
            ReactTooltip.show(this.refs.password);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.password);
      return;
    }

    let userCredentialObject = {};
    let userName = this.state.email;
    let password = btoa(this.state.password); //this.state.password;
    this.props.dispatchProfileData(userName, password).then(res => {
      if (res.payload.status == 200) {
        const uesrResponse = res.payload.data;
        if (uesrResponse && uesrResponse.access_token) {
          setCookie('userInfo', uesrResponse);
        }
        this.redirectLoggedinUser(uesrResponse);
      }
    });
  }

  openProfile = () => {
    const userTypeId = this.props.userInfo.userTypeId;
    switch (userTypeId) {
      case 1:
        this.props.history.push('/member/profile');
        break;
      case 2:
        break;
      case 3:
        break;
      default:
        break;
    }
  };

  openDashboard() {
    const userTypeId = this.props.userInfo.userTypeId;
    switch (userTypeId) {
      case 2:
        this.props.history.push('/manager/eventList');
        break;

      case 3:
        this.props.history.push('/admin/managerList');
        break;

      default:
        break;
    }
  }

  onClickEventCalendar = () => {
    if (this.state.userName === '') {
      this.setState({
        pageName: 'calendar'
      });

      this.toggleModal();
      return;
    }

    this.openCalendar(this.state.userTypeId);
  };

  openCalendar = userTypeId => {
    switch (userTypeId) {
      case 1:
        this.props.history.push('/member/calendar');
        break;
      case 2:
        this.props.history.push('/manager/calendar');
        break;
      case 3:
        this.props.history.push('/admin/calendar');
        break;
      default:
        break;
    }
  };

  onClickMyEvents = () => {
    if (this.state.userName === '') {
      this.setState({
        pageName: 'myEvent'
      });

      this.toggleModal();
      return;
    }

    this.openMyEvents(this.state.userTypeId);
  };

  openMyEvents = userTypeId => {
    switch (userTypeId) {
      case 1:
        this.props.history.push('/member/myEvents');
        break;
      case 2:
        this.props.history.push('/manager/myEvents');
        break;
      case 3:
        this.props.history.push('/admin/myEvents');
        break;
      default:
        break;
    }
  };

  openSearchEvent = (userTypeId, keyword) => {
    switch (userTypeId) {
      case 1:
        this.props.history.push('/member/searchEvent?keyword=' + keyword);
        break;
      case 2:
        this.props.history.push('/manager/searchEvent?keyword=' + keyword);
        break;
      case 3:
        this.props.history.push('/admin/searchEvent?keyword=' + keyword);
        break;
      default:
        break;
    }
  };

  openEventDetails = (userTypeId, eventId) => {
    switch (userTypeId) {
      case 1:
        this.props.history.push('/member/eventDetails?eventId=' + eventId);
        break;
      case 2:
        this.props.history.push('/manager/eventDetails?eventId=' + eventId);
        break;
      case 3:
        this.props.history.push('/admin/eventDetails?eventId=' + eventId);
        break;
      default:
        break;
    }
  };

  onClickBuyPlan = () => {
    if (this.state.userName === '') {
      this.setState({
        pageName: 'plan'
      });
      window.scrollTo(0, 0);
      this.toggleModal();
      return;
    }

    this.openPlan(this.state.userTypeId);
  };

  openPlan = userTypeId => {
    switch (userTypeId) {
      case 1:
        this.props.history.push({
          pathname: '/member/plan',
          state: { upgrade: true }
        });
        break;
      case 2:
        this.props.history.push('/manager/eventList');
        break;
      case 3:
        this.props.history.push('/admin/managerList');
        break;
      default:
        break;
    }
  };

  redirectLoggedinUser(uesrResponse) {
    if (this.state.pageName == 'calendar') {
      this.openCalendar(uesrResponse.userTypeId);
      return;
    }

    if (this.state.pageName == 'myEvent') {
      this.openMyEvents(uesrResponse.userTypeId);
      return;
    }

    if (this.state.pageName == 'searchEvent') {
      this.openSearchEvent(uesrResponse.userTypeId, this.state.keyword);
      return;
    }

    if (this.state.pageName == 'eventDetails') {
      this.openEventDetails(
        uesrResponse.userTypeId,
        this.state.eventDetailsEventId
      );
      return;
    }

    if (this.state.pageName == 'plan') {
      this.openPlan(uesrResponse.userTypeId);
      return;
    }

    // switch (uesrResponse.userTypeId) {
    //   case 1:
    //     if (this.state.pageName == 'eventDetails') {
    //       this.navigateByUrlName(
    //         '/member/eventDetails?eventId=' + this.state.eventDetailsEventId
    //       );
    //       return;
    //     }

    //     break;

    //   case 2:
    //     if (this.state.pageName == 'eventDetails') {
    //       this.navigateByUrlName(
    //         '/manager/eventDetails?eventId=' + this.state.eventDetailsEventId
    //       );
    //       return;
    //     }
    //     this.props.history.push('/manager/eventList');
    //     break;

    //   case 3:
    //     this.props.history.push('/admin/managerList');
    //     break;

    //   default:
    //     break;
    // }
  }

  // validate email
  validateUserEmail(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Email is required';
      this.setState({
        isEmailValid: false,
        emailErrorMessage: errMessage,
        emailActive: false
      });
      return;
    }

    if (!validator.isEmail(value)) {
      errMessage = `Email is not valid`;
      this.setState({
        isEmailValid: false,
        emailErrorMessage: errMessage,
        emailActive: false
      });
      return;
    }

    this.setState({
      isEmailValid: true,
      emailErrorMessage: '',
      emailActive: false
    });
  }

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

  // validate password
  validateUserPassword(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Password is required';
      this.setState({
        isPasswordValid: false,
        passwordErrorMessage: errMessage
      });
      return 0;
    }

    this.setState({
      isPasswordValid: true,
      passwordErrorMessage: '',
      passwordActive: false
    });
    return 1;
  }

  openDialogHandler(isOpen) {
    if (isOpen === true) {
      this.toggleModal();
    }
    this.setState({
      openDialog: isOpen
    });
  }

  showChangePasswordHandler() {
    this.setState({
      showChangePassword: true
    });
  }
  onCloseChangePassword = () => {
    this.setState({
      showChangePassword: false
    });
  };

  handleClose() {
    this.setState({
      showModal: false
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  onCarouselNext = () => {
    try {
      this.refs.spCarousel.next();
    } catch (err) {
      console.log(err);
    }
  };

  onCarouselPrev = () => {
    try {
      this.refs.spCarousel.prev();
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const options = {
      items: 5,
      nav: false,
      rewind: false,
      autoplay: false,
      loop: false,
      dots: false,
      smartSpeed: 300,
      responsiveClass: true,
      stagePadding: 10,
      responsive: {
        0: {
          items: 1
        },
        531: {
          items: 2
        },
        767: {
          items: 3
        },
        1024: {
          items: 4
        },
        1200: {
          items: 5
        }
      }
    };

    return (
      <div className="headerFixed" id="home">
        <ToastContainer
          autoClose={3000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
        <div className="topbar">
          <div className="container ">
            <ul>
              <li>
                <span className="ico-mobile  topbarIcon">
                  <svg>
                    <use xlinkHref={`${Sprite}#mobileIco`} />
                  </svg>
                </span>{' '}
                <span className="contectTxt">+00-000-0000</span>
              </li>
              <li>
                <span className="ico-envelop topbarIcon">
                  <svg>
                    <use xlinkHref={`${Sprite}#envelopIco`} />
                  </svg>
                </span>{' '}
                <span className="contectTxt">random.email@gmail.com</span>
              </li>
              <li>
                <span className="ico-map-pin topbarIcon">
                  <svg>
                    <use xlinkHref={`${Sprite}#map-pinIco`} />
                  </svg>
                </span>{' '}
                <span className="contectTxt">
                  123, 6st. Melbourne, FL 32904
                </span>
              </li>

              {/* <li className="notiification-li" > */}
              <li
                className={`notiification-li ${
                  this.props.userInformation &&
                  this.props.userInformation.userTypeId === 1
                    ? ''
                    : 'hide'
                }`}
              >
                <div className="topbarNotification">
                  <Notification navigateByUrlName={this.navigateByUrlName} />
                </div>
              </li>

              {this.state.userName == '' ? (
                <li className="signFix">
                  <span className="btn btn-icon sign-btn">
                    <span className="ico-lock">
                      <svg>
                        <use xlinkHref={`${Sprite}#lockIco`} />
                      </svg>
                    </span>
                    <span onClick={() => this.navigateByUrlName('/login')}>
                      &nbsp;LOGIN
                    </span>&nbsp; /&nbsp;
                    <span onClick={() => this.navigateByUrlName('/signup')}>
                      &nbsp;REGISTER
                    </span>
                  </span>

                  {/* ========== loginAlertModal Start ======== */}
                  <div
                    className="mdlBackRoot hide"
                    id="loginDiv"
                    className={classNames('mdlBackRoot', {
                      hide: this.state.showModal == false
                    })}
                  >
                    <div className="loginAlertModal">
                      <h3 className="title">Please Login to access further</h3>
                      <div className="loginAlertModal-body">
                        <form className="form-card">
                          <div className="row">
                            <div className="col-md-12">
                              <div
                                className={classNames(
                                  'form-group cls-relative ripple',
                                  {
                                    tbError:
                                      this.state.emailErrorMessage.length > 0,
                                    tbFocus: this.state.emailActive
                                  }
                                )}
                              >
                                <span className="ico-user">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#userIco`} />
                                  </svg>
                                </span>
                                <input
                                  type="text"
                                  className="form-control input-control"
                                  placeholder="Email"
                                  name="email"
                                  onChange={event =>
                                    this.handleUserInput(event)
                                  }
                                  onFocus={event => this.onControlFocus(event)}
                                  value={this.state.email}
                                  onBlur={e =>
                                    this.validateUserEmail(this.state.email)
                                  }
                                  data-tip={this.state.emailErrorMessage}
                                  ref="email"
                                />
                                {this.state.emailErrorMessage.length > 0 ? (
                                  <i className="fa fa-exclamation-triangle alertIcon" />
                                ) : (
                                  ''
                                )}
                                {this.state.isEmailValid == true ? (
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
                                    tbError:
                                      this.state.passwordErrorMessage.length >
                                      0,
                                    tbFocus: this.state.passwordActive
                                  }
                                )}
                              >
                                <span className="ico-lock">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#lockIco`} />
                                  </svg>
                                </span>
                                <input
                                  type="password"
                                  autoComplete="new-password"
                                  className="form-control input-control"
                                  placeholder="Password"
                                  name="password"
                                  onChange={event =>
                                    this.handleUserInput(event)
                                  }
                                  onFocus={event => this.onControlFocus(event)}
                                  value={this.state.password}
                                  onBlur={e =>
                                    this.validateUserPassword(
                                      this.state.password
                                    )
                                  }
                                  onKeyUp={this.handleLoginEnterKeyUp}
                                  data-tip={this.state.passwordErrorMessage}
                                  ref="password"
                                />
                                {this.state.passwordErrorMessage.length > 0 ? (
                                  <i className="fa fa-exclamation-triangle alertIcon" />
                                ) : (
                                  ''
                                )}
                                {this.state.isPasswordValid == true ? (
                                  <i className="fa fa-check tbCheck" />
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                          </div>
                        </form>
                        <div className="footer-btn text-right">
                          <button
                            className="btn btn-dark o-border pull-left ripple"
                            type="button"
                            onClick={this.onLoginFormSubmit}
                          >
                            LOGIN
                          </button>

                          <a
                            href="javascript:void(0)"
                            onClick={() => this.openDialogHandler(true)}
                            className="textSpan"
                          >
                            Forgot Password ?
                          </a>
                        </div>
                      </div>
                      <div className="loginAlertfooter">
                        <span className="newUserText">New User ? </span>{' '}
                        <Link to="/signup" className="registerText">
                          Register
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* ========== loginAlertModal End ======== */}
                </li>
              ) : (
                <li className="loggedFix dropdown">
                  <button
                    className="btn btn-icon sign-btn logged-btn dropdown-toggle"
                    data-toggle="dropdown"
                  >
                    <span className="UserNameText">
                      Hello, {this.state.userName}
                    </span>
                    <span className="ico-rightarrow">
                      <svg>
                        <use xlinkHref={`${Sprite}#rightarrowIco`} />
                      </svg>
                    </span>
                    <span className="userImg">
                      {this.props.userInfo &&
                      this.props.userInfo.userTypeId == 1 ? (
                        <img
                          src={
                            this.state.userImage == ''
                              ? imgUserDefault
                              : this.state.userImage
                          }
                          alt=""
                        />
                      ) : (
                        <img src={imgUserDefault} alt="" />
                      )}
                    </span>
                  </button>
                  {/* dropdown start */}
                  <ul className="dropdown-menu">
                    {this.props.userInfo &&
                    this.props.userInfo.userTypeId == 1 ? (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => {
                            this.openProfile();
                          }}
                        >
                          <span>Profile</span>
                          <span className="ico-user">
                            <svg>
                              <use xlinkHref={`${Sprite}#userIco`} />
                            </svg>
                          </span>
                        </a>
                      </li>
                    ) : null}

                    <li>
                      <a
                        href="javascript:void(0);"
                        onClick={this.showChangePasswordHandler}
                      >
                        <span>Change password</span>
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#lockIco`} />
                          </svg>
                        </span>
                      </a>
                    </li>

                    {this.props.userInfo &&
                    this.props.userInfo.userTypeId == 1 ? (
                      <li>
                        <a
                          href="javascript:void(0);"
                          onClick={() => {
                            this.props.history.push({
                              pathname: '/member/plan',
                              state: { upgrade: true }
                            });
                          }}
                        >
                          <span>Upgrade Plan</span>
                          <span className="ico-user">
                            <svg>
                              <use xlinkHref={`${Sprite}#upgradeIco`} />
                            </svg>
                          </span>
                        </a>
                      </li>
                    ) : null}

                    {/* <li>
                      <a href="javascript:void(0)">
                        Notification
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref="/img/sprite.svg#notificationIco" />
                          </svg>
                        </span>
                      </a>
                    </li> */}
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={this.onLogoutClick.bind(this)}
                      >
                        <span>Logout</span>
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#logoutIco`} />
                          </svg>
                        </span>
                      </a>
                    </li>
                  </ul>
                  {/* dropdown end */}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="main">
          <div className="banner">
            <header
              className={`main-header isHome ${
                this.state.userName !== ''
                  ? 'logged-landingPageHeader'
                  : 'logged-landingPageHeader'
              }`}
            >
              <nav className="navbar navbar-inverse navbarhead">
                <div className="container ifContainer">
                  <div className="navbar-header">
                    <button
                      type="button"
                      className="navbar-toggle"
                      data-toggle="collapse"
                      data-target="#myNavbar"
                    >
                      <span className="icon-bar" />
                      <span className="icon-bar" />
                      <span className="icon-bar" />
                    </button>
                    <a href="#home" className="navbar-brand innov_logo">
                      <img
                        src={logo}
                        alt="logo"
                        className="visible-md visible-lg"
                      />
                      <img
                        src={logo_sm}
                        alt="logo"
                        className="hidden-lg hidden-md"
                      />
                    </a>
                    {/* <a className="navbar-brand innov_logo">
                        <img src={logofottab} alt="logo" />

                      </a> */}
                  </div>

                  <div className="collapse navbar-collapse" id="myNavbar">
                    <div className="rightContNav">
                      <span
                        className={`${
                          this.props.userInformation &&
                          this.props.userInformation.userTypeId === 1
                            ? ''
                            : 'hide'
                        }`}
                      >
                        <Notification />
                      </span>
                      <div
                        className={`loginTag dropdown ${
                          this.state.userName !== '' ? '' : 'hide'
                        }`}
                      >
                        <div
                          className="dropdown-toggle flex-row "
                          data-toggle="dropdown"
                        >
                          <p>
                            Hello,{' '}
                            <span className="bold">
                              {this.capitalizeFirstLetter(this.state.userName)}
                            </span>{' '}
                          </p>

                          <span className="ico-rightarrow">
                            <svg>
                              <use xlinkHref={`${Sprite}#rightarrowIco`} />
                            </svg>
                          </span>

                          <span className="managerProfile">
                            <img
                              src={
                                this.state.userImage == ''
                                  ? imgUserDefault
                                  : this.state.userImage
                              }
                              alt=""
                            />
                          </span>
                        </div>
                        <ul className="dropdown-menu">
                          {this.props.userInfo &&
                          this.props.userInfo.userTypeId == 1 ? (
                            <li>
                              <a
                                href="javascript:void(0)"
                                onClick={() => {
                                  this.openProfile();
                                }}
                              >
                                <span>Profile</span>
                                <span className="ico-user">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#userIco`} />
                                  </svg>
                                </span>
                              </a>
                            </li>
                          ) : null}
                          <li>
                            <a
                              href="javascript:void(0)"
                              onClick={this.showChangePasswordHandler}
                            >
                              <span>Change password</span>
                              <span className="ico-user">
                                <svg>
                                  <use xlinkHref={`${Sprite}#lockIco`} />
                                </svg>
                              </span>
                            </a>
                          </li>

                          {this.props.userInfo &&
                          this.props.userInfo.userTypeId == 1 ? (
                            <li>
                              <a
                                href="javascript:void(0)"
                                onClick={() => {
                                  this.props.history.push({
                                    pathname: '/member/plan',
                                    state: { upgrade: true }
                                  });
                                }}
                              >
                                <span>Upgrade Plan</span>
                                <span className="ico-user">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#upgradeIco`} />
                                  </svg>
                                </span>
                              </a>
                            </li>
                          ) : null}

                          {/* <li>
                            <a>
                              Notifications
                              <span className="ico-user">
                                <svg>
                                  <use xlinkHref="/img/sprite.svg#notificationIco" />
                                </svg>
                              </span>
                            </a>
                          </li> */}
                          <li>
                            <a onClick={this.onLogoutClick.bind(this)}>
                              <span>Logout</span>
                              <span className="ico-user">
                                <svg>
                                  <use xlinkHref={`${Sprite}#logoutIco`} />
                                </svg>
                              </span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <ul className="nav navbar-nav">
                      <li
                        className={classNames({
                          active: this.state.activeMenu == 'home'
                        })}
                      >
                        <a
                          href="#home"
                          onClick={() => {
                            this.setState({ activeMenu: 'home' });
                          }}
                        >
                          Home
                        </a>
                      </li>
                      <li
                        className={classNames({
                          active: this.state.activeMenu === 'dashboard',
                          hide: !this.state.showDashboardMenu
                        })}
                      >
                        <a
                          onClick={() => {
                            this.setState({ activeMenu: 'dashboard' });
                            this.openDashboard();
                          }}
                        >
                          Dashboard
                        </a>
                      </li>
                      <li
                        className={classNames({
                          active: this.state.activeMenu == 'about'
                        })}
                      >
                        <a
                          href="#about"
                          onClick={() => {
                            this.setState({ activeMenu: 'about' });
                          }}
                        >
                          About
                        </a>
                      </li>
                      {/* <li className="event_dropdown">
                          <a>
                            Event
                            <span className="ico-rightarrow">
                              <svg>
                                <use xlinkHref="/img/sprite.svg#rightarrowIco"
                                />
                              </svg>
                            </span>
                          </a>
                        </li> */}

                      <li
                        className={`event_dropdown ${
                          this.state.activeMenu === 'events' ? 'active' : ''
                        }`}
                      >
                        <a className="dropdown">
                          <span
                            className="dropdown-toggle"
                            data-toggle="dropdown"
                            onClick={() => {
                              let _this = this;
                              setTimeout(
                                () => _this.setState({ activeMenu: 'events' }),
                                200
                              );
                              // this.setState({ activeMenu: 'events' });
                            }}
                          >
                            Events
                            <span className="ico-rightarrow">
                              <svg>
                                <use xlinkHref={`${Sprite}#rightarrowIco`} />
                              </svg>
                            </span>
                          </span>
                          <ul className="dropdown-menu landing-nav">
                            <li>
                              <a style={{ padding: '10px' }} href="#up_events">
                                Upcoming Event
                              </a>
                            </li>
                            <li>
                              <a onClick={() => this.onClickEventCalendar()}>
                                Event Calendar
                              </a>
                            </li>

                            <li
                              className={`${
                                this.state.showDashboardMenu ? 'hide' : ''
                              }`}
                            >
                              <a onClick={() => this.onClickMyEvents()}>
                                My Events
                              </a>
                            </li>
                          </ul>
                        </a>
                      </li>

                      {/* <li>
                          <a>Education Corner</a>
                        </li>*/}
                      <li
                        className={classNames({
                          active: this.state.activeMenu === 'features'
                        })}
                      >
                        <a
                          href="#features"
                          onClick={() => {
                            this.setState({ activeMenu: 'features' });
                          }}
                        >
                          Features
                        </a>
                      </li>
                      <li
                        className={classNames({
                          active: this.state.activeMenu == 'speakerGallery'
                        })}
                      >
                        <a
                          href="#speakers"
                          onClick={() => {
                            this.setState({ activeMenu: 'speakerGallery' });
                          }}
                        >
                          Speaker Gallery{' '}
                        </a>
                      </li>
                      <li
                        className={classNames({
                          active: this.state.activeMenu == 'contactUs'
                        })}
                      >
                        <a
                          href="#contactus"
                          onClick={() => {
                            this.setState({ activeMenu: 'contactUs' });
                          }}
                        >
                          Contact Us
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            </header>

            <ChangePassword
              openDialog={this.state.showChangePassword}
              onCloseChangePassword={this.onCloseChangePassword}
              userInfo={this.props.userInfo}
            />
            <div />
            <div className="bannerSearch">
              <div className="container">
                <div className="logo">
                  {/*<a href="javascript:void(0);">
                    <img src={logo} alt="" />
                  </a>*/}
                </div>
              </div>

              <div className="searchBoxWrapper text-center text-white">
                <h2>Innovative Ecosystems</h2>
                <p>Event Management Company</p>
                <div className="searchBox">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control searchbar"
                      placeholder="Search here..."
                      onChange={event => {
                        this.state.keyword = event.target.value;
                      }}
                      onKeyUp={event => this.handleEnterKeyUp(event)}
                    />
                    <span
                      className="ico-search cls-cursor"
                      onClick={() => this.searchEvent(this.state.keyword)}
                    >
                      <svg>
                        <use xlinkHref={`${Sprite}#searchIco`} />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mainWrapper bg-White">
            <div className="container">
              {/*========= OwlCarousel Start ==========*/}
              {/* <div className="eventInfoWrapper clearfix">
                <h4 className="ev-title text-white col-md-1">Events Today </h4>

                <div className="col-md-11">
                  <div className="ev-slider">
                    <OwlCarousel
                      loop
                      autoplay={true}
                      autoplayTimeout={3000}
                      margin={2}
                      className="owl-carousel liveEvents-slider text-white"
                    >
                      <div className="eventBlock">
                        <span>07:00 PM</span>
                        <p className="text-dark">Conference on diabetes</p>
                        <p className="text-dark">By Dr John Ray</p>
                      </div>
                      <div className="eventBlock">
                        <span>07:00 PM</span>
                        <p className="text-dark">Conference on diabetes</p>
                        <p className="text-dark">By Dr John Ray</p>
                      </div>
                      <div className="eventBlock">
                        <span>07:00 PM</span>
                        <p className="text-dark">Conference on diabetes</p>
                        <p className="text-dark">By Dr John Ray</p>
                      </div>
                      <div className="eventBlock">
                        <span>07:00 PM</span>
                        <p className="text-dark">Conference on diabetes</p>
                        <p className="text-dark">By Dr John Ray</p>
                      </div>
                      <div className="eventBlock">
                        <span>07:00 PM</span>
                        <p className="text-dark">Conference on diabetes</p>
                        <p className="text-dark">By Dr John Ray</p>
                      </div>
                      <div className="eventBlock">
                        <span>07:00 PM</span>
                        <p className="text-dark">Conference on diabetes</p>
                        <p className="text-dark">By Dr John Ray</p>
                      </div>
                    </OwlCarousel>
                    <a className="customPrevBtn customPrevNextbtn">
                      <i className="arrow left" />
                    </a>
                    <a className="customNextBtn customPrevNextbtn">
                      <i className="arrow right" />
                    </a>{' '}
                  </div>
                </div>
              </div> */}
              {/*========= OwlCarousel end ==========*/}

              {/* ============ new carousel start ============ */}
              <div className="event-Info-Wrapper clearfix">
                <div className="col-md-12">
                  <div className="ev-slider">
                    <h2 className="ev-title">Speaker Gallery</h2>

                    {Object.keys(this.state.speakerList).length > 0 ? (
                      <OwlCarousel
                        ref="spCarousel"
                        options={options}
                        className="owl-carousel liveEvents-slider text-white"
                      >
                        {this.state.speakerList.map((speaker, speakerIndex) => {
                          const speakerImage = speaker.imageURL;
                          return (
                            <div key={speakerIndex} className="eventBlock">
                              <div className="spBox u-box gal-eff">
                                <div className="spImg u-img">
                                  <Img
                                    src={speakerImage}
                                    default={imgUserDefault}
                                    alt=""
                                  />
                                  <div className="overlay">
                                    <ul className="social-contact text-center">
                                      <li>
                                        <a href="javascript:void(0)">
                                          <i className="fa fa-facebook" />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="javascript:void(0)">
                                          <i className="fa fa-twitter" />
                                        </a>
                                      </li>
                                      <li>
                                        <a href="javascript:void(0)">
                                          <i className="fa fa-linkedin" />
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>

                                <div className="spInfo u-details">
                                  <div className="spDescription">
                                    <p className="name all-caps">
                                      <b>{speaker.name}</b>
                                    </p>
                                    <p className="position text-dark">
                                      {speaker.position}
                                    </p>
                                    <p className="compnay text-dark">
                                      {speaker.company}
                                    </p>
                                  </div>
                                  <ul className="addEv-Details">
                                    <li>
                                      Awards{' '}
                                      <span className="pull-right">
                                        {speaker.noOfAwards}
                                      </span>
                                    </li>
                                    <li>
                                      Grants{' '}
                                      <span className="pull-right">
                                        {speaker.noOfGrants}
                                      </span>
                                    </li>
                                    <li>
                                      Publications{' '}
                                      <span className="pull-right">
                                        {speaker.noOfPublications}
                                      </span>
                                    </li>
                                    <li>
                                      Patents{' '}
                                      <span className="pull-right">
                                        {speaker.noOfPatents}
                                      </span>
                                    </li>
                                  </ul>
                                  <div className="viewDetails">
                                    <a
                                      href="javascript:void(0)"
                                      className="btn-arrow"
                                    >
                                      view details
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </OwlCarousel>
                    ) : (
                      ''
                    )}
                    <a
                      className="customPrevIcon customPrevNextIcon"
                      onClick={() => {
                        this.onCarouselPrev();
                        // this.refs.spCarousel.prev();
                      }}
                    >
                      <i className="arrow left" />
                    </a>
                    <a
                      className="customNextIcon customPrevNextIcon"
                      onClick={() => {
                        this.onCarouselNext();
                        // this.refs.spCarousel.next();
                      }}
                    >
                      <i className="arrow right" />
                    </a>
                  </div>
                </div>
              </div>
              {/* ============ new carousel end ============ */}

              <section className="for-sec" id="about">
                <div className="main-heading aboutus_heading">
                  <span className="text-dark">KNOW OUR COMPANY</span>
                  <h3>ABOUT US</h3>
                </div>
                <div className="aboutWrapper">
                  <div className="row m0">
                    <div className="col-md-3 p0 col-sm-6">
                      <div className="a-f-wrapper">
                        <div className="a-f-container">
                          <span className="ico-o-mobile">
                            <svg>
                              <use xlinkHref={`${Sprite}#o-mobileIco`} />
                            </svg>
                          </span>
                          <div className="u-details">
                            <div className="evDiscription">
                              <h5>INSTANT ACCESSING</h5>
                              <p>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s,
                              </p>
                            </div>
                          </div>
                          <a href="">
                            READ MORE
                            <span className="ico-r-arrow">
                              <svg>
                                <use xlinkHref={`${Sprite}#r-arrowIco`} />
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-6 p0">
                      <div className="a-f-wrapper">
                        <div className="a-f-container">
                          <span className="ico-c-card">
                            <svg>
                              <use xlinkHref={`${Sprite}#c-cardIco`} />
                            </svg>
                          </span>
                          <div className="u-details">
                            <div className="evDiscription">
                              <h5>CONVINIENT BOOKING</h5>
                              <p>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s,
                              </p>
                            </div>
                          </div>
                          <a href="">
                            READ MORE
                            <span className="ico-r-arrow">
                              <svg>
                                <use xlinkHref={`${Sprite}#r-arrowIco`} />
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3 p0 col-sm-6">
                      <div className="a-f-wrapper">
                        <div className="a-f-container">
                          <span className="ico-f-search">
                            <svg>
                              <use xlinkHref={`${Sprite}#f-searchIco`} />
                            </svg>
                          </span>
                          <div className="u-details">
                            <div className="evDiscription">
                              <h5>EASY SEARCHING</h5>
                              <p>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s,
                              </p>
                            </div>
                          </div>
                          <a href="">
                            READ MORE
                            <span className="ico-r-arrow">
                              <svg>
                                <use xlinkHref={`${Sprite}#r-arrowIco`} />
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3 p0 col-sm-6">
                      <div className="a-f-wrapper" />
                      <div className="a-f-wrapper">
                        <div className="a-f-container">
                          <span className="ico-o-mobile">
                            <svg>
                              <use xlinkHref={`${Sprite}#connectIco`} />
                            </svg>
                          </span>
                          <div className="u-details">
                            <div className="evDiscription">
                              <h5>FAST CONNECTING</h5>
                              <p>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s,
                              </p>
                            </div>
                          </div>
                          <a href="">
                            READ MORE
                            <span className="ico-r-arrow">
                              <svg>
                                <use xlinkHref={`${Sprite}#r-arrowIco`} />
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="for-sec" id="up_events">
                <div className="upEventWrapper">
                  <div className="row mb-30">
                    <div className="col-md-6">
                      <div className="main-heading">
                        <span className="text-dark">ALL QUEUED EVENTS</span>
                        <h3>UPCOMING EVENTS</h3>
                      </div>
                    </div>
                    <div className="col-md-6">
                      {/* <ul className="nav nav-tabs mt-20 pull-right-md">
                        <li className="active">
                          <a data-toggle="tab" href="#home">
                            ALL
                          </a>
                        </li>
                        <li>
                          <a data-toggle="tab" href="#menu1">
                            CARDIO
                          </a>
                        </li>
                        <li>
                          <a data-toggle="tab" href="#menu2">
                            CANCER
                          </a>
                        </li>
                        <li>
                          <a data-toggle="tab" href="#menu3">
                            DERMATOLOGIST
                          </a>
                        </li>
                        <li>
                          <a data-toggle="tab" href="#menu4">
                            DIABITES
                          </a>
                        </li>
                      </ul> */}
                    </div>
                  </div>

                  <div className="tab-content">
                    <div id="home" className="tab-pane fade in active">
                      <div className="upEventContainer">
                        {this.renderEvents()}
                      </div>
                    </div>
                    <div id="menu1" className="tab-pane fade">
                      <div className="upEventContainer">
                        <div className="row">
                          <div className="col-sm-6 col-md-4">
                            <div className="eventBox">
                              <div className="evImg">
                                <img src={lights} alt="" />
                                <div className="evLabel">Conference</div>
                              </div>
                              <div className="evInfo u-details white-bg h-185">
                                <div className="evDiscription mb-10">
                                  <h5>CURE DIABETES</h5>
                                  <p className="text-dark">
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy
                                    text ever since the 1500s,
                                  </p>
                                </div>
                                <a href="" className="btn-arrow">
                                  GET TICKET
                                  <span className="ico-r-arrow">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#r-arrowIco`} />
                                    </svg>
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-4">
                            <div className="eventBox">
                              <div className="evImg">
                                <img src={nature} alt="" />
                                <div className="evLabel">Conference</div>
                              </div>
                              <div className="evInfo u-details white-bg h-189">
                                <div className="evDiscription mb-10">
                                  <h5>CURE DIABETES</h5>
                                  <p className="text-dark">
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy
                                    text ever since the 1500s,
                                  </p>
                                </div>
                                <a href="" className="btn-arrow sold">
                                  SOLD
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="col-sm-4">
                            <div className="eventBox">
                              <div className="evImg">
                                <img src={lights} alt="" />
                                <div className="evLabel">Conference</div>
                              </div>
                              <div className="evInfo u-details white-bg h-185">
                                <div className="evDiscription mb-10">
                                  <h5>CURE DIABETES</h5>
                                  <p className="text-dark">
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry. Lorem
                                    Ipsum has been the industry's standard dummy
                                    text ever since the 1500s,
                                  </p>
                                </div>
                                <a href="" className="btn-arrow">
                                  GET TICKET
                                  <span className="ico-r-arrow">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#r-arrowIco`} />
                                    </svg>
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <a href="" className="btn-more">
                              view more&nbsp; <i className="arrow down" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="menu2" className="tab-pane fade">
                      <h3>Menu 2</h3>
                      <p>Some content in menu 2.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="for-sec" id="features">
                <div className="main-heading">
                  <span className="text-dark">PAID SUBSCRIBER</span>
                  <h3>FEATURES</h3>
                </div>
                <div className="features_wrapper">
                  <div className="container">
                    <div className="row">
                      <div className="feature_inner_sec">
                        <div className="col-sm-4 pad-left">
                          <div className="features_content text-center">
                            <ul>
                              <li>OVERVIEW</li>
                              <li>Conference Ratings</li>
                              <li>Speaker Ratings</li>
                              <li>Conference Tickets</li>
                              <li>Conference Discounts</li>
                              <li>Educational Information</li>
                              <li>Analytical Capabilites</li>
                              <li>On-demand Access</li>
                              <li>Identify Resources</li>
                              <li>Working Groups</li>
                              <li>Relationship Management</li>
                              <li>--</li>
                            </ul>
                          </div>
                        </div>

                        <div className="col-sm-4 pad-left">
                          <div className="features_content text-center">
                            <ul>
                              <li>FREE SUBSCRIBER</li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-crossboldIco">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#crossboldIco`} />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-crossboldIco">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#crossboldIco`} />
                                  </svg>
                                </span>
                              </li>

                              <li>
                                <span className="ico-crossboldIco">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#crossboldIco`} />
                                  </svg>
                                </span>
                              </li>

                              <li>
                                <span className="ico-crossboldIco">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#crossboldIco`} />
                                  </svg>
                                </span>
                              </li>

                              <li>
                                <span className="ico-crossboldIco">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#crossboldIco`} />
                                  </svg>
                                </span>
                              </li>

                              <li>
                                <span className="ico-crossboldIco">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#crossboldIco`} />
                                  </svg>
                                </span>
                              </li>

                              <li>--</li>
                            </ul>
                          </div>
                        </div>

                        <div className="col-sm-4 pad-left">
                          <div className="features_content text-center">
                            <ul>
                              <li className="pricetag_paidsub">
                                PAID SUBSCRIBER
                                {/* <br /> ($200 / annum) */}
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                <span className="ico-correctboldIco">
                                  <svg>
                                    <use
                                      xlinkHref={`${Sprite}#correctboldIco`}
                                    />
                                  </svg>
                                </span>
                              </li>
                              <li>
                                {(() => {
                                  if (this.props.userInfo) {
                                    if (this.props.userInfo.userTypeId == 1) {
                                      return (
                                        <a
                                          className="btn-arrow"
                                          href="javascript:void(0)"
                                          onClick={() => this.onClickBuyPlan()}
                                        >
                                          BUY THIS PLAN
                                          <span className="ico-r-arrow">
                                            <svg>
                                              <use
                                                xlinkHref={`${Sprite}#r-arrowIco`}
                                              />
                                            </svg>
                                          </span>
                                        </a>
                                      );
                                    }
                                  } else {
                                    return (
                                      <a
                                        href="javascript:void(0)"
                                        className="btn-arrow"
                                        onClick={() => this.onClickBuyPlan()}
                                      >
                                        BUY THIS PLAN
                                        <span className="ico-r-arrow">
                                          <svg>
                                            <use
                                              xlinkHref={`${Sprite}#r-arrowIco`}
                                            />
                                          </svg>
                                        </span>
                                      </a>
                                    );
                                  }
                                })()}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="for-sec speaker_gallerysec" id="speakers">
                <div className="main-heading">
                  <span className="text-dark">ABOUT THE SPEAKERS</span>
                  <h3>SPEAKER GALLERY</h3>
                </div>
                <div className="sGalleryWrapper">{this.renderSpeakers()}</div>
              </section>
            </div>

            {/* footer component */}
            <Footer />

            <ForgotPassword
              openDialogHandler={this.openDialogHandler}
              openDialog={this.state.openDialog}
            />
            <div className="footer-strip text-center">
              <span>COPYRIGHT 2018 Innovecsys | Privacy Policy</span>
              <div
                className="bottom_top_arrow"
                id="arrowTop"
                style={{ display: 'none' }}
              >
                <img
                  src="img/up_arrow.png"
                  onClick={this.scrollTop.bind(this)}
                />
              </div>
            </div>
          </div>

          {/*========= OwlCarousel End ==========*/}
        </div>
      </div>
    );
  }

  getTicket = eventId => {
    if (this.state.userName === '') {
      this.setState({
        pageName: 'eventDetails',
        eventDetailsEventId: eventId
      });

      window.scrollTo(0, 0);
      this.toggleModal();
      return;
    }

    this.openEventDetails(this.state.userTypeId, eventId);
  };

  renderEvents = () => {
    function showMoreNumberOfEvent(self) {
      self.state.showNumberOfEvent += 3;
      self.setState({ showNumberOfEvent: self.state.showNumberOfEvent });
    }

    function showLessNumberOfEvent(self) {
      self.state.showNumberOfEvent = 3;
      self.setState({ showNumberOfEvent: self.state.showNumberOfEvent });
    }

    return (
      <div>
        <div className="row">
          {this.state.eventList.map((event, eventIndex) => {
            if (eventIndex < this.state.showNumberOfEvent) {
              return (
                <div key={eventIndex} className="col-sm-6 col-md-4">
                  <div className="eventBox">
                    <div className="evImg">
                      <Img
                        src={
                          event.bannerImageURL
                            ? displayThumbImage(
                                event.bannerImageURL,
                                Config.S3AlbumForBanner,
                                Config.S3Thumbnail200
                              )
                            : imgEventDefault
                        }
                        default={imgEventDefault}
                      />
                      <div className="evLabel">Conference</div>
                    </div>
                    <div className="evInfo u-details white-bg h-185 ">
                      <div className="evDiscription mb-10">
                        <h5>{event.eventName}</h5>
                        <p className="text-dark">{event.description}</p>
                      </div>

                      <a
                        href="javascript:void(0)"
                        className="btn-arrow"
                        onClick={() => this.getTicket(event.eventId)}
                      >
                        GET TICKET
                        <span className="ico-r-arrow">
                          <svg>
                            <use xlinkHref={`${Sprite}#r-arrowIco`} />
                          </svg>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="text-center">
          <a href="javascript:void(0);" className="upcomingEvLink">
            {this.state.showNumberOfEvent < this.state.eventList.length ? (
              <span
                onClick={() => {
                  showMoreNumberOfEvent(this);
                }}
                className="btn-more ml-10"
              >
                view more &nbsp; <i className="arrow down" />
              </span>
            ) : null}
            {this.state.showNumberOfEvent > 3 ? (
              <span
                onClick={() => {
                  showLessNumberOfEvent(this);
                }}
                className="btn-more ml-10"
              >
                view less &nbsp; <i className="arrow up" />
              </span>
            ) : null}
          </a>
        </div>
      </div>
    );
  };

  renderSpeakers = () => {
    function showMoreNumberOfSpeaker(self) {
      self.state.showNumberOfSpeaker += 10;
      self.setState({ showNumberOfSpeaker: self.state.showNumberOfSpeaker });
    }

    function showLessNumberOfSpeaker(self) {
      self.state.showNumberOfSpeaker = 10;
      self.setState({ showNumberOfSpeaker: self.state.showNumberOfSpeaker });
    }

    return (
      <div>
        <div className="row">
          {this.state.speakerList.map((speaker, speakerIndex) => {
            const speakerImage = speaker.imageURL
              ? displayThumbImage(
                  speaker.imageURL,
                  Config.S3AlbumForSpeaker,
                  Config.S3Thumbnail373
                )
              : imgUserDefault;
            if (speakerIndex < this.state.showNumberOfSpeaker) {
              return (
                // <div key={speakerIndex} className="col-sm-4 col-lg-15">
                //   <div className="spBox u-box gal-eff">
                //     <div className="spImg u-img">
                //       <Img src={speakerImage} default={imgUserDefault} />
                //       <div className="overlay">
                //         <ul className="social-contact text-center">
                //           <li>
                //             <a href="javascript:void(0)">
                //               <i className="fa fa-facebook" />
                //             </a>
                //           </li>
                //           <li>
                //             <a href="javascript:void(0)">
                //               <i className="fa fa-twitter" />
                //             </a>
                //           </li>
                //           <li>
                //             <a href="javascript:void(0)">
                //               <i className="fa fa-linkedin" />
                //             </a>
                //           </li>
                //         </ul>
                //       </div>
                //     </div>
                //     <div className="spInfo u-details light-bg h-150">
                //       <div className="spDescription">
                //         <p className="name all-caps m-0">
                //           <b>{speaker.name}</b>
                //         </p>
                //         <span className="degi text-dark">
                //           {speaker.position}
                //         </span>
                //         <p className="compnay text-dark">{speaker.company}</p>
                //         <div className="rating">
                //           <i className="fa fa-star on" />
                //           <i className="fa fa-star on" />
                //           <i className="fa fa-star on" />
                //           <i className="fa fa-star on" />
                //           <i className="fa fa-star on" />
                //         </div>
                //       </div>
                //       <a href="javascript:void(0)" className="btn-arrow">
                //         READ MORE
                //         <span className="ico-r-arrow">
                //           <svg>
                //             <use xlinkHref={`${Sprite}#r-arrowIco`} />
                //           </svg>
                //         </span>
                //       </a>
                //     </div>
                //   </div>
                // </div>

                <div key={speakerIndex} className="col-sm-4 col-lg-15">
                  <div className="spBox u-box gal-eff">
                    <div className="spImg u-img">
                      <Img src={speakerImage} default={imgUserDefault} />
                      <div className="overlay">
                        <ul className="social-contact text-center">
                          <li>
                            <a href="javascript:void(0)">
                              <i className="fa fa-facebook" />
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <i className="fa fa-twitter" />
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <i className="fa fa-linkedin" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="spInfo u-details">
                      <div className="spDescription">
                        <p className="name all-caps">
                          <b>{speaker.name}</b>
                        </p>
                        <p className="position text-dark">{speaker.position}</p>
                        <p className="compnay text-dark">{speaker.company}</p>
                      </div>
                      <ul className="addEv-Details">
                        <li>
                          Awards{' '}
                          <span className="pull-right">
                            {speaker.noOfAwards}
                          </span>
                        </li>
                        <li>
                          Grants{' '}
                          <span className="pull-right">
                            {speaker.noOfGrants}
                          </span>
                        </li>
                        <li>
                          Publications{' '}
                          <span className="pull-right">
                            {speaker.noOfPublications}
                          </span>
                        </li>
                        <li>
                          Patents{' '}
                          <span className="pull-right">
                            {speaker.noOfPatents}
                          </span>
                        </li>
                      </ul>
                      <div className="viewDetails">
                        <a href="javascript:void(0)" className="btn-arrow">
                          view details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>

        <div className="text-center">
          {this.state.showNumberOfSpeaker < this.state.speakerList.length ? (
            <span
              onClick={() => {
                showMoreNumberOfSpeaker(this);
              }}
              className="btn-more ml-10"
            >
              view more&nbsp; <i className="arrow down" />
            </span>
          ) : null}
          {this.state.showNumberOfSpeaker > 10 ? (
            <span
              onClick={() => {
                showLessNumberOfSpeaker(this);
              }}
              className="btn-more ml-10"
            >
              view less&nbsp; <i className="arrow up" />
            </span>
          ) : null}
        </div>
      </div>
    );
  };
}

const mapStateToProps = function(state) {
  return {
    userInfo: state.profileData,
    speakers: state.speakers,
    upcomingEvents: state.events.upcomingEvents,
    userInformation: state.userInfo
  };
};

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      dispatchProfileData: userLogin,
      getAllSpeakers,
      actionGetUpcomingEvents,
      actionUserLogout
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
