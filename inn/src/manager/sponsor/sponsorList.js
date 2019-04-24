import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import innovecsysApiService from '../../common/core/api';
import bootbox from 'bootbox';
import { Prompt } from 'react-router';

import {
  getAllEvents,
  actionSetAllSponsorsActiveEvent,
  actionGetAllSponsorsByEvent,
  publishEvent,
  showLoader,
  hideLoader
} from '../../common/action/index';
import {
  showSuccessToast,
  displayThumbImage
} from '../../common/core/common-functions';

import StepNavBar from '../common/stepNavBar';
import imgSponsor1 from '../../img/sponsor1.png';
import imgSponsor2 from '../../img/sponsor2.png';
import imgSponsor3 from '../../img/sponsor3.png';
import imgAddSponsor from '../../img/add-sponsor.png';
import imgUserDefault from '../../img/user_default.jpg';
import Img from '../../common/core/img';
import Config from '../../common/core/config';
import Sprite from '../../img/sprite.svg';

class SponsorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sponsorList: [],
      prompt: false
    };
    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.onDeleteSponsor = this.onDeleteSponsor.bind(this);
    this.handleLastStepOfNavigation = this.handleLastStepOfNavigation.bind(
      this
    );
  }

  componentWillMount() {
    let allSponsorsList = [];
    let eventId;

    if (this.props.events.activeEvent != undefined)
      eventId = this.props.events.activeEvent.eventId;

    if (eventId == undefined) {
      console.log('eventId not found');
      this.navigateToUrlPage('/manager/eventList');
      return;
    }

    this.props.actionGetAllSponsorsByEvent(eventId).then(res => {
      if (res.payload == undefined) return;
      allSponsorsList = res.payload.data.resourceData || [];
      if (allSponsorsList.length == 0) {
        console.log('no sponsor found');
        this.props.actionSetAllSponsorsActiveEvent(allSponsorsList);
        this.navigateToUrlPage('/manager/allSponsorList');
      }

      // set reducer for all sponsor of active event
      this.props.actionSetAllSponsorsActiveEvent(allSponsorsList);
      this.setState({
        sponsorList: allSponsorsList || []
      });
    });

    // this.props.getAllEvents(this.props.userInfo.id).then(res => {
    //   let activeEvent = [];
    //   activeEvent = this.props.events.all.filter(obj => {
    //     return obj.eventId == eventId;
    //   });
    //   if (activeEvent.length == 1) {
    //     if (activeEvent[0].hasOwnProperty('sponsorsList'))
    //       allSponsorsList = activeEvent[0].sponsorsList;
    //   }

    //   if (allSponsorsList.length == 0) {
    //     console.log('no sponsor found');
    //     this.props.actionSetAllSponsorsActiveEvent(allSponsorsList);
    //     this.navigateToUrlPage('/manager/allSponsorList');
    //   }

    //   // set reucer for all sponsor of active event
    //   this.props.actionSetAllSponsorsActiveEvent(allSponsorsList);
    //   this.setState({
    //     sponsorList: allSponsorsList || []
    //   });
    // });
  }

  componentDidMount() {
    console.log('this.props.events.all', this.props.events.all);
    this.setState({
      prompt: false
    });
  }

  setPromptFlag() {
    this.setState({
      prompt: false
    });
  }

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

  onDeleteSponsor(sponsor) {
    this.setPromptFlag();
    // getting all speaker ids
    let allSponsorIds = [];
    let self = this;
    allSponsorIds = this.state.sponsorList.map(sponsorObj => {
      return sponsorObj.sponsorId;
    });

    // remove selected speaker id
    allSponsorIds = allSponsorIds.filter(sponsorId => {
      return sponsorId != sponsor.sponsorId;
    });

    // getting active event id
    let eventId;
    if (this.props.events.activeEvent != undefined)
      eventId = this.props.events.activeEvent.eventId;

    if (eventId == undefined) {
      console.log('eventId not found');
      return;
    }

    // create api data object

    let sendObject = {
      eventId: eventId,
      listOfId: allSponsorIds
    };

    console.log('sendObject', sendObject);
    // Api call
    this.props.showLoader();
    innovecsysApiService('setSponsor', sendObject).then(response => {
      if (response != undefined) {
        if (response.status == 200) {
          showSuccessToast('Sponsor deleted to event successfully');
          let newSponsorList = [];
          newSponsorList = self.state.sponsorList.filter(sponsorObj => {
            return sponsor.sponsorId != sponsorObj.sponsorId;
          });

          // set reducer for all sponsor of active event
          self.props.actionSetAllSponsorsActiveEvent(newSponsorList);

          self.setState({
            sponsorList: newSponsorList
          });
        } else {
          // handleApiError(response);
        }
      }
      self.props.hideLoader();
    });
  }

  handleLastStepOfNavigation() {
    let _this = this;
    if (this.props.events.activeEvent != undefined) {
      const event = this.props.events.activeEvent;
      if (event.published === true) {
        bootbox.confirm('Do you need to go on home of Manage Event', result => {
          if (result === true) {
            _this.navigateToUrlPage('/manager/eventList');
          }
        });
      } else {
        bootbox.confirm(
          "Do you need to publish event ? You can publish event later by click on 'PUBLISH' button at bottom left.",
          result => {
            if (result === true) {
              const eventId = event.eventId;
              this.props.publishEvent(eventId).then(function(result) {
                console.log('event published result', result);
              });
            }
          }
        );
      }
    } else {
      console.log('event data not found');
    }
  }

  render() {
    return (
      <div className="main-container">
        <Prompt
          when={this.state.prompt}
          message="You may lost any unsaved data, click cancel to stay on the same screen and click on next button  to save the changes."
        />
        <div className="inner-page">
          <StepNavBar
            navigateToUrlPage={this.navigateToUrlPage}
            tabName="eventSponsers"
            isEditEvent={this.props.events.isEditEvent}
          />
          <div className="events-page">
            <div className="event-sponsor form-card">
              {/*<!-- EVENT DIV -->*/}
              <div className="row">
                <div className="col-md-12">
                  <div className="sponsor-sec">
                    <div
                      className="sponsor-col addSponsor-col"
                      onClick={() =>
                        this.navigateToUrlPage('/manager/allSponsorList')
                      }
                    >
                      <div>
                        <img src={imgAddSponsor} alt="" />
                      </div>
                      <p className="add-sponsor-text">Add New Sponsor</p>
                    </div>

                    {this.state.sponsorList.map((item, index) => {
                      const sponsorImage = item.imageURL
                        ? displayThumbImage(
                            item.imageURL,
                            Config.S3AlbumForSponsor,
                            Config.S3Thumbnail373
                          )
                        : imgUserDefault;
                      return (
                        <div key={index} className="sponsor-col gal-eff">
                          <div className="u-img sponsor-img">
                            <Img
                              src={sponsorImage}
                              default={imgUserDefault}
                              className="img-responsive"
                            />
                            {/*<img
                              src={
                                item.imageURL ? item.imageURL : imgUserDefault
                              }
                              alt=""
                            />*/}
                            <div className="overlay">
                              <ul className="social-contact action-tag text-center">
                                <li>
                                  <a
                                    href="javascript:void(0)"
                                    onClick={() => this.onDeleteSponsor(item)}
                                  >
                                    {/* <i className="fa fa-trash" /> */}
                                    <span className="ico-delete">
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#deleteIco`}
                                        />
                                      </svg>
                                    </span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="u-details light-bg sponsor-text mh-80">
                            <div className="sponsor-details">
                              <p className="name all-caps m0 text-ellipsis">
                                <b>{item.sponserName}</b>
                              </p>
                              <p className="degi text-dark sponsor-wedlink text-ellipsis">
                                {item.webSiteLink}
                              </p>
                            </div>
                            <a className="btn-arrow">
                              READ MORE
                              <span className="ico-r-arrow">
                                <svg>
                                  <use xlinkHref={`${Sprite}#r-arrowIco`} />
                                </svg>
                              </span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/*<!-- ROW END -->*/}
            </div>
            {/*<!-- EVENT DIV -->*/}
            <div className="events-page-footer">
              <div className="btnPageNav">
                <a
                  className="btnTag mb-20"
                  onClick={() =>
                    this.navigateToUrlPage('/manager/agendaTimeLine')
                  }
                >
                  <i className="fa fa-arrow-left" aria-hidden="true" />
                </a>
                <a
                  className="btnTag mb-20"
                  onClick={() => {
                    let self = this;
                    self.setState(
                      {
                        prompt: false //Disable prompt and navigate to user
                      },
                      () => self.navigateToUrlPage('/manager/discount')
                    );
                  }}
                >
                  <i className="fa fa-arrow-right" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { events: state.events, userInfo: state.profileData };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      getAllEvents,
      actionSetAllSponsorsActiveEvent,
      actionGetAllSponsorsByEvent,
      publishEvent,
      showLoader,
      hideLoader
    },
    dispatch
  );
};
// export default SponsorList;
export default connect(mapStateToProps, mapDispatchToProps)(SponsorList);
