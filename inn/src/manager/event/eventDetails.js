import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactAudioPlayer from 'react-audio-player';
import ReactPlayer from 'react-player';
import moment from 'moment';
import OwlCarousel from 'react-owl-carousel2';
import classNames from 'classnames';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import URLSearchParams from 'url-search-params';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

import { StickyContainer, Sticky } from 'react-sticky';

import {
  actionManagerSelectedEventDetails,
  actionGetCommentsByEventId,
  actionSetCommentByEventId,
  actionSetLikeByEventId,
  actionSetMemberActiveSummary,
  actionGetDiscount,
  showLoader,
  hideLoader
} from '../../common/action/index';

import Config from '../../common/core/config';

import logo from '../../img/innovecsyslogoblack.png';
import lights from '../../img/lights.jpg';
import imgEventDefault from '../../img/def_event.jpg';
import imgMap from '../../img/map.jpg';
import sponsor1 from '../../img/sponsor1.png';
import sponsorDefault from '../../img/sponsor_default.jpg';

import test1 from '../../img/test1.jpg';
import test2 from '../../img/test2.jpg';
import imgUserDefault from '../../img/user_default.jpg';

import team1 from '../../img/team1.jpg';
import team2 from '../../img/team2.jpg';
import team3 from '../../img/team3.jpg';
import arrow from '../../img/back_arrow.png';

import imgPdfFile from '../../img/pdfFile.jpg';
import imgTextFile from '../../img/textFileLogo.png';
import imgDocFile from '../../img/docFileLogo.png';
import imgXlsFile from '../../img/xlsFileLogo.png';
import imgAudioFile from '../../img/audioLogo.png';
import imgVideoFile from '../../img/videoLogo.png';
import imgFileDefault from '../../img/defaultFileLogo.png';
import {
  showWarningToast,
  getSpeakerThumbImage,
  getSponsorBigImage,
  displayThumbImage
} from '../../common/core/common-functions';
import Img from '../../common/core/img';
import Sprite from '../../img/sprite.svg';
//import imgevDbanner from '../../img/evDbanner.png';

// import nature from '../../img/nature.jpg';
// import event_1 from '../../img/event_1.jpg';

