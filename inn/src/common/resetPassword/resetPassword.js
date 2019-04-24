import React, { Component } from 'react';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import queryString from 'query-string';
import imgSecurityImg from '../../img/security-img.png';
import innovecsysApiService from '../core/api';
import ValidatePass from '../change-password/validate-password';
import { connect } from 'react-redux';
import { tokenResetPassword } from '../action';
import {
  showWarningToast,
  ZoomInAndOut
} from '../../common/core/common-functions';
import { ToastContainer, toast } from 'react-toastify';
import Sprite from '../../img/sprite.svg';

/*============== Reset Password Scss ===========*/

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryParams: '',
      password: '',
      passwordErrorMessage: '',
      isPasswordValid: false,
      passwordActive: false,

      confirmPassword: '',
      confirmPasswordErrorMessage: '',
      isConfirmPasswordValid: false,
      confirmPasswordActive: false
    };
    this.inputValueChangeHandler = this.inputValueChangeHandler.bind(this);
    this.onResetPassword = this.onResetPassword.bind(this);
    this.validateConfirmPassword = this.validateConfirmPassword.bind(this);
    this.handleEnterKeyUp = this.handleEnterKeyUp.bind(this);
    this.validateUserPassword = this.validateUserPassword.bind(this);
  }

  componentWillMount() {
    this.tokenResetPassword();
    /*const queryParams = queryString.parse(this.props.location.search);/*
    this.setState({ queryParams });
    let resetToken, QIndex, tokenValue;
    resetToken = this.props.location.search;
    QIndex = resetToken.indexOf('=');
    tokenValue = resetToken.substring(QIndex + 1, resetToken.length);
    if (resetToken) {
      this.props.resetToken(tokenValue);
      innovecsysApiService('tokenResetPassword', token)

      .then(result => {
        try {
          console.log("dsff");
          if (result.status === 422) {
            console.log('Status: 442');
            this.navigateByUrlName('/error');
          } else if (result.status === 200) {
            console.log('Status OK');
          }
        } catch (error) {}
      });
    }*/
  }

  tokenResetPassword() {
    const queryParams = queryString.parse(this.props.location.search);
    this.setState({ queryParams });
    let resetToken, QIndex, tokenValue;
    resetToken = this.props.location.search;
    QIndex = resetToken.indexOf('=');
    tokenValue = resetToken.substring(QIndex + 1, resetToken.length);
    if (resetToken) {
      this.props
        .tokenResetPassword(tokenValue)
        .then(res => {
          if (res.payload.data.status === 422) {
            let _this = this;
            setTimeout(function() {
              _this.props.history.push('/');
            }, 3000);
          }
        })
        .catch(() => {});
    }
  }

  componentDidMount() {
    ReactTooltip.show(this.refs.confirmpassword);
  }

  //Check enter key press on password field
  handleEnterKeyUp(e) {
    if (e.key == 'Enter') {
      this.onResetPassword();
    }
  }

  inputValueChangeHandler(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
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
    console.log('passwordActive ', this.state.passwordActive);
    ReactTooltip.hide();
  }

  validateUserPassword(value) {
    let errMessage;
    if (ValidatePass(value)) {
      this.setState({
        isPasswordValid: false,
        passwordErrorMessage: ValidatePass(value),
        passwordActive: false
      });
      return 0;
    } else {
      this.setState({
        isPasswordValid: true,
        passwordErrorMessage: '',
        passwordActive: false
      });
      return 1;
    }
  }

  validateConfirmPassword(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Confirm password is required';
      this.setState({
        isConfirmPasswordValid: false,
        confirmPasswordErrorMessage: errMessage,
        confirmPasswordActive: false
      });
      ReactTooltip.show(this.refs.confirmPassword);
      return;
    }

    this.setState({
      isConfirmPasswordValid: true,
      confirmPasswordErrorMessage: '',
      confirmPasswordActive: false
    });
    return 1;
  }

  onResetPassword() {
    let _this = this;
    if (!this.state.isPasswordValid) {
      if (this.state.passwordErrorMessage == '') {
        this.setState(
          {
            passwordErrorMessage: 'Password is required'
          },
          () => {
            ReactTooltip.show(this.refs.password);
            // callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.password);
      // callback(false);
      return;
    }

    if (!this.state.isConfirmPasswordValid) {
      if (this.state.confirmPasswordErrorMessage == '') {
        this.setState(
          {
            confirmPasswordErrorMessage: 'Password is required'
          },
          () => {
            ReactTooltip.show(this.refs.confirmPassword);
            // callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.confirmPassword);
      // callback(false);
      return;
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        isConfirmPasswordValid: false,
        confirmPasswordErrorMessage: 'Password do not match',
        confirmPasswordActive: false
      });
      ReactTooltip.show(this.refs.confirmPassword);
      return;
    } else {
      if (this.state.queryParams.token) {
        const token = this.state.queryParams.token;
        // const newPassword = this.state.password;
        const newPassword = btoa(this.state.password);
        innovecsysApiService('setForgotPassword', { token, newPassword }).then(
          result => {
            console.log(result);
            try {
              if (result.data.status === 200) {
                setTimeout(function() {
                  _this.props.history.push('/');
                }, 3000);
              }
            } catch (error) {}
          }
        );
      }
    }
  }

  render() {
    return (
      <div className="main resetPassword-Sec">
        <ToastContainer
          autoClose={3000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
        <ReactTooltip effect="solid" type="error" place="bottom" />
        <div className="content-center h-100">
          <div className="rPwdContent">
            <div className="row">
              <div className="col-sm-7">
                <h4 className="title">Reset Password ?</h4>
                <p className="resetText">Enter New Password</p>
                <form className="form-card">
                  <div className="form-group ripple">
                    <div
                      className={classNames('form-group ripple', {
                        tbError: this.state.passwordErrorMessage.length > 0
                      })}
                    >
                      <span className="ico-user">
                        <svg>
                          <use xlinkHref={`${Sprite}#lockIco`} />
                        </svg>
                      </span>
                      <input
                        type="password"
                        name="password"
                        className="form-control input-control"
                        placeholder="New Password"
                        value={this.state.password}
                        onChange={event => this.inputValueChangeHandler(event)}
                        onFocus={event => this.onControlFocus(event)}
                        onBlur={e =>
                          this.validateUserPassword(this.state.password)
                        }
                        data-tip={this.state.passwordErrorMessage}
                        ref="password"
                      />
                      {this.state.passwordErrorMessage.length > 0 ? (
                        <i className="fa fa-exclamation-triangle alertIcon" />
                      ) : (
                        ''
                      )}
                      {this.state.isPasswordValid === true ? (
                        <i className="fa fa-check tbCheck" />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="form-group ripple">
                    <div
                      className={classNames('form-group ripple', {
                        tbError:
                          this.state.confirmPasswordErrorMessage.length > 0
                      })}
                    >
                      <span className="ico-user">
                        <svg>
                          <use xlinkHref={`${Sprite}#lockIco`} />
                        </svg>
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control input-control"
                        placeholder="Confirm New Password"
                        value={this.state.confirmPassword}
                        onKeyUp={this.handleEnterKeyUp}
                        onChange={event => this.inputValueChangeHandler(event)}
                        onFocus={event => this.onControlFocus(event)}
                        onBlur={e =>
                          this.validateConfirmPassword(
                            this.state.confirmPassword
                          )
                        }
                        data-tip={this.state.confirmPasswordErrorMessage}
                        ref="confirmPassword"
                      />
                      {this.state.confirmPasswordErrorMessage.length > 0 ? (
                        <i className="fa fa-exclamation-triangle alertIcon" />
                      ) : (
                        ''
                      )}
                      {this.state.isConfirmPasswordValid === true ? (
                        <i className="fa fa-check tbCheck" />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </form>
                <div className="rpass-footer">
                  <button
                    type="button"
                    className="btn btnSubmit ripple"
                    onClick={() => this.onResetPassword()}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="btn btnCancel ripple ml-20"
                    onClick={() => this.props.history.push('/')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="col-sm-5">
                <div className="text-center securityImg">
                  <img src={imgSecurityImg} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(null, { tokenResetPassword })(ResetPassword);
//export default ResetPassword;
