import React, { Component } from 'react';
// import connect from 'redux';
// import mapStateToProps from 'react-redux';

import { getAllEvents, publishEvent } from '../../common/action/index';
import { showWarningToast } from '../../common/core/common-functions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import bootbox from 'bootbox';
//import AlertModal from '../../common/alert-box/alert-modal';
// let $ = require('jquery');

class StepNavBar extends Component {
  constructor(props) {
    super(props);
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
        document.getElementsByClassName('events-page')[0].offsetWidth + 313;
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
      bootbox.confirm('You are going to publish this event', result => {
        if (result === true) {
          this.props.publishEvent(eventId);
        }
      });
    }
  }

  render() {
    return (
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
              this.props.managerAccess.accessEventSponsors == false
                ? 'btn btnInfo width-100px ripple anchorDisabled disabled-publish-btncolor'
                : 'btn btnInfo width-100px ripple'
            }
            onClick={() => this.publishEvent()}
          >
            <i className="fa fa-bullhorn" />{' '}
            {this.props.events.activeEvent &&
            this.props.events.activeEvent.published
              ? ' Published '
              : ' PUBLISH '}{' '}
          </a>
        </div>
        {/* <AlertModal
          confirmedMe={this.publishEvent}
          eventType="publish"
          alertMessage="Are you sure you want to publish?"
        /> */}
        <div className="footerline" id="footerline">
          {' '}
        </div>
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
      publishEvent
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(StepNavBar);
