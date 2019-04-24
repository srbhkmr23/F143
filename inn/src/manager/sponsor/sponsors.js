import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import bootbox from 'bootbox';

import {
  getAllSponsors,
  actionManagerAccess,
  publishEvent,
  showLoader,
  hideLoader
} from '../../common/action/index';
import {
  showSuccessToast,
  displayThumbImage
} from '../../common/core/common-functions';

import innovecsysApiService from '../../common/core/api';
import { actionDashboardData } from '../../common/action/index';
import StepNavBar from '../common/stepNavBar';
import imgAddSponsor from '../../img/add-sponsor.png';
import imgSponsor1 from '../../img/sponsor1.png';
import imgsearch from '../../img/search-icon.png';
import imgUserDefault from '../../img/user_default.jpg';
import AlphabeticalFilter from '../common/alphabeticalFilter';
import SearchFilter from '../common/searchFilter';
import AlertModal from '../../common/alert-box/alert-modal';
import Img from '../../common/core/img';
import Config from '../../common/core/config';
import Sprite from '../../img/sprite.svg';

class Sponsors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sponsorList: [],
      selectedSponsorList: [],
      filteredSponsors: [],
      search: '',
      showDeleteModal: false,
      clickedId: ''
    };
    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.onSponsorSelect = this.onSponsorSelect.bind(this);
    this.addSponsorToEvent = this.addSponsorToEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterSponsor = this.filterSponsor.bind(this);
    this.onDeleteSponsor = this.onDeleteSponsor.bind(this);
  }

  componentWillMount() {
    this.props.getAllSponsors().then(res => {
      this.setState({
        sponsorList: this.props.sponsors.all
      });
    });
  }

  componentDidMount() {
    console.log('this.state.sponsorList', this.state.sponsorList);
    console.log('this.props', this.props);

    /*let sponsorIds = [];
    if (this.props.sponsors.sponsorListActiveEvent != undefined) {
      sponsorIds = this.props.sponsors.sponsorListActiveEvent.map(item => {
        return item.sponsorId;
      });
    }

    this.setState({
      selectedSponsorList: sponsorIds
    });*/
  }

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

  onSponsorSelect(newSponsor) {
    var flag = this.state.selectedSponsorList.indexOf(newSponsor.sponsorId);
    let newList = [];
    newList = this.state.selectedSponsorList;
    if (flag == -1) {
      newList.push(newSponsor.sponsorId);
    } else {
      newList.splice(
        this.state.selectedSponsorList.indexOf(newSponsor.sponsorId),
        1
      );
    }

    this.setState({
      selectedSponsorList: newList
    });
  }

  addSponsorToEvent() {
    let eventId;
    let _this = this;
    if (this.props.events.activeEvent != undefined)
      eventId = this.props.events.activeEvent.eventId;

    let sponsorIds = this.state.selectedSponsorList;
    if (eventId == undefined) {
      console.log('eventId not found');
      return;
    }

    let sendObject = {
      listOfId: sponsorIds,
      eventId: eventId
    };
    // eventId
    this.props.showLoader();
    innovecsysApiService('setSponsor', sendObject).then(response => {
      console.log('setSponsor', response);
      if (response != undefined) {
        if (response.status == 200) {
          showSuccessToast('Sponsor added to event successfully');
          console.log('response', response);
          _this.props.hideLoader();
          const event = _this.props.events.activeEvent;

          if (event.published === false) {
            bootbox.confirm(
              "Do you need to publish event ? You can publish event later by click on 'PUBLISH' button at bottom left.",
              result => {
                if (result === true) {
                  const eventId = event.eventId;
                  _this.props.publishEvent(eventId).then(function(result) {
                    console.log('event published result', result);
                  });
                } else {
                  _this.navigateToUrlPage('/manager/sponsorList');
                }
              }
            );
          }
        } else {
          _this.props.hideLoader();
        }
      } else {
        _this.props.hideLoader();
      }
    });
  }

  filterSponsor(filteredData) {
    this.setState({
      sponsorList: filteredData
    });
    setTimeout(() => {
      this.setState({
        filteredSponsors: this.state.sponsorList,
        search: ''
      });
    }, 200);
  }

  handleChange(target) {
    let sponsorInialList = [];
    if (target.value) {
      sponsorInialList = this.state.filteredSponsors.length
        ? this.state.filteredSponsors
        : this.state.sponsorList;
      this.setState({
        sponsorList: sponsorInialList.filter(
          sponsor =>
            String(sponsor.sponserName)
              .toLowerCase()
              .indexOf(String(target.value).toLowerCase()) != -1
        )
      });
    } else {
      this.setState({
        sponsorList: this.props.sponsors.all
      });
    }
    setTimeout(() => {
      this.setState({
        filteredSponsors: sponsorInialList,
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

  onDeleteSponsor() {
    if (this.state.clickedId) {
      let sponsorId = this.state.clickedId;
      innovecsysApiService('deleteSponsor', { sponsorId }).then(result => {
        if (result.data && result.data.status && result.data.status === 200) {
          if (result.data.responseMessage) {
            const message = result.data.responseMessage;
            // showSuccessToast(message);
          }
          this.props.getAllSponsors().then(res => {
            this.setState({
              sponsorList: this.props.sponsors.all
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
                      filterHandler={this.filterSponsor}
                      filterFrom={this.props.sponsors.all}
                      matchKey="sponserName"
                    />
                  </div>
                  <div className="col-md-4">
                    <SearchFilter
                      handleChange={this.handleChange}
                      placeholder="Search Sponsors"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-3">
                  <div className="mb-5">
                    <div
                      className="addSponsor-col"
                      onClick={() =>
                        this.navigateToUrlPage('/manager/addNewSponsor')
                      }
                    >
                      <img src={imgAddSponsor} />
                      <label className="bold mt-10">Add New Sponsor</label>
                    </div>
                  </div>
                </div>

                {this.state.sponsorList.map((item, index) => {
                  const sponsorImage = item.imageURL
                    ? displayThumbImage(
                        item.imageURL,
                        Config.S3AlbumForSponsor,
                        Config.S3Thumbnail200
                      )
                    : imgUserDefault;
                  return (
                    <div key={index} className="col-sm-6 col-md-3">
                      <div className="cBox gal-eff">
                        <div className="overlay">
                          <ul className="social-contact action-tag text-center">
                            <li onClick={() => this.showAlert(item.sponsorId)}>
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
                                  '/manager/editSponsor/' + item.sponsorId
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
                          className={
                            this.state.selectedSponsorList.indexOf(
                              item.sponsorId
                            ) > -1
                              ? 'addSelect-speaker mb-5 addSelected-sponsor'
                              : 'addSelect-speaker mb-5 '
                          }
                        >
                          <div className="sponsorImg">
                            <Img
                              src={sponsorImage}
                              default={imgUserDefault}
                              className="img-responsive"
                            />
                            {/*<img
                              src={
                                sponsorImage ? item.imageURL : imgUserDefault
                              }
                              className="img-responsive"
                              alt=""
                            />*/}
                          </div>
                          <div className="spInfoContainer">
                            <div className="spInfo sponsorInfo">
                              <p className="cName bold text-ellipsis mb-5">
                                {item.sponserName}
                              </p>
                              <p className="client-position text-ellipsis">
                                {item.webSiteLink}
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

            <div className="events-page-footer" />
          </div>
        </div>
        <AlertModal
          confirmedMe={this.onDeleteSponsor}
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
  console.log('state', state);
  return {
    sponsors: state.sponsors,
    userInfo: state.profileData,
    events: state.events
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      getAllSponsors,
      actionManagerAccess,
      publishEvent,
      showLoader,
      hideLoader,
      actionDashboardData
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Sponsors);
