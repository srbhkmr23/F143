import React, { Component } from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import Sprite from '../../img/sprite.svg';

export default class AlertModal extends Component {
  constructor(props) {
    super(props);
  }

  confirmHandler() {
    console.log('confirmHandler...');
    this.props.confirmedMe();
  }

  onSelectYes = () => {
    this.props.confirmedMe();
    this.handleClose();
  };

  handleClose = () => {
    this.props.hideDeleteModal();
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.showDeleteModal}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={'md'}
          className="editEventModal"
        >
          <DialogContent className="editEventModal-body">
            <span className="ico-close" onClick={this.handleClose}>
              <svg>
                <use xlinkHref={`${Sprite}#close`} />
              </svg>
            </span>
            <div className="mdl-BgDesign bg-delete">&nbsp;</div>

            <div className="mdlContent">
              <div className={this.props.customClass}>
                <span className={`ico-${this.props.eventType}`}>
                  <svg>
                    <use xlinkHref={`${Sprite}#${this.props.eventType}Ico`} />
                  </svg>
                </span>
              </div>
              <h4>{this.props.alertMessage}</h4>
            </div>
            <div className="mdl-footer mt-20">
              <button
                type="button"
                className="btn btnSubmit ripple"
                onClick={() => this.onSelectYes()}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn btnCancel ripple ml-20 onClick={this.handleClose}"
                onClick={() => this.handleClose()}
              >
                No
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
