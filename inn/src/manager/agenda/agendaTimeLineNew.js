import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import OwlCarousel from 'react-owl-carousel2';
// import 'react-owl-carousel2/style.css';
// import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'rc-time-picker/assets/index.css';
// import TimePicker from 'rc-time-picker';
import ReactDOM from 'react-dom';
import bootbox from 'bootbox';
import Modal from 'react-modal';
import classNames from 'classnames';
import $ from 'jquery';
import { Prompt } from 'react-router';

import imgUserDefault from '../../img/user_default.jpg';
import imgCalendar from '../../img/calendar.png';

import StepNavBar from '../common/stepNavBar';
import {
  actionGetSpeakersForAgenda,
  actionGetAllAgendaOfEvent,
  actionManagerAccess
} from '../../common/action/index';
import innovecsysApiService from '../../common/core/api';
import {
  getMomentObjFromIsoDate,
  showWarningToast
} from '../../common/core/common-functions';
import AddNewAgenda from './addNewAgenda';
import AgendaHeader from './agendaHeader';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

import 'react-md/dist/react-md.amber-blue.min.css';
// import 'react-md/dist/react-md.amber-cyan.min.css'
// import { DatePicker } from 'react-md';
// import 'react-md/dist/react-md.blue_grey-amber.min.css'
// import 'react-md/dist/react-md.blue-pink.min.css'
// import 'react-md/dist/react-md.brown-amber.min.css'
// import 'react-md/dist/react-md.deep_purple-pink.min.css';
import { DatePicker, TimePicker } from 'react-md';
import Sprite from '../../img/sprite.svg';

var momenttz = require('moment-timezone');

// const events = {
//   onDragged: function(event) {...},
//   onChanged: function(event) {...}
// };

class AgendaTimeLineNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: '',
      eventTimeZone: '',
      eventStartDate: null,
      eventEndDate: null,
      dateWiseAgenda: {},
      selectedDate: '',
      selectedDateList: [],
      agendaDetailsObj: [
        // {
        //   startTimestamp: '',
        //   agendaSummeryList: [],
        //   ActiveField: [],
        //   showContent: false,
        //   addedNext: false
        // }
      ],
      modalDataAgendaObject: {},
      modalDataSummaryObject: {
        speakers: [],
        speakersActiveField: []
      },
      agendaResponsedata: [],
      newAgendaTitle: '',
      showDropDown: false,
      trackList: [
        { name: 'track1', color: 'dark-red' },
        { name: 'track2', color: 'purpel' },
        { name: 'track3', color: 'green' },
        { name: 'track4', color: 'red' },
        { name: 'track5', color: 'chocklet' }
      ],
      speakerList: [],
      value: null,
      visible: false,
      isModalVisible: false,
      visibleEditDate: false,
      editDatevalue: null,
      editDate: '',
      prompt: false
    };

    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.onNewAgendaFieldChange = this.onNewAgendaFieldChange.bind(this);
    this.onTimePickerValueChange = this.onTimePickerValueChange.bind(this);
    this.onAddNewAgendaSummary = this.onAddNewAgendaSummary.bind(this);
  }

  setPromptFlag() {
    this.setState({
      prompt: true
    });
  }
  setPromptFlagFalse() {
    this.setState({
      prompt: false
    });
  }

  componentWillMount() {
    // console.log(this.props);
    // const eventId = this.props.events.editEvent.eventId;
    // this.setState({ eventId });

    let eventId;
    if (this.props.events.editEvent != undefined) {
      eventId = this.props.events.editEvent.eventId;
      console.log(
        'this.props.events.editEvent========',
        this.props.events.editEvent
      );
      let timezone = this.props.events.editEvent.timeZone || '';
      this.setState({ eventTimeZone: timezone });
    }

    if (eventId == undefined) {
      this.props.history.push('/manager/eventList');
      console.log('eventId not found');
      return;
    }

    this.props.actionGetSpeakersForAgenda(eventId).then(res => {
      if (res.payload && res.payload.data && res.payload.data.status == 200) {
        this.setState({
          speakerList: res.payload.data.resourceData || []
        });
      }
    });
    this.props.actionGetAllAgendaOfEvent(eventId).then(res => {
      console.log('res ============>', res);
      if (res.payload && res.payload.data.status == 200) {
        let agendaList = res.payload.data.resourceData || [];

        // convert all agenda time in local
        // agendaList = this.agendaListInLocalTimeZoneFormat(agendaList);

        agendaList.sort(this.dynamicSortWithNumber('startTime'));
        this.setState(
          {
            agendaResponsedata: agendaList || []
          },
          () => {
            this.test();

            // this.convertResponseToAgendaDetailsList();
          }
        );
      }
    });

    this.setState({
      eventStartDate: this.props.events.activeEvent.startTimestamp,
      eventEndDate: this.props.events.activeEvent.endTimestamp
    });
  }

  agendaListInLocalTimeZoneFormat = agendaList => {
    agendaList.map(agenda => {
      agenda.startTime = this.convertUTCDateToLocalDate(
        new Date(agenda.startTime)
      );
      agenda.listOfAgendas.map(agendaSummary => {
        agendaSummary.startTimestamp = this.convertUTCDateToLocalDate(
          new Date(agendaSummary.startTimestamp)
        );
        agendaSummary.agendaDetailsResponse.map(speaker => {
          speaker.startTimestamp = this.convertUTCDateToLocalDate(
            new Date(speaker.startTimestamp)
          );
        });
      });
    });

    console.log('agendaList***************************>', agendaList);

    return agendaList;
  };

  convertUTCDateToLocalDate = date => {
    // var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    // var offset = date.getTimezoneOffset() / 60;
    // var hours = date.getHours();
    // newDate.setHours(hours - offset);
    // return newDate.valueOf();
    // let newdate=moment(date).local();
    // return newdate.valueOf();
  };

  test = () => {
    let responseDataList = JSON.parse(
      JSON.stringify(this.state.agendaResponsedata)
    );

    let dateWiseAgenda = {};

    responseDataList.forEach((agendaObj, index) => {
      // console.log("agenda.startTime",moment(agenda.startTime).format("YYYY-MM-DD") )

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
        if (Object.keys(this.state.dateWiseAgenda)[0] != undefined)
          this.onSelectDays(Object.keys(this.state.dateWiseAgenda)[0]);
      }
    );
  };

  onSelectDays = date => {
    // console.log("this.state.dateWiseAgenda",this.state.dateWiseAgenda)

    this.setState(
      {
        selectedDate: date,
        selectedDateList: this.state.dateWiseAgenda[date] || []
      },
      () => {
        console.log('this.state.dateWiseAgenda', this.state.dateWiseAgenda);
        this.convertResponseToAgendaDetailsList();
      }
    );
  };

  onEditDate = (event, date) => {
    event.stopPropagation();
    console.log('date', date);
    console.log(
      'Object.keys(this.state.dateWiseAgenda)',
      this.state.dateWiseAgenda
    );
    this.setState({ visibleEditDate: true, editDate: date });
  };

  handleEditDate = (value, dateValue, event) => {
    let selectedDateWithZone = this.getDateTimeInZoneFormat(
      moment(dateValue).format('YYYY-MM-DD')
    );
    let eventStartDateWithZone = this.state.eventStartDate;
    let eventEndDateWithZone = this.state.eventEndDate;

    if (selectedDateWithZone < eventStartDateWithZone) {
      showWarningToast('Date must be greater than event start date');
      return;
    }

    if (selectedDateWithZone > eventEndDateWithZone) {
      showWarningToast('Date must be less than event end date');
      return;
    }

    try {
      let newDate = moment(dateValue).format('YYYY-MM-DD');
      let editDate = this.state.editDate;
      let dateWiseAgenda = this.state.dateWiseAgenda;

      if (dateWiseAgenda.hasOwnProperty(newDate) == true) {
        return;
      }

      dateWiseAgenda[newDate] = JSON.parse(
        JSON.stringify(dateWiseAgenda[editDate])
      );
      delete dateWiseAgenda[editDate];

      this.changeAllDatesOfObject(dateWiseAgenda[newDate], newDate, () => {
        this.setState({ dateWiseAgenda }, () => {
          this.onSelectDays(newDate);
        });
      });
    } catch (err) {
      console.log(err);
    }
    this.setPromptFlag();
  };

  handleVisibilityEditDate = visible => {
    this.setState({ visibleEditDate: visible });
  };

  changeAllDatesOfObject = (changebledata, newDate, cb) => {
    console.log('data', changebledata);

    changebledata.map(agenda => {
      let newDateFormat =
        newDate +
        ' ' +
        moment.tz(agenda.startTime, this.state.eventTimeZone).format('HH:mm');
      agenda.startTime = this.getDateTimeInZoneFormat(newDateFormat);
      agenda.listOfAgendas.map(summary => {
        let summaryStartTimeFormat =
          newDate +
          ' ' +
          moment
            .tz(summary.startTimestamp, this.state.eventTimeZone)
            .format('HH:mm');
        summary.startTimestamp = this.getDateTimeInZoneFormat(
          summaryStartTimeFormat
        );

        let summaryEndTimeFormat =
          newDate +
          ' ' +
          moment
            .tz(summary.endTimestamp, this.state.eventTimeZone)
            .format('HH:mm');
        summary.endTimestamp = this.getDateTimeInZoneFormat(
          summaryEndTimeFormat
        );

        summary.agendaDetailsResponse.map(speaker => {
          let speakerStartTimeFormat =
            newDate +
            ' ' +
            moment
              .tz(speaker.startTimestamp, this.state.eventTimeZone)
              .format('HH:mm');
          speaker.startTimestamp = this.getDateTimeInZoneFormat(
            speakerStartTimeFormat
          );
          let speakerEndTimeFormat =
            newDate +
            ' ' +
            moment
              .tz(speaker.endTimestamp, this.state.eventTimeZone)
              .format('HH:mm');
          speaker.endTimestamp = this.getDateTimeInZoneFormat(
            speakerEndTimeFormat
          );
        });
      });
    });
    cb();
  };

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

  closeModal = () => {
    $('#myModal').modal('hide');
  };

  ///=============================   Agenda form ================================================

  onTimePickerValueChange = (momentObj, stateName, child, agendaObj) => {
    agendaObj.startTimestamp = momentObj.format('YYYY-MM-DDTHH:mm:ss');

    if (agendaObj.addedNext == false) {
      agendaObj.showContent = true;
      agendaObj.addedNext = true;
      let list = this.state.agendaDetailsObj;
      list.push({
        startTimestamp: '',
        agendaSummeryList: [],
        ActiveField: [
          {
            summary: '',
            selectedtrack: '',
            showDropdown: false
          }
        ],
        showContent: false,
        addedNext: false
      });
    }

    this.updateAgenda();
  };

  onNewAgendaFieldChange = (event, field) => {
    const name = event.target.name;
    const value = event.target.value;

    field.summary = event.target.value;
    // this.setState({ [name]: value });
    this.updateAgenda();
    this.setPromptFlag();
  };

  onAddNewAgendaSummary = (agendaObj, field) => {
    try {
      if (field.summary.trim() == '') {
        showWarningToast('Summary can not be empty');
        return;
      }

      if (field.selectedtrack.trim() == '') {
        showWarningToast('Please assign track to your agenda');
        return;
      }
    } catch (err) {
      console.log(err);
    }

    if (field.summary == '' || field.selectedtrack == '') {
      return;
    }

    let newAgendaSummary = {};
    newAgendaSummary['agendaSummary'] = field.summary;
    newAgendaSummary['speakers'] = [];
    newAgendaSummary['speakersActiveField'] = [
      { topic: '', selectedSpeaker: '', time: '' }
    ];
    newAgendaSummary['selectedTrack'] = field.selectedtrack;

    let list = agendaObj.agendaSummeryList;
    list.push(newAgendaSummary);
    field.summary = '';
    field.selectedtrack = '';

    let fieldList = agendaObj.ActiveField;

    if (fieldList.length > 1) {
      fieldList = fieldList.splice(fieldList.indexOf(field), 1);
    }

    agendaObj.ActiveField = [];
    this.updateAgenda();
    this.setPromptFlag();
  };

  onCloseAgendaActiveField = agendaObj => {
    agendaObj.ActiveField = [];
    this.updateAgenda();
  };

  onAddNewField = agendaObj => {
    let ActiveFieldList = agendaObj.ActiveField;
    let newField = {
      summary: '',
      selectedtrack: '',
      showDropdown: false
    };
    ActiveFieldList.push(newField);
    this.updateAgenda();
  };

  onSelectTrack = (field, trackName) => {
    field.showDropdown = false;
    field.selectedtrack = trackName;

    this.updateAgenda();
  };

  onSelectDropDown = field => {
    field.showDropdown = !field.showDropdown;
    this.updateAgenda();
  };

  // ======================  Modal Code =============================

  showDetails(agendaObj, agenda) {
    this.setState(
      {
        modalDataAgendaObject: agendaObj,
        modalDataSummaryObject: agenda
      },
      () => {
        console.log(
          'modalDataSummaryObject',
          this.state.modalDataSummaryObject
        );
        $('#myModal').modal();
      }
    );
  }

  showDetailsModal(agendaObj, agenda) {
    console.log(agendaObj, agenda);

    this.setState({
      modalDataAgendaObject: agendaObj,
      modalDataSummaryObject: agenda,
      isModalVisible: true
    });
  }

  closeDetailsModal = () => {
    this.setState({
      isModalVisible: false
    });
  };

  onAddSpeaker = (modalAgendaObj, modalSummaryObj, activeField) => {
    try {
      if (activeField.topic.trim() == '') {
        showWarningToast('Please enter topic');
        return;
      }

      if (activeField.selectedSpeaker.trim() == '') {
        showWarningToast('Please select speaker');
        return;
      }

      if (activeField.time.trim() == '') {
        showWarningToast('Please select time');
        return;
      }
    } catch (err) {
      console.log(err);
    }

    console.log(activeField);
    if (
      activeField.selectedSpeaker == '' ||
      activeField.time == '' ||
      activeField.topic == ''
    ) {
      return;
    }

    let list = modalSummaryObj.speakers;
    let newSpeaker = {
      topic: activeField.topic,
      selectedSpeaker: activeField.selectedSpeaker,
      time: activeField.time,
      selectedSpeakerDetails: this.getSpeakerDetailsById(
        activeField.selectedSpeaker
      )
    };
    list.push(newSpeaker);

    activeField.topic = '';
    activeField.selectedSpeaker = '';
    (activeField.time = ''), (activeField.selectedSpeakerDetails = {});

    let fieldList = modalSummaryObj.speakersActiveField;

    if (fieldList.length > 1) {
      fieldList = fieldList.splice(fieldList.indexOf(activeField), 1);
    }

    modalSummaryObj.speakersActiveField = [];
    this.updateAgenda();
    this.setPromptFlagFalse();
  };

  getSpeakerDetailsById = speakerId => {
    let selecterdSpeakerObj = {};
    let filteredList = [];
    filteredList = this.state.speakerList.filter(speakerObj => {
      if (speakerObj.speakerId == speakerId) return speakerObj;
    });
    selecterdSpeakerObj = filteredList[0] || {};
    console.log('selecterdSpeakerObj', selecterdSpeakerObj);
    return selecterdSpeakerObj;
  };

  onAddActiveSpeakerField = (modalAgendaObj, modalSummaryObj) => {
    console.log('modalAgendaObj', modalAgendaObj);
    console.log('modalSummaryObj', modalSummaryObj);
    let newSpeakerActiveField = {
      topic: '',
      selectedSpeaker: '',
      time: ''
    };
    let list = modalSummaryObj.speakersActiveField;
    list.push(newSpeakerActiveField);
    this.updateAgenda();
  };

  onSpeakerTimePickerValueChange = (
    momentObj,
    stateName,
    child,
    activeFieldObj
  ) => {
    activeFieldObj.time = momentObj.format('YYYY-MM-DDTHH:mm:ss');
    this.updateAgenda();
  };

  updateAgenda = () => {
    console.log(this.state.agendaDetailsObj);
    // console.log("this.selectedDate",this.state.selectedDate)

    this.convertLocalFormObjectToApiObject(list => {
      let listObj = this.state.dateWiseAgenda;
      listObj[this.state.selectedDate] = list;

      this.setState(
        {
          agendaDetailsObj: this.state.agendaDetailsObj,
          dateWiseAgenda: listObj
        },
        () => {
          console.log(
            'this.state.dateWiseAgenda*********',
            this.state.dateWiseAgenda
          );
        }
      );
    });
    this.setPromptFlagFalse();
    // this.state.dateWiseAgenda[this.state.selectedDate]=this.state.agendaDetailsObj;

    // console.log("this.state.dateWiseAgenda*********",this.state.dateWiseAgenda)
    // this.setState({
    //   agendaDetailsObj: this.state.agendaDetailsObj,
    //   dateWiseAgenda:  this.state.dateWiseAgenda
    // });
  };

  convertLocalFormObjectToApiObject = cb => {
    // console.log("this.state.dateWiseAgenda",this.state.dateWiseAgenda)

    // let formDataList =
    //   JSON.parse(JSON.stringify(this.state.agendaDetailsObj)) || [];

    //   let mergedAgendaList = [];

    //   Object.keys(this.state.dateWiseAgenda).map((key,index)=>{
    //     mergedAgendaList = mergedAgendaList.concat(this.state.dateWiseAgenda[key])
    //   })

    //   console.log("mergedAgendaList",mergedAgendaList)

    let eventId = this.props.events.activeEvent.eventId;
    let formDataList =
      JSON.parse(JSON.stringify(this.state.agendaDetailsObj)) || [];
    let apiObject = {};
    (apiObject['eventId'] = eventId),
      (apiObject['timeBasedAgendaRequestList'] = []);

    console.log('formDataList========>', formDataList);

    formDataList.map(agenda => {
      let localAgendaObject = {};
      localAgendaObject['startTime'] = agenda.startTimestamp;
      localAgendaObject['listOfAgendas'] = [];

      agenda.agendaSummeryList.map(summary => {
        let summaryObj = {};
        summaryObj['agendaTitle'] = summary.agendaSummary;
        summaryObj['trackNumber'] = summary.selectedTrack;

        summaryObj['startTimestamp'] = agenda.startTimestamp;
        summaryObj['endTimestamp'] = agenda.startTimestamp;
        summaryObj['agendaDetailsResponse'] = [];
        summaryObj['listOfAgendaDetails'] = [];
        summary.speakers.map(speaker => {
          let speakerDetailsObj = {};
          speakerDetailsObj['speakerId'] = speaker.selectedSpeaker;
          speakerDetailsObj['speakerResponse'] = speaker.selectedSpeakerDetails;
          speakerDetailsObj['startTimestamp'] = speaker.time;
          speakerDetailsObj['endTimestamp'] = speaker.time;
          speakerDetailsObj['description'] = speaker.topic;
          summaryObj['agendaDetailsResponse'].push(speakerDetailsObj);
          summaryObj['listOfAgendaDetails'].push(speakerDetailsObj);
        });

        localAgendaObject['listOfAgendas'].push(summaryObj);
      });
      apiObject['timeBasedAgendaRequestList'].push(localAgendaObject);
    });

    let list = [];
    list = apiObject['timeBasedAgendaRequestList'];
    list.splice(list.length - 1, 1);
    apiObject['timeBasedAgendaRequestList'] = list;
    console.log('apiObject-->', apiObject);
    cb(apiObject.timeBasedAgendaRequestList);
  };

  convertResponseToAgendaDetailsList = () => {
    console.log('agendaResponsedata', this.state.agendaResponsedata);

    // let responseDataList = JSON.parse(
    //   JSON.stringify(this.state.selectedDateList)
    // );

    let responseDataList = this.state.selectedDateList || [];

    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%', responseDataList);

    console.log('responseDataList----------', responseDataList);

    let newAgendaDetailsList = [];
    responseDataList.map(agenda => {
      let agendaObject = {};

      agendaObject['startTimestamp'] = agenda.startTime; //moment(agenda.startTime).format('YYYY-MM-DDTHH:mm:ss'); // agenda.startTime;
      agendaObject['agendaSummeryList'] = [];
      agendaObject['ActiveField'] = [];
      agendaObject['showContent'] = true;
      agendaObject['addedNext'] = true;

      agenda.listOfAgendas.map(summary => {
        let summaryObject = {};
        summaryObject['agendaSummary'] = summary.agendaTitle;
        summaryObject['selectedTrack'] = summary.trackNumber;
        summaryObject['speakersActiveField'] = [
          // { topic: '', selectedSpeaker: '', time: '' }
        ];
        summaryObject['speakers'] = [];
        summary.agendaDetailsResponse.map(speaker => {
          let speakerObject = {};
          if (speaker.speakerResponse)
            speakerObject['selectedSpeaker'] =
              speaker.speakerResponse.speakerId;
          speakerObject['speakerResponse'] = speaker.speakerResponse;

          speakerObject['time'] = speaker.startTimestamp; //moment(speaker.startTimestamp).format('YYYY-MM-DDTHH:mm:ss'); //speaker.startTimestamp;
          speakerObject['topic'] = speaker.description;
          speakerObject['selectedSpeakerDetails'] =
            speaker.speakerResponse || {};
          summaryObject['speakers'].push(speakerObject);
        });
        agendaObject['agendaSummeryList'].push(summaryObject);
      });
      newAgendaDetailsList.push(agendaObject);
    });

    newAgendaDetailsList.push({
      startTimestamp: '',
      agendaSummeryList: [],
      ActiveField: [
        // {
        //   summary: '',
        //   selectedtrack: '',
        //   showDropdown: false
        // }
      ],
      showContent: false,
      addedNext: false
    });

    this.setState({
      agendaDetailsObj: newAgendaDetailsList
    });

    console.log('newAgendaDetailsList ==========> ', newAgendaDetailsList);
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

  // finalApiList = cb => {
  //   let mergedAgendaList = [];
  //   Object.keys(this.state.dateWiseAgenda).map((key, index) => {
  //     mergedAgendaList = mergedAgendaList.concat(
  //       this.state.dateWiseAgenda[key]
  //     );
  //   });

  //   console.log('mergedAgendaList', mergedAgendaList);
  //   mergedAgendaList.map(agenda => {
  //     agenda['listOfAgendas'].map(summaryObj => {
  //       summaryObj['listOfAgendaDetails'] = summaryObj['agendaDetailsResponse'];
  //       summaryObj['startTimestamp'] = moment(
  //         summaryObj['startTimestamp']
  //       ).format('YYYY-MM-DDTHH:mm:ss');
  //       summaryObj['endTimestamp'] = moment(summaryObj['endTimestamp']).format(
  //         'YYYY-MM-DDTHH:mm:ss'
  //       );
  //       summaryObj['createdTimestamp'] = moment(
  //         summaryObj['createdTimestamp']
  //       ).format('YYYY-MM-DDTHH:mm:ss');
  //       summaryObj['lastModifiedTimestamp'] = moment(
  //         summaryObj['lastModifiedTimestamp']
  //       ).format('YYYY-MM-DDTHH:mm:ss');

  //       summaryObj['listOfAgendaDetails'].map(spDetails => {
  //         spDetails['startTimestamp'] = moment(
  //           spDetails['startTimestamp']
  //         ).format('YYYY-MM-DDTHH:mm:ss');
  //         spDetails['endTimestamp'] = moment(spDetails['endTimestamp']).format(
  //           'YYYY-MM-DDTHH:mm:ss'
  //         );
  //         if (spDetails['speakerResponse']) {
  //           spDetails['speakerId'] = spDetails['speakerResponse']['speakerId'];
  //         }
  //       });
  //     });

  //     agenda['startTime'] = moment(agenda['startTime']).format(
  //       'YYYY-MM-DDTHH:mm:ss'
  //     );
  //   });

  //   console.log('mergedAgendaList', mergedAgendaList);

  //   let eventId = this.props.events.activeEvent.eventId;
  //   let apiObject = {};
  //   apiObject['eventId'] = eventId;
  //   apiObject['timeBasedAgendaRequestList'] = mergedAgendaList;

  //   cb(apiObject);
  // };

  finalApiList = cb => {
    let mergedAgendaList = [];
    Object.keys(this.state.dateWiseAgenda).map((key, index) => {
      mergedAgendaList = mergedAgendaList.concat(
        this.state.dateWiseAgenda[key]
      );
    });

    console.log('mergedAgendaList', mergedAgendaList);
    mergedAgendaList.map(agenda => {
      agenda['listOfAgendas'].map(summaryObj => {
        summaryObj['listOfAgendaDetails'] = summaryObj['agendaDetailsResponse'];
        summaryObj['startTimestamp'] = summaryObj['startTimestamp']; //this.getDateTimeInZoneFormat(moment(summaryObj['startTimestamp']).format('YYYY-MM-DDTHH:mm:ss'));
        summaryObj['endTimestamp'] = summaryObj['endTimestamp']; //this.getDateTimeInZoneFormat(moment(summaryObj['endTimestamp']).format('YYYY-MM-DDTHH:mm:ss'));
        summaryObj['createdTimestamp'] = summaryObj['createdTimestamp']; //this.getDateTimeInZoneFormat(moment( summaryObj['createdTimestamp']).format('YYYY-MM-DDTHH:mm:ss'));
        summaryObj['lastModifiedTimestamp'] =
          summaryObj['lastModifiedTimestamp']; //this.getDateTimeInZoneFormat(moment(summaryObj['lastModifiedTimestamp']).format('YYYY-MM-DDTHH:mm:ss'));

        summaryObj['listOfAgendaDetails'].map(spDetails => {
          spDetails['startTimestamp'] = spDetails['startTimestamp']; //this.getDateTimeInZoneFormat(moment(spDetails['startTimestamp']).format('YYYY-MM-DDTHH:mm:ss'));
          spDetails['endTimestamp'] = spDetails['endTimestamp']; //this.getDateTimeInZoneFormat(moment(spDetails['endTimestamp']).format('YYYY-MM-DDTHH:mm:ss'));
          if (spDetails['speakerResponse']) {
            spDetails['speakerId'] = spDetails['speakerResponse']['speakerId'];
          }
        });
      });

      agenda['startTime'] = agenda['startTime']; //this.getDateTimeInZoneFormat(moment(agenda['startTime']).format('YYYY-MM-DDTHH:mm:ss'));
    });

    console.log('mergedAgendaList', mergedAgendaList);

    let eventId = this.props.events.activeEvent.eventId;
    let apiObject = {};
    apiObject['eventId'] = eventId;
    apiObject['timeBasedAgendaRequestList'] = mergedAgendaList;

    cb(apiObject);
  };

  onSaveAgenda = () => {
    let _this = this;
    this.finalApiList(apiObject => {
      if (apiObject.timeBasedAgendaRequestList.length == 0) {
        _this.navigateToUrlPage('/manager/sponsorList');
        return;
      }

      innovecsysApiService('addEventAgenda', apiObject).then(result => {
        console.log('agenda add result', result);
        _this.setState(
          {
            prompt: false //Disable prompt and navigate to user
          },
          () => _this.navigateToUrlPage('/manager/sponsorList')
        );
      });
    });
  };

  getDateTimeInZoneFormat = date => {
    return moment.tz(date, this.state.eventTimeZone).valueOf();
  };

  convertApiDataLocalTimeZoneFormatToUtcFormat = apiObject => {
    apiObject.timeBasedAgendaRequestList.map(agenda => {
      agenda.startTime = moment(agenda.startTime)
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss'); //this.localToUtc(agenda.startTime);
      agenda.listOfAgendas.map(summary => {
        summary.startTimestamp = moment(summary.startTimestamp)
          .utc()
          .format('YYYY-MM-DDTHH:mm:ss'); //this.localToUtc(summary.startTimestamp);
        summary.agendaDetailsResponse.map(speaker => {
          speaker.startTimestamp = moment(speaker.startTimestamp)
            .utc()
            .format('YYYY-MM-DDTHH:mm:ss'); //this.localToUtc(speaker.startTimestamp);
        });
      });
    });

    console.log('apiObject@@@@@@@@@@@@@@@@@@@@@@@', apiObject);

    //2016-03-08T02:00:00.000Z
    //2016-03-08T07:30:00

    return apiObject;
  };

  localToUtc = date => {
    date = new Date(date);
    let dateString = date.toISOString();
    let formatedArray = dateString.split('.');
    return formatedArray[0];
  };

  onSaveSummary = () => {
    this.convertLocalFormObjectToApiObject(apiObject => {
      console.log(apiObject);

      innovecsysApiService('addEventAgenda', apiObject).then(result => {
        console.log('agenda updated result', result);
        this.closeModal();
      });
    });
  };

  onDeleteAgendaSummary = (agendaObject, summaryObject) => {
    agendaObject.agendaSummeryList.splice(
      agendaObject.agendaSummeryList.indexOf(summaryObject),
      1
    );
    this.updateAgenda();
    this.setPromptFlag();
  };

  onDeleteSummarySpeaker = (summaryObject, speaker) => {
    summaryObject.speakers.splice(summaryObject.speakers.indexOf(speaker), 1);
    this.updateAgenda();
  };

  ////////////////////  datepicker

  // clearTimeout = () => {
  //   if (this.timeout) {
  //     clearTimeout(this.timeout);
  //   }

  //   this.timeout = null;
  // };

  // reset = () => {
  //   this.setState({ value: null });
  // };

  showDate = () => {
    // this.clearTimeout();
    this.setState({ visible: true });
  };

  handleChangeDate = (value, dateValue, event) => {
    // eslint-disable-line no-unused-vars
    let selectedDateWithZone = this.getDateTimeInZoneFormat(
      moment(dateValue).format('YYYY-MM-DD')
    );
    let eventStartDateWithZone = this.state.eventStartDate;
    let eventEndDateWithZone = this.state.eventEndDate;
    if (selectedDateWithZone < eventStartDateWithZone) {
      showWarningToast('Date must be greater than event start date');
      return;
    }

    if (selectedDateWithZone > eventEndDateWithZone) {
      showWarningToast('Date must be less than event end date');
      return;
    }

    // this.setState({ value });
    let key = moment(dateValue).format('YYYY-MM-DD');
    let dateWiseObj = {};
    dateWiseObj = this.state.dateWiseAgenda;
    if (dateWiseObj.hasOwnProperty(key)) {
      return;
    }

    // check new date is greater or not with previous date

    console.log('dateWiseObj', dateWiseObj);
    let dateArray = Object.keys(dateWiseObj);
    dateArray = dateArray.map(date => {
      return moment(date);
    });
    console.log('moment(dateValue)', moment(dateValue));

    let isSmall = false;
    dateArray.forEach(date => {
      if (moment(dateValue) < date) {
        // new date must be greater than previous date;
        isSmall = true;
        return;
      }
    });

    if (isSmall == true) {
      showWarningToast('New date must be greater than previous date');
      return;
    }

    dateWiseObj[key] = [];
    this.setState(
      {
        dateWiseAgenda: dateWiseObj
      },
      () => {
        console.log(key);
        this.onSelectDays(key);
      }
    );
    this.setPromptFlag();
  };

  getDateTimeInZoneFormat = date => {
    return moment.tz(date, this.state.eventTimeZone).valueOf();
  };

  handleVisibilityChangeDate = visible => {
    // this.clearTimeout();
    this.setState({ visible });
  };

  //////////////////======================== agenda time picker

  showTime = agendaObj => {
    agendaObj.showTime = true;
    this.updateAgenda();
    // this.setState({ visible: true });
  };

  handleChangeTime = (formattedValue, value, event, agendaObj) => {
    // console.log("momentObj", moment(value));
    // console.log("momentObj.valueOf()",moment(value).valueOf());
    // console.log("momentObj",moment());
    // console.log(",moment().valueOf()",moment().valueOf());

    // eslint-disable-line no-unused-vars
    console.log(moment(value).format('YYYY-MM-DDTHH:mm:ss'));

    let year = moment(this.state.selectedDate).year();
    let month = moment(this.state.selectedDate).month();
    let date = moment(this.state.selectedDate).date();
    let hour = moment(value).hour();
    let min = moment(value).minute();
    let sec = 0; //moment(value).second();
    let milisec = 0; // moment(value).millisecond();

    // check selected date time is not before current
    try {
      let selectedTimeWithDate = moment
        .tz(
          [year, month, date, hour, min, sec, milisec],
          this.state.eventTimeZone
        )
        .valueOf();

      let currentTimeWithDate = moment
        .tz(moment(), this.state.eventTimeZone)
        .valueOf(); //moment().valueOf();
      if (selectedTimeWithDate < currentTimeWithDate) {
        showWarningToast('Agenda start time must be greater than current time');
        return;
      }
    } catch (err) {
      console.log(err);
    }

    // check new agenda time is greater or not of last agenda end time
    // agenda end time is not availabe so make confirm new time is greater than last agenda summary start time

    // check for summary time is before next agenda start time

    try {
      let index = this.state.agendaDetailsObj.indexOf(agendaObj);
      console.log('index', index);
      let previousAgendaObject = this.state.agendaDetailsObj[index - 1];
      let previousAgendaTime = [];
      // add previous agenda start time
      if (previousAgendaObject) {
        previousAgendaTime.push(
          moment(previousAgendaObject.startTimestamp).set({
            second: 0,
            millisecond: 0
          })
        );
        // add previous agenda all speakers start time

        previousAgendaObject.agendaSummeryList.forEach(summary => {
          summary.speakers.forEach(speaker => {
            previousAgendaTime.push(
              moment(speaker.time).set({ second: 0, millisecond: 0 })
            );
          });
        });
      }

      console.log('previousAgendaTime', previousAgendaTime);
      let newtime = moment.tz(
        [year, month, date, hour, min, sec, milisec],
        this.state.eventTimeZone
      );
      let isGrater = true;
      previousAgendaTime.forEach(date => {
        if (date >= newtime) {
          // new date must be greater than previous dates;
          isGrater = false;
          return;
        }
      });

      if (isGrater == false) {
        showWarningToast(
          'Agenda start time must be greater than previous times'
        );
        return;
      }

      // check agenda start time is not greater than next agenda start time

      index = this.state.agendaDetailsObj.indexOf(agendaObj);
      let nextAgendaObject = this.state.agendaDetailsObj[index + 1];
      let nextAgendaStartTime = moment(nextAgendaObject.startTimestamp).set({
        second: 0,
        millisecond: 0
      });
      if (newtime >= nextAgendaStartTime) {
        showWarningToast('Agenda time can not after next agenda start time');
        return;
      }
    } catch (err) {
      console.log(err);
    }

    console.log(year, month, date, hour, min, sec, milisec);
    agendaObj.startTimestamp = moment
      .tz(
        [year, month, date, hour, min, sec, milisec],
        this.state.eventTimeZone
      )
      .valueOf(); //format('YYYY-MM-DDTHH:mm:ss');

    console.log('agendaObj.startTimestamp', agendaObj.startTimestamp);
    if (agendaObj.addedNext == false) {
      agendaObj.showContent = true;
      agendaObj.addedNext = true;
      let list = this.state.agendaDetailsObj;
      list.push({
        startTimestamp: '',
        agendaSummeryList: [],
        ActiveField: [
          // {
          //   summary: '',
          //   selectedtrack: '',
          //   showDropdown: false
          // }
        ],
        showContent: false,
        addedNext: false
      });
    }
    this.updateAgenda();
    this.setPromptFlag();
  };

  handleVisibilityChangeTime = (visible, agendaObj) => {
    agendaObj.showTime = visible;
    this.updateAgenda();
  };

  //// =============================================  speaker time picker

  showSpeakerTime = speakerActiveField => {
    speakerActiveField.showTime = true;
    this.updateAgenda();
  };

  handleChangeSpeakerTime = (
    formattedValue,
    value,
    event,
    speakerActiveField,
    agendaObj,
    summaryObj
  ) => {
    // eslint-disable-line no-unused-vars

    // startTimestamp
    let year = moment(this.state.selectedDate).year();
    let month = moment(this.state.selectedDate).month();
    let date = moment(this.state.selectedDate).date();
    let hour = moment(value).hour();
    let min = moment(value).minute();
    let sec = 0; //moment(value).second();
    let milisec = 0; //moment(value).millisecond();

    try {
      // check for summary time is after the agenda start time and previous summary time

      console.log('speakerActiveField', speakerActiveField);

      let agendaPreviousTime = [];
      // add current agenda start time

      console.log('summaryObj', summaryObj);
      // if (agendaObj) {
      //   agendaObj.agendaSummeryList.forEach(summary => {
      //     summary.speakers.forEach(speaker => {
      //       agendaPreviousTime.push(
      //         moment(speaker.time).set({ second: 0, millisecond: 0 })
      //       );
      //     });
      //   });
      // }

      if (summaryObj) {
        summaryObj.speakers.forEach(speaker => {
          agendaPreviousTime.push(
            moment(speaker.time).set({ second: 0, millisecond: 0 })
          );
        });
      }

      console.log('previousAgendaTime', agendaPreviousTime);
      let newtime = moment.tz(
        [year, month, date, hour, min, sec, milisec],
        this.state.eventTimeZone
      );

      if (speakerActiveField.isEditing == true) {
        // check for previous summary and next summary
      } else {
        let isGrater = true;
        agendaPreviousTime.forEach(date => {
          if (date >= newtime) {
            // new date must be greater than previous dates;
            isGrater = false;
            return;
          }
        });

        if (isGrater == false) {
          showWarningToast(
            'Summary start time must be greater than agenda start time and previous summary times'
          );
          return;
        }
      }

      newtime = moment.tz(
        [year, month, date, hour, min, sec, milisec],
        this.state.eventTimeZone
      );
      if (
        newtime <
        moment(agendaObj.startTimestamp).set({ second: 0, millisecond: 0 })
      ) {
        showWarningToast('Summary time can not before agenda start time');
        return;
      }

      // check for summary time is before next agenda start time
      let index = this.state.agendaDetailsObj.indexOf(agendaObj);
      let nextAgendaObject = this.state.agendaDetailsObj[index + 1];
      let nextAgendaStartTime = moment(nextAgendaObject.startTimestamp).set({
        second: 0,
        millisecond: 0
      });

      if (newtime >= nextAgendaStartTime) {
        showWarningToast('Summary time can not after next agenda start time');
        return;
      }
    } catch (err) {
      console.log(err);
    }

    speakerActiveField.time = moment
      .tz(
        [year, month, date, hour, min, sec, milisec],
        this.state.eventTimeZone
      )
      .valueOf(); //format('YYYY-MM-DDTHH:mm:ss');
    this.updateAgenda();
    this.setPromptFlag();
  };

  handleVisibilityChangeSpeakerTime = (visible, speakerActiveField) => {
    speakerActiveField.showTime = visible;
    this.updateAgenda();
  };

  render() {
    const speakerList = this.props.agenda.speakerList;
    const addMoreAgenda = this.addMoreAgenda;
    const updateAgendaArray = this.updateAgendaArray;
    const _this = this;
    const _node = this.props.agenda.node;

    return (
      <div className="main-container">
        <Prompt
          when={this.state.prompt}
          message="You may lost any unsaved data, click cancel to stay on the same screen and click on next button  to save the changes."
        />
        <div className="inner-page">
          <StepNavBar
            navigateToUrlPage={this.navigateToUrlPage}
            tabName="eventAgenda"
          />
          <div className="events-page ">
            {this.state.agendaDetailsObj.length == 0 ? (
              <div className="events-page divCentSet">
                <div className="agendaTimeline form-card singBox">
                  <img src={imgCalendar} alt="" onClick={this.showDate} />
                  <p>
                    Select a date <br /> to create agenda
                  </p>
                  <button className="date-btn" onClick={this.showDate}>
                    Add date
                  </button>
                  <DatePicker
                    id="date-picker-controlled"
                    label="Select date"
                    autoOk={true}
                    visible={this.state.visible}
                    value={this.state.value}
                    className="md-cell cls-add-agenda-datepicker"
                    onChange={this.handleChangeDate}
                    onVisibilityChange={this.handleVisibilityChangeDate}
                    textFieldClassName="hide"
                    // minDate={new Date()}
                    // minDate={new Date(this.state.eventStartDate)}
                    // maxDate={new Date(this.state.eventEndDate)}
                  />
                </div>
              </div>
            ) : (
              <div className="agendaTimeline form-card">
                {/* <AgendaHeader events={this.props.events.editEvent} /> */}
                {this.renderHeader()}

                <div className="timelineContent newTimeLine">
                  {this.state.agendaDetailsObj.map((agendaObj, agendaIndex) => {
                    return (
                      <div key={agendaIndex + '' + agendaObj.startTimestamp}>
                        {/* <TimePicker
                          className={`selectTime speakerStartTime agendaStartTime${agendaIndex}`}
                          placeholder=""
                          showSecond={false}
                          onChange={momentObj => {
                            _this.onTimePickerValueChange(
                              momentObj,
                              `agendaStartTime${agendaIndex}`,
                              1,
                              agendaObj
                            );
                          }}
                        /> */}

                        <TimePicker
                          id="time-picker-controlled"
                          locales="en-US"
                          visible={agendaObj.showTime == true}
                          className="md-cell cls-add-agenda-timepicker"
                          defaultValue={agendaObj.startTimestamp || new Date()}
                          onChange={(formattedValue, value, event) =>
                            this.handleChangeTime(
                              formattedValue,
                              value,
                              event,
                              agendaObj
                            )
                          }
                          onVisibilityChange={ev =>
                            this.handleVisibilityChangeTime(ev, agendaObj)
                          }
                          textFieldClassName="hide"
                        />

                        <span
                          className="timeForAddedSummary"
                          // onClick={() => {
                          //   const temp = $(
                          //     `.rc-time-picker.selectTime.agendaStartTime${agendaIndex}`
                          //   ).find('input.rc-time-picker-input');
                          //   temp.trigger('click');
                          // }}

                          onClick={() => this.showTime(agendaObj)}
                        >
                          {/* {agendaObj.startTimestamp
                            ? moment(agendaObj.startTimestamp)
                                .tz(this.state.eventTimeZone)
                                .format('LT')
                            : 'Start Time'} */}

                          {agendaObj.startTimestamp
                            ? moment
                                .tz(
                                  agendaObj.startTimestamp,
                                  this.state.eventTimeZone
                                )
                                .format('LT')
                            : 'Start Time'}
                          <i className="fa fa-clock-o" aria-hidden="true" />
                        </span>

                        {(() => {
                          if (agendaObj.showContent == true) {
                            return (
                              <ul className="timelineDataList managerAgenda">
                                <li>
                                  {/*<!-- AGENDA SUMMERY -->*/}

                                  <div className="agendaSummery">
                                    {agendaObj.agendaSummeryList.map(
                                      (agenda, agendaIn) => {
                                        return (
                                          <div className="row" key={agendaIn}>
                                            <div className="col-md-12">
                                              <div className="form-group">
                                                <div className="agendaSummryInput">
                                                  {(() => {
                                                    if (
                                                      agenda.isEditing != true
                                                    ) {
                                                      return this.renderSummaryList(
                                                        agendaObj,
                                                        agenda
                                                      );
                                                    } else {
                                                      return this.renderEditField(
                                                        agendaObj,
                                                        agenda
                                                      );
                                                    }
                                                  })()}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>

                                  {/* <!-- END AGENDA SUMMERY -->*/}

                                  {/* <!-- SPEAKER DETAILS -->*/}

                                  {agendaObj.ActiveField.map(
                                    (field, fieldIndex) => {
                                      return (
                                        <div
                                          className="agendaSpeakerDetails"
                                          key={fieldIndex}
                                        >
                                          <a
                                            href="javascript:void(0)"
                                            className="checkBtn"
                                            onClick={() =>
                                              this.onAddNewAgendaSummary(
                                                agendaObj,
                                                field
                                              )
                                            }
                                          >
                                            <i className="fa fa-check" />
                                          </a>
                                          <div className="agendaSummeryField">
                                            <div className="row">
                                              <div className="col-md-12">
                                                <div className="form-group">
                                                  <label for="usr">
                                                    Agenda Summary*
                                                  </label>
                                                  <input
                                                    type="text"
                                                    className="form-control input-control"
                                                    placeholder="Lorem Ipsum"
                                                    name="newAgendaTitle"
                                                    onChange={event => {
                                                      this.onNewAgendaFieldChange(
                                                        event,
                                                        field
                                                      );
                                                    }}
                                                    value={field.summary}
                                                  />

                                                  <div className="SelectTrackDiv">
                                                    <div className="selectTrack closed">
                                                      <span
                                                        className={classNames(
                                                          'selTrack',
                                                          {
                                                            'dark-red-bg':
                                                              field.selectedtrack ==
                                                              'track1',
                                                            'purpel-bg':
                                                              field.selectedtrack ==
                                                              'track2',
                                                            'green-bg':
                                                              field.selectedtrack ==
                                                              'track3',
                                                            'red-bg':
                                                              field.selectedtrack ==
                                                              'track4',
                                                            'chocklet-bg':
                                                              field.selectedtrack ==
                                                              'track5'
                                                          }
                                                        )}
                                                        onClick={() => {
                                                          this.onSelectDropDown(
                                                            field
                                                          );
                                                        }}
                                                      >
                                                        {/* select track */}
                                                        {field.selectedtrack
                                                          ? field.selectedtrack
                                                          : 'select track'}
                                                      </span>

                                                      {(() => {
                                                        if (
                                                          field.showDropdown ==
                                                          true
                                                        ) {
                                                          return (
                                                            <div className="dropdown-menu-track">
                                                              <div className="list">
                                                                {this.state.trackList.map(
                                                                  (
                                                                    trackItem,
                                                                    trackIndex
                                                                  ) => {
                                                                    return (
                                                                      <p
                                                                        key={
                                                                          trackIndex
                                                                        }
                                                                        className={`chooseTrack ${
                                                                          trackItem.color
                                                                        }`}
                                                                        onClick={() => {
                                                                          this.onSelectTrack(
                                                                            field,
                                                                            trackItem.name
                                                                          );
                                                                        }}
                                                                      >
                                                                        {
                                                                          trackItem.name
                                                                        }
                                                                      </p>
                                                                    );
                                                                  }
                                                                )}
                                                                {/* <p
                                                                  className="chooseTrack purpel"
                                                                  onClick={() => {
                                                                    this.onSelectTrack(
                                                                      field
                                                                    );
                                                                  }}
                                                                >
                                                                  track 2
                                                                </p>
                                                                <p
                                                                  className="chooseTrack green"
                                                                  onClick={() => {
                                                                    this.onSelectTrack(
                                                                      field
                                                                    );
                                                                  }}
                                                                >
                                                                  track 3
                                                                </p>
                                                                <p
                                                                  className="chooseTrack red"
                                                                  onClick={() => {
                                                                    this.onSelectTrack(
                                                                      field
                                                                    );
                                                                  }}
                                                                >
                                                                  track 4
                                                                </p>
                                                                <p
                                                                  className="chooseTrack chocklet"
                                                                  onClick={() => {
                                                                    this.onSelectTrack(
                                                                      field
                                                                    );
                                                                  }}
                                                                >
                                                                  track 5
                                                                </p> */}
                                                              </div>
                                                            </div>
                                                          );
                                                        }
                                                      })()}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <a
                                              href="javascript:void(0)"
                                              className="cancleIconTag"
                                              onClick={() => {
                                                this.onCloseAgendaActiveField(
                                                  agendaObj
                                                );
                                              }}
                                            >
                                              <span className="ico-close">
                                                <svg>
                                                  <use
                                                    xlinkHref={`${Sprite}#close`}
                                                  />
                                                </svg>
                                              </span>
                                            </a>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}

                                  {/* <!-- END SPEAKER DETAILS -->*/}

                                  {/*<!-- ADD ONE MORE SPEAKER DETAILS -->*/}
                                  <div className="oneMoreAgendaSpeakerDetails">
                                    <a
                                      href="javascript:void(0)"
                                      onClick={() =>
                                        this.onAddNewField(agendaObj)
                                      }
                                      className={classNames('addPlusBtn', {
                                        anchorDisabled:
                                          agendaObj.ActiveField.length > 0
                                      })}
                                    >
                                      <i className="fa fa-plus" />
                                    </a>
                                  </div>

                                  {/* <!-- END ADD ONE MORE SPEAKER DETAILS -->*/}
                                </li>
                              </ul>
                            );
                          }
                        })()}
                      </div>
                    );
                  })}
                </div>

                {this.renderModal()}
              </div>
            )}
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
                    this.onSaveAgenda();
                    // this.navigateToUrlPage('/manager/sponsorList');
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

  renderHeader = () => {
    const options = {
      items: 5,
      nav: false,
      rewind: false,
      autoplay: false,
      loop: false,
      dots: false,
      smartSpeed: 300,
      responsiveClass: true,
      responsive: {
        0: {
          items: 2
        },
        600: {
          items: 4
        },
        800: {
          items: 5
        },
        1200: {
          items: 6
        },
        1300: {
          items: 7
        },
        1400: {
          items: 8
        }
      }
    };

    return (
      <header className="agendaHeader">
        <ul className="dateTabs flex-row">
          {/* <li className="active">
            <a href="javascript:void(0)">
              <span className="dayNo">DAY 1</span>
              <span className="dateNo">Tue, Dec 22 2017</span>
            </a>
          </li> */}

          <OwlCarousel ref="car" options={options}>
            {Object.keys(this.state.dateWiseAgenda)
              .sort()
              .map((key, index) => {
                return (
                  <li
                    key={index}
                    className={this.state.selectedDate == key ? 'active' : ''}
                  >
                    <a
                      href="javascript:void(0)"
                      onClick={() => {
                        this.onSelectDays(key);
                      }}
                    >
                      <span className="dayNo">
                        DAY {index + 1}
                        {'  '}{' '}
                        <i
                          onClick={event => this.onEditDate(event, key)}
                          className="fa fa-pencil"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="dateNo">
                        {moment(key).format('ddd, MMM DD YYYY')}
                      </span>
                    </a>
                  </li>
                );
              })}

            <li className="addDay">
              <a href="javascript:void(0)" onClick={this.showDate}>
                <i className="fa fa-plus" />
              </a>
            </li>
          </OwlCarousel>
        </ul>
        <a
          href="javascript:void(0)"
          onClick={() => {
            this.refs.car.prev();
          }}
          class="customPrevBtn customPrevNextbtn"
        >
          <i class="arrow left" />
        </a>
        <a
          href="javascript:void(0)"
          onClick={() => {
            this.refs.car.next();
          }}
          class="customNextBtn customPrevNextbtn"
        >
          <i class="arrow right" />
        </a>

        <DatePicker
          id="date-picker-controlled"
          label="Select date"
          autoOk={true}
          visible={this.state.visible}
          value={this.state.value}
          className="md-cell cls-add-agenda-datepicker"
          onChange={this.handleChangeDate}
          onVisibilityChange={this.handleVisibilityChangeDate}
          textFieldClassName="hide"
          // minDate={new Date()}
          // formatOptions={{timeZone: 'UTC'}}
          // minDate={new Date(this.state.eventStartDate)}
          // maxDate={new Date(this.state.eventEndDate)}
        />

        <DatePicker
          id="date-picker-controlled"
          label="Select date"
          autoOk={true}
          visible={this.state.visibleEditDate}
          value={this.state.editDatevalue}
          className="md-cell cls-add-agenda-datepicker"
          onChange={this.handleEditDate}
          onVisibilityChange={this.handleVisibilityEditDate}
          textFieldClassName="hide"
          // minDate={new Date()}
          // formatOptions={{timeZone: 'UTC'}}
          // minDate={new Date(this.state.eventStartDate)}
          // maxDate={new Date(this.state.eventEndDate)}
        />
      </header>
    );
  };

  renderModal = () => {
    return (
      <Dialog
        open={this.state.isModalVisible}
        keepMounted
        onClose={this.closeDetailsModal}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth={true}
        maxWidth={'md'}
        className="agendaDetailsModal"
      >
        <DialogTitle className="mdl-header">
          {'ADD AGENDA DETAIL'}
          <span
            className="ico-close pull-right"
            onClick={() => {
              this.closeDetailsModal();
            }}
          >
            <svg>
              <use xlinkHref={`${Sprite}#close`} />
            </svg>
          </span>
        </DialogTitle>

        <DialogContent className="mdl-body">
          <div className="agendaTimeline form-card ">
            <div className="timelineContent">
              <ul className="timelineDataList">
                <li className="savedAgendaSummery">
                  <span className="timeForAddedSummary">
                    {/* 04:00  */}
                    {/* {moment(this.state.modalDataAgendaObject.startTimestamp)
                      .tz(this.state.eventTimeZone)
                      .format('LT')} */}

                    {moment
                      .tz(
                        this.state.modalDataAgendaObject.startTimestamp,
                        this.state.eventTimeZone
                      )
                      .format('LT')}

                    {/* <span>PM</span> */}
                  </span>
                  <div
                    className={classNames('keynoteText', {
                      'dark-red-Div':
                        this.state.modalDataSummaryObject.selectedTrack ==
                        'track1',
                      'purpel-Div':
                        this.state.modalDataSummaryObject.selectedTrack ==
                        'track2',
                      'green-Div':
                        this.state.modalDataSummaryObject.selectedTrack ==
                        'track3',
                      'red-Div':
                        this.state.modalDataSummaryObject.selectedTrack ==
                        'track4',
                      'chocklet-Div':
                        this.state.modalDataSummaryObject.selectedTrack ==
                        'track5'
                    })}
                  >
                    <p>
                      {/* Opening Keynote Session – Historical Perspective &
                      Current State of the Industry */}

                      {this.state.modalDataSummaryObject.agendaSummary}
                    </p>
                    <span className="selectedTrack">
                      {' '}
                      {this.state.modalDataSummaryObject.selectedTrack ||
                        'No track'}{' '}
                    </span>
                  </div>

                  {this.state.modalDataSummaryObject.speakers.map(
                    (speaker, speakerIndex) => {
                      return (
                        <div className="row" key={speakerIndex}>
                          <div className="col-md-12">
                            {(() => {
                              if (speaker.isEditing != true) {
                                return this.renderSpeakerList(speaker);
                              } else {
                                return this.renderEditSpeakerField(
                                  speaker,
                                  speakerIndex
                                );
                              }
                            })()}
                          </div>
                        </div>
                      );
                    }
                  )}

                  {/* <div className="row">
                      <div className="col-md-12">
                        <div className="client-profile-div">
                          <span className="agendaUserIcon">
                            <img src="assets/img/admin-user.png" alt="" />
                          </span>

                          <div className="">
                            <h4 className="ctText text-left">
                              <p>
                                <span className="client-Topic-name">
                                  Topic Name
                                </span>{' '}
                                &nbsp;
                                <span className="client-time">
                                  04:00 <small> PM</small>
                                </span>
                              </p>
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

                  {/*<!-- SPEAKER DETAILS -->*/}
                  {/* <div className="agendaSpeakerDetails"> */}

                  {this.state.modalDataSummaryObject.speakersActiveField.map(
                    (activeField, fieldIndex) => {
                      return (
                        <div className="agendaSpeakerDetails" key={fieldIndex}>
                          <a
                            href="javascript:void(0)"
                            className="checkBtn"
                            onClick={() =>
                              this.onAddSpeaker(
                                this.state.modalDataAgendaObject,
                                this.state.modalDataSummaryObject,
                                activeField
                              )
                            }
                          >
                            <i className="fa fa-check" />
                          </a>
                          <div className="agendaSummeryField">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="form-group">
                                  <label htmlFor="usr">Topic Name</label>
                                  <input
                                    type="text"
                                    maxLength="100"
                                    className="form-control input-control"
                                    placeholder="Lorem Ipsum"
                                    onChange={event => {
                                      activeField.topic = event.target.value;
                                      this.setPromptFlag();
                                      this.setState({
                                        agendaDetailsObj: this.state
                                          .agendaDetailsObj
                                      });
                                    }}
                                    value={activeField.topic}
                                  />
                                </div>
                              </div>
                              <div className="col-md-5">
                                {/* <div className="form-group">
                                  <label for="usr">Select Speaker</label>

                                  <div  className="dropdown_joinevt">
                                    <div className="dropdown_joinevent closed">
                                      <div className="title">Member Name </div>
                                      <div className="dropdown-menu-event">
                                        <ul>
                                          <li>1 member</li>
                                          <li>2 members</li>
                                          <li>3 members</li>
                                          <li>4 members</li>
                                          <li>5 members</li>
                                          <li>6 members</li>
                                          <li>7 members</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div> */}

                                <div className="form-group">
                                  <label htmlFor="usr">Select Speaker</label>
                                  <select
                                    id="speakerId"
                                    name="speakerId"
                                    className="form-control input-control"
                                    onChange={event => {
                                      activeField.selectedSpeaker =
                                        event.target.value;
                                      this.setPromptFlag();
                                      this.setState({
                                        agendaDetailsObj: this.state
                                          .agendaDetailsObj
                                      });
                                    }}
                                    value={activeField.selectedSpeaker}
                                  >
                                    <option value="Select speaker name">
                                      Select speaker name
                                    </option>
                                    {this.state.speakerList.map(
                                      (speaker, speakerIndex) => {
                                        return (
                                          <option
                                            key={speakerIndex}
                                            value={speaker.speakerId}
                                          >
                                            {' '}
                                            {speaker.name}{' '}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="form-group">
                                  <label for="usr1">Start Time</label>
                                  <div className="form-control input-control text-center">
                                    {/* <TimePicker
                                      className={`selectTime speakerStartTime speakerStartTime${fieldIndex}`}
                                      placeholder=""
                                      showSecond={false}
                                      onChange={momentObj => {
                                        this.onSpeakerTimePickerValueChange(
                                          momentObj,
                                          `speakerStartTime${fieldIndex}`,
                                          1,
                                          activeField
                                        );
                                      }}
                                    /> */}

                                    <TimePicker
                                      locales="en-US"
                                      visible={activeField.showTime == true}
                                      className="md-cell cls-add-agenda-timepicker"
                                      onChange={(
                                        formattedValue,
                                        value,
                                        event
                                      ) =>
                                        this.handleChangeSpeakerTime(
                                          formattedValue,
                                          value,
                                          event,
                                          activeField,
                                          this.state.modalDataAgendaObject,
                                          this.state.modalDataSummaryObject
                                        )
                                      }
                                      onVisibilityChange={ev =>
                                        this.handleVisibilityChangeSpeakerTime(
                                          ev,
                                          activeField
                                        )
                                      }
                                      textFieldClassName="hide"
                                    />

                                    <span
                                      className="starttimeForAddedSummary"
                                      onClick={() =>
                                        this.showSpeakerTime(activeField)
                                      }
                                    >
                                      {/* {activeField.time
                                        ? moment(activeField.time)
                                            .tz(this.state.eventTimeZone)
                                            .format('LT')
                                        : 'Start Time'} */}

                                      {activeField.time
                                        ? moment
                                            .tz(
                                              activeField.time,
                                              this.state.eventTimeZone
                                            )
                                            .format('LT')
                                        : 'Start Time'}

                                      <i
                                        className="fa fa-clock-o"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <a
                              href="javascript:void(0)"
                              className="cancleIconTag"
                              onClick={() => {
                                this.state.modalDataSummaryObject.speakersActiveField = [];
                                this.updateAgenda();
                              }}
                            >
                              <span className="ico-close">
                                <svg>
                                  <use xlinkHref={`${Sprite}#close`} />
                                </svg>
                              </span>
                            </a>
                          </div>
                        </div>
                      );
                    }
                  )}

                  {/* </div> */}

                  {/*<!-- END SPEAKER DETAILS -->*/}
                  {/*<!-- ADD ONE MORE SPEAKER DETAILS -->*/}
                  <div className="oneMoreAgendaSpeakerDetails">
                    <a
                      href="javascript:void(0)"
                      className="addPlusBtn"
                      className={classNames('addPlusBtn', {
                        anchorDisabled:
                          this.state.modalDataSummaryObject.speakersActiveField
                            .length > 0
                      })}
                      onClick={() =>
                        this.onAddActiveSpeakerField(
                          this.state.modalDataAgendaObject,
                          this.state.modalDataSummaryObject
                        )
                      }
                    >
                      <i className="fa fa-plus" />
                    </a>
                  </div>
                  {/*<!-- END ADD ONE MORE SPEAKER DETAILS -->*/}
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="mdl-footer">
          <button
            type="button"
            className="btn btnInfo btnSave"
            data-dismiss="modal"
            onClick={() => {
              this.closeDetailsModal();
            }}
          >
            CLOSE
          </button>
        </DialogActions>
      </Dialog>
    );
  };

  renderSummaryList = (agendaObj, agenda) => {
    return (
      <div>
        <div
          className={classNames('keynoteText', {
            'dark-red-Div': agenda.selectedTrack == 'track1',
            'purpel-Div': agenda.selectedTrack == 'track2',
            'green-Div': agenda.selectedTrack == 'track3',
            'red-Div': agenda.selectedTrack == 'track4',
            'chocklet-Div': agenda.selectedTrack == 'track5'
          })}
        >
          <span className="licircleIcon" />
          <p>{agenda.agendaSummary}</p>
          <span className="selectedTrack">
            {agenda.selectedTrack || 'No track'}
          </span>
        </div>
        <div className="actionBtn">
          <a
            href="javascript:void(0);"
            onClick={() => this.onDeleteAgendaSummary(agendaObj, agenda)}
          >
            {/* <i className="fa fa-trash" /> */}
            <span className="ico-delete">
              <svg>
                <use xlinkHref={`${Sprite}#deleteIco`} />
              </svg>
            </span>
          </a>
          <a
            href="javascript:void(0);"
            onClick={() => {
              agenda.isEditing = true;
              agenda.localSummaryText = agenda.agendaSummary;
              agenda.localTrack = agenda.selectedTrack;
              this.updateAgenda();
              // this.setState({ agendaDetailsObj: this.state.agendaDetailsObj });
            }}
          >
            {/* <i className="fa fa-pencil" /> */}
            <span className="ico-pen">
              <svg>
                <use xlinkHref={`${Sprite}#penIco`} />
              </svg>
            </span>
          </a>
          <span
            className="summeryDetails"
            onClick={this.showDetailsModal.bind(this, agendaObj, agenda)}
          >
            {' '}
            Summary Details{' '}
          </span>
        </div>
      </div>
    );
  };

  checkValidationForEditAgenda = (summary, track, agenda) => {
    try {
      if (summary.trim() == '') {
        showWarningToast('Summary can not be empty');
        return;
      }

      if (track.trim() == '') {
        showWarningToast('Please assign track to your agenda');
        return;
      }
    } catch (err) {
      console.log(err);
    }

    agenda.isEditing = false;
    this.updateAgenda();
    this.setPromptFlagFalse();
  };

  renderEditField = (agendaObj, agenda) => {
    return (
      <div>
        <div className="agendaSpeakerDetails">
          <a
            href="javascript:void(0)"
            className="checkBtn"
            onClick={() => {
              // agenda.isEditing = false;
              // this.updateAgenda();
              this.checkValidationForEditAgenda(
                agenda.agendaSummary,
                agenda.selectedTrack,
                agenda
              );
            }}
          >
            <i className="fa fa-check" />
          </a>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label for="usr">Agenda Summary*</label>
                <input
                  type="text"
                  className="form-control input-control"
                  placeholder="Lorem Ipsum"
                  name="newAgendaTitle"
                  value={agenda.agendaSummary}
                  onChange={event => {
                    agenda.agendaSummary = event.target.value;
                    this.updateAgenda();
                    this.setPromptFlag();
                    // this.setState({
                    //   agendaDetailsObj: this.state.agendaDetailsObj
                    // });
                  }}
                />

                <div className="SelectTrackDiv">
                  <div className="selectTrack closed">
                    <span
                      className={classNames('selTrack', {
                        'dark-red-bg': agenda.selectedTrack == 'track1',
                        'purpel-bg': agenda.selectedTrack == 'track2',
                        'green-bg': agenda.selectedTrack == 'track3',
                        'red-bg': agenda.selectedTrack == 'track4',
                        'chocklet-bg': agenda.selectedTrack == 'track5'
                      })}
                      onClick={() => {
                        agenda.showDropdown = !agenda.showDropdown;
                        this.updateAgenda();
                        // this.setState({
                        //   agendaDetailsObj: this.state.agendaDetailsObj
                        // });
                      }}
                    >
                      {/* select track */}
                      {agenda.selectedTrack
                        ? agenda.selectedTrack
                        : 'select track'}
                    </span>

                    {(() => {
                      if (agenda.showDropdown == true) {
                        return (
                          <div className="dropdown-menu-track">
                            <div className="list">
                              {this.state.trackList.map(
                                (trackItem, trackIndex) => {
                                  return (
                                    <p
                                      key={trackIndex}
                                      className={`chooseTrack ${
                                        trackItem.color
                                      }`}
                                      onClick={() => {
                                        agenda.selectedTrack = trackItem.name;
                                        agenda.showDropdown = false;
                                        // this.setState({
                                        //   agendaDetailsObj: this.state
                                        //     .agendaDetailsObj
                                        // });
                                        this.updateAgenda();
                                      }}
                                    >
                                      {trackItem.name}
                                    </p>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="actionBtn">
          {/* <a href="javascript:void(0);">
            <i className="fa fa-trash" />
          </a>
          <a href="javascript:void(0);">
            <i className="fa fa-pencil" />
          </a>
          <span>
            {' '}
            add details{' '}
          </span> */}
        </div>
        <a
          href="javascript:void(0)"
          className="cancleIconTag"
          onClick={() => {
            agenda.isEditing = false;
            agenda.agendaSummary = agenda.localSummaryText;
            agenda.selectedTrack = agenda.localTrack;
            this.updateAgenda();
          }}
        >
          <span className="ico-close">
            <svg>
              <use xlinkHref={`${Sprite}#close`} />
            </svg>
          </span>
        </a>
      </div>
    );
  };

  renderSpeakerList = speaker => {
    return (
      <div className="client-profile-div">
        <span className="agendaUserIcon">
          <img
            src={speaker.selectedSpeakerDetails.imageURL || imgUserDefault}
            alt=""
          />
        </span>

        <div className="clientDetails">
          <h4 className="ctText text-left">
            <p className="mb-0">
              <span className="client-Topic-name">{speaker.topic}</span> &nbsp;
              <span className="client-time">
                {/* <small> PM</small> */}
                {/* {moment(speaker.time)
                  .tz(this.state.eventTimeZone)
                  .format('LT')} */}
                {moment.tz(speaker.time, this.state.eventTimeZone).format('LT')}
              </span>
            </p>
            <p className="client-name">
              {/* SCOOT DURUM */}
              {speaker.selectedSpeakerDetails.name}
            </p>
          </h4>
          <p className="client-position">
            {/* Chief, Section of Cytokines and Immunity */}
            {speaker.selectedSpeakerDetails.position}
          </p>
          <p className="client-institute">
            {/* NIH - National Cancer Center - Center for
            Cancer Research */}

            {speaker.selectedSpeakerDetails.company}
          </p>
        </div>

        <div className="actionBtn">
          <a
            href="javascript:void(0);"
            onClick={() =>
              this.onDeleteSummarySpeaker(
                this.state.modalDataSummaryObject,
                speaker
              )
            }
          >
            {/* <i className="fa fa-trash" /> */}
            <span className="ico-delete">
              <svg>
                <use xlinkHref={`${Sprite}#deleteIco`} />
              </svg>
            </span>
          </a>
          <a
            href="javascript:void(0);"
            onClick={() => {
              speaker.isEditing = true;
              speaker.localTopicName = speaker.topic;
              speaker.localSelectedSpeaker = speaker.selectedSpeaker;
              speaker.localTime = speaker.time;
              this.updateAgenda();
            }}
          >
            {/* <i className="fa fa-pencil" /> */}
            <span className="ico-pen">
              <svg>
                <use xlinkHref={`${Sprite}#penIco`} />
              </svg>
            </span>
          </a>
        </div>
      </div>
    );
  };

  checkValidationForEditSpeaker = (topic, speakername, time, speaker) => {
    try {
      if (topic.trim() == '') {
        showWarningToast('Please enter topic');
        return;
      }

      if (
        speakername.trim() == 'Select speaker name' ||
        speakername.trim() == ''
      ) {
        showWarningToast('Please select speaker');
        return;
      }

      if (time.trim() == '') {
        showWarningToast('Please select time');
        return;
      }
    } catch (err) {
      console.log(err);
    }

    speaker.isEditing = false;
    this.updateAgenda();
  };

  renderEditSpeakerField = (speaker, speakerEditIndex) => {
    return (
      <div className="agendaSpeakerDetails">
        <a
          href="javascript:void(0)"
          className="checkBtn"
          onClick={() => {
            this.checkValidationForEditSpeaker(
              speaker.topic,
              speaker.selectedSpeaker,
              speaker.time,
              speaker
            );
            // speaker.isEditing = false;
            // this.updateAgenda();
          }}
        >
          <i className="fa fa-check" />
        </a>
        <div className="agendaSummeryField">
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label for="usr">Topic Name</label>
                <input
                  type="text"
                  maxLength="100"
                  className="form-control input-control"
                  placeholder="Lorem Ipsum"
                  value={speaker.topic}
                  onChange={event => {
                    speaker.topic = event.target.value;
                    this.updateAgenda();
                  }}
                />
              </div>
            </div>
            <div className="col-md-5">
              <div className="form-group">
                <label htmlFor="usr">Select Speaker</label>
                <select
                  id="speakerId"
                  name="speakerId"
                  className="form-control input-control"
                  onChange={event => {
                    speaker.selectedSpeaker = event.target.value;
                    speaker.selectedSpeakerDetails = this.getSpeakerDetailsById(
                      event.target.value
                    );
                    this.updateAgenda();
                  }}
                  value={speaker.selectedSpeaker}
                >
                  <option value="Select speaker name">
                    Select speaker name
                  </option>
                  {this.state.speakerList.map((speakerObj, speakerIndex) => {
                    return (
                      <option key={speakerIndex} value={speakerObj.speakerId}>
                        {' '}
                        {speakerObj.name}{' '}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label for="usr1">Start Time</label>
                <div className="form-control input-control text-center">
                  {/* <TimePicker
                    className={`selectTime speakerStartTime speakerEditStartTime${speakerEditIndex}`}
                    placeholder=""
                    showSecond={false}
                    onChange={momentObj => {
                      speaker.time = momentObj.format('YYYY-MM-DDTHH:mm:ss');
                      this.updateAgenda();
                    }}
                  /> */}

                  <TimePicker
                    locales="en-US"
                    visible={speaker.showTime == true}
                    className="md-cell cls-add-agenda-timepicker"
                    onChange={(formattedValue, value, event) => {
                      this.handleChangeSpeakerTime(
                        formattedValue,
                        value,
                        event,
                        speaker,
                        this.state.modalDataAgendaObject,
                        this.state.modalDataSummaryObject
                      );
                    }}
                    onVisibilityChange={ev =>
                      this.handleVisibilityChangeSpeakerTime(ev, speaker)
                    }
                    textFieldClassName="hide"
                  />

                  <span
                    className="starttimeForAddedSummary"
                    // onClick={() => {
                    //   const temp = $(
                    //     `.rc-time-picker.selectTime.speakerEditStartTime${speakerEditIndex}`
                    //   ).find('input.rc-time-picker-input');
                    //   temp.trigger('click');
                    // }}

                    onClick={() => this.showSpeakerTime(speaker)}
                  >
                    {/* {speaker.time
                      ? moment(speaker.time)
                          .tz(this.state.eventTimeZone)
                          .format('LT')
                      : 'Start Time'} */}

                    {speaker.time
                      ? moment
                          .tz(speaker.time, this.state.eventTimeZone)
                          .format('LT')
                      : 'Start Time'}
                    <i className="fa fa-clock-o" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <a
            href="javascript:void(0)"
            className="cancleIconTag"
            onClick={() => {
              speaker.isEditing = false;
              speaker.topic = speaker.localTopicName;
              speaker.selectedSpeaker = speaker.localSelectedSpeaker;
              speaker.selectedSpeakerDetails = this.getSpeakerDetailsById(
                speaker.localSelectedSpeaker
              );
              speaker.time = speaker.localTime;
              this.updateAgenda();
            }}
          >
            <span className="ico-close">
              <svg>
                <use xlinkHref={`${Sprite}#close`} />
              </svg>
            </span>
          </a>
        </div>
      </div>
    );
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(AgendaTimeLineNew);
