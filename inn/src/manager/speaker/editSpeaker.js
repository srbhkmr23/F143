import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import FileDragAndDrop from 'react-file-drag-and-drop';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';

import innovecsysApiService from '../../common/core/api';
import StepNavBar from '../common/stepNavBar';
import {
  showWarningToast,
  generateUniqueId
} from '../../common/core/common-functions';
import {
  addPhoto,
  createEventDirectory,
  deleteEventImage
} from '../../common/core/aws-s3';
import ImageCropper from '../../common/core/imageCropper';
import { showLoader, hideLoader } from '../../common/action/index';
import Config from '../../common/core/config';

import imgFileUpload from '../../img/file-upload-img.png';
import imgFileUploaded from '../../img/file.png';
import validator from 'validator';
import Sprite from '../../img/sprite.svg';

let targetElement = '';
class EditSpeaker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speakerName: '',
      isSpeakerNameValid: true,
      speakerNameErrorMessage: '',
      speakerNameActive: true,

      position: '',
      isPositionValid: true,
      positionErrorMessage: '',
      positionActive: true,

      company: '',
      isCompanyValid: true,
      companyErrorMessage: '',
      companyActive: true,

      awards: 0,
      isAwardsValid: false,
      awardsErrorMessage: '',
      awardsActive: false,

      grant: 0,
      isGrantValid: false,
      grantErrorMessage: '',
      grantActive: false,

      publications: 0,
      isPublicationsValid: false,
      publicationsErrorMessage: '',
      publicationsActive: false,

      patents: 0,
      isPatentsValid: false,
      patentsErrorMessage: '',
      patentsActive: false,

      aboutSpeaker: '',
      isAboutSpeakerValid: true,
      aboutSpeakerErrorMessage: '',
      aboutSpeakerActive: true,

      imageURL: '',

      rating: 0,
      createrUserId: '',
      activeMediaUrl: 'twitter',
      uploadedFile: '',

      uploadFileSize: 5242880,
      fileUploadProgress: 0,
      bannerImageAWSURL: '', //AWS image url will store here, get this url after upload banner on AWS, and send this url in event data
      bannerUploadInProgress: false,
      uploadingImageData: '', //Store banner imanger object that will pass to aws for upload
      bannerImageSource: '', //Store banner image source data to show in image tab
      AWSAlbumName: 'speakers',

      socialTwitter: '',
      socialLinkedin: '',
      socialFacebook: '',
      listOfSocialMediaUrl: {
        twitterURL: '',
        facebookURL: '',
        linkedinURL: ''
      },

      twitterLink: '',
      isTwitterLinkValid: false,
      twitterLinkErrorMessage: '',
      twitterLinkActive: false,

      fbLink: '',
      isFbLinkValid: false,
      fbLinkErrorMessage: '',
      fbLinkActive: false,

      linkedinLink: '',
      isLinkedinLinkValid: false,
      linkedinLinkErrorMessage: '',
      linkedinLinkActive: false,
      imageSource: '',
      imageName: '',
      imageType: '',
      deleteIco: true
    };

    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.onEditSpeakerFormSubmit = this.onEditSpeakerFormSubmit.bind(this);
    this.handleUserRating = this.handleUserRating.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.setFileUploadProgress = this.setFileUploadProgress.bind(this);
    this.updateProfileImage = this.updateProfileImage.bind(this);
  }

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

  componentDidMount() {
    if (
      this.props.speakers &&
      this.props.speakers.all &&
      this.props.speakers.all.length
    ) {
      const speakerListArr = this.props.speakers.all;
      const currentSpeaker = speakerListArr.find(speaker => {
        return speaker.speakerId === this.props.match.params.id;
      });

      var socialMediaURLResponse = currentSpeaker.socialMediaURLResponse;
      this.setState({
        speakerName: currentSpeaker.name,
        position: currentSpeaker.position,
        company: currentSpeaker.company,
        aboutSpeaker: currentSpeaker.about,
        rating: currentSpeaker.rating,

        bannerImageSource: currentSpeaker.imageURL
          ? currentSpeaker.imageURL
          : '',

        bannerImageAWSURL: currentSpeaker.imageURL
          ? currentSpeaker.imageURL
          : '',
        //imageURL: currentSpeaker.imageURL ? currentSpeaker.imageURL : '',

        socialTwitter: socialMediaURLResponse
          ? currentSpeaker.socialMediaURLResponse.twitterURL || ''
          : '',
        socialFacebook: socialMediaURLResponse
          ? currentSpeaker.socialMediaURLResponse.facebookURL || ''
          : '',
        socialLinkedin: socialMediaURLResponse
          ? currentSpeaker.socialMediaURLResponse.linkedinURL || ''
          : '',

        awards: currentSpeaker.noOfAwards || 0,
        patents: currentSpeaker.noOfPatents || 0,
        grant: currentSpeaker.noOfGrants || 0,
        publications: currentSpeaker.noOfPublications | 0
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

  /* handleDrop(dataTransfer) {
    let _this = this;

    if (dataTransfer && dataTransfer.files && dataTransfer.files[0]) {
      if (dataTransfer.files[0].size <= this.state.uploadFileSize) {
        _this.setState({
          bannerUploadInProgress: true,
          fileUploadProgress: 0
        });
        let targetElement = Object.assign({}, dataTransfer);
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
                      imageURL: bannerImageAWSURL,
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

  handleDrop(dataTransfer) {
    let _this = this;
    _this.setState({ imageSource: '', deleteIco: false });
    if (dataTransfer && dataTransfer.files && dataTransfer.files[0]) {
      if (dataTransfer.files[0].size <= this.state.uploadFileSize) {
        //targetElement = Object.assign({}, dataTransfer);

        //targetElement.files = Object.assign([], dataTransfer.files);
        this.targetElement = Object.assign({}, dataTransfer);
        this.targetElement.files = Object.assign([], dataTransfer.files);
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

        // Read source of file that selected to upload as banner
        /*let reader = new FileReader();
        reader.addEventListener(
          'load',
          () => {
            this.setState({
              imageSource: reader.result // Assigning source of banner image to show as preview
            });
          },
          false
        );
        reader.readAsDataURL(dataTransfer.files[0]);
        _this.setState({
          imageName: this.targetElement.files[0].name,
          imageType: this.targetElement.files[0].type
        });*/
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
      // console.log(newImage);
      // console.log(this.targetElement);
      // console.log(this.targetElement.files);
      // targetElement = this.targetElement;

      this.targetElement = { files: [] };
      this.targetElement.files.name = newImage.name;
      this.targetElement.files.push(newImage);
      let targetElement = this.targetElement;

      try {
        let _this = this;
        createEventDirectory(Config.S3AlbumForSpeaker, function(result) {
          if (result.directoryStatus) {
            console.log('directory created');
            let fileName = newImage.name;
            let fileNameArray = fileName.split('.');
            fileNameArray[fileNameArray.length - 2] =
              _this.props.userInfo.id + '_' + generateUniqueId();
            fileName = fileNameArray.join('.');
            addPhoto(
              Config.S3AlbumForSpeaker,
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
                    //  bannerImageAWSURL,
                    // imageURL: bannerImageAWSURL,
                    newBannerImageAWSURL: bannerImageAWSURL,
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
    console.log(AWSFileURL);
    try {
      const _bannerUrl = AWSFileURL;
      const AwsAlbumName = Config.S3AlbumForSpeaker;
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

  setFileUploadProgress(progressValue) {
    this.setState({
      fileUploadProgress: progressValue
    });
  }

  validateSpeakerName(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Name is required';
      this.setState({
        isSpeakerNameValid: false,
        speakerNameErrorMessage: errMessage,
        speakerNameActive: false
      });
      return 0;
    }

    this.setState({
      isSpeakerNameValid: true,
      speakerNameErrorMessage: '',
      speakerNameActive: false
    });
    return 1;
  }

  validatePosition(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Position is required';
      this.setState({
        isPositionValid: false,
        positionErrorMessage: errMessage,
        positionActive: false
      });
      return 0;
    }

    this.setState({
      isPositionValid: true,
      positionErrorMessage: '',
      positionActive: false
    });
    return 1;
  }

  validateCompany(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Company name is required';
      this.setState({
        isCompanyValid: false,
        companyErrorMessage: errMessage,
        companyActive: false
      });
      return 0;
    }

    this.setState({
      isCompanyValid: true,
      companyErrorMessage: '',
      companyActive: false
    });
    return 1;
  }

  validateAboutSpeaker(value) {
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'About speaker is required';
      this.setState({
        isAboutSpeakerValid: false,
        aboutSpeakerErrorMessage: errMessage,
        aboutSpeakerActive: false
      });
      return 0;
    }

    this.setState({
      isAboutSpeakerValid: true,
      aboutSpeakerErrorMessage: '',
      aboutSpeakerActive: false
    });
    return 1;
  }

  validateSocialTwitterLink(value) {
    let errMessage;
    if (value !== '') {
      if (!validator.isURL(value)) {
        errMessage = `Twitter link is not valid`;
        this.setState({
          isTwitterLinkValid: false,
          twitterLinkErrorMessage: errMessage,
          twitterLinkActive: false
        });
        return;
      }
    }

    this.setState({
      isTwitterLinkValid: true,
      twitterLinkErrorMessage: '',
      twitterLinkActive: false
    });
    return 1;
  }

  validateSocialFbLink(value) {
    let errMessage;
    if (value !== '') {
      if (!validator.isURL(value)) {
        errMessage = `Facebook link is not valid`;
        this.setState({
          isFbLinkValid: false,
          fbLinkErrorMessage: errMessage,
          fbLinkActive: false
        });
        return;
      }
    }

    this.setState({
      isFbLinkValid: true,
      fbLinkErrorMessage: '',
      fbLinkActive: false
    });
    return 1;
  }

  validateSocialLinkedInLink(value) {
    let errMessage;
    if (value !== '') {
      if (!validator.isURL(value)) {
        errMessage = `Linkedin link is not valid`;
        this.setState({
          isLinkedinLinkValid: false,
          linkedinLinkErrorMessage: errMessage,
          linkedinLinkActive: false
        });
        return;
      }
    }

    this.setState({
      isLinkedinLinkValid: true,
      linkedinLinkErrorMessage: '',
      linkedinLinkActive: false
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

  handleUserNumericInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      this.setState({ [name]: value });
    }
  }

  handleUserRating(value) {
    this.setState({
      rating: value
    });
  }

  onEditSpeakerFormSubmit() {
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
    if (!this.state.isSpeakerNameValid) {
      if (this.state.speakerNameErrorMessage == '') {
        this.setState(
          {
            speakerNameErrorMessage: 'Speaker name is required'
          },
          () => {
            ReactTooltip.show(this.refs.speakerName);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.speakerName);
      callback(false);
      return;
    }

    // validate position
    if (!this.state.isPositionValid) {
      if (this.state.positionErrorMessage == '') {
        this.setState(
          {
            positionErrorMessage: 'Position is required'
          },
          () => {
            ReactTooltip.show(this.refs.position);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.position);
      callback(false);
      return;
    }

    // validate company
    if (!this.state.isCompanyValid) {
      if (this.state.companyErrorMessage == '') {
        this.setState(
          {
            companyErrorMessage: 'Company is required'
          },
          () => {
            ReactTooltip.show(this.refs.company);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.company);
      callback(false);
      return;
    }

    // validate about
    if (!this.state.isAboutSpeakerValid) {
      if (this.state.aboutSpeakerErrorMessage == '') {
        this.setState(
          {
            aboutSpeakerErrorMessage: 'About speaker is required'
          },
          () => {
            ReactTooltip.show(this.refs.aboutSpeaker);
            callback(false);
            return;
          }
        );
      }
      ReactTooltip.show(this.refs.aboutSpeaker);
      callback(false);
      return;
    }

    // all fields are valid now return true
    callback(true);
    return;
  }

  submitForm() {
    if (
      this.state.speakerName == '' ||
      this.state.position == '' ||
      this.state.company == '' ||
      this.state.aboutSpeaker == ''
    ) {
      console.log('fields can not be empty');
      return;
    }

    if (this.props.userInfo && this.props.userInfo.id) {
      let speakerRequests = [];
      let name = this.state.speakerName;
      let position = this.state.position;
      let company = this.state.company;
      let about = this.state.aboutSpeaker;
      let rating = this.state.rating;
      let createrUserId = this.props.userInfo.id;
      //let imageURL = this.state.imageURL;
      let imageURL = this.state.newBannerImageAWSURL
        ? this.state.newBannerImageAWSURL
        : this.state.bannerImageAWSURL;
      let listOfSocialMediaUrl = this.state.listOfSocialMediaUrl;
      listOfSocialMediaUrl = {
        twitterURL: this.state.socialTwitter,
        facebookURL: this.state.socialFacebook,
        linkedinURL: this.state.socialLinkedin
      };

      let noOfAwards = this.state.awards || 0;
      let noOfPatents = this.state.patents || 0;
      let noOfGrants = this.state.grant || 0;
      let noOfPublications = this.state.publications || 0;

      if (this.state.newBannerImageAWSURL) {
        this.deleteSpeakerImageFromAWS(this.state.bannerImageAWSURL);
      }

      if (this.state.bannerImageSource == '') {
        imageURL = '';
        this.deleteSpeakerImageFromAWS(this.state.bannerImageAWSURL);
      }

      let sendDataObj = {
        speakerId: this.props.match.params.id,
        name,
        position,
        company,
        about,
        rating,
        imageURL,
        listOfSocialMediaUrl,
        noOfAwards,
        noOfPatents,
        noOfGrants,
        noOfPublications
      };
      innovecsysApiService('editSpeaker', sendDataObj).then(response => {
        if (response != undefined) {
          if (response.status == 200) {
            console.log('response', response);
            this.navigateToUrlPage('/manager/speakers');
          } else {
            // handleApiError(response);
          }
        }
      });
    } else {
      console.log('user id not found');
    }
  }

  render() {
    return (
      <div className="main-container">
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
        <ReactTooltip effect="solid" type="error" place="bottom" />
        <div className="innerfull-page inner-page">
          {/* <StepNavBar
                        navigateToUrlPage={this.navigateToUrlPage}
                        tabName="eventSpeakers"
                        isEditEvent={this.props.events.isEditEvent}
                    /> */}

          <div className="events-page">
            <a
              href="javascript:void(0);"
              className="cancel-icon"
              onClick={() => this.navigateToUrlPage('/manager/speakers')}
            >
              <span className="ico-close">
                <svg>
                  <use xlinkHref={`${Sprite}#close`} />
                </svg>
              </span>
            </a>
            <div className="event-agenda form-card">
              <div className="row">
                <div className="col-md-6">
                  <form className="row">
                    <div className="col-md-12">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError:
                              this.state.speakerNameErrorMessage.length > 0,
                            tbFocus: this.state.speakerNameActive
                          }
                        )}
                      >
                        <label htmlFor="speakerName">Speaker Name</label>
                        <input
                          type="text"
                          maxLength="50"
                          className="form-control input-control"
                          id="speakerName"
                          placeholder="Speaker name"
                          name="speakerName"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event => this.handleNameUserInput(event)}
                          onBlur={e =>
                            this.validateSpeakerName(this.state.speakerName)
                          }
                          value={this.state.speakerName}
                          data-tip={this.state.speakerNameErrorMessage}
                          ref="speakerName"
                        />
                        {this.state.speakerNameErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isSpeakerNameValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div
                        className="form-group"
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError: this.state.positionErrorMessage.length > 0,
                            tbFocus: this.state.positionActive
                          }
                        )}
                      >
                        <label htmlFor="position">Position</label>
                        <input
                          type="text"
                          maxLength="100"
                          className="form-control input-control"
                          id="position"
                          placeholder="Position"
                          name="position"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event => this.handleUserInput(event)}
                          onBlur={e =>
                            this.validatePosition(this.state.position)
                          }
                          value={this.state.position}
                          data-tip={this.state.positionErrorMessage}
                          ref="position"
                        />
                        {this.state.positionErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isPositionValid == true ? (
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
                            tbError: this.state.companyErrorMessage.length > 0,
                            tbFocus: this.state.companyActive
                          }
                        )}
                      >
                        <label htmlFor="company">Company</label>
                        <input
                          type="text"
                          maxLength="100"
                          className="form-control input-control"
                          id="company"
                          placeholder="Company"
                          name="company"
                          onFocus={event => this.onControlFocus(event)}
                          onChange={event => this.handleUserInput(event)}
                          onBlur={e => this.validateCompany(this.state.company)}
                          value={this.state.company}
                          data-tip={this.state.companyErrorMessage}
                          ref="company"
                        />
                        {this.state.companyErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isCompanyValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>

                    <div className="col-sm-6 col-md-3">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError: this.state.awardsErrorMessage.length > 0,
                            tbFocus: this.state.awardsActive
                          }
                        )}
                      >
                        <label htmlFor="award">Awards</label>
                        <input
                          type="text"
                          maxLength="3"
                          className="form-control input-control"
                          id="awards"
                          placeholder="Awards"
                          name="awards"
                          onChange={event => this.handleUserNumericInput(event)}
                          value={this.state.awards}
                        />
                        {this.state.awardsErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isAwardsValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError: this.state.grantErrorMessage.length > 0,
                            tbFocus: this.state.grantActive
                          }
                        )}
                      >
                        <label htmlFor="company">Grant</label>
                        <input
                          type="text"
                          maxLength="3"
                          className="form-control input-control"
                          id="grant"
                          placeholder="Grant"
                          name="grant"
                          onChange={event => this.handleUserNumericInput(event)}
                          value={this.state.grant}
                        />
                        {this.state.grantErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isGrantValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError:
                              this.state.publicationsErrorMessage.length > 0,
                            tbFocus: this.state.publicationsActive
                          }
                        )}
                      >
                        <label htmlFor="company">Publications</label>
                        <input
                          type="text"
                          maxLength="3"
                          className="form-control input-control"
                          id="publications"
                          placeholder="Publications"
                          name="publications"
                          onChange={event => this.handleUserNumericInput(event)}
                          value={this.state.publications}
                        />
                        {this.state.publicationsErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isPublicationsValid == true ? (
                          <i className="fa fa-check tbCheck" />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <div
                        className={classNames(
                          'form-group cls-relative ripple',
                          {
                            tbError: this.state.patentsErrorMessage.length > 0,
                            tbFocus: this.state.patentsActive
                          }
                        )}
                      >
                        <label htmlFor="company">Patents</label>
                        <input
                          type="text"
                          maxLength="3"
                          className="form-control input-control"
                          id="patents"
                          placeholder="Patents"
                          name="patents"
                          onChange={event => this.handleUserNumericInput(event)}
                          value={this.state.patents}
                        />
                        {this.state.patentsErrorMessage.length > 0 ? (
                          <i className="fa fa-exclamation-triangle alertIcon" />
                        ) : (
                          ''
                        )}
                        {this.state.isPatentsValid == true ? (
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
                              src={imgFileUpload}
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
                          accept="image/*"
                          onChange={event => {
                            const evt = event;
                            this.handleDrop(evt.target);
                          }}
                        />
                        <div>
                          <img
                            src={
                              this.state.uploadedFile == ''
                                ? imgFileUpload
                                : imgFileUploaded
                            }
                            className="file-upload-img"
                            alt=""
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

                    <div className="ratingTag">
                      <label className="labelText">Rate Speaker</label>
                      <div className="stars">
                        <i
                          className={
                            this.state.rating >= 1
                              ? 'fa fa-star on'
                              : 'fa fa-star'
                          }
                          onClick={() => this.handleUserRating(1)}
                        />
                        <i
                          className={
                            this.state.rating >= 2
                              ? 'fa fa-star on'
                              : 'fa fa-star'
                          }
                          onClick={() => this.handleUserRating(2)}
                        />
                        <i
                          className={
                            this.state.rating >= 3
                              ? 'fa fa-star on'
                              : 'fa fa-star'
                          }
                          onClick={() => this.handleUserRating(3)}
                        />
                        <i
                          className={
                            this.state.rating >= 4
                              ? 'fa fa-star on'
                              : 'fa fa-star'
                          }
                          onClick={() => this.handleUserRating(4)}
                        />
                        <i
                          className={
                            this.state.rating >= 5
                              ? 'fa fa-star on'
                              : 'fa fa-star'
                          }
                          onClick={() => this.handleUserRating(5)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-9">
                  <div
                    className={classNames('form-group cls-relative ripple', {
                      tbError: this.state.aboutSpeakerErrorMessage.length > 0,
                      tbFocus: this.state.aboutSpeakerActive
                    })}
                  >
                    <label htmlFor="aboutSpeaker">About Speaker</label>
                    <textarea
                      className="form-control textarea-control h-120p"
                      rows="5"
                      id="aboutSpeaker"
                      placeholder="About speaker"
                      name="aboutSpeaker"
                      onFocus={event => this.onControlFocus(event)}
                      onChange={event => this.handleUserInput(event)}
                      onBlur={e =>
                        this.validateAboutSpeaker(this.state.aboutSpeaker)
                      }
                      value={this.state.aboutSpeaker}
                      data-tip={this.state.aboutSpeakerErrorMessage}
                      ref="aboutSpeaker"
                    />
                    {this.state.aboutSpeakerErrorMessage.length > 0 ? (
                      <i className="fa fa-exclamation-triangle alertIcon mr-20" />
                    ) : (
                      ''
                    )}
                    {this.state.isAboutSpeakerValid == true ? (
                      <i className="fa fa-check tbCheck mr-20" />
                    ) : (
                      ''
                    )}
                  </div>

                  <div className="social-media-links">
                    <p className="labelText">Social Media Links</p>
                    <ul className="links">
                      <li
                        onClick={() => {
                          this.setState({ activeMediaUrl: 'twitter' });
                        }}
                        className={classNames({
                          active: this.state.activeMediaUrl == 'twitter'
                        })}
                      >
                        <a>
                          <i className="fa fa-twitter" aria-hidden="true" />
                        </a>
                        <div className="url-control twitter">
                          <div
                            className={classNames(
                              'form-group cls-relative ripple',
                              {
                                tbError:
                                  this.state.twitterLinkErrorMessage.length > 0,
                                tbFocus: this.state.twitterLinkActive
                              }
                            )}
                          >
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Twitter URL"
                              name="socialTwitter"
                              value={this.state.socialTwitter}
                              onFocus={event => this.onControlFocus(event)}
                              onChange={event => this.handleUserInput(event)}
                              onBlur={e =>
                                this.validateSocialTwitterLink(
                                  this.state.socialTwitter
                                )
                              }
                              data-tip={this.state.twitterLinkErrorMessage}
                              ref="twitterLink"
                            />
                            {this.state.twitterLinkErrorMessage.length > 0 ? (
                              <i className="fa fa-exclamation-triangle alertIcon" />
                            ) : (
                              ''
                            )}
                            {this.state.isTwitterLinkValid == true ? (
                              <i className="fa fa-check tbCheck" />
                            ) : (
                              ''
                            )}
                          </div>
                          <span className="arrow" />
                        </div>
                      </li>

                      <li
                        onClick={() => {
                          this.setState({ activeMediaUrl: 'linkedin' });
                        }}
                        className={classNames({
                          active: this.state.activeMediaUrl == 'linkedin'
                        })}
                      >
                        <a>
                          <i className="fa fa-linkedin" aria-hidden="true" />
                        </a>
                        <div className="url-control linkedin">
                          <div
                            className={classNames(
                              'form-group cls-relative ripple',
                              {
                                tbError:
                                  this.state.linkedinLinkErrorMessage.length >
                                  0,
                                tbFocus: this.state.linkedinLinkActive
                              }
                            )}
                          >
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Linkedin URL"
                              name="socialLinkedin"
                              value={this.state.socialLinkedin}
                              onFocus={event => this.onControlFocus(event)}
                              onChange={event => this.handleUserInput(event)}
                              onBlur={e =>
                                this.validateSocialLinkedInLink(
                                  this.state.socialLinkedin
                                )
                              }
                              data-tip={this.state.linkedinLinkErrorMessage}
                              ref="linkedinLink"
                            />
                            {this.state.linkedinLinkErrorMessage.length > 0 ? (
                              <i className="fa fa-exclamation-triangle alertIcon" />
                            ) : (
                              ''
                            )}
                            {this.state.isLinkedinLinkValid == true ? (
                              <i className="fa fa-check tbCheck" />
                            ) : (
                              ''
                            )}
                          </div>

                          <span className="arrow" />
                        </div>
                      </li>
                      <li
                        onClick={() => {
                          this.setState({ activeMediaUrl: 'facebook' });
                        }}
                        className={classNames({
                          active: this.state.activeMediaUrl == 'facebook'
                        })}
                      >
                        <a>
                          <i className="fa fa-facebook" aria-hidden="true" />
                        </a>
                        <div className="url-control facebook">
                          <div
                            className={classNames(
                              'form-group cls-relative ripple',
                              {
                                tbError:
                                  this.state.fbLinkErrorMessage.length > 0,
                                tbFocus: this.state.fbLinkActive
                              }
                            )}
                          >
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Facebook URL"
                              name="socialFacebook"
                              value={this.state.socialFacebook}
                              onFocus={event => this.onControlFocus(event)}
                              onChange={event => this.handleUserInput(event)}
                              onBlur={e =>
                                this.validateSocialFbLink(
                                  this.state.socialFacebook
                                )
                              }
                              data-tip={this.state.fbLinkErrorMessage}
                              ref="facebookLink"
                            />
                            {this.state.fbLinkErrorMessage.length > 0 ? (
                              <i className="fa fa-exclamation-triangle alertIcon" />
                            ) : (
                              ''
                            )}
                            {this.state.isFbLinkValid == true ? (
                              <i className="fa fa-check tbCheck" />
                            ) : (
                              ''
                            )}
                          </div>
                          <span className="arrow" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="events-page-footer-add-new">
              <button
                className="btn btnSuccess mb-20 ripple"
                type="button"
                onClick={this.onEditSpeakerFormSubmit}
              >
                Save
              </button>

              <button
                className="btn btnCancel mb-20 ml-10 ripple"
                type="button"
                onClick={() => this.navigateToUrlPage('/manager/speakers')}
              >
                Cancel
              </button>

              {/* <div className="btnPageNav">
                <a  className="btnTag mb-20" onClick={()=>this.navigateToUrlPage('/manager/speakerList')}>
                  <i className="fa fa-arrow-left" aria-hidden="true" />
                </a>
                <a  className="btnTag mb-20">
                  <i className="fa fa-arrow-right" aria-hidden="true" />
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    userInfo: state.profileData,
    events: state.events,
    speakers: state.speakers
  };
};

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({ showLoader, hideLoader }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EditSpeaker);
