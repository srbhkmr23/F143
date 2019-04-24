import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import { Prompt } from 'react-router';

import innovecsysApiService from '../../common/core/api';
import {
  getAllSpeakers,
  actionManagerAccess,
  showLoader,
  hideLoader
} from '../../common/action/index';

import {
  showSuccessToast,
  displayThumbImage
} from '../../common/core/common-functions';

import StepNavBar from '../common/stepNavBar';
import imgAddSpeaker from '../../img/add-speaker-icon.png';
import imgAdminUser from '../../img/admin-user.png';
import imgsearch from '../../img/search-icon.png';
import imgUserDefault from '../../img/user_default.jpg';
import AlphabeticalFilter from '../common/alphabeticalFilter';
import SearchFilter from '../common/searchFilter';
import Img from '../../common/core/img';
import Config from '../../common/core/config';
import Sprite from '../../img/sprite.svg';

class AllSpeakerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speakerList: [],
      selectedSpeakerList: [],
      filteredSpeakers: [],
      search: '',
      prompt: false
    };
    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.onSpeakerSelect = this.onSpeakerSelect.bind(this);
    this.addSpeakerToEvent = this.addSpeakerToEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterSpeaekers = this.filterSpeaekers.bind(this);
  }

  componentWillMount() {
    this.props.getAllSpeakers().then(res => {
      this.setState({
        speakerList: this.props.speakers.all
      });
    });
  }

  componentDidMount() {
    console.log('this.props.speakers.all', this.props.speakers.all);
    let speakerIds = [];
    if (this.props.speakers.speakerListActiveEvent != undefined) {
      speakerIds = this.props.speakers.speakerListActiveEvent.map(item => {
        return item.speakerId;
      });
    }

    this.setState({
      selectedSpeakerList: speakerIds,
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

  onSpeakerSelect(newSpeaker) {
    this.setPromptFlag();
    var flag = this.state.selectedSpeakerList.indexOf(newSpeaker.speakerId);
    let newList = [];
    newList = this.state.selectedSpeakerList;
    if (flag == -1) {
      newList.push(newSpeaker.speakerId);
    } else {
      newList.splice(
        this.state.selectedSpeakerList.indexOf(newSpeaker.speakerId),
        1
      );
    }

    this.setState({
      selectedSpeakerList: newList
    });
  }

  addSpeakerToEvent() {
    let eventId;
    let self = this;
    if (this.props.events.activeEvent != undefined)
      eventId = this.props.events.activeEvent.eventId;

    let speakerIds = this.state.selectedSpeakerList;
    if (eventId == undefined) {
      console.log('eventId not found');
      return;
    }

    let sendObject = {
      eventId: eventId,
      listOfId: speakerIds
    };
    // eventId
    this.props.showLoader();
    innovecsysApiService('setSpeaker', sendObject).then(response => {
      self.props.hideLoader();
      if (response != undefined) {
        if (response.status == 200) {
          console.log('response', response);
          showSuccessToast('Speaker added to event successfully');

          // make nevigation enable
          self.props.actionManagerAccess({
            accessEventMedia: true
          });
          self.setState(
            {
              prompt: false //Disable prompt and navigate to user
            },
            () => self.navigateToUrlPage('/manager/eventMedia')
          );

          // self.navigateToUrlPage('/manager/eventMedia');
        } else {
          // handleApiError(response);
        }
      }
    });
  }

  filterSpeaekers(filteredData) {
    this.setState({
      speakerList: filteredData
    });
    setTimeout(() => {
      this.setState({
        filteredSpeakers: this.state.speakerList,
        search: ''
      });
    }, 200);
  }

  handleChange(target) {
    let speakerInialList = [];
    if (target.value) {
      speakerInialList = this.state.filteredSpeakers.length
        ? this.state.filteredSpeakers
        : this.state.speakerList;
      this.setState({
        speakerList: speakerInialList.filter(
          speaker =>
            String(speaker.name)
              .toLowerCase()
              .indexOf(String(target.value).toLowerCase()) != -1
        )
      });
    } else {
      this.setState({
        speakerList: this.props.speakers.all
      });
    }
    setTimeout(() => {
      this.setState({
        filteredSpeakers: speakerInialList,
        search: target.value
      });
    }, 200);
    this.setState({
      search: target.value
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
              <div className="row mb-30">
                <div className="speakerSearch">
                  <div className="col-md-8">
                    <AlphabeticalFilter
                      filterHandler={this.filterSpeaekers}
                      filterFrom={this.props.speakers.all}
                      matchKey="name"
                    />
                  </div>
                  <div className="col-md-4">
                    <SearchFilter
                      handleChange={this.handleChange}
                      placeholder="Search Speakers"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-5">
                    <div
                      className="addSpeaker-col"
                      onClick={() => {
                        let self = this;
                        self.setState(
                          {
                            prompt: false //Disable prompt and navigate to user
                          },
                          () => self.navigateToUrlPage('/manager/addSpeaker')
                        );
                      }}
                    >
                      <img src={imgAddSpeaker} />
                      <label className="bold mt-10">Add New Speaker</label>
                    </div>
                  </div>
                </div>

                {this.state.speakerList.map((item, index) => {
                  const speakerImage = item.imageURL
                    ? displayThumbImage(
                        item.imageURL,
                        Config.S3AlbumForSpeaker,
                        Config.S3Thumbnail200
                      )
                    : imgUserDefault;
                  return (
                    <div
                      key={index}
                      className="col-md-4"
                      onClick={() => this.onSpeakerSelect(item)}
                    >
                      <div
                        // className="addSelect-speaker mb-5"
                        className={
                          this.state.selectedSpeakerList.indexOf(
                            item.speakerId
                          ) > -1
                            ? 'addSelect-speaker mb-5 addSelected-speaker'
                            : 'addSelect-speaker mb-5'
                        }
                      >
                        <div className="spImg">
                          <Img src={speakerImage} default={imgUserDefault} />
                        </div>
                        <div className="spInfoContainer">
                          <div className="spInfo">
                            <p className="cName text-ellipsis">{item.name} </p>
                            <p className="client-position text-ellipsis">
                              {item.position}
                            </p>
                            <p className="client-institute text-ellipsis">
                              {item.company}
                            </p>
                          </div>
                        </div>

                        <div
                          className={
                            this.state.selectedSpeakerList.indexOf(
                              item.speakerId
                            ) > -1
                              ? 'spChecked spShowCheck addSelected-speaker'
                              : 'spChecked'
                          }
                        >
                          {/* <i className="fa fa-check" aria-hidden="true" /> */}
                          <span className="ico-rightTick">
                            <svg>
                              <use xlinkHref={`${Sprite}#rightTickIco`} />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/*<!-- add showCheck className to show checkbox  replace className="spChecked" to className="spChecked spShowCheck" on active when you Add New Speaker -->*/}

                {/*
                <div className="col-md-4">
                  <div className="addSelected-speaker mb-5">
                    <div className="spImg">
                      <img src={imgAdminUser} />
                    </div>
                    <div className="spInfoContainer">
                      <div className="spInfo">
                        <h4 className="text-ellipsis mb-5">SCOTT DURUM </h4>
                        <p className="client-position text-ellipsis">
                          Chief, Section of Cytokines and Immunity
                        </p>
                        <p className="client-institute text-ellipsis">
                          NIH - National Cancer Center - Center
                        </p>
                      </div>
                    </div>

                    <div className="spChecked">
                      <i className="fa fa-check" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="addSelected-speaker mb-5">
                    <div className="spImg">
                      <img src={imgAdminUser} />
                    </div>
                    <div className="spInfoContainer">
                      <div className="spInfo">
                        <h4 className="text-ellipsis mb-5">SCOTT DURUM </h4>
                        <p className="client-position text-ellipsis">
                          Chief, Section of Cytokines and Immunity
                        </p>
                        <p className="client-institute text-ellipsis">
                          NIH - National Cancer Center - Center
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="addSelected-speaker mb-5">
                    <div className="spImg">
                      <img src={imgAdminUser} />
                    </div>
                    <div className="spInfoContainer">
                      <div className="spInfo">
                        <h4 className="text-ellipsis mb-5">SCOTT DURUM </h4>
                        <p className="client-position text-ellipsis">
                          Chief, Section of Cytokines and Immunity
                        </p>
                        <p className="client-institute text-ellipsis">
                          NIH - National Cancer Center - Center
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="addSelected-speaker mb-5">
                    <div className="spImg">
                      <img src={imgAdminUser} />
                    </div>
                    <div className="spInfoContainer">
                      <div className="spInfo">
                        <h4 className="text-ellipsis mb-5">SCOTT DURUM </h4>
                        <p className="client-position text-ellipsis">
                          Chief, Section of Cytokines and Immunity
                        </p>
                        <p className="client-institute text-ellipsis">
                          NIH - National Cancer Center - Center
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="addSelected-speaker mb-5">
                    <div className="spImg">
                      <img src={imgAdminUser} />
                    </div>
                    <div className="spInfoContainer">
                      <div className="spInfo">
                        <h4 className="text-ellipsis mb-5">SCOTT DURUM </h4>
                        <p className="client-position text-ellipsis">
                          Chief, Section of Cytokines and Immunity
                        </p>
                        <p className="client-institute text-ellipsis">
                          NIH - National Cancer Center - Center
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="addSelected-speaker mb-5">
                    <div className="spImg">
                      <img src={imgAdminUser} />
                    </div>
                    <div className="spInfoContainer">
                      <div className="spInfo">
                        <h4 className="text-ellipsis mb-5">SCOTT DURUM </h4>
                        <p className="client-position text-ellipsis">
                          Chief, Section of Cytokines and Immunity
                        </p>
                        <p className="client-institute text-ellipsis">
                          NIH - National Cancer Center - Center
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="addSelected-speaker mb-5">
                    <div className="spImg">
                      <img src={imgAdminUser} />
                    </div>
                    <div className="spInfoContainer">
                      <div className="spInfo">
                        <h4 className="text-ellipsis mb-5">SCOTT DURUM </h4>
                        <p className="client-position text-ellipsis">
                          Chief, Section of Cytokines and Immunity
                        </p>
                        <p className="client-institute text-ellipsis">
                          NIH - National Cancer Center - Center
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="addSelected-speaker mb-5">
                    <div className="spImg">
                      <img src={imgAdminUser} />
                    </div>
                    <div className="spInfoContainer">
                      <div className="spInfo">
                        <h4 className="text-ellipsis mb-5">SCOTT DURUM </h4>
                        <p className="client-position text-ellipsis">
                          Chief, Section of Cytokines and Immunity
                        </p>
                        <p className="client-institute text-ellipsis">
                          NIH - National Cancer Center - Center
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="addSelected-speaker mb-5">
                    <div className="spImg">
                      <img src={imgAdminUser} />
                    </div>
                    <div className="spInfoContainer">
                      <div className="spInfo">
                        <h4 className="text-ellipsis mb-5">SCOTT DURUM </h4>
                        <p className="client-position text-ellipsis">
                          Chief, Section of Cytokines and Immunity
                        </p>
                        <p className="client-institute text-ellipsis">
                          NIH - National Cancer Center - Center
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              */}
              </div>
            </div>
            {/*<!-- EVENT SPEAKER --> */}
            <div className="events-page-footer">
              {/* <a href="javascript:void(0)" className="btn btnSuccess mb-20">
                ADD
              </a> */}
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
                  onClick={() => this.addSpeakerToEvent()}
                >
                  <i className="fa fa-arrow-right" aria-hidden="true" />
                </a>
              </div>
            </div>
            {/*<!-- EVENT PAGE FOOTER -->*/}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    speakers: state.speakers,
    userInfo: state.profileData,
    events: state.events
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    { getAllSpeakers, actionManagerAccess, showLoader, hideLoader },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AllSpeakerList);
