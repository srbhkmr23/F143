import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';
import ReactAudioPlayer from 'react-audio-player';
import ReactPlayer from 'react-player';

import { getFileInformation } from '../../common/core/aws-s3';
import PlaceholderComponent from './placeholder';
import Img from '../../common/core/img';
import Config from '../../common/core/config';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

import imgPdfFile from '../../img/pdfFile.jpg';
import imgTextFile from '../../img/textFileLogo.png';
import imgDocFile from '../../img/docFileLogo.png';
import imgXlsFile from '../../img/xlsFileLogo.png';
import imgAudioFile from '../../img/audioLogo.png';
import imgVideoFile from '../../img/videoLogo.png';
import imgFileDefault from '../../img/defaultFileLogo.png';
import Sprite from '../../img/sprite.svg';

class EventMediaItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageExtensions: ['png', 'jpg', 'jpeg'],
      fileExtension: '',
      fileUrl: '',
      fileName: '',
      eventId: '',
      bucketName: Config.S3BucketName,
      resizedBucketName: Config.S3ResizeBucketName,
      mediaId: '',
      mediaName: '',
      imgFlag: false,
      // docFlag: false,
      // audFlag: false,
      // vidFlag: false,
      audioPlay: false,
      videoPlay: false,
      allowedFiles: {
        ANI: 'image',
        BMP: 'image',
        CAL: 'image',
        FAX: 'image',
        IMG: 'image',
        JBG: 'image',
        JPE: 'image',
        MAC: 'image',
        PBM: 'image',
        PCD: 'image',
        PCX: 'image',
        PCT: 'image',
        PGM: 'image',
        PPM: 'image',
        PSD: 'image',
        RAS: 'image',
        TGA: 'image',
        TIFF: 'image',
        WMF: 'image',
        GIF: 'image',
        JPEG: 'image',
        JPG: 'image',
        PNG: 'image',
        ICO: 'image',
        DOC: 'document',
        DOCX: 'document',
        PPT: 'document',
        PDF: 'document',
        XLS: 'document',
        XLSX: 'document',
        XLS: 'document',
        ODT: 'document',
        PSD: 'document',
        TXT: 'document',
        TEXT: 'document',
        MP4: 'video',
        //MPEG: 'video',
        MOV: 'video',
        WMV: 'video',
        AVI: 'video',
        MPG: 'video',
        OGV: 'video',
        '3GP': 'video',
        '3G2': 'video',
        MP3: 'audio',
        WAV: 'audio',
        //WMA: 'audio',
        //AAC: 'audio',
        M4A: 'audio',
        OGG: 'audio'
      }
    };

    this.callAwsToGetFileInformation = this.callAwsToGetFileInformation.bind(
      this
    );
    this.setFileOrLogoUrl = this.setFileOrLogoUrl.bind(this);
    this.generateFileUrlOfThumbnails = this.generateFileUrlOfThumbnails.bind(
      this
    );
    this.deleteMediaFileFromAWS = this.deleteMediaFileFromAWS.bind(this);
    this.downloadFile = this.downloadFile.bind(this);
    this.viewImg = this.viewImg.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.viewVideo = this.viewVideo.bind(this);
  }

  componentWillMount() {
    console.log(this.props);
    const eventId = this.props.eventId;
    const fileUrl = this.props.fileUrl;
    this.setState({
      eventId,
      fileUrl
    });
    let fileType = this.props.fileDetails.type.toUpperCase();

    if (fileType in this.state.allowedFiles) {
      this.setState({ mediaName: this.state.allowedFiles[fileType] }, () => {
        if (this.state.mediaName === 'image') {
          this.setState({
            imgFlag: true
          });
          let img = new Image();
          img.src = this.props.fileUrl;
          let _this = this;
          img.onload = function() {
            let imgWidth = this.width;
            let imgHeight = this.height;
            let maxWidth = window.innerWidth / 3;
            let ratioH = imgHeight / imgWidth;
            let finalH = maxWidth * ratioH;
            _this.setState({ width: maxWidth, height: finalH });
          };
          return;
        }
      });
    }
  }

  componentDidMount() {
    try {
      let fileNameArray = this.state.fileUrl.split('/');
      const fileName = fileNameArray[fileNameArray.length - 1];
      const fileExtension = fileName.split('.')[1];
      this.setState({
        fileName,
        fileExtension
      });
    } catch (error) {
      console.log('com did mount failed======================');
    }

    this.callAwsToGetFileInformation();
  }

  callAwsToGetFileInformation() {
    const eventId = this.state.eventId;
    if (eventId)
      getFileInformation(eventId, (error, data) => {
        console.log('get file information ', error, data);
      });
  }

  deleteMediaFileFromAWS() {
    const AWSFileUrl = this.state.fileUrl;
    const eventId = this.props.eventId;
    const mediaId = this.props.fileDetails.id;
    this.props.deleteMediaFileFromAWS(AWSFileUrl, eventId, mediaId);
  }

  downloadFile() {
    console.log('download file got clicked....');
    // var fileDownload = require('js-file-download');
    // fileDownload(this.props.fileDetails.name);
  }
  viewImg() {
    this.setState({
      openImgDialog: true
    });
  }
  closeImgDialog = () => {
    this.setState({ openImgDialog: false });
  };

  playAudio() {
    this.setState({
      openAudioDialog: true,
      audioPlay: true
    });
  }
  viewVideo() {
    this.setState({
      openVideoDialog: true,
      videoPlay: true
    });
  }

  closeAudioDialog = () => {
    this.setState({ openAudioDialog: false, audioPlay: false });
  };
  closeVideoDialog = () => {
    this.setState({ openVideoDialog: false, videoPlay: false });
  };

  generateFileUrlOfThumbnails(fileUrl) {
    //     var temp = 'https://innovecsystest.s3.amazonaws.com/evt13d41169fe45//usr7d1bf3c7d4e7_cdf3f6f8e39a0e6509e00e46ba606db27f4d2544.png'
    // temp = temp.replace('innovecsystest','innovecsystestresized')
    // console.log(temp)
    // var tempArray = temp.split('//');
    // tempArray[tempArray.length - 2 ] = tempArray[tempArray.length -2] +'/200x200';
    // var finalLink = tempArray.join('/')
    // console.log(finalLink)

    try {
      let _fileUrl = fileUrl;
      _fileUrl = _fileUrl.replace(
        this.state.bucketName,
        this.state.resizedBucketName
      );
      var _fileUrlArray = _fileUrl.split('/');
      _fileUrlArray[_fileUrlArray.length - 2] =
        _fileUrlArray[_fileUrlArray.length - 2] + '/200x200';
      let finalLink = _fileUrlArray.join('/');
      console.log(finalLink);
      return finalLink;
    } catch (error) {
      return fileUrl;
    }
  }

  setFileOrLogoUrl(fileExtension) {
    console.log(fileExtension);
    switch (String(fileExtension).toLowerCase()) {
      case 'ani':
      case 'bmp':
      case 'cal':
      case 'fax':
      case 'gif':
      case 'img':
      case 'jbg':
      case 'jpe':
      case 'jpeg':
      case 'jpg':
      case 'mac':
      case 'pbm':
      case 'pcd':
      case 'pcx':
      case 'pct':
      case 'pgm':
      case 'png':
      case 'ppm':
      case 'psd':
      case 'ras':
      case 'tga':
      case 'tiff':
      case 'wmf':
        return this.generateFileUrlOfThumbnails(this.state.fileUrl);

      case 'pdf':
        return imgPdfFile;

      case 'txt':
      case 'text':
        return imgTextFile;

      case 'doc':
      case 'docx':
        return imgDocFile;

      case 'xls':
      case 'xlsx':
        return imgXlsFile;

      case 'mp3':
      case 'wav':
      case 'wma':
      case 'aac':
      case 'm4a':
      case 'ogg':
        return imgAudioFile;

      case 'mp4':
      case 'mpeg':
      case 'mov':
      case 'wmv':
      case 'avi':
      case 'mpg':
      case 'ogv':
      case '3gp':
      case '3g2':
        return imgVideoFile;

      default:
        return imgFileDefault;
    }
  }

  render() {
    return (
      <div className="uploaded-files-div gal-eff">
        <div className="u-img upld-img-div">
          <LazyLoad
            height={100 + '%'}
            dbounce={500}
            placeholder={<PlaceholderComponent />}
          >
            {/* <img
              src={this.setFileOrLogoUrl(this.state.fileExtension)}
              alt={this.props.fileDetails.name}
            /> */}

            <Img
              src={this.setFileOrLogoUrl(this.state.fileExtension)}
              default={imgFileDefault}
            />
          </LazyLoad>
          <div className="overlay">
            {/* img code */}
            {this.state.imgFlag !== true ? (
              ''
            ) : (
              <ul className="social-contact action-tag text-center">
                <li>
                  <a
                    onClick={() => {
                      this.viewImg();
                    }}
                  >
                    <span className="ico-delete">
                      <svg>
                        <use xlinkHref={`${Sprite}#eyeIco`} />
                      </svg>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      this.deleteMediaFileFromAWS();
                    }}
                  >
                    <span className="ico-delete">
                      <svg>
                        <use xlinkHref={`${Sprite}#deleteIco`} />
                      </svg>
                    </span>
                  </a>
                </li>
              </ul>
            )}
            {/* file code */}
            {this.state.mediaName === 'document' ? (
              <ul className="social-contact action-tag text-center">
                <li>
                  <a
                    href={this.props.fileDetails.mediaURL}
                    download="docFile"
                    onClick={() => {
                      this.downloadFile();
                    }}
                  >
                    <span className="ico-delete">
                      <svg>
                        <use xlinkHref={`${Sprite}#downloadIco`} />
                      </svg>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      this.deleteMediaFileFromAWS();
                    }}
                  >
                    <span className="ico-delete">
                      <svg>
                        <use xlinkHref={`${Sprite}#deleteIco`} />
                      </svg>
                    </span>
                  </a>
                </li>
              </ul>
            ) : (
              ''
            )}
            {/* audio code */}
            {this.state.mediaName === 'audio' ? (
              <ul className="social-contact action-tag text-center">
                <li>
                  <a
                    onClick={() => {
                      this.playAudio();
                    }}
                  >
                    <span className="ico-delete">
                      <svg>
                        <use xlinkHref={`${Sprite}#playIco`} />
                      </svg>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      this.deleteMediaFileFromAWS();
                    }}
                  >
                    <span className="ico-delete">
                      <svg>
                        <use xlinkHref={`${Sprite}#deleteIco`} />
                      </svg>
                    </span>
                  </a>
                </li>
              </ul>
            ) : (
              ''
            )}
            {/* video code */}
            {this.state.mediaName === 'video' ? (
              <ul className="social-contact action-tag text-center">
                <li>
                  <a
                    onClick={() => {
                      this.viewVideo();
                    }}
                  >
                    <span className="ico-delete">
                      <svg>
                        <use xlinkHref={`${Sprite}#playIco`} />
                      </svg>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      this.deleteMediaFileFromAWS();
                    }}
                  >
                    <span className="ico-delete">
                      <svg>
                        <use xlinkHref={`${Sprite}#deleteIco`} />
                      </svg>
                    </span>
                  </a>
                </li>
              </ul>
            ) : (
              ''
            )}
          </div>
        </div>
        {/* img preview code */}
        <Dialog
          open={this.state.openImgDialog}
          onClose={this.closeImgDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth={false}
          maxWidth={'md'}
          className="discountModal"
        >
          <DialogTitle className="mdl-header">
            {'Image Preview'}
            <span
              className="ico-close pull-right"
              onClick={() => {
                this.closeImgDialog();
              }}
            >
              <svg>
                <use xlinkHref={`${Sprite}#close`} />
              </svg>
            </span>
          </DialogTitle>
          <DialogContent className="mdl-body">
            <img
              src={this.props.fileDetails.mediaURL}
              style={{ width: this.state.width, height: this.state.height }}
            />
          </DialogContent>
        </Dialog>
        {/* Audio preview code */}
        <Dialog
          open={this.state.openAudioDialog}
          onClose={this.closeAudioDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth={false}
          maxWidth={'md'}
          className="discountModal"
        >
          <DialogTitle className="mdl-header">
            {'Play Audio'}
            <span
              className="ico-close pull-right"
              onClick={() => {
                this.closeAudioDialog();
              }}
            >
              <svg>
                <use xlinkHref={`${Sprite}#close`} />
              </svg>
            </span>
          </DialogTitle>
          <DialogContent className="mdl-body">
            <ReactAudioPlayer
              src={this.props.fileDetails.mediaURL}
              playing={this.state.audioPlay}
              autoplay
              controls
            />
          </DialogContent>
        </Dialog>
        {/* video preview code */}
        <Dialog
          open={this.state.openVideoDialog}
          onClose={this.closeVideoDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth={false}
          maxWidth={'md'}
          className="discountModal"
        >
          <DialogTitle className="mdl-header">
            {'Play Video'}
            <span
              className="ico-close pull-right"
              onClick={() => {
                this.closeVideoDialog();
              }}
            >
              <svg>
                <use xlinkHref={`${Sprite}#close`} />
              </svg>
            </span>
          </DialogTitle>

          <DialogContent className="mdl-body">
            <ReactPlayer
              url={this.props.fileDetails.mediaURL}
              playing={this.state.videoPlay}
              controls
            />
          </DialogContent>
        </Dialog>
        <div className="u-details light-bg filename-text">
          <p className="name all-caps m0 text-ellipsis file-name">
            {this.props.fileDetails.name}
          </p>
          <p className="name all-caps m0 text-ellipsis file-size">
            {this.props.fileDetails.size}
          </p>
        </div>
      </div>
    );
  }
}

export default EventMediaItem;
