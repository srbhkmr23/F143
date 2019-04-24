import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import FileDragAndDrop from 'react-file-drag-and-drop';
import validator from 'validator';

import innovecsysApiService from '../../common/core/api';
import StepNavBar from '../common/stepNavBar';
import {
  showWarningToast,
  generateUniqueId
} from '../../common/core/common-functions';
import ImageCropper from '../../common/core/imageCropper';
import {
  addPhoto,
  createEventDirectory,
  deleteEventImage
} from '../../common/core/aws-s3';
import { showLoader, hideLoader } from '../../common/action/index';
import Config from '../../common/core/config';

import imgFileUpload from '../../img/file-upload-img.png';
import imgFileUploaded from '../../img/file.png';
import Sprite from '../../img/sprite.svg';
let targetElement = '';

class EditSponsor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sponsorName: '',
      isSponsorNameValid: true,
      sponsorNameErrorMessage: '',
      sponsorNameActive: true,

      webSiteLink: '',
      isWebSiteLinkValid: true,
      webSiteLinkErrorMessage: '',
      webSiteLinkActive: true,

      aboutSponsor: '',
      isAboutSponsorValid: true,
      aboutSponsorErrorMessage: '',
      aboutSponsorActive: true,

      imageURL: '',
      uploadedFile: '',
      uploadFileSize: 5242880,
      fileUploadProgress: 0,

      bannerImageAWSURL: '', //AWS image url will store here, get this url after upload banner on AWS, and send this url in event data
      bannerUploadInProgress: false,
      uploadingImageData: '', //Store banner imanger object that will pass to aws for upload
      bannerImageSource: '', //Store banner image source data to show in image tab

      AWSAlbumName: 'sponsors',
      imageSource: '',
      imageName: '',
      imageType: '',
      deleteIco: true
    };
    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.onEditSponsorFormSubmit = this.onEditSponsorFormSubmit.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.updateProfileImage = this.updateProfileImage.bind(this);
    this.setFileUploadProgress = this.setFileUploadProgress.bind(this);
  }

  componentDidMount() {
    if (
      this.props.sponsors &&
      this.props.sponsors.all &&
      this.props.sponsors.all.length
    ) {
      const sponsorListArr = this.props.sponsors.all;
      const currentSponsor = sponsorListArr.find(sponsor => {
        return sponsor.sponsorId === this.props.match.params.id;
      });
      this.setState({
        sponsorName: currentSponsor.sponserName,
        webSiteLink: currentSponsor.webSiteLink,
        aboutSponsor: currentSponsor.about,

        bannerImageSource: currentSponsor.imageURL
          ? currentSponsor.imageURL
          : '',

        bannerImageAWSURL: currentSponsor.imageURL
          ? currentSponsor.imageURL
          : ''

        //imageURL: currentSponsor.imageURL
      });
    }
    let files = document.getElementById('fileSelector');
    files.addEventListener('change', () => {
      var file = files.files[0];
      this.setState({
        uploadedFile: file
      });
    });
  }

  // handleDrop(dataTransfer) {
  //   var file = dataTransfer.files[0];
  //   this.setState({
  //     uploadedFile: file
  //   });
  // }
  setFileUploadProgress(progressValue) {
    this.setState({
      fileUploadProgress: progressValue
    });
  }

  handleDrop(dataTransfer) {
    let _this = this;
    _this.setState({ imageSource: '', deleteIco: false });
    if (dataTransfer && dataTransfer.files && dataTransfer.files[0]) {
      if (dataTransfer.files[0].size <= this.state.uploadFileSize) {
        // targetElement = Object.assign({}, dataTransfer);
        this.targetElement = Object.assign({}, dataTransfer);

        //targetElement.files = Object.assign([], dataTransfer.files);
        this.targetElement.files = Object.assign([], dataTransfer.files);

        // Read source of file that selected to upload as banner
        let reader = new FileReader();
        reader.readAsDataURL(dataTransfer.files[0]);
        reader.onload = function(e) {
          var image = new Image();
          image.src = e.target.result;
          image.onload = function() {
            var height = this.height;
            var width = this.width;
            console.log(height, width);
            if (height >= 400 || width >= 480) {
              _this.setState({
                imageSource: reader.result, // Assigning source of banner image to show as preview
                imageName: _this.targetElement.files[0].name,
                imageType: _this.targetElement.files[0].type
              });
            } else {
              showWarningToast(
                'minimum requied dimesions for image is 480x400'
              );
              return false;
            }
          };
        };
      } else {
        showWarningToast("Can't upload file more then 5 MB");
      }
    }
  }

  updateProfileImage(imgData, newImage) {
    this.setState({
      bannerImageSource: imgData
    });

    if (newImage) {
      if (this.state.newBannerImageAWSURL) {
        this.deleteSpeakerImageFromAWS(this.state.newBannerImageAWSURL);
      }
      this.setState({
        bannerUploadInProgress: true,
        fileUploadProgress: 0
      });
      // targetElement = this.targetElement;
      this.targetElement = { files: [] };
      this.targetElement.files.name = newImage.name;
      this.targetElement.files.push(newImage);
      let targetElement = this.targetElement;

      try {
        let _this = this;
        // const eventId = this.props.events.editEvent.eventId;
        createEventDirectory(Config.S3AlbumForSponsor, function(result) {
          if (result.directoryStatus) {
            console.log('directory created');
            let fileName = newImage.name;
            let fileNameArray = fileName.split('.');
            fileNameArray[fileNameArray.length - 2] =
              _this.props.userInfo.id + '_' + generateUniqueId();
            fileName = fileNameArray.join('.');
            addPhoto(
              Config.S3AlbumForSponsor,
              targetElement,
              fileName,
              null,
              (error, data) => {
                console.log('upload success', error, data);
                _this.setState({
                  bannerUploadInProgress: false
                });
                if (error) {
                  return;
                }
                if (data.Location) {
                  const bannerImageAWSURL = data.Location;
                  _this.setState({
                    //bannerImageAWSURL,
                    newBannerImageAWSURL: bannerImageAWSURL,
                    // imageURL: bannerImageAWSURL,
                    isFormChanged: true,
                    deleteIco: true
                  });
                }
              },
              _this.setFileUploadProgress
            );
          } else {
            console.log('directory creation failed');
          }
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  }

  removeEventBanner(AWSFileURL) {
    this.setState({
      bannerImageSource: ''
      //bannerImageAWSURL : '',
      //newBannerImageAWSURL : ''
    });
  }

  deleteSpeakerImageFromAWS(AWSFileURL) {
    try {
      const _bannerUrl = AWSFileURL;
      const AwsAlbumName = Config.S3AlbumForSponsor;
      let _this = this;
      let _bannerUrlArray = _bannerUrl.split('/');
      let AwsFileName = _bannerUrlArray[_bannerUrlArray.length - 1];

      deleteEventImage(AwsAlbumName, AwsAlbumName + '/' + AwsFileName, function(
        error,
        result
      ) {
        if (error) return console.log('delete image callback', error, result);
        if (_this.state.newBannerImageAWSURL === AwsFileName)
          _this.setState({
            newBannerImageAWSURL: ''
          });
      });
    } catch (err) {
      console.log('delete banner image error');
    }
  }

  /*handleDrop(dataTransfer) {
    let _this = this;

    if (dataTransfer && dataTransfer.files && dataTransfer.files[0]) {
      if (dataTransfer.files[0].size <= this.state.uploadFileSize) {
        _this.setState({
          bannerUploadInProgress: true,
          fileUploadProgress: 0
        });
        let targetElement = Object.assign({}, dataTransfer);
        this.targetElement =
        targetElement.files = Object.assign([], dataTransfer.files);
        // Read source of file that selected to upload as banner
        let reader = new FileReader();
        reader.addEventListener(
          'load',
          () => {
            this.setState({
              bannerImageSource: reader.result // Assigning source of banner image to show as preview
            });
          },
          false
        );
        reader.readAsDataURL(dataTransfer.files[0]);
        // END Read source of file that selected to upload as banner

        //Uploading banner image on AWS server
        try {
          // const eventId = this.props.events.editEvent.eventId;
          createEventDirectory(_this.state.AWSAlbumName, function(result) {
            if (result.directoryStatus) {
              console.log('directory created');
              let fileName = targetElement.files[0].name;
              let fileNameArray = fileName.split('.');
              fileNameArray[fileNameArray.length - 2] =
                _this.props.userInfo.id + '_' + generateUniqueId();
              fileName = fileNameArray.join('.');
              addPhoto(
                _this.state.AWSAlbumName,
                targetElement,
                fileName,
                null,
                (error, data) => {
                  console.log('upload success', error, data);
                  _this.setState({
                    bannerUploadInProgress: false
                  });
                  if (error) {
                    return;
                  }
                  if (data.Location) {
                    const bannerImageAWSURL = data.Location;
                    _this.setState({
                      bannerImageAWSURL,
                      isFormChanged: true
                    });
                  }
                },
                _this.setFileUploadProgress
              );
            } else {
              console.log('directory creation failed');
            }
          });
        } catch (e) {
          console.log(e.message);
        }
        //END Uploading banner image on AWS server
      } else {
        showWarningToast("Can't upload file more then 5 MB");
      }
    }
  }*/

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

  validateSponsorName(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Name is required';
      this.setState({
        isSponsorNameValid: false,
        sponsorNameErrorMessage: errMessage,
        sponsorNameActive: false
      });
      return 0;
    }

    this.setState({
      isSponsorNameValid: true,
      sponsorNameErrorMessage: '',
      sponsorNameActive: false
    });
    return 1;
  }

  validateWebSiteLink(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Website link is required';
      this.setState({
        isWebSiteLinkValid: false,
        webSiteLinkErrorMessage: errMessage,
        webSiteLinkActive: false
      });
      return 0;
    }

    if (!validator.isURL(value)) {
      errMessage = `Website link is not valid`;
      this.setState({
        isWebSiteLinkValid: false,
        webSiteLinkErrorMessage: errMessage,
        webSiteLinkActive: false
      });
      return;
    }

    this.setState({
      isWebSiteLinkValid: true,
      webSiteLinkErrorMessage: '',
      webSiteLinkActive: false
    });
    return 1;
  }

  validateAboutSponsor(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'About sponsor is required';
      this.setState({
        isAboutSponsorValid: false,
        aboutSponsorErrorMessage: errMessage,
        aboutSponsorActive: false
      });
      return 0;
    }

    this.setState({
      isAboutSponsorValid: true,
      aboutSponsorErrorMessage: '',
      aboutSponsorActive: false
    });
    return 1;
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

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  handleNameUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(Config.regExp_alphaNumSpace);
    if (value === '' || regExp.test(value) === true) {
      this.setState({
        [name]: value
      });
    }
  }

  onEditSponsorFormSubmit() {
    this.isFormValid(response => {
      if (response == false) {
        return;
      } else {
        this.submitForm();
      }
    });
  }

  isFormValid(callback) {
    // validate speaker name
    if (!this.state.isSponsorNameValid) {
      if (this.state.sponsorNameErrorMessage == '') {
        this.setState(
          {
            sponsorNameErrorMessage: 'Sponsor name is required'
          },
          () => {
            ReactTooltip.show(this.refs.sponsorName);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.sponsorName);
      callback(false);
      return;
    }

    // validate position
    if (!this.state.isWebSiteLinkValid) {
      if (this.state.webSiteLinkErrorMessage == '') {
        this.setState(
          {
            webSiteLinkErrorMessage: 'Website link is required'
          },
          () => {
            ReactTooltip.show(this.refs.webSiteLink);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.webSiteLink);
      callback(false);
      return;
    }

    // validate about
    if (!this.state.isAboutSponsorValid) {
      if (this.state.aboutSponsorErrorMessage == '') {
        this.setState(
          {
            aboutSponsorErrorMessage: 'About sponsor is required'
          },
          () => {
            ReactTooltip.show(this.refs.aboutSponsor);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.aboutSponsor);
      callback(false);
      return;
    }

    // all fields are valid now return true
    callback(true);
    return;
  }

  submitForm() {
    console.log('this.state', this.state);
    let _this = this;

    if (
      this.state.sponsorName == '' ||
      this.state.webSiteLink == '' ||
      this.state.aboutSponsor == ''
    ) {
      console.log('fields can not be empty');
      return;
    }

    if (this.props.userInfo && this.props.userInfo.id) {
      let speakerRequests = [];
      let sponserName = this.state.sponsorName;
      let webSiteLink = this.state.webSiteLink;
      let about = this.state.aboutSponsor;
      let createrUserId = this.props.userInfo.id;
      let imageURL = this.state.newBannerImageAWSURL
        ? this.state.newBannerImageAWSURL
        : this.state.bannerImageAWSURL;
      //let imageURL = this.state.imageURL;
      // let eventId = 'evt50f3f826fbe3';
      if (this.state.newBannerImageAWSURL) {
        this.deleteSpeakerImageFromAWS(this.state.bannerImageAWSURL);
      }

      if (this.state.bannerImageSource == '') {
        imageURL = '';
        this.deleteSpeakerImageFromAWS(this.state.bannerImageAWSURL);
      }

      let sponsorId = '';
      let sendDataObj = {
        sponsorId: this.props.match.params.id,
        sponserName,
        webSiteLink,
        about,
        imageURL
      };
      console.log(sendDataObj);
      this.props.showLoader();
      innovecsysApiService('editSponsor', sendDataObj).then(response => {
        if (response != undefined) {
          if (response.status == 200) {
            console.log('response', response);
            _this.navigateToUrlPage('/manager/sponsors');
          } else {
            // handleApiError(response);
          }
        }
        _this.props.hideLoader();
      });
    } else {
      console.log('user id not found');
    }
  }

  render() {
    return (
      <div className="main-container">
        <ReactTooltip effect="solid" type="error" place="bottom" />
        {this.state.imageSource !== '' ? (
          <ImageCropper
            showModal={true}
            imagesrc={this.state.imageSource}
            updateProfileImage={this.updateProfileImage}
            imageName={this.state.imageName}
            imgWidth="480"
            imgHeight="400"
            imgType={this.state.imageType}
            aspectRatio={6 / 5}
          />
        ) : (
          ''
        )}
        <div className="innerfull-page inner-page">
          {/* <StepNavBar
                        navigateToUrlPage={this.navigateToUrlPage}
                        tabName="eventSponsers"
                        isEditEvent={this.props.events.isEditEvent}
                    /> */}

          <div className="events-page">
            <div className="event-agenda form-card">
              {/*  <!-- EVENT DIV -->*/}
              <div className="row">
                <div className="col-md-6">
                  <form className="row">
                    <div className="col-md-12">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError:
                              this.state.sponsorNameErrorMessage.length > 0,
                            tbFocus: this.state.sponsorNameActive
                          }
                        )}
                      >
                        <label htmlFor="usr">Sponsor Name</label>
                        <input
                          type="text"
                          maxLength="50"
                          className="form-control input-control"
                          id="sponsorName"
                          placeholder="Sponsor Name"
                          name="sponsorName"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event => this.handleNameUserInput(event)}
                          onBlur={e =>
                            this.validateSponsorName(this.state.sponsorName)
                          }
                          value={this.state.sponsorName}
                          data-tip={this.state.sponsorNameErrorMessage}
                          ref="sponsorName"
                        />
                        {this.state.sponsorNameErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isSponsorNameValid == true ? (
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
                              this.state.webSiteLinkErrorMessage.length > 0,
                            tbFocus: this.state.webSiteLinkActive
                          }
                        )}
                      >
                        <label htmlFor="usr">Website Link</label>
                        <input
                          type="text"
                          maxLength="50"
                          className="form-control input-control"
                          id="webSiteLink"
                          placeholder="Website Link"
                          name="webSiteLink"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event => this.handleUserInput(event)}
                          onBlur={e =>
                            this.validateWebSiteLink(this.state.webSiteLink)
                          }
                          value={this.state.webSiteLink}
                          data-tip={this.state.webSiteLinkErrorMessage}
                          ref="webSiteLink"
                        />
                        {this.state.webSiteLinkErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isWebSiteLinkValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-3">
                  <div className="file-dragNdrop">
                    <div
                      className={`overlay ${
                        this.state.bannerImageSource ? '' : 'hide'
                      }`}
                    >
                      <FileDragAndDrop onDrop={this.handleDrop}>
                        <ul className="social-contact action-tag text-center">
                          {this.state.deleteIco == true ? (
                            <li>
                              <a
                                onClick={() => {
                                  this.removeEventBanner(
                                    this.state.newBannerImageAWSURL
                                  );
                                }}
                                className="ml-2"
                              >
                                {/*<i className="fa fa-trash" />*/}
                                <span className="ico-delete">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#deleteIco`} />
                                  </svg>
                                </span>
                              </a>
                            </li>
                          ) : (
                            ''
                          )}

                          <li>
                            <a
                              onClick={() => {
                                this.imageUploadFileElement.click();
                              }}
                              className="ml-2"
                            >
                              {/*<i className="fa fa-pencil" />*/}
                              <span className="ico-pen">
                                <svg>
                                  <use xlinkHref={`${Sprite}#penIco`} />
                                </svg>
                              </span>
                            </a>
                          </li>
                        </ul>
                      </FileDragAndDrop>
                    </div>
                    <FileDragAndDrop onDrop={this.handleDrop}>
                      <div className="uploadFile">
                        <input
                          id="fileSelector"
                          type="file"
                          className="file-upload-input"
                          accept="image/*"
                          onChange={event => {
                            const evt = event;
                            this.handleDrop(evt.target);
                          }}
                          onClick={event => {
                            event.target.value = null;
                          }}
                          ref={input => (this.imageUploadFileElement = input)}
                        />
                        <div
                          className={this.state.bannerImageSource ? 'hide' : ''}
                        >
                          <div>
                            <img
                              src={this.state.imageURL || imgFileUpload}
                              className="file-upload-img"
                              alt=""
                            />
                          </div>
                          <label>Drag & Drop</label>
                          <p>
                            a file here or <span>browse</span>
                          </p>
                          {this.state.bannerImageSource == '' ? (
                            ''
                          ) : (
                            <p>
                              File Name :{' '}
                              {this.state.uploadedFile &&
                              this.state.uploadedFile.name
                                ? this.state.uploadedFile.name
                                : ''}
                            </p>
                          )}
                        </div>
                        <div className="cls-ImgAdjust">
                          <img
                            src={this.state.bannerImageSource}
                            alt={this.state.bannerImageAWSURL}
                            style={{ width: 100 + '%', height: 100 + '%' }}
                            className={
                              this.state.bannerImageSource ? '' : 'hide'
                            }
                          />
                          <div
                            className={
                              this.state.bannerUploadInProgress
                                ? 'progress'
                                : 'progress hide'
                            }
                            style={{
                              width: 50 + '%',
                              textAlign: 'center',
                              margin: '5px auto auto auto'
                            }}
                          >
                            <div
                              className="progress-bar progress-bar-warning"
                              role="progressbar"
                              aria-valuenow={this.state.fileUploadProgress}
                              aria-valuemin="0"
                              aria-valuemax="100"
                              style={{
                                width: this.state.fileUploadProgress + '%',
                                color: 'red'
                              }}
                            >
                              {this.state.fileUploadProgress}% Complete
                            </div>
                          </div>
                        </div>
                      </div>
                    </FileDragAndDrop>
                    {/* <FileDragAndDrop onDrop={this.handleDrop}>
                      <div className="uploadFile">
                        <input
                          id="fileSelector"
                          type="file"
                          className="file-upload-input"
                        />
                        <div>
                          <img
                            src={
                              this.state.uploadedFile == ''
                                ? imgFileUpload
                                : imgFileUploaded
                            }
                            alt=""
                            className="file-upload-img"
                          />
                        </div>
                        <label className="">Drag & Drop</label>
                        <p className="">
                          a file here or <span>browse</span>
                        </p>
                        {this.state.uploadedFile == '' ? (
                          'No file selected'
                        ) : (
                          <p>File Name : {this.state.uploadedFile.name}</p>
                        )}
                      </div>
                    </FileDragAndDrop> */}
                  </div>
                </div>
                {/*<div className="col-md-9">
                  <div
                    className={classNames('form-group cls-relative ripple', {
                      tbError: this.state.aboutSponsorErrorMessage.length > 0,
                      tbFocus: this.state.aboutSponsorActive
                    })}
                  >
                    <label htmlFor="usr">About Sponsor</label>
                    <textarea
                      className="form-control textarea-control h-120p"
                      rows="5"
                      id="aboutSponsor"
                      placeholder="About Sponsor"
                      name="aboutSponsor"
                      onFocus={event => this.onControlFocus(event)}
                      onChange={event => this.handleUserInput(event)}
                      onBlur={e =>
                        this.validateAboutSponsor(this.state.aboutSponsor)
                      }
                      value={this.state.aboutSponsor}
                      data-tip={this.state.aboutSponsorErrorMessage}
                      ref="aboutSponsor"
                    />
                    {this.state.aboutSponsorErrorMessage.length > 0 ? (
                      <i className="fa fa-exclamation-triangle alertIcon mr-20" />
                    ) : (
                      ''
                    )}
                    {this.state.isAboutSponsorValid == true ? (
                      <i className="fa fa-check tbCheck mr-20" />
                    ) : (
                      ''
                    )}
                  </div>
                </div>*/}
                <div className="col-md-9">
                  <div
                    className={classNames('form-group cls-relative ripple', {
                      tbError: this.state.aboutSponsorErrorMessage.length > 0,
                      tbFocus: this.state.aboutSponsorActive
                    })}
                  >
                    <label htmlFor="usr">About Sponsor</label>
                    <textarea
                      className="form-control textarea-control h-120p"
                      rows="5"
                      id="aboutSponsor"
                      placeholder="About Sponsor"
                      name="aboutSponsor"
                      onFocus={event => this.onControlFocus(event)}
                      onChange={event => this.handleUserInput(event)}
                      onBlur={e =>
                        this.validateAboutSponsor(this.state.aboutSponsor)
                      }
                      value={this.state.aboutSponsor}
                      data-tip={this.state.aboutSponsorErrorMessage}
                      ref="aboutSponsor"
                    />
                    {this.state.aboutSponsorErrorMessage.length > 0 ? (
                      <i className="fa fa-exclamation-triangle alertIcon mr-20" />
                    ) : (
                      ''
                    )}
                    {this.state.isAboutSponsorValid == true ? (
                      <i className="fa fa-check tbCheck mr-20" />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
              {/* <!-- ROW END -->*/}
            </div>
            {/* <!-- EVENT DIV -->*/}
            <div className="events-page-footer">
              <button
                className="btn btnSuccess mb-20 ripple"
                type="button"
                onClick={this.onEditSponsorFormSubmit}
              >
                Save
              </button>

              <button
                className="btn btnCancel mb-20 ml-10 ripple"
                type="button"
                onClick={() => this.navigateToUrlPage('/manager/sponsors')}
              >
                Cancel
              </button>

              {/*
              <div className="btnPageNav">
                <a  className="btnTag mb-20">
                  <i className="fa fa-arrow-left" aria-hidden="true" />
                </a>
                <a  className="btnTag mb-20">
                  <i className="fa fa-arrow-right" aria-hidden="true" />
                </a>
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.profileData,
    events: state.events,
    sponsors: state.sponsors
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ showLoader, hideLoader }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditSponsor);

// export default editSponsor;
