import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';
import ReactDOM from 'react-dom';
import bootbox from 'bootbox';
import $ from 'jquery';

import imgAdminUser from '../../img/admin-user.png';

import StepNavBar from '../common/stepNavBar';
import {
  actionGetSpeakersForAgenda,
  actionGetAllAgendaOfEvent,
  actionManagerAccess
} from '../../common/action/index';
import innovecsysApiService from '../../common/core/api';
import { getMomentObjFromIsoDate } from '../../common/core/common-functions';
import AddNewAgenda from './addNewAgenda';
import AgendaHeader from './agendaHeader';

class AgendaTimeLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeFormat: 'YYYY-MM-DD[T]HH:mm:ss.SSS',
      showSpeakerDetailsHtml: false,
      eventId: '',
      newAgendaTitle: '',
      newAgendaSpeakerId: '',
      newAgendaTopic: '',
      newAgendaStartTime: '',
      newAgendaEndTime: '',
      newAgendaStartTimeOpenFlag: '',
      newAgendaEndTimeOpenFlag: '',
      newAgendaSpeakerStartTime: '',
      newAgendaSpeakerEndTime: '',
      newAgendaSpeakerStartTimeOpenFlag: '',
      newAgendaSpeakerEndTimeOpenFlag: '',
      activeTabDate: '',
      mainAgendaList: [],

      addNewAgendaArray: [
        {
          node: 1,
          agendaTitle: '',
          startTimestamp: '',
          endTimestamp: '',
          eventId: '',
          save: false,
          eventAgendaDetailsRequest: [
            {
              child: 1,
              speakerId: '',
              description: '',
              startTimestamp: '',
              endTimestamp: ''
            }
          ]
        }
        // ,
        // {
        //   node: 2,
        //   agendaTitle: '',
        //   startTimestamp: '',
        //   endTimestamp: '',
        //   eventId: 'string',
        //   eventAgendaDetailsRequest: [
        //     {
        //       child: 1,
        //       speakerId: '',
        //       description: '',
        //       startTimestamp: '',
        //       endTimestamp: ''
        //     }
        //   ]
        // }
      ]
    };
    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.showHideAgendaSpeakerDeatils = this.showHideAgendaSpeakerDeatils.bind(
      this
    );
    this.onNewAgendaFieldChange = this.onNewAgendaFieldChange.bind(this);
    this.onSaveNewAgedaDetails = this.onSaveNewAgedaDetails.bind(this);
    this.onDeleteAgendaDetails = this.onDeleteAgendaDetails.bind(this);
    this.addMoreAgenda = this.addMoreAgenda.bind(this);
    this.updateAgendaArray = this.updateAgendaArray.bind(this);
  }

  componentWillMount() {
    console.log(this.props);
    const eventId = this.props.events.editEvent.eventId;
    this.setState({ eventId });
    this.props.actionGetSpeakersForAgenda(eventId);
    this.props.actionGetAllAgendaOfEvent(eventId);
  }

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

  showHideAgendaSpeakerDeatils() {
    return this.state.showSpeakerDetailsHtml == true
      ? 'agendaSpeakerDetailsDiv'
      : 'agendaSpeakerDetailsDiv hide';
  }
  // <div className="agendaSpeakerDetails">
  onNewAgendaFieldChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  /**
   * This function will add one more object in 'addNewAgendaArray' to show
   */
  addMoreAgenda = () => {
    // addNewAgendaArray

    const arrayLength = this.state.addNewAgendaArray.length + 1;
    const addObject = {
      node: arrayLength,
      agendaTitle: '',
      startTimestamp: '',
      endTimestamp: '',
      eventId: 'string',
      eventAgendaDetailsRequest: [
        {
          child: 1,
          speakerId: '',
          description: '',
          startTimestamp: '',
          endTimestamp: ''
        }
      ]
    };

    this.setState({
      addNewAgendaArray: [...this.state.addNewAgendaArray, addObject]
    });
    console.log('after add speaker list', this.state.addNewAgendaArray);
  };

  /**
   * Update agenda to array to show in details view
   */
  updateAgendaArray = (node, child, speakerList, agenda) => {
    console.log(node, child, speakerList, agenda);

    let _this = this,
      requestList = [],
      _speakerList = [],
      eventId = this.props.events.editEvent.eventId;
    //Agenda Information
    const agendaTitle = agenda.agendaTitle;
    const startTimestamp = agenda.startTimestamp
      .utc()
      .format(this.state.timeFormat);
    const endTimestamp = agenda.endTimestamp
      .utc()
      .format(this.state.timeFormat);

    //Speaker List Preparation

    for (let index = 0; index < speakerList.length; index++) {
      const element = speakerList[index];
      const speakerId = element.speakerId;
      const description = element.description;
      const startTimestamp = moment(element.startTimestamp)
        .utc()
        .format(this.state.timeFormat);
      const endTimestamp = moment(element.endTimestamp)
        .utc()
        .format(this.state.timeFormat);

      _speakerList.push({
        speakerId,
        description,
        startTimestamp,
        endTimestamp
      });
    }
    //End Speaker List Preparation

    let agendaObject = {
      agendaTitle,
      startTimestamp,
      endTimestamp,
      eventAgendaDetailsRequest: _speakerList,
      eventId
    };
    requestList.push(agendaObject);

    console.log('requestList', requestList);

    innovecsysApiService('addEventAgenda', { requestList, eventId }).then(
      result => {
        console.log('agenda add result', result);
        _this.props.actionGetAllAgendaOfEvent(eventId);
      }
    );
  };

  onSaveNewAgedaDetails() {
    let _this = this,
      requestList = [],
      eventId = this.props.events.editEvent.eventId;
    let agendaObject = {
      agendaTitle: this.state.newAgendaTitle,
      startTimestamp: '2018-01-27T15:19:36.440',
      endTimestamp: '2018-01-28T15:19:36.440',
      eventAgendaDetailsRequest: [
        {
          speakerId: this.state.newAgendaSpeakerId,
          description: this.state.newAgendaTopic,
          startTimestamp: '2018-01-27T12:00:36.440',
          endTimestamp: '2018-01-27T12:30:36.440'
        }
      ],
      eventId
    };
    requestList.push(agendaObject);

    console.log(agendaObject);
    let agendaList = [];
    agendaList = this.state.mainAgendaList;
    agendaList.push(agendaObject);
    this.setState(
      {
        mainAgendaList: agendaList
      },
      () => {
        this.resetNewAgendaFields();
      }
    );
    // innovecsysApiService('addEventAgenda', { requestList, eventId }).then(
    //   result => {
    //     console.log('agenda add result', result);
    //     _this.props.actionGetAllAgendaOfEvent(eventId);
    //   }
    // );
  }

  resetNewAgendaFields() {
    this.setState(
      {
        newAgendaTitle: '',
        newAgendaSpeakerId: '',
        newAgendaTopic: '',
        newAgendaStartTime: '',
        newAgendaEndTime: '',
        showSpeakerDetailsHtml: false
      },
      () => {
        document.getElementById('singleRow').classList.add('singleRow');
      }
    );
  }

  onDeleteAgendaDetails(eventId, agendaId) {
    // const eventId = this.state.eventId;
    bootbox.confirm('Are you sure want to delete agenda', result => {
      if (result === true) {
        console.log('will delete even and agenda id', eventId, agendaId);
        // innovecsysApiService('deleteEvent', { userId, eventId }).then(
        //   result => {
        //     if (
        //       result.data &&
        //       result.data.status &&
        //       result.data.status === 200
        //     ) {
        //       if (result.data.responseMessage) {
        //         const message = result.data.responseMessage;
        //         showSuccessToast(message);
        //       }
        //       //Call event list after delete success
        //       this.props.getAllEvents(this.props.userInfo.id);
        //     }
        //   }
        // );
      }
    });
  }

  renderSpeakerDetails = agendaListItem => {
    return agendaListItem.agendaDetailsResponse.map(speakerDetail => {
      const startTime = getMomentObjFromIsoDate(
        speakerDetail.startTimestamp
      ).local();
      const endTime = getMomentObjFromIsoDate(
        speakerDetail.endTimestamp
      ).local();
      const speakerName = speakerDetail.speakerResponse.name;
      const speakerDescription = speakerDetail.description;
      const speakerPosition = speakerDetail.speakerResponse.position;
      const speakerCompany = speakerDetail.speakerResponse.company;

      return (
        <div className="row">
          <div className="col-md-12">
            <div className="client-profile-div">
              <span className="agendaUserIcon">
                <img src={imgAdminUser} alt="" />
              </span>
              <div className="">
                <p className="yellow">{speakerDescription}</p>
                <h4 className="text-left">
                  <span className="client-name">{speakerName}</span>
                </h4>
                <p className="client-position">{speakerPosition}</p>
                <p className="client-institute">{speakerCompany}</p>
              </div>
              <div className="actionBtn">
                <p className="client-time">
                  {startTime.format('hh:mm')}{' '}
                  <small>{startTime.format('A')} </small> -{' '}
                  {endTime.format('hh:mm')}{' '}
                  <small>{endTime.format('A')} </small>
                </p>
                <a
                  onClick={() =>
                    this.onDeleteAgendaDetails(
                      this.state.eventId,
                      agendaListItem.id
                    )
                  }
                >
                  <i className="fa fa-trash" />
                </a>
                <a href="javascript:void(0);" className="ml-2">
                  <i className="fa fa-pencil" />
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  renderAgendaList = () => {
    const agendaList = this.props.agenda.agendaList;
    console.log('agenda list ', agendaList);
    if (agendaList) {
      return agendaList.map(agendaListItem => {
        return (
          <li className="savedAgendaSummery">
            <span className="timeForAddedSummary">
              04:00 <span>PM</span>
            </span>
            <div className="keynoteText dark-red-Div">
              <p>{agendaListItem.agendaTitle}</p>
            </div>

            {this.renderSpeakerDetails(agendaListItem)}

            {/* <div className="row">
              <div className="col-md-12">
                <div className="client-profile-div">
                  <span className="agendaUserIcon">
                    <img src={imgAdminUser} alt="" />
                  </span>
                  <div className="">
                    <p className="yellow">{agendaListItem.agendaDetailsResponse.description}</p>
                    <h4 className="text-left">
                      <span className="client-name">SCOOT DURUM</span>
                    </h4>
                    <p className="client-position">
                      Chief, Section of Cytokines and Immunity
                    </p>
                    <p className="client-institute">
                      NIH - National Cancer Center - Center for Cancer Research
                    </p>
                  </div>
                  <div className="actionBtn">
                    <p className="client-time">
                      {/* 04:00 <small> PM</small> - 05:00 <small> PM</small> *
                      {moment(agendaListItem.agendaDetailsResponse.startTimestamp).local().format('hh:mm a') - moment(agendaListItem.agendaDetailsResponse.endTimestamp).local().format('hh:mm a')}
                    </p>
                    <a href="javascript:void(0);">
                      <i className="fa fa-trash" />
                    </a>
                    <a href="javascript:void(0);">
                      <i className="fa fa-pencil" />
                    </a>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="oneMoreAgendaSpeakerDetails">
              <a className="addPlusBtn">
                <i className="fa fa-plus" />
              </a>
            </div>
          </li>
        );
      });
    } else {
      return '';
    }
  };

  render() {
    const speakerList = this.props.agenda.speakerList;
    const addMoreAgenda = this.addMoreAgenda;
    const updateAgendaArray = this.updateAgendaArray;
    return (
      <div className="main-container">
        <div className="inner-page">
          <StepNavBar
            navigateToUrlPage={this.navigateToUrlPage}
            tabName="eventAgenda"
          />
          <div className="events-page">
            <div className="agendaTimeline form-card">
              <AgendaHeader events={this.props.events.editEvent} />

              <div className="timelineContent">
                <ul className="timelineDataList">
                  {this.renderAgendaList()}
                  {/* <li className="savedAgendaSummery">
                    <span className="timeForAddedSummary">
                      04:00 <span>PM</span>
                    </span>
                    <div className="keynoteText">
                      <p>
                        Opening Keynote Session – Historical Perspective &
                        Current State of the Industry
                      </p>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className="client-profile-div">
                          <span className="agendaUserIcon">
                            <img src={imgAdminUser} alt="" />
                          </span>
                          <div className="">
                            <p className="yellow">Topic Name</p>
                            <h4 className="text-left">
                              <span className="client-name">SCOOT DURUM</span>
                            </h4>
                            <p className="client-position">
                              Chief, Section of Cytokines and Immunity
                            </p>
                            <p className="client-institute">
                              NIH - National Cancer Center - Center for Cancer
                              Research
                            </p>
                          </div>
                          <div className="actionBtn">
                            <p className="client-time">
                              04:00 <small> PM</small> - 05:00{' '}
                              <small> PM</small>
                            </p>
                            <a href="javascript:void(0);">
                              <i className="fa fa-trash" />
                            </a>
                            <a href="javascript:void(0);">
                              <i className="fa fa-pencil" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li> */}

                  {/* To show new agenda option to user */}
                  {this.state.addNewAgendaArray.map(function(newObj, index) {
                    console.log('newObj', newObj);
                    return (
                      <AddNewAgenda
                        agenda={newObj}
                        speakerList={speakerList}
                        addMoreAgenda={addMoreAgenda}
                        updateAgendaArray={updateAgendaArray}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="events-page-footer">
              {/* <!--   <a  className="btn btnSuccess mb-20">ADD</a> -->*/}

              <div className="btnPageNav">
                <a
                  onClick={() => this.navigateToUrlPage('/manager/eventMedia')}
                  className="btnTag mb-20"
                >
                  <i className="fa fa-arrow-left" aria-hidden="true" />
                </a>
                <a
                  onClick={() => {
                    this.props.actionManagerAccess({
                      accessEventSponsors: true
                    });
                    this.navigateToUrlPage('/manager/sponsorList');
                  }}
                  className="btnTag mb-20"
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

const mapStateToProps = state => {
  console.log(state.agenda);
  return { agenda: state.agenda, events: state.events };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionGetSpeakersForAgenda,
      actionGetAllAgendaOfEvent,
      actionManagerAccess
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AgendaTimeLine);
