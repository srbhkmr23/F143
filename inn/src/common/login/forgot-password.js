import React, { Component } from 'react';
import validator from 'validator';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import securityImg from '../../img/security-img.png';
import { resetPassword } from '../action';
import { connect } from 'react-redux';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

import Sprite from '../../img/sprite.svg';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      email: '',
      isEmailValid: false,
      emailActive: false,
      emailErrorMessage: ''
    };
    this.closeDialog = this.closeDialog.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onControlFocus = this.onControlFocus.bind(this);
    this.validateUserEmail = this.validateUserEmail.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      email: '',
      openDialog: nextProps.openDialog
    });
  }

  closeDialog() {
    this.setState({
      openDialog: false,
      isEmailValid: false,
      emailActive: false,
      emailErrorMessage: ''
    });
    ReactTooltip.hide();
    this.props.openDialogHandler(false);
  }

  onChangeHandler({ target }) {
    this.setState({
      email: target.value
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

  resetPassword() {
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
    this.props.resetPassword(this.state.email);
    this.closeDialog();
  }

  render() {
    return (
      <Dialog
        open={this.state.openDialog}
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
          <span className="ico-close pull-right" onClick={this.closeDialog}>
            <svg>
              <use xlinkHref={`${Sprite}#close`} />
            </svg>
          </span>
        </DialogTitle>

        <DialogContent className="changePwd-body">
          <div className="row">
            <div className="col-sm-7">
              <h4 className="title">Forgot Password ?</h4>
              <div className="col-sm-12">
                <p className="resetText">
                  Enter your registered email address so that we can send a link
                  to reset your password.
                </p>
              </div>
              <div className="form-card">
                <div className="col-xs-12">
                  <div
                    className={classNames('form-group ripple', {
                      tbError: this.state.emailErrorMessage.length > 0,
                      tbFocus: this.state.emailActive
                    })}
                  >
                    <span className="ico-user">
                      <svg>
                        <use xlinkHref={`${Sprite}#envelopIco`} />
                      </svg>
                    </span>
                    <input
                      type="text"
                      maxLength="50"
                      className="form-control input-control"
                      placeholder="Email"
                      name="email"
                      value={this.state.email}
                      onChange={this.onChangeHandler}
                      onFocus={this.onControlFocus}
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
              </div>
              <div className="mdl-footer">
                <button
                  type="button"
                  className="btn btnSubmit ripple"
                  data-dismiss="modal"
                  onClick={this.resetPassword}
                >
                  Send
                </button>
                <button
                  type="button"
                  className="btn btnCancel ripple ml-20"
                  onClick={this.closeDialog}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="col-sm-5">
              <div className="securityImg text-center mt-10">
                <img src={securityImg} alt="" />
              </div>
            </div>
          </div>
        </DialogContent>

        {/* <DialogActions className="changePwdfooter">
          <span className="newUserText">New User ? </span>{' '}
          <span className="registerText">Register</span>
        </DialogActions> */}
      </Dialog>
    );
  }
}

export default connect(null, { resetPassword })(ForgotPassword);
