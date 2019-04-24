import React, { Component } from 'react';
// import connect from 'redux';
// import mapStateToProps from 'react-redux';

import {
  getAllEvents,
  publishEvent,
  actionEventNotificationToMembers
} from '../../common/action/index';
import { showWarningToast } from '../../common/core/common-functions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import bootbox from 'bootbox';
//import AlertModal from '../../common/alert-box/alert-modal';
// let $ = require('jquery');
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import { actionDashboardData } from '../../common/action/index';
import Sprite from '../../img/sprite.svg';

class StepNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      updateState: false,
      setNotifyFlag: false
    };
    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.activeTabClass = this.activeTabClass.bind(this);
    this.publishEvent = this.publishEvent.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidMount() {
    this.updateDimensions();
    this.fixStepNav();
    window.onscroll = function() {
      let stepnavContent = document.getElementById('stepnavContent');
      if (stepnavContent) {
        stepnavContent.scrollTop = document.documentElement.scrollTop;
      }
    };
  }

  // fixStepNav = () => {
  //   var heightNav = $('.stepsNavbar').outerHeight();

  //   var posNav;
  //   if ($('.stepsNavbar').offset() == undefined) {
  //     return;
  //   }
  //   posNav = $('.stepsNavbar').offset().top;

  //   var heightWindow = $(window).height();
  //   var totalPos = heightNav + posNav;
  //   var footerLine = $('.footerline').offset().top;

  //   if (totalPos > footerLine) {
  //     $('.stepsNavbar').css('height', heightWindow);
  //     $('.stepnav-content').css({
  //       width: '116px',
  //       'padding-bottom': '15px'
  //     });
  //   } else {
  //     $('.stepsNavbar').css('height', 'auto');
  //     $('.stepnav-content').css({
  //       width: '100px',
  //       'padding-bottom': '0'
  //     });
  //   }

  //   $(window).scroll(function() {
  //     $('.stepnav-content').scrollTop($(this).scrollTop());
  //   });

  // };

  fixStepNav = () => {
    let navElement = document.getElementById('stepsNavbar');

    if (navElement == null || navElement == undefined) return;
    let heightNav = navElement.offsetHeight;

    let posNav;
    if (navElement.getBoundingClientRect() == undefined) {
      return;
    }
    posNav = navElement.getBoundingClientRect().top;
    let heightWindow = document.documentElement.clientHeight;
    let totalPos = heightNav + posNav;
    let footerLine = document
      .getElementById('footerline')
      .getBoundingClientRect().top;
    let stepnavContent = document.getElementById('stepnavContent');

    if (totalPos > footerLine) {
      navElement.setAttribute('style', 'height: ' + heightWindow + 'px');
      stepnavContent.setAttribute(
        'style',
        'width: 116px; padding-bottom: 15px'
      );
    } else {
      navElement.setAttribute('style', 'height: auto;');
      stepnavContent.setAttribute('style', 'width: 100px; padding-bottom: 0px');
    }
  };

  updateDimensions() {
    // var getWidthContent = $('.events-page').width() + 313;
    // $('.btnPageNav').css('left', getWidthContent);

    try {
      var getWidthContent =
        document.getElementsByClassName('events-page')[0].offsetWidth + 272;
      document
        .getElementsByClassName('btnPageNav')[0]
        .setAttribute('style', `left: ${getWidthContent}px`);
      this.fixStepNav();
    } catch (err) {
      console.log(err);
    }
  }

  navigateToUrlPage(pageUrl) {
    this.props.navigateToUrlPage(pageUrl);
  }

  activeTabClass(tabName) {
    return tabName === this.props.tabName ? 'active' : '';
  }

  publishEvent() {
    this.setState({ open: false });
    let eventId;
    if (this.props.events.activeEvent != undefined)
      eventId = this.props.events.activeEvent.eventId;

    if (eventId == undefined) {
      console.log('eventId not found');
      return;
    }

    if (this.props.events.activeEvent.published) {
      showWarningToast('Event already published');
    } else {
      // bootbox.confirm('You are going to publish this event', result => {
      //   if (result === true) {
      //     this.props.publishEvent(eventId);
      //   }
      // });
      this.state.setNotifyFlag = true;
      this.props.publishEvent(eventId).then(res => {
        this.props.events.activeEvent.published = true;
        this.props.actionDashboardData();
        this.setState({ updateState: !this.state.updateState });
      });
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleNotify = () => {
    let eventId = this.props.events.activeEvent.eventId;
    this.props.actionEventNotificationToMembers(eventId).then(res => {});
  };

  render() {
    return (
      <div>
        <div className="stepsNavbar pull-left" id="stepsNavbar">
          <div className="stepnav-content" id="stepnavContent">
            <ul className="stepsNavbarList">
              <li
                className={
                  this.props.managerAccess.accessCreateEvent == true
                    ? 'active'
                    : ''
                }
              >
                <a
                  onClick={() => {
                    this.props.managerAccess.accessEventSpeakers == false
                      ? this.navigateToUrlPage('/manager/addEvent')
                      : this.navigateToUrlPage('/manager/editEvent');
                  }}
                >
                  <span>
                    {' '}
                    {this.props.managerAccess.accessEventSpeakers == false
                      ? 'CREATE EVENT'
                      : 'UPDATE EVENT'}{' '}
                  </span>{' '}
                </a>{' '}
              </li>{' '}
              <li
                className={
                  this.props.managerAccess.accessEventSpeakers == true
                    ? 'active'
                    : ''
                }
              >
                <a
                  className={
                    this.props.managerAccess.accessEventSpeakers == false
                      ? 'anchorDisabled'
                      : ''
                  }
                  onClick={() => this.navigateToUrlPage('/manager/speakerList')}
                >
                  <span> EVENT SPEAKERS </span>{' '}
                </a>{' '}
              </li>{' '}
              <li
                className={
                  this.props.managerAccess.accessEventMedia == true
                    ? 'active'
                    : ''
                }
              >
                <a
                  className={
                    this.props.managerAccess.accessEventSpeakers == false ||
                    this.props.managerAccess.accessEventMedia == false
                      ? 'anchorDisabled'
                      : ''
                  }
                  onClick={() => this.navigateToUrlPage('/manager/eventMedia')}
                >
                  <span> EVENT MEDIA </span>{' '}
                </a>{' '}
              </li>{' '}
              <li
                className={
                  this.props.managerAccess.accessEventAgenda == true
                    ? 'active'
                    : ''
                }
              >
                <a
                  className={
                    this.props.managerAccess.accessEventSpeakers == false ||
                    this.props.managerAccess.accessEventMedia == false ||
                    this.props.managerAccess.accessEventAgenda == false
                      ? 'anchorDisabled'
                      : ''
                  }
                  onClick={() =>
                    this.navigateToUrlPage('/manager/agendaTimeLine')
                  }
                >
                  <span> EVENT AGENDA </span>{' '}
                </a>{' '}
              </li>{' '}
              <li
                className={
                  this.props.managerAccess.accessEventSponsors == true
                    ? 'active'
                    : ''
                }
              >
                <a
                  className={
                    this.props.managerAccess.accessEventSpeakers == false ||
                    this.props.managerAccess.accessEventMedia == false ||
                    this.props.managerAccess.accessEventAgenda == false ||
                    this.props.managerAccess.accessEventSponsors == false
                      ? 'anchorDisabled'
                      : ''
                  }
                  onClick={() => this.navigateToUrlPage('/manager/sponsorList')}
                >
                  <span> EVENT SPONSORS </span>{' '}
                </a>{' '}
              </li>{' '}
              <li
                className={
                  this.props.managerAccess.accessEventDiscount == true
                    ? 'active'
                    : ''
                }
              >
                <a
                  className={
                    this.props.managerAccess.accessEventSpeakers == false ||
                    this.props.managerAccess.accessEventMedia == false ||
                    this.props.managerAccess.accessEventAgenda == false ||
                    this.props.managerAccess.accessEventSponsors == false ||
                    this.props.managerAccess.accessEventDiscount == false
                      ? 'anchorDisabled'
                      : ''
                  }
                  onClick={() => this.navigateToUrlPage('/manager/discount')}
                >
                  <span>APPLY DISCOUNT </span>{' '}
                </a>{' '}
              </li>{' '}
              {/* <li
                                            className={
                                              this.props.managerAccess.accessInvitations == true ? 'active' : ''
                                            }
                                          >
                                            <a
                                              className={
                                                this.props.managerAccess.accessEventSpeakers == false ||
                                                this.props.managerAccess.accessEventMedia == false ||
                                                this.props.managerAccess.accessEventAgenda == false ||
                                                this.props.managerAccess.accessEventSponsors == false ||
                                                this.props.managerAccess.accessInvitations == false
                                                  ? 'anchorDisabled'
                                                  : ''
                                              }
                                              onClick={() => this.navigateToUrlPage('/manager/invitationList')}
                                            >
                                              <span>INVITATIONS</span>
                                            </a>
                                          </li> */}{' '}
            </ul>{' '}
            <a
              className={
                this.props.managerAccess.accessEventSpeakers == false ||
                this.props.managerAccess.accessEventAgenda == false ||
                this.props.managerAccess.accessEventSponsors == false ||
                (this.props.events.activeEvent &&
                  this.props.events.activeEvent.published)
                  ? 'btn btnInfo width-100px ripple anchorDisabled disabled-publish-btncolor'
                  : 'btn btnInfo width-100px ripple'
              }
              onClick={() => this.handleClickOpen()}
            >
              <i className="fa fa-bullhorn" />{' '}
              {this.props.events.activeEvent &&
              this.props.events.activeEvent.published
                ? ' Published '
                : ' PUBLISH '}{' '}
              {/* {this.props.events.activeEvent ? this.props.events.activeEvent.published.toString():'nun'} */}
            </a>
            <a
              className={
                this.props.managerAccess.accessEventSpeakers == false ||
                this.props.managerAccess.accessEventAgenda == false ||
                this.props.managerAccess.accessEventSponsors == false ||
                !this.props.events.activeEvent.published
                  ? 'btn btnInfo width-100px ripple anchorDisabled disabled-notify-btncolor'
                  : 'btn btnInfo width-100px ripple cls-btn-notify'
              }
              onClick={() => this.handleNotify()}
            >
              <i className="fa fa-bell-o" />{' '}
              {this.props.events.activeEvent &&
              this.props.events.activeEvent.published
                ? ' NOTIFY '
                : ' NOTIFY '}{' '}
            </a>
          </div>

          <div className="footerline" id="footerline">
            {' '}
          </div>

          <div className="publish-alert alertModal">
            {/* <Button onClick={this.handleClickOpen}>{''}</Button> */}
            {/* <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                <span className="ico-close-alert" onClick={this.handleClose}>
                  &times;
                </span>
              </DialogTitle>
              <DialogContent>
                <div className="publishIconDiv">
                  <span className="ico-publish">
                    <svg>
                      <use xlinkHref={`${Sprite}#publishIco`} />
                    </svg>
                  </span>
                </div>
                <h4>Are you sure you want to publish ?</h4>
              </DialogContent>
              <DialogActions>
                <button
                  className="btn publishYesBtn ripple"
                  type="button"
                  onClick={() => this.publishEvent()}
                  data-dismiss="modal"
                >
                  Yes
                </button>
                <button
                  className="btn publishNoBtn ml-20 ripple"
                  type="button"
                  onClick={this.handleClose}
                >
                  No
                </button>
              </DialogActions>
            </Dialog> */}

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
                    <span className={`ico-publish`}>
                      <svg>
                        <use xlinkHref={`/img/sprite.svg#publishIco`} />
                      </svg>
                    </span>
                  </div>
                  <h4>Are you sure you want to publish ?</h4>
                </div>
                <div className="mdl-footer mt-20">
                  <button
                    type="button"
                    className="btn btnSubmit ripple"
                    onClick={() => this.publishEvent()}
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
        </div>

        {/* ====== bottomFix-stepsNavbar start ===== */}
        <div className="bottomFix-stepsNavbar" id="stepsNavbar">
          <div className="stepnav-content" id="stepnavContent">
            <ul className="stepsNavbarList">
              <li
                className={
                  this.props.managerAccess.accessCreateEvent == true
                    ? 'active'
                    : ''
                }
              >
                <a
                  onClick={() => {
                    this.props.managerAccess.accessEventSpeakers == false
                      ? this.navigateToUrlPage('/manager/addEvent')
                      : this.navigateToUrlPage('/manager/editEvent');
                  }}
                >
                  <span>
                    {' '}
                    {this.props.managerAccess.accessEventSpeakers == false
                      ? 'CREATE EVENT'
                      : 'UPDATE EVENT'}{' '}
                  </span>{' '}
                </a>{' '}
              </li>{' '}
              <li
                className={
                  this.props.managerAccess.accessEventSpeakers == true
                    ? 'active'
                    : ''
                }
              >
                <a
                  className={
                    this.props.managerAccess.accessEventSpeakers == false
                      ? 'anchorDisabled'
                      : ''
                  }
                  onClick={() => this.navigateToUrlPage('/manager/speakerList')}
                >
                  <span> EVENT SPEAKERS </span>{' '}
                </a>{' '}
              </li>{' '}
              <li
                className={
                  this.props.managerAccess.accessEventMedia == true
                    ? 'active'
                    : ''
                }
              >
                <a
                  className={
                    this.props.managerAccess.accessEventSpeakers == false ||
                    this.props.managerAccess.accessEventMedia == false
                      ? 'anchorDisabled'
                      : ''
                  }
                  onClick={() => this.navigateToUrlPage('/manager/eventMedia')}
                >
                  <span> EVENT MEDIA </span>{' '}
                </a>{' '}
              </li>{' '}
              <li
                className={
                  this.props.managerAccess.accessEventAgenda == true
                    ? 'active'
                    : ''
                }
              >
                <a
                  className={
                    this.props.managerAccess.accessEventSpeakers == false ||
                    this.props.managerAccess.accessEventMedia == false ||
                    this.props.managerAccess.accessEventAgenda == false
                      ? 'anchorDisabled'
                      : ''
                  }
                  onClick={() =>
                    this.navigateToUrlPage('/manager/agendaTimeLine')
                  }
                >
                  <span> EVENT AGENDA </span>{' '}
                </a>{' '}
              </li>{' '}
              <li
                className={
                  this.props.managerAccess.accessEventSponsors == true
                    ? 'active'
                    : ''
                }
              >
                <a
                  className={
                    this.props.managerAccess.accessEventSpeakers == false ||
                    this.props.managerAccess.accessEventMedia == false ||
                    this.props.managerAccess.accessEventAgenda == false ||
                    this.props.managerAccess.accessEventSponsors == false
                      ? 'anchorDisabled'
                      : ''
                  }
                  onClick={() => this.navigateToUrlPage('/manager/sponsorList')}
                >
                  <span> EVENT SPONSORS </span>{' '}
                </a>{' '}
              </li>{' '}
              <li
                className={
                  this.props.managerAccess.accessEventDiscount == true
                    ? 'active'
                    : ''
                }
              >
                <a
                  className={
                    this.props.managerAccess.accessEventSpeakers == false ||
                    this.props.managerAccess.accessEventMedia == false ||
                    this.props.managerAccess.accessEventAgenda == false ||
                    this.props.managerAccess.accessEventSponsors == false ||
                    this.props.managerAccess.accessEventDiscount == false
                      ? 'anchorDisabled'
                      : ''
                  }
                  onClick={() => this.navigateToUrlPage('/manager/discount')}
                >
                  <span>APPLY DISCOUNT </span>{' '}
                </a>{' '}
              </li>{' '}
              {/* <li
              className={
                this.props.managerAccess.accessInvitations == true ? 'active' : ''
              }
            >
              <a
                className={
                  this.props.managerAccess.accessEventSpeakers == false ||
                  this.props.managerAccess.accessEventMedia == false ||
                  this.props.managerAccess.accessEventAgenda == false ||
                  this.props.managerAccess.accessEventSponsors == false ||
                  this.props.managerAccess.accessInvitations == false
                    ? 'anchorDisabled'
                    : ''
                }
                onClick={() => this.navigateToUrlPage('/manager/invitationList')}
              >
                <span>INVITATIONS</span>
              </a>
            </li> */}{' '}
            </ul>{' '}
          </div>
        </div>
        {/* ====== bottomFix-stepsNavbar end ===== */}
      </div>
    );
  }
}

// function mapStateToProps(state) {
//   return { events: state.events };
// }

// export default StepNavBar;

function mapStateToProps(state) {
  return {
    events: state.events,
    userInfo: state.profileData,
    managerAccess: state.managerAccess
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      getAllEvents,
      publishEvent,
      actionDashboardData,
      actionEventNotificationToMembers
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(StepNavBar);
