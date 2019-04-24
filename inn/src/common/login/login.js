import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import validator from 'validator';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
// import Transition from "react-transition-group/Transition";
import Flip from 'react-reveal/Flip';
import Slide from 'react-reveal/Slide';

import { ZoomInAndOut, setCookie, getCookie } from '../core/common-functions';
import { userLogin, showLoader, hideLoader } from '../action';

import logo from '../../img/innovecsyslogoblack2.png';
import ForgotPassword from './forgot-password';
import Sprite from '../../img/sprite.svg';

import './login.css';

import Signup from '../signup/signup';

const mapStateToProps = function(state) {
  return {
    userInfo: state.profileData
  };
};

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      dispatchProfileData: userLogin,
      showLoader: showLoader,
      hideLoader: hideLoader
    },
    dispatch
  );
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isEmailValid: false,
      emailErrorMessage: '',
      isPasswordValid: false,
      passwordErrorMessage: '',
      emailActive: false,
      passwordActive: false,
      openDialog: false,
      isResetLayout: true
    };
    this.openLandingPage = this.openLandingPage.bind(this);
    this.onLoginFormSubmit = this.onLoginFormSubmit.bind(this);
    this.handleEnterKeyUp = this.handleEnterKeyUp.bind(this);
    this.onControlFocus = this.onControlFocus.bind(this);
    this.openDialogHandler = this.openDialogHandler.bind(this);
  }

  componentWillReceiveProps(props) {
    // if (props.userInfo && props.userInfo.access_token) {
    //   setCookie('userInfo', props.userInfo);
    //   this.props.history.push('/manager/eventList');
    // }
  }

  componentWillMount() {
    let userInfo = getCookie('userInfo');
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      if (userInfo && userInfo.access_token) {
        this.redirectLoggedinUser(userInfo);
      }
    }

    try {
      if (this.props.match.path == '/login') {
        this.setState({ isResetLayout: true });
      } else {
        this.setState({ isResetLayout: false });
      }
    } catch (err) {
      console.log(err);
    }
  }

  navigateToUrlPage = pageUrl => {
    this.props.history.push(pageUrl);
  };

  // redirect to landing page
  openLandingPage() {
    this.props.history.push('/');
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
  handleEnterKeyUp(e) {
    if (e.key == 'Enter') {
      let self = this;
      setTimeout(() => {
        if (self.validateUserPassword(self.state.password) == 1)
          self.onLoginFormSubmit();
      }, 200);
    }
  }

  // create credential object
  onLoginFormSubmit() {
    if (!this.state.isEmailValid) {
      if (this.state.emailErrorMessage == '') {
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
      if (this.state.passwordErrorMessage == '') {
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
    this.props.showLoader();
    let _this = this;
    this.props
      .dispatchProfileData(userName, password)
      .then(res => {
        // console.log(' login result ', res);
        _this.props.hideLoader();
        if (res.payload && res.payload.status === 200) {
          const uesrResponse = res.payload.data;
          if (uesrResponse && uesrResponse.access_token) {
            setCookie('userInfo', uesrResponse);
          }
          _this.redirectLoggedinUser(uesrResponse);
        }
      })
      .catch(() => {
        _this.props.hideLoader();
      });
  }

  redirectLoggedinUser(uesrResponse) {
    switch (uesrResponse.userTypeId) {
      case 1:
        if (uesrResponse.planId == null || uesrResponse.isExpired === true)
          this.props.history.push({
            pathname: '/member/plan',
            state: { upgrade: false }
          });
        else this.props.history.push('/');
        break;

      //   case 2:
      //     this.props.history.push('/manager/eventList');
      //     break;

      //   case 3:
      //     this.props.history.push('/admin/managerList');
      //     break;

      default:
        this.props.history.push('/');
        break;
    }
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
    this.setState({
      openDialog: isOpen
    });
  }

  onRgisterClick = () => {
    console.log('on register click');
    this.setState({
      isResetLayout: !this.state.isResetLayout
    });

    if (this.state.isResetLayout == true) {
      this.navigateToUrlPage('/signup');
    } else {
      this.navigateToUrlPage('/login');
    }
  };

  render() {
    return (
      <div className="main-page overflowHidden loginPageCustom">
        {' '}
        {/*overflowHidden*/}
        <ToastContainer
          autoClose={3000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
        <ReactTooltip effect="solid" type="error" place="bottom" />
        {/* <Slide right duration={1000}> */}
        <div
          id="splitlayout"
          className={`splitlayout ${
            this.state.isResetLayout ? 'reset-layout' : 'open-left'
          }`}
        >
          <div className="registration-page">
            <div className="login">
              <div className="info-content side side-left">
                <div className="text-details">
                  <div className="logo" onClick={this.openLandingPage}>
                    <img src={logo} alt="" className="img-responsive" />
                  </div>
                  <div className="content-center h-100">
                    <div className="left-sec">
                      <h2>Lorem Ipsum is simply dummy text</h2>
                      <p className="mt-25">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                      </p>
                      <span className="btn btn-dark mt-15">
                        <span
                          className="btn-signup"
                          onClick={() => {
                            this.onRgisterClick();
                            // this.navigateToUrlPage('/signup');
                          }}
                        >
                          {/* REGISTER */}
                          {this.state.isResetLayout ? 'REGISTER' : 'LOGIN'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="formField-content side side-right">
                <div className="form-panel content-center">
                  <h3 className="lead text-white">Login to your account</h3>

                  <div className="form-row">
                    <div className="form-col">
                      <div
                        className={classNames('form-group ripple', {
                          tbError: this.state.emailErrorMessage.length > 0,
                          tbFocus: this.state.emailActive
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
                          placeholder="Email"
                          name="email"
                          onChange={event => this.handleUserInput(event)}
                          onFocus={event => this.onControlFocus(event)}
                          value={this.state.email}
                          onBlur={e => this.validateUserEmail(this.state.email)}
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
                    <div className="form-col">
                      <div
                        className={classNames('form-group ripple', {
                          tbError: this.state.passwordErrorMessage.length > 0,
                          tbFocus: this.state.passwordActive
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
                          className="form-control"
                          placeholder="Password"
                          name="password"
                          onChange={event => this.handleUserInput(event)}
                          onFocus={event => this.onControlFocus(event)}
                          value={this.state.password}
                          onBlur={e =>
                            this.validateUserPassword(this.state.password)
                          }
                          onKeyUp={this.handleEnterKeyUp}
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
                      className="textSpan mt-15"
                    >
                      Forgot Password ?
                    </a>

                    <div className="backTo_RL text-center">
                      <a
                        href="javascript:void(0);"
                        onClick={() => this.onRgisterClick()}
                      >
                        Go to Register?
                      </a>
                    </div>
                  </div>

                  {/* <div className="social-div">
                    <span className="textSpan block">Or you can login with</span>
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
          </div>
          {/* </Slide> */}
          <ForgotPassword
            openDialogHandler={this.openDialogHandler}
            openDialog={this.state.openDialog}
          />

          <div className="page page-left side side-left">
            <Signup
              navigateToUrlPage={this.navigateToUrlPage}
              onRgisterClick={this.onRgisterClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
