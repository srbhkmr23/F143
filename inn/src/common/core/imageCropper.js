import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

import Sprite from '../../img/sprite.svg';

class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageDialog: false,
      imgSource: '',
      imgWidth: '',
      imgHeight: '',
      imgType: '',
      imgRatio: ''
    };
    //this.cropImage = this.cropImage.bind(this);
  }

  componentDidMount() {
    // console.log(this.props);
    let showModal = this.props.showModal ? this.props.showModal : '';
    let imgSource = this.props.imagesrc ? this.props.imagesrc : '';
    let imageName = this.props.imageName ? this.props.imageName : '';
    let imgWidth = this.props.imgWidth ? this.props.imgWidth : '';
    let imgHeight = this.props.imgHeight ? this.props.imgHeight : '';
    let imgType = this.props.imgType ? this.props.imgType : '';
    let imgRatio = this.props.aspectRatio ? this.props.aspectRatio : '';
    // console.log(imgType);

    if (showModal && imgSource) {
      this.setState({
        imageDialog: showModal,
        imgSource: imgSource,
        imageName: imageName,
        imgWidth: imgWidth,
        imgHeight: imgHeight,
        imgType: imgType,
        imgRatio: imgRatio
      });
    }
  }

  cropImage(action) {
    if (action == 1) {
      let cropImageResult = this.refs.cropper
        .getCroppedCanvas({
          width: 480,
          height: 480,
          fillColor: '#fff',
          imageSmoothingEnabled: false,
          imageSmoothingQuality: 'high'
        })
        .toDataURL(this.state.imgType);
      //console.log(cropImageResult);
      if (cropImageResult != '') {
        let newImage = this.dataURLtoFile(
          cropImageResult,
          this.state.imageName
        );
        this.props.updateProfileImage(cropImageResult, newImage);
        this.setState({
          imageDialog: false
        });
      }
    }

    if (action == 2) {
      this.props.updateProfileImage('', '');
      this.setState({
        imageDialog: false
      });
    }
  }

  onCloseImageDialog = () => {
    this.setState({
      imageDialog: false
    });
  };

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  render() {
    return (
      <Dialog
        open={this.state.imageDialog}
        keepMounted
        onClose={this.onCloseImageDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth={'sm'}
        className="imageCropperModal"
      >
        <DialogTitle id="" className="mdl-header">
          Image Crop
          <span
            className="ico-close pull-right"
            onClick={this.cropImage.bind(this, 2)}
          >
            <svg>
              <use xlinkHref={`${Sprite}#close`} />
            </svg>
          </span>
        </DialogTitle>

        <DialogContent className="imageCropper-body">
          <Cropper
            ref="cropper"
            src={this.state.imgSource}
            minCropBoxWidth={this.state.imgWidth}
            minCropBoxHeight={this.state.imgHeight}
            style={{ height: 400, width: '100%' }}
            aspectRatio={this.state.imgRatio}
            guides={false}
            dragMode="move"
            restore={false}
            cropBoxResizable={true}
            movable={false}
            toggleDragModeOnDblclick={false}
            zoomable={false}
            viewMode={1}
            //crop={this.cropImage.bind(this)}
          />
          <div className="mdl-footer">
            <button
              type="button"
              className="btn btnSubmit ripple"
              onClick={this.cropImage.bind(this, 1)}
            >
              Crop
            </button>
            <button
              type="button"
              className="btn btnCancel ripple ml-20"
              onClick={this.cropImage.bind(this, 2)}
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default ImageCropper;
