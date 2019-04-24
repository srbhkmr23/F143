import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';

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
import { actionDashboardData } from '../../common/action/index';
import StepNavBar from '../common/stepNavBar';
import imgAddSpeaker from '../../img/add-speaker-icon.png';
import imgAdminUser from '../../img/admin-user.png';
import imgsearch from '../../img/search-icon.png';
import imgUserDefault from '../../img/user_default.jpg';
import AlphabeticalFilter from '../common/alphabeticalFilter';
import SearchFilter from '../common/searchFilter';
import AlertModal from '../../common/alert-box/alert-modal';
import Img from '../../common/core/img';
import Config from '../../common/core/config';
import Sprite from '../../img/sprite.svg';

class Speakers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speakerList: [],
      selectedSpeakerList: [],
      filteredSpeakers: [],
      search: '',
      showDeleteModal: false,
      clickedId: ''
    };
    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.onSpeakerSelect = this.onSpeakerSelect.bind(this);
    this.addSpeakerToEvent = this.addSpeakerToEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterSpeaekers = this.filterSpeaekers.bind(this);
    this.onDeleteSpeaker = this.onDeleteSpeaker.bind(this);
  }

  componentWillMount() {
    // console.log(this.props.events.activeEvent.eventId);
    //console.log(this.props);
    //console.log(this.props.parentProps);
    this.props.getAllSpeakers().then(res => {
      this.setState({
        speakerList: this.props.speakers.all
      });
    });
  }

  componentDidMount() {
    console.log('this.props.speakers.all', this.props.speakers.all);
    /*let speakerIds = [];
    if (this.props.speakers.speakerListActiveEvent != undefined) {
      speakerIds = this.props.speakers.speakerListActiveEvent.map(item => {
        return item.speakerId;
      });
    }

    this.setState({
      selectedSpeakerList: speakerIds
    });*/
  }

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

  onSpeakerSelect(newSpeaker) {
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
      if (response != undefined) {
        if (response.status == 200) {
          console.log('response', response);
          showSuccessToast('Speaker added to event successfully');

          // make nevigation enable
          self.props.actionManagerAccess({
            accessEventMedia: true
          });

          self.navigateToUrlPage('/manager/eventMedia');
        } else {
          // handleApiError(response);
        }
      }
      self.props.hideLoader();
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

  showAlert(id) {
    this.setState({
      clickedId: id,
      showDeleteModal: true
    });
  }

  hideDeleteModal = () => {
    this.setState({
      showDeleteModal: false
    });
  };

  onDeleteSpeaker() {
    if (this.state.clickedId) {
      let speakerId = this.state.clickedId;
      innovecsysApiService('deleteSpeader', { speakerId }).then(result => {
        if (result.data && result.data.status && result.data.status === 200) {
          if (result.data.responseMessage) {
            const message = result.data.responseMessage;
            // showSuccessToast(message);
          }
          this.props.getAllSpeakers().then(res => {
            this.setState({
              speakerList: this.props.speakers.all
            });
          });
          this.props.actionDashboardData();
        }
      });
    }
  }

  render() {
    return (
      <div className="main-container">
        <div className="innerfull-page inner-saperate-page">
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
                <div className="col-md-3">
                  <div className="mb-5">
                    <div
                      className="addSpeaker-col"
                      onClick={() =>
                        this.navigateToUrlPage('/manager/addNewSpeaker')
                      }
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
                      className="col-sm-6 col-md-3 addspeaker_overlay"
                    >
                      <div className="cBox gal-eff">
                        <div className="overlay">
                          <ul className="social-contact action-tag text-center">
                            <li onClick={() => this.showAlert(item.speakerId)}>
                              <a href="javascript:void(0)" className="ml-2">
                                <span className="ico-delete">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#deleteIco`} />
                                  </svg>
                                </span>
                              </a>
                            </li>
                            <li
                              onClick={() =>
                                this.navigateToUrlPage(
                                  '/manager/editSpeaker/' + item.speakerId
                                )
                              }
                            >
                              <a href="javascript:void(0)" className="ml-2">
                                <span className="ico-pen">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#penIco`} />
                                  </svg>
                                </span>
                              </a>
                            </li>
                          </ul>
                        </div>
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
                            {/*<img
                              src={
                                item.imageURL ? item.imageURL : imgUserDefault
                              }
                              alt=""
                            />*/}
                            <Img src={speakerImage} default={imgUserDefault} />
                          </div>
                          <div className="spInfoContainer">
                            <div className="spInfo">
                              <p className="cName text-ellipsis">
                                {item.name}{' '}
                              </p>
                              <p className="client-position text-ellipsis">
                                {item.position}
                              </p>
                              <p className="client-institute text-ellipsis">
                                {item.company}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/*<!-- EVENT SPEAKER --> */}
            <div className="events-page-footer" />
            {/*<!-- EVENT PAGE FOOTER -->*/}
          </div>
        </div>
        <AlertModal
          confirmedMe={this.onDeleteSpeaker}
          eventType="delete"
          customClass="deleteIconDiv"
          alertMessage="Are you sure you want to delete?"
          showDeleteModal={this.state.showDeleteModal}
          hideDeleteModal={this.hideDeleteModal}
        />
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
    {
      getAllSpeakers,
      actionManagerAccess,
      showLoader,
      hideLoader,
      actionDashboardData
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Speakers);
