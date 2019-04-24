import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import { Prompt } from 'react-router';

import innovecsysApiService from '../../common/core/api';

import {
  getAllEvents,
  actionSetAllSpeakersActiveEvent,
  actionGetAllSpeakersByEvent,
  showLoader,
  hideLoader
} from '../../common/action/index';

import {
  showSuccessToast,
  displayThumbImage
} from '../../common/core/common-functions';

import StepNavBar from '../common/stepNavBar';
import imgSpeaker from '../../img/team1.jpg';
import imgAddSpeaker from '../../img/added_speakers-icon.png';
import imgUserDefault from '../../img/user_default.jpg';
import Img from '../../common/core/img';
import Config from '../../common/core/config';
import Sprite from '../../img/sprite.svg';

class SpeakerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speakerList: [],
      prompt: false
    };
    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.onDeleteSpeaker = this.onDeleteSpeaker.bind(this);
  }

  componentWillMount() {
    let allSpeakerList = [];
    let eventId;

    console.log('component will mount', this.props.events.activeEvent);
    if (this.props.events.activeEvent != undefined)
      eventId = this.props.events.activeEvent.eventId;

    if (eventId == undefined) {
      console.log('eventId not found');
      this.navigateToUrlPage('/manager/eventList');
      return;
    }

    this.props.actionGetAllSpeakersByEvent(eventId).then(res => {
      console.log('get Speaker list', res);
      if (res.payload == undefined) return;

      allSpeakerList = res.payload.data.resourceData || [];

      if (allSpeakerList.length == 0) {
        console.log('no speaker found');
        this.props.actionSetAllSpeakersActiveEvent(allSpeakerList);
        this.navigateToUrlPage('/manager/allSpeakerList');
      }

      this.props.actionSetAllSpeakersActiveEvent(allSpeakerList);
      this.setState({
        speakerList: allSpeakerList
      });
    });
  }

  componentDidMount() {
    console.log('this.props.events.all', this.props.events.all);
    this.setState({
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

  onDeleteSpeaker(speaker) {
    this.setPromptFlag();
    let self = this;
    // getting all speaker ids
    let allSpeakerIds = [];
    allSpeakerIds = this.state.speakerList.map(speakerObj => {
      return speakerObj.speakerId;
    });

    // remove selected speaker id
    allSpeakerIds = allSpeakerIds.filter(speakerId => {
      return speakerId != speaker.speakerId;
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
      listOfId: allSpeakerIds
    };
    // Api call
    this.props.showLoader();
    innovecsysApiService('setSpeaker', sendObject).then(response => {
      if (response != undefined) {
        if (response.status === 200) {
          showSuccessToast('Speaker deleted to event successfully');

          // Speaker deleted to event successfully

          console.log('response', response);

          // set new speaker list in state
          let newSpeakerList = [];
          newSpeakerList = self.state.speakerList.filter(speakerObj => {
            return speaker.speakerId != speakerObj.speakerId;
          });

          // set speaker list for active event in store
          self.props.actionSetAllSpeakersActiveEvent(newSpeakerList);
          self.setState({
            speakerList: newSpeakerList
          });
        } else {
          // handleApiError(response);
        }
      }
      self.props.hideLoader();
    });
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
            tabName="eventSpeakers"
            isEditEvent={this.props.events.isEditEvent}
          />
          <div className="events-page">
            <div className="event-speaker">
              <div className="row" ref="container">
                <div className="col-md-4 col-sm-6 col-lg-20 pdLR-5">
                  <div className="fixed-card">
                    {/* <div className="spBox u-box gal-eff">
                      <div className="spImg u-img ">
                        <img src={imgUserDefault} alt="" />
                        <div className="overlay">
                          <ul className="social-contact action-tag text-center">
                            <li>
                              <a>
                                <span className="ico-delete">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#deleteIco`} />
                                  </svg>
                                </span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="spInfo u-details light-bg h-150">
                        <div className="spDescription">
                          <p className="name all-caps m0">
                            <b>hhhhh</b>
                          </p>
                          <span className="degi text-dark">ppppp</span>
                          <p className="compnay text-dark">cccc</p>
                          <div className="rating">
                            <i className="fa fa-star on" />
                          </div>
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
                    </div> */}

                    <div className="spBox u-box gal-eff">
                      <div className="spImg u-img">
                        <Img src={imgUserDefault} default={imgUserDefault} />
                        <div className="overlay">
                          <ul className="social-contact action-tag text-center">
                            <li>
                              <a>
                                <span className="ico-delete">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#deleteIco`} />
                                  </svg>
                                </span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="spInfo u-details">
                        <div className="spDescription">
                          <p className="name all-caps">
                            <b>ERIKA BROWN</b>
                          </p>
                          <span className="position text-dark">
                            President & Chief Executive Officer
                          </span>
                          <p className="compnay text-dark">
                            PalTown Development Foundation
                          </p>
                        </div>
                        <ul className="addEv-Details">
                          <li>
                            Awards <span className="pull-right">3</span>
                          </li>
                          <li>
                            Gaint <span className="pull-right">23</span>
                          </li>
                          <li>
                            Publications <span className="pull-right">117</span>
                          </li>
                          <li>
                            Patents <span className="pull-right">23</span>
                          </li>
                        </ul>
                        <div className="viewDetails">
                          <a href="javascript:void(0)" className="btn-arrow">
                            view details
                          </a>
                        </div>
                      </div>
                    </div>

                    <div
                      ref="addNewSpeaker"
                      className="addNewSpeaker content-center gal-eff"
                      onClick={() =>
                        this.navigateToUrlPage('/manager/allSpeakerList')
                      }
                    >
                      <div className="iconAddBox">
                        <img src={imgAddSpeaker} alt="" />
                      </div>
                      <p className="addSpeakerText mt-10">
                        Add <br /> Speaker
                      </p>
                    </div>
                  </div>
                </div>

                {this.state.speakerList.map((item, index) => {
                  const speakerImage = item.imageURL
                    ? displayThumbImage(
                        item.imageURL,
                        Config.S3AlbumForSpeaker,
                        Config.S3Thumbnail373
                      )
                    : imgUserDefault;
                  return (
                    // <div
                    //   key={index}
                    //   className="col-md-4 col-sm-6 col-lg-20 pdLR-5"
                    // >
                    //   <div className="spBox u-box gal-eff">
                    //     <div className="spImg u-img">
                    //       <Img src={speakerImage} default={imgUserDefault} />
                    //       {/*<img
                    //         src={item.imageURL ? item.imageURL : imgUserDefault}
                    //         alt=""
                    //       />*/}
                    //       <div className="overlay">
                    //         <ul className="social-contact action-tag text-center">
                    //           <li>
                    //             <a onClick={() => this.onDeleteSpeaker(item)}>
                    //               <span className="ico-delete">
                    //                 <svg>
                    //                   <use xlinkHref={`${Sprite}#deleteIco`} />
                    //                 </svg>
                    //               </span>
                    //             </a>
                    //           </li>
                    //           {/* <li>
                    //             <a onClick={() => this.onDeleteSpeaker(item)}>
                    //               <span className="ico-pen">
                    //                 <svg>
                    //                   <use xlinkHref={`${Sprite}#penIco`} />
                    //                 </svg>
                    //               </span>
                    //             </a>
                    //           </li> */}
                    //         </ul>
                    //       </div>
                    //     </div>
                    //     <div className="spInfo u-details light-bg h-150">
                    //       <div className="spDescription">
                    //         <p className="name all-caps m0">
                    //           <b>{item.name}</b>
                    //         </p>
                    //         <span className="degi text-dark">
                    //           {item.position}
                    //         </span>
                    //         <p className="compnay text-dark">{item.company}</p>
                    //         <div className="rating">
                    //           {/*
                    //           {Array(item.rating)
                    //             .fill(1)
                    //             .map((el, starindex) => {
                    //               return (
                    //                 <i
                    //                   key={starindex}
                    //                   className="fa fa-star on"
                    //                 />
                    //               );
                    //             })}
                    //         }

                    //       */}

                    //           <i className="fa fa-star on" />
                    //         </div>
                    //       </div>
                    //       <a className="btn-arrow">
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

                    <div
                      key={index}
                      className="col-md-4 col-sm-6 col-lg-20 pdLR-5"
                    >
                      <div className="spBox u-box gal-eff">
                        <div className="spImg u-img">
                          <Img src={speakerImage} default={imgUserDefault} />
                          <div className="overlay">
                            <ul className="social-contact action-tag text-center">
                              <li>
                                <a onClick={() => this.onDeleteSpeaker(item)}>
                                  <span className="ico-delete">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#deleteIco`} />
                                    </svg>
                                  </span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="spInfo u-details">
                          <div className="spDescription">
                            <p className="name all-caps m0">
                              <b>{item.name}</b>
                            </p>
                            <span className="position text-dark">
                              {item.position}
                            </span>
                            <p className="compnay text-dark">{item.company}</p>
                          </div>
                          <ul className="addEv-Details">
                            <li>
                              Awards{' '}
                              <span className="pull-right">
                                {item.noOfAwards}
                              </span>
                            </li>
                            <li>
                              Grants{' '}
                              <span className="pull-right">
                                {item.noOfGrants}
                              </span>
                            </li>
                            <li>
                              Publications{' '}
                              <span className="pull-right">
                                {item.noOfPublications}
                              </span>
                            </li>
                            <li>
                              Patents{' '}
                              <span className="pull-right">
                                {item.noOfPatents}
                              </span>
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
                })}
              </div>
            </div>

            <div className="events-page-footer">
              {/* <a className="btn btnSuccess mb-20">ADD</a> */}

              <div className="btnPageNav">
                <a
                  className="btnTag mb-20"
                  onClick={() => {
                    this.props.events.isEditEvent === false
                      ? this.navigateToUrlPage('/manager/addEvent')
                      : this.navigateToUrlPage('/manager/editEvent');
                  }}
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
                      () => self.navigateToUrlPage('/manager/eventMedia')
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
  return {
    events: state.events,
    userInfo: state.profileData,
    speakers: state.speakers
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      getAllEvents,
      actionSetAllSpeakersActiveEvent,
      actionGetAllSpeakersByEvent,
      showLoader,
      hideLoader
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SpeakerList);
