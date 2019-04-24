import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import bootbox from 'bootbox';
import LazyLoad from 'react-lazyload';
import socketIOClient from 'socket.io-client';
import classNames from 'classnames';
// import Menu, { MenuItem } from 'material-ui/Menu';
import { Button } from 'react-md';
import { stat } from 'fs';
import $ from 'jquery';

import imgDownCaretIcon from '../../img/downCaretIcon.png';

import PlaceholderComponent from './placeholder';
import Img from '../../common/core/img';
import Dialog, {
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import {
  getAllEvents,
  actionManagerSelectedEventDetails,
  editEvent,
  actionActiveEvent,
  setEditEventFlag,
  actionManagerAccess,
  actionMemberEventDetailsObject
} from '../../common/action/index';
import imgEventDefault from '../../img/def_event.jpg';
import imgCaretDown from '../../img/downCaretIcon.png';
import { actionDashboardData } from '../../common/action/index';
import imgAddSpeaker from '../../img/added_speakers-icon.png';
import imgSearchIcon from '../../img/evSearchIcon.png';
import innovecsysApiService from '../../common/core/api';
import {
  showSuccessToast,
  displayThumbImage
} from '../../common/core/common-functions';
import AlertModal from '../../common/alert-box/alert-modal';
import Config from '../../common/core/config';
import Sprite from '../../img/sprite.svg';

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedEventId: '',
      eventList: [],
      filteredCategoryEventList: [],
      finalFilterList: [],
      showDropDownList: false,
      selectedCategory: 'ALL',
      searchKeyword: '',
      hasFocus: false,
      bucketName: Config.S3BucketName,
      resizedBucketName: Config.S3ResizeBucketName,
      showDeleteModal: false
    };

    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.renderEventList = this.renderEventList.bind(this);
    this.onDeleteEvent = this.onDeleteEvent.bind(this);
    this.onEditEvent = this.onEditEvent.bind(this);
    this.onAddEvent = this.onAddEvent.bind(this);
    window.addEventListener('click', this.handleDocumentClick);
  }

  componentWillMount() {
    if (this.props.userInfo && this.props.userInfo.id) {
      let sendObject = {};
      sendObject = {
        userId: this.props.userInfo.id,
        pageNumber: 1,
        pageSize: 500
      };
      this.props.getAllEvents(sendObject);
    } else {
      this.props.history.push('/');
    }
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  showDropDown = event => {
    this.setState({
      showDropDownList: !this.state.showDropDownList
    });
  };

  hideDropDown = name => {
    let filteredList = [];
    switch (name) {
      case 'PUBLISHED':
        filteredList = this.state.eventList.filter(event => {
          return event.published == true;
        });
        break;
      case 'UNPUBLISHED':
        filteredList = this.state.eventList.filter(event => {
          return event.published == false;
        });
        break;

      case 'ALL':
        filteredList = this.state.eventList;
    }

    this.setState({
      filteredCategoryEventList: filteredList,
      finalFilterList: filteredList,
      showDropDownList: false,
      selectedCategory: name,
      searchKeyword: name
    });
  };

  handleDocumentClick = evt => {
    try {
      const area = ReactDOM.findDOMNode(this.refs.dropDownArea);
      if (!area.contains(evt.target)) {
        this.collapse();
      }
    } catch (err) {
      // console.log(err);
    }
  };

  collapse = () => {
    this.setState({ showDropDownList: false });
  };

  clearText = () => {
    this.setState({
      searchKeyword: '',
      finalFilterList: this.state.eventList
    });
  };

  componentWillReceiveProps(res) {
    let events = res.events.all || [];
    this.setState({
      eventList: events,
      filteredCategoryEventList: events,
      finalFilterList: events
    });
  }

  componentDidMount() {
    let events = this.props.events.all || [];
    this.setState({
      eventList: events,
      filteredCategoryEventList: events,
      finalFilterList: events
    });
  }

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

  showAlert(eventId) {
    $('#alert_modal').modal();

    this.setState({
      clickedEventId: eventId,
      showDeleteModal: true
    });
  }

  hideDeleteModal = () => {
    this.setState({
      showDeleteModal: false
    });
  };

  onDeleteEvent(eventId) {
    if (this.state.clickedEventId) {
      const userId = this.props.userInfo.id;
      let eventId = this.state.clickedEventId;
      innovecsysApiService('deleteEvent', { userId, eventId }).then(result => {
        if (result.data && result.data.status && result.data.status === 200) {
          if (result.data.responseMessage) {
            const message = result.data.responseMessage;
            // showSuccessToast(message);
          }
          //Call event list after delete success
          let sendObject = {};
          sendObject = {
            userId: this.props.userInfo.id,
            pageNumber: 1,
            pageSize: 500
          };
          this.props.getAllEvents(sendObject);
          this.props.actionDashboardData();
        }
      });
    }
  }

  onEditEvent(eventObj) {
    if (eventObj === '') {
      var eventData = this.state.eventData;
      console.log('onEditEvent', eventData);
      // this.openEditEventPage(eventData);
      this.props.actionActiveEvent(eventData);
      this.getManagerEventDetails(eventData.eventId);
    } else {
      console.log('onEditEvent', eventObj);
      // this.openEditEventPage(eventObj);
      this.props.actionActiveEvent(eventObj);
      this.getManagerEventDetails(eventObj.eventId);
    }
  }

  getManagerEventDetails = eventId => {
    this.props.actionManagerSelectedEventDetails(eventId).then(res => {
      if (res.payload && res.payload.data && res.payload.data.resourceData) {
        let eventDetails = res.payload.data.resourceData || {};
        this.openEditEventPage(eventDetails);
      }
      console.log('res', res);
    });
  };

  handleClickOpen = eventObj => {
    this.setState({ open: true, eventData: eventObj });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  openEditEventPage(eventObj) {
    this.props.editEvent(eventObj);
    this.props.actionActiveEvent(eventObj);
    this.props.actionManagerAccess({
      accessCreateEvent: true,
      accessEventSpeakers: true,
      accessEventMedia: true,
      accessEventAgenda: true,
      accessEventSponsors: true,
      accessEventDiscount: true
    });
    this.props.history.push('/manager/editEvent');
  }

  onAddEvent() {
    this.props.setEditEventFlag(false);
    this.props.actionActiveEvent(undefined);
    this.props.actionManagerAccess({
      accessCreateEvent: true,
      accessEventSpeakers: false,
      accessEventMedia: false,
      accessEventAgenda: false,
      accessEventSponsors: false,
      accessEventDiscount: false
    });
    this.navigateToUrlPage('/manager/addEvent');
  }

  filterOnCategory = name => {
    console.log(name);

    let filteredList = [];

    switch (name) {
      case 'published':
        filteredList = this.state.eventList.filter(event => {
          return event.published == true;
        });
        break;
      case 'unpublished':
        filteredList = this.state.eventList.filter(event => {
          return event.published == false;
        });
        break;

      case 'all':
        filteredList = this.state.eventList;
    }

    this.setState({
      filteredCategoryEventList: filteredList,
      finalFilterList: filteredList,
      selectedCategory: name
    });
  };

  searchFilter = (items, term) => {
    if (Array.isArray(items) && items.length && term && term.length) {
      return items.filter(item => {
        let keys = Object.keys(item);
        if (Array.isArray(keys) && keys.length) {
          for (let key of keys) {
            if (
              item.hasOwnProperty(key) &&
              item[key] &&
              item[key].length &&
              item[key]
                .toString()
                .toLowerCase()
                .replace(/ /g, '')
                .includes(
                  term
                    .toString()
                    .toLowerCase()
                    .replace(/ /g, '')
                )
            ) {
              return true;
            }
          }
          return false;
        } else {
          return false;
        }
      });
    } else {
      return items;
    }
  };

  onTextChange = (text, list) => {
    let li = this.searchFilter(JSON.parse(JSON.stringify(list)), text);
    this.setState({
      searchKeyword: text,
      finalFilterList: li
    });
  };

  // showEventDetails = event => {
  //   console.log(event);
  //   this.props.actionMemberEventDetailsObject(event);
  //   this.navigateByUrlName('eventDetails');
  // };
  showEventDetails = eventId => {
    this.navigateByUrlName('/manager/eventDetails?eventId=' + eventId);
  };

  renderEventList(eventObj) {
    //console.log(eventObj);
    const name = eventObj.eventName;
    const description = eventObj.description;
    const eventId = eventObj.eventId;
    const eventPublishStatus = eventObj.published; // This should be true or false
    const bannerImageURL = eventObj.bannerImageURL
      ? displayThumbImage(
          eventObj.bannerImageURL,
          Config.S3AlbumForBanner,
          Config.S3Thumbnail200
        )
      : imgEventDefault;
    //console.log(eventObj.eventName + '--------' + bannerImageURL);
    return (
      <div className="eventList-Sec" key={eventId}>
        <div className="col-lg-3 col-md-4 col-sm-6">
          <div className="eventBox gal-eff">
            <div className="evImg">
              <div
                className={`publishIcon ${!eventPublishStatus ? 'hide' : ''}`}
              >
                {/*<i className="fa fa-bullhorn" />*/}
                <span className="ico-publish">
                  <svg>
                    <use xlinkHref={`${Sprite}#publishIco`} />
                  </svg>
                </span>
              </div>
              <LazyLoad
                placeholder={<PlaceholderComponent />}
                debounce={200}
                height={100 + '%'}
              >
                {/* <img src={bannerImageURL} alt="" /> */}
                <Img src={bannerImageURL} default={imgEventDefault} />
              </LazyLoad>
              <div className="evLabel">Conference</div>
              <div className="overlay">
                <ul className="social-contact action-tag text-center">
                  <li>
                    <a
                      href="javascript:void(0)"
                      onClick={() => this.showEventDetails(eventId)}
                      className="ml-2"
                    >
                      <span className="ico-eye">
                        <svg>
                          <use xlinkHref={`${Sprite}#eyeIco`} />
                        </svg>
                      </span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="javascript:void(0)"
                      onClick={() => this.showAlert(eventId)}
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
                  {eventPublishStatus ? (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => this.handleClickOpen(eventObj)}
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
                  ) : (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => this.onEditEvent(eventObj)}
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
                  )}
                  <li className="ticketAmountDiv ">
                    <div className="manageTickets ticketsImg ">
                      <p>Tickets Sold</p>
                      <h3>
                        {
                          eventObj.totalMemberRegisterWithAmountCount
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
                          eventObj.totalMemberRegisterWithAmountCount
                            .totalEarningOfEvent
                        }
                      </h3>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="evInfo u-details white-bg h-170">
              <div className="evDiscription">
                <h5 className="name all-caps">{name}</h5>
                <p className="degi text-dark">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="main-container">
        <div className="innerfull-page">
          <div className="row">
            <div className="col-md-9">
              <h2 className="evListTitle">
                <span>CREATED EVENTS </span>
                <div
                  className={classNames('eventSearchDiv', {
                    closeList: this.state.showDropDownList == false
                  })}
                  ref="dropDownArea"
                >
                  <input
                    type="text"
                    className="form-control evSearchBox"
                    className={classNames('form-control evSearchBox', {
                      inputFocus:
                        this.state.showDropDownList == true ||
                        this.state.searchKeyword.length > 0
                    })}
                    name="Search"
                    placeholder="Search"
                    onFocus={() => {
                      this.setState({ showDropDownList: true });
                    }}
                    onChange={event => {
                      this.onTextChange(
                        event.target.value,
                        this.state.eventList
                      );
                    }}
                    value={this.state.searchKeyword}
                    ref="keyword"
                  />

                  {this.state.searchKeyword.length > 0 ? (
                    <span
                      onClick={() => {
                        this.clearText();
                      }}
                      className="SelectClear"
                    >
                      ×
                    </span>
                  ) : null}

                  {this.state.showDropDownList == true ||
                  this.state.searchKeyword.length > 0 ? (
                    <span
                      className="carretDown"
                      onClick={event => this.showDropDown(event)}
                    >
                      {' '}
                      <img src={imgDownCaretIcon} />{' '}
                    </span>
                  ) : null}

                  <img src={imgSearchIcon} alt="" className="evSearchIcon" />
                  <ul className="listCategory">
                    <li onClick={event => this.hideDropDown('ALL')}>ALL</li>
                    <li onClick={event => this.hideDropDown('PUBLISHED')}>
                      PUBLISHED
                    </li>
                    <li onClick={event => this.hideDropDown('UNPUBLISHED')}>
                      UNPUBLISHED
                    </li>
                  </ul>
                </div>
              </h2>
            </div>

            <div className="col-md-3">
              <a onClick={() => this.onAddEvent()} className="createNewEvent">
                <span className="ico-plus-create">
                  <svg>
                    <use xlinkHref={`${Sprite}#plusCreate`} />
                  </svg>
                </span>
                Create New Event
              </a>
            </div>
          </div>
          <div className="mt-20">
            <div className="upEventContainer">
              <div className="row">
                {this.state.finalFilterList.map(this.renderEventList)}
              </div>
            </div>
          </div>
        </div>

        {/* Alert modal Satrt */}
        <AlertModal
          confirmedMe={this.onDeleteEvent}
          eventType="delete"
          customClass="deleteIconDiv"
          alertMessage="Are you sure you want to delete?"
          showDeleteModal={this.state.showDeleteModal}
          hideDeleteModal={this.hideDeleteModal}
        />

        <Button onClick={this.handleClickOpen}>{''}</Button>

        <Dialog
          open={this.state.open}
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
            <div className="mdl-BgDesign bg-publish">&nbsp;</div>
            <div className="mdlContent">
              <div className="publishIconDiv">
                <span className="ico-publish">
                  <svg>
                    <use xlinkHref={`${Sprite}#publishIco`} />
                  </svg>
                </span>
              </div>
              <h4>Do you want to make changes to published event ?</h4>
            </div>
            <div className="mdl-footer mt-20">
              <button
                type="button"
                className="btn btnSubmit ripple"
                onClick={() => this.onEditEvent('')}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn btnCancel ripple ml-20"
                onClick={this.handleClose}
              >
                No
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Alert modal end */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    userInfo: state.profileData,
    managerAccess: state.managerAccess,
    socket: state.state.socket
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      getAllEvents,
      actionManagerSelectedEventDetails,
      editEvent,
      actionActiveEvent,
      setEditEventFlag,
      actionManagerAccess,
      actionMemberEventDetailsObject,
      actionDashboardData
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