const style = {
  width: '80%',
  height: '30%'
};

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: '',
      eventTimeZone: '',
      eventLati: '',
      eventLong: '',
      eventvenue: '',
      companyName: '',
      commentList: [],
      userComment: '',
      eventLikes: '',
      eventDetailsObject: {
        sponsorsList: [],
        speakersList: [],
        mediaResponseList: [],
        timeBasedAgendaResponse: [],
        totalMemberRegisterWithAmountCount: {}
      },
      dateWiseAgenda: {},
      selectedSummaryDate: '',
      selectedSummaryDateAgendaList: [],
      selectedDate: '',
      discountData: {},
      generalDiscountList: [],
      offerList: [],
      couponList: [],
      combineList: [],
      isDiscountModalVisible: false,
      bucketName: Config.S3BucketName,
      resizedBucketName: Config.S3ResizeBucketName,
      openAudioDialog: false,
      openVideoDialog: false,
      openImgDialog: false,
      videoSrc: false,
      audioSrc: false,
      imgFlag: false,
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
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.viewImg = this.viewImg.bind(this);
    this.closeAudioDialog = this.closeAudioDialog.bind(this);
    this.closeVideoDialog = this.closeVideoDialog.bind(this);
    this.closeImgDialog = this.closeImgDialog.bind(this);
  }

  componentDidMount() {
    /*if (this.props.events.memberEventDetailsObject._id == undefined) {
      this.navigateByUrlName('/member');
      return;
    }*/

    window.scrollTo(0, 0);

    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const eventId = params.get('eventId') || '';

    if (eventId == '' || eventId == 'undefined') {
      this.props.history.goBack();
      // this.navigateByUrlName('/member/searchEvent');
      return;
    }

    // let eventId = this.props.events.memberEventDetailsObject._id;
    this.setState(
      {
        eventId: eventId
      },
      () => this.initializePage()
    );
  }

  componentWillReceiveProps(res) {
    if (res.comment) {
      this.setState({
        commentList: res.comment.allComments || []
      });
    }

    if (res.events && res.events.managerSelectedEventDetails) {
      let numberOfLikes = res.events.managerSelectedEventDetails.likesCount;
      this.setState({ eventLikes: numberOfLikes });
    }

    if (res.discount) {
      let discountData = res.discount || {};

      let generalDiscountList = [];
      let offerList = [];
      let couponList = [];

      if (discountData.discounts) {
        generalDiscountList = discountData.discounts.innovecsysDiscounts || [];
      }

      if (discountData.offers) {
        offerList = discountData.offers.innovecsysOffers || [];
      }

      if (discountData.coupons) {
        couponList = discountData.coupons.innovecsysCoupons || [];
      }

      // let generalDiscountList =
      //   discountData.innovecsysDiscountsResponseList || [];
      // let offerList = discountData.innovecsysOffersResponseList || [];
      // let couponList = discountData.innovecsysCouponResponseList || [];

      this.combineDiscount(
        discountData,
        generalDiscountList,
        offerList,
        couponList
      );
    }

    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const eventId = params.get('eventId') || '';

    if (
      eventId !== '' &&
      eventId !== 'undefined' &&
      eventId !== this.state.eventId
    ) {
      this.setState(
        {
          eventId: eventId
        },
        () => this.initializePage()
      );
    }
  }

  initializePage = () => {
    const eventId = this.state.eventId;

    this.props.actionGetCommentsByEventId(eventId).then(res => {
      if (res.payload && res.payload.data && res.payload.data.resourceData) {
        let commentList = res.payload.data.resourceData || [];
        this.setState({ commentList });
      }
    });

    try {
      this.props.showLoader();
      this.props
        .actionManagerSelectedEventDetails(eventId)
        .then(res => {
          this.props.hideLoader();
          if (
            res.payload &&
            res.payload.data &&
            res.payload.data.resourceData
          ) {
            let lat = '';
            let lon = '';
            let ven = '';
            let comp = '';

            if (res.payload.data.resourceData.address) {
              lat = parseFloat(res.payload.data.resourceData.address.latitude);
              lon = parseFloat(res.payload.data.resourceData.address.longitude);
              ven = res.payload.data.resourceData.venue;
            }

            if (res.payload.data.resourceData.userResponse) {
              comp = res.payload.data.resourceData.userResponse.company;
            }

            let eventDetailsObject = res.payload.data.resourceData;
            let eventLikes = res.payload.data.resourceData.likesCount || '';
            let eventTimeZone = res.payload.data.resourceData.timeZone || '';

            this.setState(
              {
                eventDetailsObject: eventDetailsObject || {},
                eventLikes: eventLikes,
                eventLati: lat,
                eventLong: lon,
                eventvenue: ven,
                eventTimeZone: eventTimeZone,
                companyName: comp,
                eventId: eventId || ''
              },
              () => {
                this.createAgendaListByDate();
              }
            );
          }
        })
        .catch(error => {
          this.props.hideLoader();
        });
    } catch (err) {
      console.log(err);
    }

    this.props.actionGetDiscount(eventId).then(res => {
      if (res.payload && res.payload.data && res.payload.data.resourceData) {
        let discountData = res.payload.data.resourceData || {};

        let generalDiscountList = [];
        let offerList = [];
        let couponList = [];

        if (discountData.discounts) {
          generalDiscountList =
            discountData.discounts.innovecsysDiscounts || [];
        }

        if (discountData.offers) {
          offerList = discountData.offers.innovecsysOffers || [];
        }

        if (discountData.coupons) {
          couponList = discountData.coupons.innovecsysCoupons || [];
        }

        // let generalDiscountList =
        //   discountData.innovecsysDiscountsResponseList || [];
        // let offerList = discountData.innovecsysOffersResponseList || [];
        // let couponList = discountData.innovecsysCouponResponseList || [];
        this.combineDiscount(
          discountData,
          generalDiscountList,
          offerList,
          couponList
        );
      }
    });
  };

  playAudio(media) {
    this.setState({
      openAudioDialog: true,
      audioPlay: true,
      audioSrc: media.mediaURL
    });
  }
  playVideo(media) {
    this.setState({
      openVideoDialog: true,
      videoPlay: true,
      videoSrc: media.mediaURL
    });
  }
  viewImg(media) {
    this.setState({
      openImgDialog: true,
      imgSrc: media.mediaURL
    });
    let img = new Image();
    img.src = media.mediaURL;
    let _this = this;
    img.onload = function() {
      let imgWidth = this.width;
      let imgHeight = this.height;
      let maxWidth = window.innerWidth / 3;
      let ratioH = imgHeight / imgWidth;
      let finalH = maxWidth * ratioH;
      _this.setState({ width: maxWidth, height: finalH });
    };
  }
  closeAudioDialog() {
    this.setState({ openAudioDialog: false });
  }
  closeVideoDialog = () => {
    this.setState({ openVideoDialog: false, videoPlay: false });
  };
  closeImgDialog = () => {
    this.setState({ openImgDialog: false });
  };

  combineDiscount = (
    discountData,
    generalDiscountList,
    offerList,
    couponList
  ) => {
    let combineList = [];
    generalDiscountList.map(discount => {
      discount['discountType'] = 'generalDiscount';
      combineList.push(discount);
    });

    offerList.map(offer => {
      offer['discountType'] = 'offer';
      combineList.push(offer);
    });

    couponList.map(coupon => {
      coupon['discountType'] = 'coupon';
      combineList.push(coupon);
    });

    console.log('combineList', combineList);
    this.setState({
      discountData,
      generalDiscountList,
      offerList,
      couponList,
      combineList
    });
  };

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  handleCommentEnterKeyUp = e => {
    if (e.key == 'Enter') {
      this.createComment(this.state.userComment);
    }
  };

  createAgendaListByDate = () => {
    try {
      let responseDataList = JSON.parse(
        JSON.stringify(this.state.eventDetailsObject.timeBasedAgendaResponse)
      );
      responseDataList.sort(this.dynamicSortWithNumber('startTime')); // sort agenda
      let dateWiseAgenda = {};
      responseDataList.forEach((agendaObj, index) => {
        let keyName = moment(agendaObj.startTime).format('YYYY-MM-DD');
        if (!dateWiseAgenda.hasOwnProperty(keyName)) {
          dateWiseAgenda[keyName] = [];
          dateWiseAgenda[keyName].push(agendaObj);
        } else {
          dateWiseAgenda[keyName].push(agendaObj);
        }
      });
      console.log('dateWiseAgenda', dateWiseAgenda);
      this.setState(
        {
          dateWiseAgenda: dateWiseAgenda
        },
        () => {
          console.log('dateWiseAgenda', dateWiseAgenda);
          if (Object.keys(this.state.dateWiseAgenda)[0] != undefined)
            this.onSelectSummarydate(Object.keys(this.state.dateWiseAgenda)[0]);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  onSelectSummarydate = date => {
    this.setState({
      selectedSummaryDateAgendaList: this.state.dateWiseAgenda[date] || [],
      selectedDate: date
    });
  };

  setFileOrLogoUrl = (fileExtension, fileUrl) => {
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
        return this.generateFileUrlOfThumbnails(fileUrl);

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
  };

  generateFileUrlOfThumbnails = fileUrl => {
    try {
      let _fileUrl = fileUrl;
      _fileUrl = _fileUrl.replace(
        this.state.bucketName,
        this.state.resizedBucketName
      );
      var _fileUrlArray = _fileUrl.split('/');
      _fileUrlArray[_fileUrlArray.length - 2] =
        _fileUrlArray[_fileUrlArray.length - 2] + '/373x233';
      let finalLink = _fileUrlArray.join('/');
      return finalLink;
    } catch (error) {
      return fileUrl;
    }
  };

  getFileData = fileUrl => {
    try {
      let fileNameArray = fileUrl.split('/');
      const fileName = fileNameArray[fileNameArray.length - 1];
      const fileExtension = fileName.split('.')[1];
      let file = this.setFileOrLogoUrl(fileExtension, fileUrl);
      return file;
    } catch (error) {
      console.log('failed======================', error);
    }
  };

  dynamicSortWithNumber = property => {
    var sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }

    return function(a, b) {
      if (a != undefined && b != undefined) {
        var result =
          a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
      }
    };
  };

  render() {
    return (
      <div>
        {/*<!--main content starts-->*/}

        <div className="main-page-wrapper">
          <section className="light-bg ">
            <div className="topBanner bannerBgForEvDeatails" />
            <div className="container">
              <StickyContainer>
                <div className="row">
                  <div className="col-md-8">
                    <div className="imgAboutBox">
                      <div className="j-i-wrapper joinEventtab">
                        <p className="noteText">
                          <i>Note:</i> Become a <span>Paid Member</span> for
                          more exciting offers.
                        </p>

                        {this.renderHorizontalDiscountList()}

                        <p>
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.onShowDiscountModal()}
                            className="btn-arrow moreDiscountList"
                          >
                            View more
                            <span class="ico-r-arrow">
                              <svg>
                                <use xlinkHref={`${Sprite}#r-arrowIco`} />
                              </svg>
                            </span>
                          </a>
                        </p>

                        {/* <div className="eb-Discount mr-10">
                            <p className="eb-text">Early Bird Discount</p>
                            <p className="eb-RegisterText">
                              Register by Dec 16, 2017 to receive 10% off your
                              registration!
                            </p>
                          </div>
                          <div className="eb-Discount">
                            <p className="eb-text">Early Bird Discount</p>
                            <p className="eb-RegisterText">
                              Register 3 for the price of 2 with the coupon code
                              "rcdvb"!
                            </p>
                          </div> */}

                        <div className="joinEvntMoreDiv">
                          {/* <span
                            className="btn btn-rounded btn-theme"
                            onClick={() =>
                              this.navigateByUrlName(
                                'member/joinEvent?eventId=' + this.state.eventId
                              )
                            }
                          >
                            <span className="ico-user">
                              <svg>
                                <use xlinkHref="/img/sprite.svg#userIco" />
                              </svg>
                            </span>
                            JOIN EVENT
                          </span> */}
                          <ul className="social-contact">
                            <li>
                              <a href="javascript:void(0);">
                                <i className="fa fa-twitter" />
                              </a>
                            </li>
                            <li>
                              <a href="javascript:void(0);">
                                <i className="fa fa-linkedin" />
                              </a>
                            </li>
                            <li>
                              <a href="javascript:void(0);">
                                <i className="fa fa-facebook" />
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="topIntro">
                        <div className="in-head">
                          <span
                            class="ico-arrowIncircle goBackIcon"
                            onClick={this.props.history.goBack}
                          >
                            <svg>
                              <use xlinkHref={`${Sprite}#arrowIncircleIco`} />
                            </svg>
                          </span>
                          {/* <img src={arrow} onClick={this.props.history.goBack} /> */}

                          <h3 className="text-white m0">
                            {/* PARENTAL CONSUALTANT CONFERENCE */}
                            {this.state.eventDetailsObject.eventName
                              ? this.state.eventDetailsObject.eventName.toUpperCase()
                              : ''}
                          </h3>

                          <div className="rating">
                            <i className="fa fa-star on" />
                            <i className="fa fa-star on" />
                            <i className="fa fa-star on" />
                            <i className="fa fa-star on" />
                            <i className="fa fa-star on" />
                          </div>
                          <p className="dPosition">{this.state.companyName}</p>
                        </div>

                        <div className="back-shadow">
                          <div className="contentBox">
                            <div className="imgBox">
                              <Img
                                src={
                                  this.state.eventDetailsObject.bannerImageURL
                                    ? displayThumbImage(
                                        this.state.eventDetailsObject
                                          .bannerImageURL,
                                        Config.S3AlbumForBanner,
                                        Config.S3Thumbnail728
                                      )
                                    : imgEventDefault
                                }
                                default={imgEventDefault}
                              />

                              <div className="evLabel">Conference</div>
                            </div>
                            <div className="evDescription">
                              <p>{this.state.eventDetailsObject.description}</p>
                              {/* <p>
                                Lorem Ipsum is simply dummy text of the printing and
                                typesetting industry. Lorem Ipsum has been the
                                industry's standard dummy text ever since the
                                1500s,Lorem Ipsum is simply dummy text of the
                                printing and typesetting industry. Lorem Ipsum has
                                been the industry's standard dummy text ever since
                                the 1500s,
                              </p> */}
                            </div>
                            <p className="evPrice">
                              Event Price:{' '}
                              <b>$ {this.state.eventDetailsObject.fees}</b>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="white-box">
                      <div className="sub-head">
                        <div className="ev-m-head">
                          <div className="ev-m-filter">
                            <ul className="nav nav-tabs">
                              <li className="active">
                                <a data-toggle="tab" href="#home">
                                  SUMMARY
                                </a>
                              </li>
                              <li>
                                <a data-toggle="tab" href="#menu1">
                                  SPEAKERS
                                </a>
                              </li>
                              <li>
                                <a data-toggle="tab" href="#menu2">
                                  MEDIA
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="evsWrapper">
                        <div className="tab-content">
                          <div id="home" className="tab-pane fade in active">
                            <div className="summeryWrapper">
                              <div className="agendaTimeline form-card summeryTimeline">
                                {this.renderDateHeader()}

                                <div className="timelineContent">
                                  <ul className="timelineDataList">
                                    {this.renderSummary()}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div id="menu1" className="tab-pane fade">
                            <div className="speakerLWrapper">
                              <div className="row">
                                {this.state.eventDetailsObject.speakersList
                                  ? this.renderSpeakers()
                                  : null}
                              </div>
                            </div>
                          </div>

                          <div id="menu2" className="tab-pane fade">
                            <div className="mediaWrapper">
                              <div className="row">
                                {this.state.eventDetailsObject.mediaResponseList
                                  ? this.renderMedia()
                                  : null}

                                {/* <div className="col-sm-6 col-md-6">
                                  <div className="media-box">
                                    <div className="mImgBox">
                                      <img
                                        src="img/mother.jpg"
                                        className="img-responsive"
                                      />
                                      <a href="javascript:void(0);">
                                        <span className="ico-mike">
                                          <svg>
                                            <use xlinkHref="/img/sprite.svg#mikeIco" />
                                          </svg>
                                        </span>
                                      </a>
                                    </div>
                                    <div className="mediaText">
                                      <p>Lorem Ipsum.mp3</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-6 col-md-6">
                                  <div className="media-box">
                                    <div className="mImgBox">
                                      <img
                                        src="img/mother.jpg"
                                        className="img-responsive"
                                      />
                                      <a href="javascript:void(0);">
                                        <span className="ico-play-video">
                                          <svg>
                                            <use xlinkHref="/img/sprite.svg#playIco" />
                                          </svg>
                                        </span>
                                      </a>
                                    </div>
                                    <div className="mediaText">
                                      <p>Lorem Ipsum.mp4</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-6 col-md-6">
                                  <div className="media-box">
                                    <div className="mImgBox">
                                      <img
                                        src="img/mother.jpg"
                                        className="img-responsive"
                                      />
                                      <a href="javascript:void(0);">
                                        <span className="ico-play-video">
                                          <svg>
                                            <use xlinkHref="/img/sprite.svg#playIco" />
                                          </svg>
                                        </span>
                                      </a>
                                    </div>
                                    <div className="mediaText">
                                      <p>Lorem Ipsum.mp4</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-6 col-md-6">
                                  <div className="media-box">
                                    <div className="mImgBox">
                                      <img
                                        src="img/mother.jpg"
                                        className="img-responsive"
                                      />
                                      <a href="javascript:void(0);">
                                        <span className="ico-play-video">
                                          <svg>
                                            <use xlinkHref="/img/sprite.svg#playIco" />
                                          </svg>
                                        </span>
                                      </a>
                                    </div>
                                    <div className="mediaText">
                                      <p>Lorem Ipsum.mp4</p>
                                    </div>
                                  </div>
                                </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {this.renderLikesAndComments()}
                  </div>

                  <div className="col-md-4">
                    <div className="j-i-wrapper joinEventPc">
                      <p className="noteText mb-20">
                        <i>Note:</i> Become a <span>Paid Member</span> for more
                        exciting offers.
                      </p>
                      {this.renderDiscountList()}

                      <div className="joinEvntMoreDiv">
                        {this.state.combineList.length >= 2 ? (
                          <p>
                            <a
                              href="javascript:void(0)"
                              onClick={() => this.onShowDiscountModal()}
                              className="btn-arrow moreDiscountList"
                            >
                              View more
                              <span class="ico-r-arrow">
                                <svg>
                                  <use xlinkHref={`${Sprite}#r-arrowIco`} />
                                </svg>
                              </span>
                            </a>
                          </p>
                        ) : null}

                        <ul className="social-contact">
                          <li>
                            <a href="javascript:void(0);">
                              <i className="fa fa-twitter" />
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0);">
                              <i className="fa fa-linkedin" />
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0);">
                              <i className="fa fa-facebook" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="ticketAmountDiv">
                      <div className="manageTickets ticketsImg ">
                        <p>Tickets Sold</p>
                        <h3>
                          {
                            this.state.eventDetailsObject
                              .totalMemberRegisterWithAmountCount
                              .totalTicketsSold
                          }
                        </h3>
                      </div>
                      <div className="manageTickets dollarImg">
                        <span className="recievedAmount" />
                        <p>Amount Recieved</p>
                        <h3>
                          ${' '}
                          {
                            this.state.eventDetailsObject
                              .totalMemberRegisterWithAmountCount
                              .totalEarningOfEvent
                          }
                        </h3>
                      </div>
                    </div>

                    <div className="eventVenueWrapper">
                      <div className="common-sub-heading">
                        <h3>EVENT VENUE</h3>
                      </div>
                      <div className="venue-details">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td className="title">Start Date:</td>
                              <td className="">
                                {/* December 22,2017 03:55 PM */}
                                {moment(
                                  this.state.eventDetailsObject.startTimestamp
                                ).format('MMMM DD,YYYY')}
                              </td>
                            </tr>
                            <tr>
                              <td className="title">End Date:</td>
                              <td className="">
                                {/* December 22,2017 03:55 PM */}
                                {moment(
                                  this.state.eventDetailsObject.endTimestamp
                                ).format('MMMM DD,YYYY')}
                              </td>
                            </tr>
                            <tr>
                              <td className="title">Venue</td>
                              <td className="">
                                {/* 20 yards */}
                                {this.state.eventDetailsObject.venue}
                              </td>
                            </tr>
                            {/* <tr>
                              <td className="title">Checkin Radius</td>
                              <td className="">December 22,2017 03:55 PM</td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>
                      <div className="mapcontainer">
                        <p>Map:</p>
                        <div id="mapBox">
                          {this.state.eventLati ? this.renderMap() : ''}
                        </div>
                      </div>
                    </div>

                    <Sticky topOffset={550} className="mt-100">
                      {({
                        style,
                        isSticky,
                        wasSticky,
                        distanceFromTop,
                        distanceFromBottom,
                        calculatedHeight
                      }) => (
                        <div
                          style={style}
                          className={classNames('eventSponsorsWrapper', {
                            'mt-100': isSticky == true
                          })}
                        >
                          <div className="common-sub-heading">
                            <h3>SPONSORS </h3>
                          </div>
                          <div className="sponsorsList">
                            <div className="row">
                              {this.state.eventDetailsObject.sponsorsList
                                ? this.renderSponsors()
                                : null}
                            </div>
                          </div>
                        </div>
                      )}
                    </Sticky>

                    {/* <div className="eventSponsorsWrapper">
                        <div className="common-sub-heading">
                          <h3>SPONSORS</h3>
                        </div>
                        <div className="sponsorsList">
                          <div className="row">
                            {this.state.eventDetailsObject.sponsorsList
                              ? this.renderSponsors()
                              : null}
                          </div>
                        </div>
                      </div> */}
                  </div>
                </div>
              </StickyContainer>
            </div>
          </section>
        </div>

        {this.renderDiscountModal()}
      </div>
    );
  }

  onClickofPrev = () => {
    try {
      if (this.refs.evDetailsCarousel) this.refs.evDetailsCarousel.prev();
    } catch (err) {
      console.log(err);
    }
  };

  onClickOfNext = () => {
    try {
      if (this.refs.evDetailsCarousel) this.refs.evDetailsCarousel.next();
    } catch (err) {
      console.log(err);
    }
  };

  renderDateHeader = () => {
    const options = {
      nav: false,
      rewind: false,
      autoplay: false,
      loop: false,
      dots: false,
      smartSpeed: 300,
      responsiveClass: true,
      center: false,
      margin: 5,
      responsive: {
        200: {
          items: 1
        },
        300: {
          items: 2
        },
        600: {
          items: 3
        },
        800: {
          items: 4
        },
        1300: {
          items: 5
        }
      }
    };
    return (
      <header className="agendaHeader">
        <ul className="dateTabs flex-row">
          {Object.keys(this.state.dateWiseAgenda).length > 0 ? (
            <OwlCarousel ref="evDetailsCarousel" options={options}>
              {Object.keys(this.state.dateWiseAgenda).map((key, index) => {
                return (
                  <li
                    className={this.state.selectedDate == key ? 'active' : ''}
                    onClick={() => this.onSelectSummarydate(key)}
                    key={index}
                  >
                    <a>
                      <span className="dayNo">DAY {index + 1}</span>
                      <span className="dateNo">
                        {moment(key).format('ddd, MMM DD YYYY')}
                      </span>
                    </a>
                  </li>
                );
              })}
            </OwlCarousel>
          ) : (
            ''
          )}
        </ul>
        <a
          href="javascript:void(0)"
          onClick={() => {
            this.onClickofPrev();
          }}
          class="customPrevBtn customPrevNextbtn"
        >
          <i class="arrow left" />
        </a>
        <a
          href="javascript:void(0)"
          onClick={() => {
            this.onClickOfNext();
          }}
          class="customNextBtn customPrevNextbtn"
        >
          <i class="arrow right" />
        </a>
      </header>
    );
  };

  showSummaryDetails = agenda => {
    this.props.actionSetMemberActiveSummary({
      summary: agenda,
      eventTimeZone: this.state.eventTimeZone
    });
    this.navigateByUrlName('/manager/summaryDetails');
  };

  setSocialLink(link) {
    window.open(link, '_blank');
  }

  renderSummary = () => {
    return this.state.selectedSummaryDateAgendaList.map(
      (summary, summaryIndex) => {
        return (
          <li className="savedAgendaSummery" key={summaryIndex}>
            <span className="timeForAddedSummary">
              {moment
                .tz(summary.startTime, this.state.eventTimeZone)
                .format('LT')}
            </span>

            {summary.listOfAgendas.map((agenda, agendaIndex) => {
              return (
                <div
                  key={agendaIndex}
                  className="keynoteText dark-red-Div"
                  className={classNames('keynoteText', {
                    'dark-red-Div': agenda.trackNumber == 'track1',
                    'purpel-Div': agenda.trackNumber == 'track2',
                    'green-Div': agenda.trackNumber == 'track3',
                    'red-Div': agenda.trackNumber == 'track4',
                    'chocklet-Div': agenda.trackNumber == 'track5'
                  })}
                  onClick={() => this.showSummaryDetails(agenda)}
                >
                  <span className="licircleIcon" />
                  <p>
                    {/* Opening Keynote Session - Historical
                        Prespective & Current State of the
                        Industry */}
                    {agenda.agendaTitle}
                  </p>
                  <span className="selectedTrack">
                    {/* Track 1 */}
                    {agenda.trackNumber}
                  </span>
                </div>
              );
            })}
          </li>
        );
      }
    );
  };

  renderSpeakers = () => {
    return this.state.eventDetailsObject.speakersList.map((speaker, index) => {
      const speakerImage = speaker.imageURL
        ? displayThumbImage(
            speaker.imageURL,
            Config.S3AlbumForSpeaker,
            Config.S3Thumbnail373
          )
        : imgUserDefault;
      return (
        // <div className="col-sm-4 col-md-4 col-lg-4 pdLR-5" key={index}>
        //   <div className="spBox u-box gal-eff">
        //     <div className="spImg u-img">
        //       <Img src={speakerImage} default={imgUserDefault} />
        //       {/*<img src={speaker.imageURL || imgUserDefault} alt="" />*/}

        //       {speaker.socialMediaURLResponse ? (
        //         <div className="overlay">
        //           <ul className="social-contact text-center">
        //             <li>
        //               {speaker.socialMediaURLResponse.facebookURL ? (
        //                 <a
        //                   href="javascript:void(0);"
        //                   onClick={this.setSocialLink.bind(
        //                     this,
        //                     speaker.socialMediaURLResponse.facebookURL
        //                   )}
        //                 >
        //                   <i className="fa fa-facebook" />
        //                 </a>
        //               ) : (
        //                 <a href="javascript:void(0);">
        //                   <i className="fa fa-facebook" />
        //                 </a>
        //               )}
        //             </li>
        //             <li>
        //               {speaker.socialMediaURLResponse.twitterURL ? (
        //                 <a
        //                   href="javascript:void(0);"
        //                   onClick={this.setSocialLink.bind(
        //                     this,
        //                     speaker.socialMediaURLResponse.twitterURL
        //                   )}
        //                 >
        //                   <i className="fa fa-twitter" />
        //                 </a>
        //               ) : (
        //                 <a href="javascript:void(0);">
        //                   <i className="fa fa-twitter" />
        //                 </a>
        //               )}
        //             </li>
        //             <li>
        //               {speaker.socialMediaURLResponse.linkedinURL ? (
        //                 <a
        //                   href="javascript:void(0);"
        //                   onClick={this.setSocialLink.bind(
        //                     this,
        //                     speaker.socialMediaURLResponse.linkedinURL
        //                   )}
        //                 >
        //                   <i className="fa fa-linkedin" />
        //                 </a>
        //               ) : (
        //                 <a href="javascript:void(0);">
        //                   <i className="fa fa-linkedin" />
        //                 </a>
        //               )}
        //             </li>
        //           </ul>
        //         </div>
        //       ) : (
        //         ''
        //       )}
        //     </div>
        //     <div className="spInfo u-details light-bg">
        //       <div className="spDescription">
        //         <p className="name all-caps m0">
        //           <b>{speaker.name}</b>
        //         </p>
        //         <span className="degi text-dark">{speaker.position}</span>
        //         <p className="compnay text-dark">{speaker.company}</p>
        //         <div className="rating">
        //           <i className="fa fa-star on" />
        //           <i className="fa fa-star on" />
        //           <i className="fa fa-star on" />
        //           <i className="fa fa-star on" />
        //           <i className="fa fa-star on" />
        //         </div>
        //       </div>
        //       <a href="javascript:void(0);" className="btn-arrow">
        //         READ MORE
        //         <span className="ico-r-arrow">
        //           <svg>
        //             <use xlinkHref={`${Sprite}#r-arrowIco`} />
        //           </svg>
        //         </span>
        //       </a>
        //     </div>
        //   </div>
        // </div>

        <div className="col-sm-4 col-md-4 col-lg-4 pdLR-5" key={index}>
          <div className="spBox u-box gal-eff">
            <div className="spImg u-img">
              <Img src={speakerImage} default={imgUserDefault} />
              {/*<img src={speaker.imageURL || imgUserDefault} alt="" />*/}

              {speaker.socialMediaURLResponse ? (
                <div className="overlay">
                  <ul className="social-contact text-center">
                    <li>
                      {speaker.socialMediaURLResponse.facebookURL ? (
                        <a
                          href="javascript:void(0);"
                          onClick={this.setSocialLink.bind(
                            this,
                            speaker.socialMediaURLResponse.facebookURL
                          )}
                        >
                          <i className="fa fa-facebook" />
                        </a>
                      ) : (
                        <a href="javascript:void(0);">
                          <i className="fa fa-facebook" />
                        </a>
                      )}
                    </li>
                    <li>
                      {speaker.socialMediaURLResponse.twitterURL ? (
                        <a
                          href="javascript:void(0);"
                          onClick={this.setSocialLink.bind(
                            this,
                            speaker.socialMediaURLResponse.twitterURL
                          )}
                        >
                          <i className="fa fa-twitter" />
                        </a>
                      ) : (
                        <a href="javascript:void(0);">
                          <i className="fa fa-twitter" />
                        </a>
                      )}
                    </li>
                    <li>
                      {speaker.socialMediaURLResponse.linkedinURL ? (
                        <a
                          href="javascript:void(0);"
                          onClick={this.setSocialLink.bind(
                            this,
                            speaker.socialMediaURLResponse.linkedinURL
                          )}
                        >
                          <i className="fa fa-linkedin" />
                        </a>
                      ) : (
                        <a href="javascript:void(0);">
                          <i className="fa fa-linkedin" />
                        </a>
                      )}
                    </li>
                  </ul>
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="spInfo u-details">
              <div className="spDescription">
                <p className="name all-caps">
                  <b>{speaker.name}</b>
                </p>
                <p className="position text-dark">{speaker.position}</p>
                <p className="compnay text-dark">{speaker.company}</p>
              </div>
              <ul className="addEv-Details">
                <li>
                  Awards{' '}
                  <span className="pull-right">{speaker.noOfAwards}</span>
                </li>
                <li>
                  Grants{' '}
                  <span className="pull-right">{speaker.noOfGrants}</span>
                </li>
                <li>
                  Publications{' '}
                  <span className="pull-right">{speaker.noOfPublications}</span>
                </li>
                <li>
                  Patents{' '}
                  <span className="pull-right">{speaker.noOfPatents}</span>
                </li>
              </ul>
              <div className="viewDetails">
                <a href="javascript:void(0)" className="btn-arrow">
                  view details
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  renderSponsors = () => {
    return this.state.eventDetailsObject.sponsorsList.map((sponsor, index) => {
      const sponsorImage = sponsor.imageURL
        ? displayThumbImage(
            sponsor.imageURL,
            Config.S3AlbumForSponsor,
            Config.S3Thumbnail373
          )
        : imgUserDefault;
      return (
        <div className="col-sm-3 col-md-6 col-lg-6" key={index}>
          <div className="sponsorLogo-Col">
            <Img src={sponsorImage} default={imgUserDefault} />
            {/*<img
              src={sponsor.imageURL || sponsorDefault}
              alt={sponsor.sponserName}
              className=""
            />*/}
            <span className="tooltiptext">sponserName</span>
          </div>
        </div>
      );
    });
  };

  renderMedia = () => {
    return this.state.eventDetailsObject.mediaResponseList.map(
      (media, index) => {
        let fileType = media.type.toUpperCase();

        if (fileType in this.state.allowedFiles) {
          media.mediaName = this.state.allowedFiles[fileType];
        }

        return (
          <div className="col-sm-6 col-md-6" key={index}>
            <div className="media-box">
              <div className="mImgBox">
                {media.mediaName === 'image' ? (
                  <img
                    src={this.getFileData(media.mediaURL)}
                    alt="Mountain View"
                    className=""
                    onClick={() => {
                      this.viewImg(media);
                    }}
                  />
                ) : (
                  ''
                )}
                {media.mediaName === 'document' ? (
                  <a
                    className="cls-download-doc"
                    href={media.mediaURL}
                    download
                  >
                    <img
                      src={this.getFileData(media.mediaURL)}
                      alt="Mountain View"
                      className="img-Doc"
                      // onClick={() => {
                      //   let anchorTag = document.createElement('a');
                      //   anchorTag.href = media.mediaURL;
                      //   anchorTag.click();
                      // }}
                    />
                  </a>
                ) : (
                  ''
                )}
                {media.mediaName === 'audio' ? (
                  <img
                    src={this.getFileData(media.mediaURL)}
                    alt="Mountain View"
                    className=""
                    onClick={() => {
                      this.playAudio(media);
                    }}
                  />
                ) : (
                  ''
                )}
                {media.mediaName === 'video' ? (
                  <img
                    src={this.getFileData(media.mediaURL)}
                    alt="Mountain View"
                    className=""
                    onClick={() => {
                      this.playVideo(media);
                    }}
                  />
                ) : (
                  ''
                )}
              </div>

              <div className="mediaText">
                <p className="mediaNameText">
                  <span className="mediaTextDtls">{media.name}</span>
                  <span className="tooltiptext">{media.name}</span>
                </p>
              </div>
            </div>
          </div>
        );
        // return (
        //   <div className="col-sm-6 col-md-6" key={index}>
        //     <div className="media-box">
        //       <div className="mImgBox">
        //         <img
        //           src={this.getFileData(media.mediaURL)}
        //           alt="Mountain View"
        //           className=""
        //         />
        //         <a href="javascript:void(0);">
        //           <span className="ico-mike">
        //             <svg>
        //               <use xlinkHref="/img/sprite.svg#mikeIco" />
        //             </svg>
        //           </span>

        //           {/* <img
        //             src={this.getFileData(media.mediaURL)}
        //             alt="Mountain View"
        //           /> */}
        //         </a>
        //       </div>
        //       <div className="mediaText">
        //         <p className="mediaNameText">
        //           <span className="mediaTextDtls">{media.name}</span>
        //           <span className="tooltiptext">{media.name}</span>
        //         </p>
        //       </div>
        //     </div>
        //   </div>
        // );
      }
    );
  };

  renderMap = () => {
    return (
      <Map
        google={this.props.google}
        zoom={8}
        style={style}
        center={{ lat: this.state.eventLati, lng: this.state.eventLong }}
      >
        <Marker
          title={this.state.eventvenue}
          position={{ lat: this.state.eventLati, lng: this.state.eventLong }}
        />
      </Map>
    );
  };

  createLike = () => {
    let newLikeData = {
      eventId: this.state.eventId,
      likedByUserId: this.props.userInfo.id
    };
    this.props.actionSetLikeByEventId(newLikeData).then(res => {
      if (res.payload && res.payload.data && res.payload.data.status == 200) {
        console.log('---------------------------', res.payload.data);
        this.props.actionManagerSelectedEventDetails(this.state.eventId);
      }
    });
  };

  createComment = userComment => {
    userComment = userComment.trim();

    if (userComment.length == 0) {
      // showWarningToast('Comment can not empty');
      return;
    }

    let newCommentData = {
      eventId: this.state.eventId,
      comment: userComment,
      commentorUserId: this.props.userInfo.id
    };
    this.props.actionSetCommentByEventId(newCommentData).then(res => {
      if (res.payload && res.payload.data && res.payload.data.status == 200) {
        this.setState({ userComment: '' });
        this.props.actionGetCommentsByEventId(this.state.eventId);
      }
    });
  };

  renderLikesAndComments = () => {
    return (
      <div className="white-box">
        <div className="rowBox">
          <div className="colBox">
            <div className="common-sub-heading">
              <h3>LIKES AND COMMENTS</h3>
            </div>
          </div>
          <div className="colBox">
            <div className="like-count text-right">
              <a
                href="javascript:void(0);"
                onClick={() => {
                  this.createLike();
                }}
              >
                <span className="glyphicon glyphicon-thumbs-up" />{' '}
                {this.state.eventLikes} LIKES
              </a>
            </div>
          </div>
        </div>
        <div className="l-n-cWrapper">
          <div className="commentBox">{this.renderComments()}</div>
          <div className="commentInput-Col">
            <span className="ico-user">
              <svg>
                <use xlinkHref={`${Sprite}#userIco`} />
              </svg>
            </span>
            <div className="commentInputDiv">
              <input
                type="text"
                className="form-control commentInput"
                placeholder="Your Comments"
                name="userComment"
                value={this.state.userComment}
                onChange={event => {
                  this.handleUserInput(event);
                }}
                onKeyUp={event => this.handleCommentEnterKeyUp(event)}
              />
              <span
                className="ico-send"
                onClick={() => {
                  this.createComment(this.state.userComment);
                }}
              >
                <svg>
                  <use xlinkHref={`${Sprite}#sendIco`} />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderComments = () => {
    return (
      <ul>
        {this.state.commentList.map((comment, commentIndex) => {
          return (
            <li key={commentIndex}>
              <div className="spInfoWapper">
                <div className="spImg">
                  <img
                    src={
                      comment.commentorUserId.profilePhotoURL || imgUserDefault
                    }
                  />
                </div>
                <div className="spInfoContainer">
                  <div className="spInfo">
                    <h5 className="m0">
                      {comment.commentorUserId.firstName}
                      <span>
                        {comment.commentorUserId.profession
                          ? comment.commentorUserId.profession[0]
                          : ''}
                      </span>
                    </h5>
                    <p className="text-right">
                      {moment(comment.createdTimeStamp).format(
                        'DD, MMMM YYYY | LT'
                      )}
                    </p>
                  </div>
                  <p className="commentText">{comment.comment}</p>
                  {/* <p className="reply">
                      <span className="glyphicon glyphicon-share-alt" /> &nbsp;Reply
                    </p> */}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  renderDiscountList = () => {
    return (
      <div className="discount-sec">
        {this.state.combineList.map((discount, discountIndex) => {
          if (discountIndex < 2) {
            switch (discount.discountType) {
              case 'generalDiscount':
                return (
                  <div className="eb-Discount" key={discountIndex}>
                    <p className="eb-text">
                      <span className="ico-tag">
                        <svg>
                          <use xlinkHref={`${Sprite}#tagIco`} />
                        </svg>
                      </span>
                      {/* Early Bird Discount */}
                      Discount
                    </p>
                    <p className="eb-RegisterText">
                      {/* Register by Dec 16, 2017 to receive 10% off your
                      registration! */}
                      {/* {`Get ${
                        discount.innovecsysDiscountPercentage
                      }% innovecsys discount and ${
                        discount.ownerDiscountPercentage
                      }% owner discount on delegate type ${
                        discount.delegateType
                      }`} */}
                      Get special discount on delegate type{' '}
                      {discount.delegateType}
                    </p>
                  </div>
                );
                break;
              case 'offer':
                return (
                  <div className="eb-Discount" key={discountIndex}>
                    <p className="eb-text">
                      <span className="ico-tag">
                        <svg>
                          <use xlinkHref={`${Sprite}#tagIco`} />
                        </svg>
                      </span>
                      {/* Early Bird Discount */}
                      Offer
                    </p>
                    <p className="eb-RegisterText">
                      {/* Register by Dec 16, 2017 to receive 10% off your
                      registration! */}
                      {/* {`Register before ${moment(
                        discount.applicableTillDate
                      ).format('DD MMM, YYYY')} to receive ${
                        discount.discountPercentage
                      }% off on registration`} */}

                      {discount.description}
                    </p>
                  </div>
                );
                break;

              case 'coupon':
                return (
                  <div className="eb-Discount" key={discountIndex}>
                    <p className="eb-text">
                      <span className="ico-tag">
                        <svg>
                          <use xlinkHref={`${Sprite}#tagIco`} />
                        </svg>
                      </span>
                      {/* Early Bird Discount */}
                      Coupon
                    </p>
                    <p className="eb-RegisterText">
                      {/* Register by Dec 16, 2017 to receive 10% off your
                      registration! */}

                      {/* {`Register before ${moment(
                        discount.expiryTimeStamp
                      ).format('DD MMM, YYYY')} to receive ${
                        discount.discountPercentage
                      }% off on registration with the coupon code`} */}

                      {discount.description}
                    </p>
                  </div>
                );
                break;
            }
          }
        })}
      </div>
    );
  };

  renderHorizontalDiscountList = () => {
    return (
      <div className="discount-sec">
        <div className="flex-row">
          {this.state.combineList.map((discount, discountIndex) => {
            if (discountIndex < 2) {
              switch (discount.discountType) {
                case 'generalDiscount':
                  return (
                    <div
                      className={classNames('eb-Discount', {
                        'mr-10': discountIndex == 0
                      })}
                    >
                      <p className="eb-text">
                        <span className="ico-tag">
                          <svg>
                            <use xlinkHref={`${Sprite}#tagIco`} />
                          </svg>
                        </span>
                        Discount
                      </p>
                      <p className="eb-RegisterText">
                        {/* {`Get ${
                          discount.innovecsysDiscountPercentage
                        }% innovecsys discount and ${
                          discount.ownerDiscountPercentage
                        }% owner discount on delegate type ${
                          discount.delegateType
                        }`} */}
                        Get special discount on delegate type{' '}
                        {discount.delegateType}
                      </p>
                    </div>
                  );
                  break;
                case 'offer':
                  return (
                    <div
                      className={classNames('eb-Discount', {
                        'mr-10': discountIndex == 0
                      })}
                    >
                      <p className="eb-text">
                        <span className="ico-tag">
                          <svg>
                            <use xlinkHref={`${Sprite}#tagIco`} />
                          </svg>
                        </span>
                        Offer
                      </p>
                      <p className="eb-RegisterText">
                        {/* {`Register before ${moment(
                          discount.applicableTillDate
                        ).format('DD MMM, YYYY')} to receive ${
                          discount.discountPercentage
                        }% off on registration`} */}

                        {discount.description}
                      </p>
                    </div>
                  );
                  break;

                case 'coupon':
                  return (
                    <div
                      className={classNames('eb-Discount', {
                        'mr-10': discountIndex == 0
                      })}
                    >
                      <p className="eb-text">
                        <span className="ico-tag">
                          <svg>
                            <use xlinkHref={`${Sprite}#tagIco`} />
                          </svg>
                        </span>
                        Coupon
                      </p>
                      <p className="eb-RegisterText">
                        {/* {`Register before ${moment(
                          discount.expiryTimeStamp
                        ).format('DD MMM, YYYY')} to receive ${
                          discount.discountPercentage
                        }% off on registration with the coupon code`} */}
                        {discount.description}
                      </p>
                    </div>
                  );
                  break;
              }
            }
          })}
        </div>
      </div>
    );
  };

  onShowDiscountModal = () => {
    this.setState({ isDiscountModalVisible: true });
  };

  closeDiscountModal = () => {
    this.setState({ isDiscountModalVisible: false });
  };

  renderDiscountModal = () => {
    return (
      <Dialog
        open={this.state.isDiscountModalVisible}
        keepMounted
        onClose={this.closeDiscountModal}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth={false}
        maxWidth={'md'}
        className="discountModal"
      >
        <DialogTitle className="mdl-header">
          {'Applicable discounts'}
          <span
            className="ico-close pull-right"
            onClick={() => {
              this.closeDiscountModal();
            }}
          >
            <svg>
              <use xlinkHref={`${Sprite}#close`} />
            </svg>
          </span>
        </DialogTitle>

        <DialogContent className="mdl-body">
          {this.renderModalData()}
        </DialogContent>
      </Dialog>
    );
  };

  renderModalData = () => {
    return (
      <div className="mdlContent">
        <div className="row">
          {this.state.combineList.map((discount, discountIndex) => {
            switch (discount.discountType) {
              case 'generalDiscount':
                return (
                  <div className="col-sm-6" key={discountIndex}>
                    <div className="discount-sec">
                      <div className="eb-Discount gal-eff">
                        <p className="eb-text">
                          <span className="ico-tag">
                            <svg>
                              <use xlinkHref={`${Sprite}#tagIco`} />
                            </svg>
                          </span>
                          {/* Early Bird Discount */}
                          Discount
                        </p>
                        <p className="eb-RegisterText">
                          {/* Register by Dec 16, 2017 to receive 10% off your
                        registration! */}
                          {/* {`Get ${
                          discount.innovecsysDiscountPercentage
                        }% innovecsys discount and ${
                          discount.ownerDiscountPercentage
                        }% owner discount on delegate type ${
                          discount.delegateType
                        }`} */}
                          Get special discount on delegate type{' '}
                          {discount.delegateType}
                        </p>
                      </div>
                    </div>
                  </div>
                );
                break;
              case 'offer':
                return (
                  <div className="col-sm-6" key={discountIndex}>
                    <div className="discount-sec">
                      <div className="eb-Discount gal-eff">
                        <p className="eb-text">
                          <span className="ico-tag">
                            <svg>
                              <use xlinkHref={`${Sprite}#tagIco`} />
                            </svg>
                          </span>
                          {/* Early Bird Discount */}
                          Offer
                        </p>
                        <p className="eb-RegisterText">
                          {/* Register by Dec 16, 2017 to receive 10% off your
                        registration! */}
                          {/* {`Register before ${moment(
                          discount.applicableTillDate
                        ).format('DD MMM, YYYY')} to receive ${
                          discount.discountPercentage
                        }% off on registration`} */}

                          {discount.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
                break;

              case 'coupon':
                return (
                  <div className="col-sm-6" key={discountIndex}>
                    <div className="discount-sec">
                      <div className="eb-Discount gal-eff">
                        <p className="eb-text">
                          <span className="ico-tag">
                            <svg>
                              <use xlinkHref={`${Sprite}#tagIco`} />
                            </svg>
                          </span>
                          {/* Early Bird Discount */}
                          Coupon
                        </p>
                        <p className="eb-RegisterText">
                          {/* Register by Dec 16, 2017 to receive 10% off your
                          registration! */}

                          {/* {`Register before ${moment(discount.expiryTimeStamp).format(
                            'DD MMM, YYYY'
                          )} to receive ${
                            discount.discountPercentage
                          }% off on registration with the coupon code`} */}
                          {discount.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
                break;
            }
          })}
        </div>
        <div>
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
                src={this.state.audioSrc}
                // playing={this.state.audioPlay}
                autoplay
                controls
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={this.state.openVideoDialog}
            keepMounted
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
                url={this.state.videoSrc}
                playing={this.state.videoPlay}
                controls
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={this.state.openImgDialog}
            onClose={this.closeImgDialog}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            fullWidth={false}
            maxWidth={'md'}
            className="imagePreviewModal"
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
                src={this.state.imgSrc}
                style={{ width: this.state.width, height: this.state.height }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    events: state.events,
    userInfo: state.profileData,
    comment: state.comment,
    discount: state.discount.discountData
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actionManagerSelectedEventDetails,
      actionGetCommentsByEventId,
      actionSetCommentByEventId,
      actionSetLikeByEventId,
      actionSetMemberActiveSummary,
      actionGetDiscount,
      showLoader,
      hideLoader
    },
    dispatch
  );
};

// export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
// export default EventDetails;

const Container = connect(mapStateToProps, mapDispatchToProps)(EventDetails);
const WrappedContainer = GoogleApiWrapper({
  apiKey: 'AIzaSyAY7vptEnJmCGZrnrZkmMknh0TSfZXmUko'
})(Container);

export default WrappedContainer;
