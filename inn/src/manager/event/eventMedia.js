import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import FileDragAndDrop from 'react-file-drag-and-drop';
import moment from 'moment';
import Dialog, { DialogContent } from 'material-ui/Dialog';
import { Prompt } from 'react-router';
import { bytesToSize } from '../../common/core/aws-s3';

import {
  actionManagerAccess,
  editEvent,
  actionActiveEvent,
  actionDeleteMediaEvent,
  actionNewUploadedMedia,
  actionAppendMediaUrl
} from '../../common/action/index';
import StepNavBar from '../common/stepNavBar';
import {
  addPhoto,
  createEventDirectory,
  getFileInformation,
  deleteEventImage
} from '../../common/core/aws-s3';
import EventMediaItem from './eventMediaItem';
import EventMediaNewUploadedItem from './eventMediaNewUploadedItem';
import innovecsysApiService from '../../common/core/api';
import { generateUniqueId } from '../../common/core/common-functions';

import imgFileUpload2 from '../../img/dragdrop.png';
import imgFileTypeOne from '../../img/media-img.png';
import Config from '../../common/core/config';
import Sprite from '../../img/sprite.svg';

class EventDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaImageURLs: this.props.events.eventMediaList,
      newMediaAwsUrlList: [],
      imageExtensions: ['png', 'jpg', 'jpeg'],
      fileSizeLimit: {
        image: '20971520', // 20 MB
        document: '52428800', // 50 MB
        video: '1610612736', // 1.5 GB
        audio: '73400320' // 70 MB
      },
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
      },
      fileSizeInfo: [],
      event: {},
      newUploadedMedia: [],
      fileCountDialog: false,
      fileValidationDialog: false,
      fileInputValue: '',
      invalidFilesName: [],
      bigFilesName: [],
      prompt: false
    };

    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.uploadFileOnAws = this.uploadFileOnAws.bind(this);
    this.deleteMediaFileFromAWS = this.deleteMediaFileFromAWS.bind(this);
    this.fileCountDialogClose = this.fileCountDialogClose.bind(this);
    this.fileValidationDialogClose = this.fileValidationDialogClose.bind(this);
  }

  componentDidMount() {
    let event = {};

    if (this.props.events.isEditEvent) {
      event = this.props.events.editEvent ? this.props.events.editEvent : {};
    } else {
      event = this.props.events.addEvent ? this.props.events.addEvent : {};
    }
    const mediaImageURLs = this.props.events.eventMediaList;
    console.log(mediaImageURLs);
    this.setState({
      event,
      mediaImageURLs,
      prompt: false
    });
  }

  setPromptFlag() {
    this.setState({
      prompt: true
    });
  }

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

  handleDrop(dataTransfer) {
    this.setPromptFlag();
    if (dataTransfer && dataTransfer.files) {
      let _bigFilesName = []; // Manage list of file name that exceed max size limit
      let _invalidFilesName = []; // Manage list of files that have invalid extensions
      const fileLength = dataTransfer.files.length;
      if (fileLength < 11) {
        // Cloning file object
        let targetElement = Object.assign({}, dataTransfer);
        targetElement.files = Object.assign([], dataTransfer.files);
        // End Clone file object
        for (let index = 0; index < fileLength; index++) {
          const element = dataTransfer.files[index];
          const fileName = element.name;
          let fileNameArray = fileName.split('.');
          const fileExtension = fileNameArray[
            fileNameArray.length - 1
          ].toUpperCase();

          // Checking extension in allowed files object
          if (fileExtension in this.state.allowedFiles) {
            const fileMaxSize = this.state.fileSizeLimit[
              this.state.allowedFiles[fileExtension]
            ];
            const fileSize = element.size;
            if (fileSize > fileMaxSize) {
              //Files that will exceed file size limit
              _bigFilesName.push({
                name: element.name,
                extension: fileExtension,
                size: fileSize,
                maxSize: fileMaxSize
              });
            } else {
              //Approved files calling file upload functions
              this.uploadFileOnAws(targetElement, index);
            }
          } else {
            // Files with invalid extensions that do not allow to upload
            _invalidFilesName.push(element.name);
          }
        }

        this.setState({
          bigFilesName: _bigFilesName,
          invalidFilesName: _invalidFilesName
        });
        // Show invalid file names to user
        if (_invalidFilesName.length > 0 || _bigFilesName.length > 0) {
          this.setState({
            fileValidationDialog: true
          });
        }

        // Code to show popup for invalide files

        // Old code that was working
        // let targetElement = Object.assign({}, dataTransfer);
        // targetElement.files = Object.assign([], dataTransfer.files);
        // for (let index = 0; index < dataTransfer.files.length; index++) {
        //   this.uploadFileOnAws(targetElement, index);
        // }
        // END Old code that was working
      } else {
        // Show dialog with max no of files messages
        this.setState({
          fileCountDialog: true
        });
      }
    }
  }

  uploadFileOnAws(targetElement, index) {
    const value = targetElement.files[index];
    const fileName = value.name;
    const fileSize = bytesToSize(value.size);

    // Addding object in temp array to manage media source code and AWSURL
    let _newUploadedMedia = this.props.events.newUploadedMedia;
    console.log(_newUploadedMedia);
    const count = _newUploadedMedia.length;
    let _mediaObject = {
      id: count,
      source: imgFileTypeOne,
      AWSURL: '',
      progress: 0,
      uploaded: false,
      fileName,
      fileSize
    };

    _newUploadedMedia.push(_mediaObject);

    this.props.actionNewUploadedMedia(_newUploadedMedia);

    // this.setState({
    //   newUploadedMedia: _newUploadedMedia
    // });

    // // Read source of file that selected to upload as banner
    // let reader = new FileReader();
    // reader.addEventListener(
    //   'load',
    //   () => {
    //     let _newUploadedMedia = this.state.newUploadedMedia;
    //     for (let index = 0; index < _newUploadedMedia.length; index++) {
    //       const element = _newUploadedMedia[index];
    //       if (element.id === count) {
    //         element.source = reader.result; // Assigning source of banner image to show as preview
    //         break;
    //       }
    //     }
    //     this.setState({
    //       newUploadedMedia: _newUploadedMedia
    //     });
    //   },
    //   false
    // );
    // reader.readAsDataURL(targetElement.files[index]);
    // // END Read source of file that selected to upload as banner

    let _this = this;
    try {
      const eventId = this.state.event.eventId;
      createEventDirectory(Config.S3AlbumForEvent + '/' + eventId, function(
        result
      ) {
        if (result.directoryStatus) {
          let fileName = targetElement.files[index].name;
          let fileNameArray = fileName.split('.');

          let saveFileName = targetElement.files[index].name;
          let fileExtension = fileNameArray[fileNameArray.length - 1];

          fileNameArray[fileNameArray.length - 2] =
            _this.props.userInfo.id + '_' + generateUniqueId();
          fileName = fileNameArray.join('.');

          addPhoto(
            Config.S3AlbumForEvent + '/' + eventId,
            targetElement,
            fileName,
            index,
            (error, data) => {
              if (error) {
                return;
              }
              if (data.Location) {
                const uplodedImageUrl = data.Location;

                let _newUploadedMedia = _this.props.events.newUploadedMedia;
                let _newMediaAwsUrlList = _this.state.newMediaAwsUrlList;
                for (let index = 0; index < _newUploadedMedia.length; index++) {
                  const element = _newUploadedMedia[index];
                  if (element.id === count) {
                    element.AWSURL = uplodedImageUrl; // Setting AWSURL of uploaded image
                    element.uploaded = true;
                    _newMediaAwsUrlList.push(uplodedImageUrl);
                    break;
                  }
                }
                _this.props.actionNewUploadedMedia(_newUploadedMedia);
                // _this.setState({
                //   newUploadedMedia: _newUploadedMedia,
                //   newMediaAwsUrlList: _newMediaAwsUrlList
                // });

                _this.updateEvent(
                  saveFileName,
                  fileExtension,
                  uplodedImageUrl,
                  fileSize
                );
              }
            },
            progressValue => {
              let _newUploadedMedia = _this.props.events.newUploadedMedia;
              for (let index = 0; index < _newUploadedMedia.length; index++) {
                const element = _newUploadedMedia[index];
                if (element.id === count) {
                  element.progress = progressValue; // Setting AWSURL of uploaded image
                  break;
                }
              }

              this.props.actionNewUploadedMedia(_newUploadedMedia);
              // _this.setState({
              //   newUploadedMedia: _newUploadedMedia
              // });
            }
          );
        } else {
          console.log('directory creation failed');
        }
      });
    } catch (e) {
      console.log(e.message);
    }

    // Read source of file that selected to upload as banner
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        let _newUploadedMedia = this.state.newUploadedMedia;
        for (let index = 0; index < _newUploadedMedia.length; index++) {
          const element = _newUploadedMedia[index];
          if (element.id === count) {
            element.source = reader.result; // Assigning source of banner image to show as preview
            break;
          }
        }
        this.setState({
          newUploadedMedia: _newUploadedMedia
        });
      },
      false
    );
    reader.readAsDataURL(targetElement.files[index]);
    // END Read source of file that selected to upload as banner
  }

  /**
   * To delete media file from AWS bucket. Event Ud will use as Album name in bucket.
   * @param {string} AWSFileURL
   * @param {string} eventId
   */
  // deleteMediaFileFromAWS(AWSFileURL, eventId) {
  //   try {
  //     const _bannerUrl = AWSFileURL;
  //     const AwsAlbumName = eventId;
  //     let _this = this;
  //     let _bannerUrlArray = _bannerUrl.split('/');
  //     let AwsFileName = _bannerUrlArray[_bannerUrlArray.length - 1];

  //     this.props.actionDeleteMediaEvent();

  //     // console.log('AwsFileName', AwsAlbumName + '//' + AwsFileName);

  //     // deleteEventImage(
  //     //   AwsAlbumName,
  //     //   AwsAlbumName + '//' + AwsFileName,
  //     //   function (error, result) {
  //     //     if (error) return console.log('delete image callback', error, result);
  //     //     alert("aws file deleted"+AWSFileURL);
  //     //   }
  //     // );
  //   } catch (err) {
  //     console.log('delete banner image error');
  //   }
  // }

  /**
   * To delete media file from AWS bucket. Event Ud will use as Album name in bucket.
   * @param {string} AWSFileURL
   * @param {string} eventId
   * @param {string} mediaId
   */
  deleteMediaFileFromAWS(AWSFileURL, eventId, mediaId) {
    // console.log('AWSFileURL=> ',AWSFileURL, 'eventId=> ',eventId, 'mediaId=> ',mediaId);
    this.props.actionDeleteMediaEvent(AWSFileURL, eventId, mediaId);

    // try {
    //   const _bannerUrl = AWSFileURL;
    //   const AwsAlbumName = eventId;
    //   let _this = this;
    //   let _bannerUrlArray = _bannerUrl.split('/');
    //   let AwsFileName = _bannerUrlArray[_bannerUrlArray.length - 1];

    //   this.props.actionDeleteMediaEvent();

    //   // console.log('AwsFileName', AwsAlbumName + '//' + AwsFileName);

    //   // deleteEventImage(
    //   //   AwsAlbumName,
    //   //   AwsAlbumName + '//' + AwsFileName,
    //   //   function (error, result) {
    //   //     if (error) return console.log('delete image callback', error, result);
    //   //     alert("aws file deleted"+AWSFileURL);
    //   //   }
    //   // );
    // } catch (err) {
    //   console.log('delete banner image error');
    // }
  }

  updateEvent(fileName, fileType, fileAwsUrl, fileSize) {
    console.log('eeeeeee', fileSize);
    let self = this;
    if (this.props.userInfo && this.props.userInfo.id) {
      let createrUserId = this.props.userInfo.id;
      let eventName = this.state.event.eventName;
      let startTimestamp = moment().utc(this.state.event.startDate);

      let endTimestamp = moment().utc(this.state.event.endDate);
      let venue = this.state.event.venue;
      let timeZone = this.state.event.timeZone;
      let duration = this.state.event.duration;
      let fees = this.state.event.eventFee;
      let description = this.state.event.description;
      let address = this.state.event.address
        ? this.state.event.address
        : {
            detailedLocation: '',
            city: '',
            state: '',
            country: '',
            latitude: '',
            longitude: ''
          };
      let bannerImageURL = this.state.event.bannerImageURL;
      let sponsorsList = this.state.event.sponsorsList
        ? this.state.event.sponsorsList
        : [];
      let speakersList = this.state.event.speakersList
        ? this.state.event.speakersList
        : [];
      let eventId = this.state.event.eventId;

      let listOfMedia = [
        {
          id: '',
          name: fileName,
          type: fileType,
          mediaURL: fileAwsUrl,
          size: fileSize
        }
      ];

      // const mediaImageURL = this.props.events.eventMediaList;

      // let mediaImageURLs = [
      //   // ...this.props.activeEvent.mediaResponseList,
      //   // ...this.props.events.eventMediaList,
      //   ...mediaImageURL,
      //   ...listOfMedia
      // ];

      let addNewEvent = {
        eventId,
        createrUserId,
        eventName,
        startTimestamp: startTimestamp
          .utc()
          .format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        endTimestamp: endTimestamp.utc().format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        venue,
        timeZone,
        duration,
        fees,
        description,
        address,
        sponsorsList,
        speakersList,
        bannerImageURL,
        mediaResponseList: []
      };

      let addMediaUrl = {
        eventId,
        listOfMedia
      };

      innovecsysApiService('addUpdateEventMedia', addMediaUrl).then(result => {
        console.log('addUpdateEventMedia result', result);
        if (result.data && result.data.status && result.data.status === 200) {
          let id = result.data.resourceId;
          id = id.replace('[', '').replace(']', '');
          listOfMedia[0].id = id;
          const mediaImageURL = self.props.events.eventMediaList;
          let mediaImageURLs = [
            // ...this.props.activeEvent.mediaResponseList,
            // ...this.props.events.eventMediaList,
            ...mediaImageURL,
            ...listOfMedia
          ];
          addNewEvent.mediaResponseList = mediaImageURLs;

          self.props.actionAppendMediaUrl(listOfMedia[0]);
          // self.props.editEvent(addNewEvent);
          // self.props.actionActiveEvent(Object.assign({}, addNewEvent));
          // self.props.history.push('/manager/speakerList');
        }
      });
    } else {
      console.log('user id not found');
    }
  }

  fileCountDialogClose() {
    this.setState({
      fileCountDialog: false,
      fileInputValue: ''
    });
  }

  fileValidationDialogClose() {
    this.setState({
      fileValidationDialog: false
    });
  }

  render() {
    const _this = this;
    const mediaImageURLs = this.state.mediaImageURLs;
    return (
      <div className="main-container">
        <ReactTooltip effect="solid" type="error" place="bottom" />
        <Prompt
          when={this.state.prompt}
          message="You may lost any unsaved data, click cancel to stay on the same screen and click on next button  to save the changes."
        />
        <div id="app" />
        <div className="inner-page">
          <StepNavBar
            navigateToUrlPage={this.navigateToUrlPage}
            tabName="eventMedia"
            isEditEvent={this.props.events.isEditEvent}
          />
          <div className="events-page">
            <div className="create-event">
              <div className="row">
                <div className="col-md-12">
                  <div className="media-sec">
                    <p className="labelText">Add Media</p>
                    <div className="">
                      <div className="uploaded-files-div gal-eff">
                        <div className="file-dragNdrop">
                          <FileDragAndDrop onDrop={this.handleDrop}>
                            <div className="uploadFile">
                              <input
                                type="file"
                                className="file-upload-input"
                                multiple="multiple"
                                onChange={event => {
                                  const evt = event;
                                  this.handleDrop(evt.target);
                                }}
                                value={this.state.fileInputValue}
                                ref={input => (this.fileUploadInput = input)}
                              />
                              <div>
                                <img
                                  src={imgFileUpload2}
                                  className="file-upload-img"
                                  alt=""
                                />
                              </div>
                              <label className="">Drag & Drop</label>
                              <p className="">
                                a file here or <span>browse</span>
                              </p>
                            </div>
                          </FileDragAndDrop>
                        </div>
                      </div>

                      {this.props.events.eventMediaList.map(function(fileInfo) {
                        return (
                          <EventMediaItem
                            fileUrl={fileInfo.mediaURL}
                            eventId={_this.state.event.eventId}
                            fileDetails={fileInfo}
                            key={fileInfo.mediaURL}
                            deleteMediaFileFromAWS={
                              _this.deleteMediaFileFromAWS
                            }
                          />
                        );
                      })}
                      {this.props.events.newUploadedMedia.map(function(
                        fileInfo
                      ) {
                        if (fileInfo.uploaded === false) {
                          return (
                            <EventMediaNewUploadedItem
                              fileInfo={fileInfo}
                              eventId={_this.state.event.eventId}
                              key={fileInfo.id}
                            />
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="events-page-footer">
              <a
                className="btn btnSuccess mb-20 hide"
                onClick={this.onClickAddEvent}
              >
                ADD
              </a>
              <a
                className="btn btnSuccess mb-20 hide "
                onClick={() => this.navigateToUrlPage('/manager/eventList')}
              >
                Cancel
              </a>

              <div className="btnPageNav">
                <a
                  className="btnTag mb-20"
                  onClick={() => this.navigateToUrlPage('/manager/speakerList')}
                >
                  <i className="fa fa-arrow-left" aria-hidden="true" />
                </a>
                <a
                  className="btnTag mb-20"
                  onClick={() => {
                    this.props.actionManagerAccess({ accessEventAgenda: true });
                    let self = this;
                    self.setState(
                      {
                        prompt: false //Disable prompt and navigate to user
                      },
                      () => self.navigateToUrlPage('/manager/agendaTimeLine')
                    );

                    // this.navigateToUrlPage('/manager/agendaTimeLine');
                  }}
                >
                  <i className="fa fa-arrow-right" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog of file count */}

        <Dialog
          open={this.state.fileCountDialog}
          onClose={this.fileCountDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={'md'}
          className="editEventModal"
          modal="true"
        >
          <DialogContent className="editEventModal-body">
            <span className="ico-close" onClick={this.fileCountDialogClose}>
              <svg>
                <use xlinkHref={`${Sprite}#close`} />
              </svg>
            </span>
            <div className="mdl-BgDesign bg-alert">&nbsp;</div>
            <div className="mdlContent">
              <div className="alertIconDiv">
                <span className="ico-alert">
                  <svg>
                    <use xlinkHref={`${Sprite}#alertIco`} />
                  </svg>
                </span>
              </div>
              <h4>
                You can upload maximum ten files in single selection, Please
                select files again.
              </h4>
            </div>
            <div className="mdl-footer mt-20">
              <button
                type="button"
                className="btn btnSubmit ripple"
                onClick={() => this.fileCountDialogClose()}
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
        {/* END Dialog of file count */}

        {/* Dialog for invalide file list */}

        <Dialog
          title="Invalid files"
          open={this.state.fileValidationDialog}
          onClose={this.fileValidationDialogClose}
          autoScrollBodyContent={true}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={'md'}
          className="editEventModal"
          modal="false"
          // autoscrollbodycontent="true"
        >
          <DialogContent className="editEventModal-body">
            <span
              className="ico-close"
              onClick={this.fileValidationDialogClose}
            >
              <svg>
                <use xlinkHref={`${Sprite}#close`} />
              </svg>
            </span>
            <div className="mdl-BgDesign bg-alert">&nbsp;</div>
            <div className="mdlContent">
              <div className="alertIconDiv">
                <span className="ico-alert">
                  <svg>
                    <use xlinkHref={`${Sprite}#alertIco`} />
                  </svg>
                </span>
              </div>
              <h4 className={this.state.invalidFilesName.length ? '' : 'hide'}>
                Files with following extension do not allow
              </h4>

              <ul>
                {this.state.invalidFilesName.map((item, index) => {
                  return <li key={index}> {item} </li>;
                })}
              </ul>
              <h4 className={this.state.bigFilesName.length ? '' : 'hide'}>
                Following files exceed maximum size limit of file
              </h4>
              <table className={this.state.bigFilesName.length ? '' : 'hide'}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Max size</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.bigFilesName.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.size}</td>
                        <td>{item.maxSize}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* <ul>
                {this.state.bigFilesName.map((item, index) => {
                  return (<li key={index}> {item.name}  {item.size} </li>)
                })}
              </ul> */}
            </div>
            <div className="mdl-footer mt-20">
              <button
                type="button"
                className="btn btnSubmit ripple"
                onClick={() => this.fileValidationDialogClose()}
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Dialog for invalide file list */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.profileData,
    events: state.events
  };
};

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      editEvent,
      actionManagerAccess,
      actionActiveEvent,
      actionDeleteMediaEvent,
      actionNewUploadedMedia,
      actionAppendMediaUrl
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDocuments);
