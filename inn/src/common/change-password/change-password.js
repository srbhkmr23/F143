import React, { Component } from 'react';
import validator from 'validator';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import securityImg from '../../img/security-img.png';
import Sprite from '../../img/sprite.svg';
import { updatePassword } from '../action';
import ValidatePass from '../change-password/validate-password';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChangePassword: false,

      oldPassword: '',
      isOldPasswordValid: false,
      oldPasswordActive: false,
      oldPasswordErrorMessage: '',

      password: '',
      isPasswordValid: false,
      passwordActive: false,
      passwordErrorMessage: '',

      confirmPassword: '',
      isConfirmPasswordValid: false,
      confirmPasswordActive: false,
      confirmPasswordErrorMessage: ''
    };
    this.updatePassword = this.updatePassword.bind(this);
    this.showChangePasswordHandler = this.showChangePasswordHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onControlFocus = this.onControlFocus.bind(this);
    this.validateUserOldPassword = this.validateUserOldPassword.bind(this);
    this.validateUserPassword = this.validateUserPassword.bind(this);
    this.validateUserConfirmPassword = this.validateUserConfirmPassword.bind(
      this
    );
  }

  onCloseChangePassword = () => {
    this.setState({
      showChangePassword: false,

      oldPassword: '',
      isOldPasswordValid: false,
      oldPasswordActive: false,
      oldPasswordErrorMessage: '',

      password: '',
      isPasswordValid: false,
      passwordActive: false,
      passwordErrorMessage: '',

      confirmPassword: '',
      isConfirmPasswordValid: false,
      confirmPasswordActive: false,
      confirmPasswordErrorMessage: ''
    });

    this.props.onCloseChangePassword();
  };

  showChangePasswordHandler() {
    this.setState({
      showChangePassword: true
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showChangePassword: nextProps.openDialog
    });
  }

  onChangeHandler({ target }, type) {
    if (type === 'oldPassword') {
      this.setState({
        oldPassword: target.value
      });
    } else if (type === 'password') {
      this.setState({
        password: target.value
      });
    } else if (type === 'confirmPassword') {
      this.setState({
        confirmPassword: target.value
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
    ReactTooltip.hide();
  }

  validateUserOldPassword(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Current password is required';
      this.setState({
        isOldPasswordValid: false,
        oldPasswordErrorMessage: errMessage,
        oldPasswordActive: false
      });
      return;
    }
    this.setState({
      isOldPasswordValid: true,
      oldPasswordErrorMessage: '',
      oldPasswordActive: false
    });
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

  validateUserConfirmPassword(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Confirm password is required';
      this.setState({
        isConfirmPasswordValid: false,
        confirmPasswordErrorMessage: errMessage,
        confirmPasswordActive: false
      });
      return;
    }
    this.setState({
      isConfirmPasswordValid: true,
      confirmPasswordErrorMessage: '',
      confirmPasswordActive: false
    });
  }

  updatePassword() {
    if (
      !this.state.isOldPasswordValid ||
      !this.state.isPasswordValid ||
      !this.state.isConfirmPasswordValid ||
      this.state.confirmPassword !== this.state.password
    ) {
      if (!this.state.isOldPasswordValid) {
        if (
          this.state.isOldPasswordValid === '' ||
          !this.state.isOldPasswordValid
        ) {
          this.setState(
            {
              oldPasswordErrorMessage: 'Current password is required'
            },
            () => {
              ReactTooltip.show(this.refs.oldPassword);
              return;
            }
          );
        }
        ReactTooltip.show(this.refs.oldPassword);
        return;
      }

      if (!this.state.isPasswordValid) {
        if (this.state.passwordErrorMessage === '') {
          this.setState(
            {
              passwordErrorMessage: 'New password is required'
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

      if (!this.state.isConfirmPasswordValid) {
        if (this.state.confirmPasswordErrorMessage === '') {
          this.setState(
            {
              confirmPasswordErrorMessage: 'Confirm password is required'
            },
            () => {
              ReactTooltip.show(this.refs.confirmPassword);
              return;
            }
          );
        }
        ReactTooltip.show(this.refs.confirmPassword);
        return;
      }

      if (
        this.state.isPasswordValid &&
        this.state.isConfirmPasswordValid &&
        this.state.confirmPassword !== this.state.password
      ) {
        this.setState(
          {
            confirmPasswordErrorMessage: 'Password does not match',
            isConfirmPasswordValid: false
          },
          () => {
            ReactTooltip.show(this.refs.confirmPassword);
            return;
          }
        );
        ReactTooltip.show(this.refs.confirmPassword);
        return;
      }
    }
    if (this.props.userInfo && this.props.userInfo.id) {
      let passObj = {};
      passObj.oldPassword = btoa(this.state.oldPassword); // this.state.oldPassword;
      passObj.password = btoa(this.state.password); //this.state.password;
      passObj.userId = this.props.userInfo.id;
      this.props.updatePassword(passObj);
      this.onCloseChangePassword();
    }
  }

  render() {
    return (
      <Dialog
        open={this.state.showChangePassword}
        keepMounted
        onClose={this.onCloseChangePassword}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth={'sm'}
        className="changePwdModal"
      >
        <ReactTooltip effect="solid" type="error" place="bottom" />
        <DialogTitle id="" className="mdl-header">
          <span
            className="ico-close pull-right"
            onClick={this.onCloseChangePassword}
          >
            <svg>
              <use xlinkHref={`${Sprite}#close`} />
            </svg>
          </span>
        </DialogTitle>

        <DialogContent className="changePwd-body">
          <div className="row">
            <div className="col-sm-6">
              <h4 className="title">Change Password</h4>
              <form className="form-card">
                <div className="col-md-12">
                  <div
                    className={classNames('form-group ripple', {
                      tbError: this.state.oldPasswordErrorMessage.length > 0,
                      tbFocus: this.state.oldPasswordActive
                    })}
                  >
                    <span className="ico-user">
                      <svg>
                        <use xlinkHref={`${Sprite}#userIco`} />
                      </svg>
                    </span>
                    <input
                      type="password"
                      maxLength="50"
                      className="form-control input-control"
                      placeholder="Current Password"
                      name="oldPassword"
                      value={this.state.oldPassword}
                      onChange={e => this.onChangeHandler(e, 'oldPassword')}
                      onFocus={this.onControlFocus}
                      onBlur={e =>
                        this.validateUserOldPassword(this.state.oldPassword)
                      }
                      data-tip={this.state.oldPasswordErrorMessage}
                      ref="oldPassword"
                    />
                    {this.state.oldPasswordErrorMessage.length > 0 ? (
                      <i className="fa fa-exclamation-triangle alertIcon" />
                    ) : (
                      ''
                    )}
                    {this.state.isOldPasswordValid == true ? (
                      <i className="fa fa-check tbCheck" />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="col-md-12">
                  <div
                    className={classNames('form-group ripple', {
                      tbError: this.state.passwordErrorMessage.length > 0,
                      tbFocus: this.state.passwordActive
                    })}
                  >
                    <span className="ico-user">
                      <svg>
                        <use xlinkHref={`${Sprite}#userIco`} />
                      </svg>
                    </span>
                    <input
                      type="password"
                      maxLength="50"
                      className="form-control input-control"
                      placeholder="New Password"
                      name="password"
                      value={this.state.password}
                      onChange={e => this.onChangeHandler(e, 'password')}
                      onFocus={this.onControlFocus}
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
                    {this.state.isPasswordValid == true ? (
                      <i className="fa fa-check tbCheck" />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="col-md-12">
                  <div
                    className={classNames('form-group ripple', {
                      tbError:
                        this.state.confirmPasswordErrorMessage.length > 0,
                      tbFocus: this.state.confirmPasswordActive
                    })}
                  >
                    <span className="ico-user">
                      <svg>
                        <use xlinkHref={`${Sprite}#userIco`} />
                      </svg>
                    </span>
                    <input
                      type="password"
                      maxLength="50"
                      name="confirmPassword"
                      className="form-control input-control"
                      placeholder="Confirm New Password"
                      value={this.state.confirmPassword}
                      onChange={e => this.onChangeHandler(e, 'confirmPassword')}
                      onFocus={this.onControlFocus}
                      onBlur={e =>
                        this.validateUserConfirmPassword(
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
                    {this.state.isConfirmPasswordValid == true ? (
                      <i className="fa fa-check tbCheck" />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </form>
              <div className="mdl-footer">
                <button
                  type="button"
                  className="btn btnSubmit ripple"
                  onClick={this.updatePassword}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn btnCancel ripple ml-20"
                  onClick={this.onCloseChangePassword}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="text-center securityImg">
                <img src={securityImg} alt="" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return { updatePasswordData: state.updatePasswordData };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      updatePassword
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
