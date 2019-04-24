import React, { Component } from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

import Sprite from '../../img/sprite.svg';

class TermsAndCondition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false
    };
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      openDialog: nextProps.openDialog
    });
  }

  closeDialog() {
    this.setState({
      openDialog: false
    });
    this.props.openDialogHandler(false);
  }

  render() {
    return (
      <Dialog
        open={this.state.openDialog}
        keepMounted
        // onClose={this.onCloseChangePassword}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth={'md'}
        className="termsAndCondition_Modal "
      >
        <DialogTitle id="" className="mdl-header">
          TERMS AND CONDITION
          <span className="ico-close pull-right" onClick={this.closeDialog}>
            <svg>
              <use xlinkHref={`${Sprite}#close`} />
            </svg>
          </span>
        </DialogTitle>

        <DialogContent className="mdl-body">
          <div className="tnC_content">
            <ol type="number">
              <li>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </li>
              <li>
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s,
              </li>
              <li>
                when an unknown printer took a galley of type and scrambled it
                to make a type specimen book.
              </li>
              <li>
                It has survived not only five centuries, but also the leap into
                electronic typesetting,
              </li>
              <li>
                remaining essentially unchanged. It was popularised in the 1960s
                with the release of Letraset
              </li>
              <li>
                sheets containing Lorem Ipsum passages, and more recently with
                desktop publishing
              </li>
              <li>
                software like Aldus PageMaker including versions of Lorem Ipsum.
              </li>
            </ol>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default TermsAndCondition;
