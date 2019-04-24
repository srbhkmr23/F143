import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import TimePicker from 'rc-time-picker';

class AddNewAgenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSpeakerDetailsHtml: false,
      agendaTitle: '',
      startTimestamp: '',
      endTimestamp: '',
      speakerArray: [
        {
          child: 1,
          speakerId: '',
          description: '',
          startTimestamp: '',
          endTimestamp: '',
          save: false
        }
      ]
    };
    this.onNewAgendaFieldChange = this.onNewAgendaFieldChange.bind(this);
    this.onAgendaTimePickerValueChange = this.onAgendaTimePickerValueChange.bind(
      this
    );
    this.onTimePickerValueChange = this.onTimePickerValueChange.bind(this);
    this.onSpeakerSelection = this.onSpeakerSelection.bind(this);
    this.addMoreSpeakerList = this.addMoreSpeakerList.bind(this);
    this.saveSpeakerDetails = this.saveSpeakerDetails.bind(this);
  }

  onNewAgendaFieldChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
    this.props.agenda[name] = value;
  };

  onAgendaTimePickerValueChange = (momentObj, stateName) => {
    this.setState({
      [stateName]: momentObj
    });
    this.props.agenda[stateName] = momentObj;
  };

  onTimePickerValueChange = (momentObj, stateName, child) => {
    console.log(momentObj, stateName, child);
    let _speakerArray = Object.assign([], this.state.speakerArray);
    console.log('_speakerArray', _speakerArray);
    for (let index = 0; index < _speakerArray.length; index++) {
      let element = _speakerArray[index];
      if (element.child === child) {
        element[stateName] = momentObj.format();
        this.setState({
          speakerArray: _speakerArray
        });
        break;
      }
    }
    console.log(this.state.speakerArray);
  };

  onSpeakerSelection = (event, child) => {
    const name = event.target.name;
    const value = event.target.value;

    let _speakerArray = Object.assign([], this.state.speakerArray);
    console.log('_speakerArray', _speakerArray);
    for (let index = 0; index < _speakerArray.length; index++) {
      let element = _speakerArray[index];
      if (element.child === child) {
        element[name] = value;
        this.setState({
          speakerArray: _speakerArray
        });
        break;
      }
    }
    console.log(this.state.speakerArray);
  };

  showHideAgendaSpeakerDeatils = () => {
    return this.state.showSpeakerDetailsHtml == true
      ? 'agendaSpeakerDetailsDiv'
      : 'agendaSpeakerDetailsDiv hide';
  };

  addMoreSpeakerList = () => {
    const arrayLength = this.state.speakerArray.length + 1;
    const addObject = {
      child: arrayLength,
      speakerId: '',
      description: '',
      startTimestamp: '',
      endTimestamp: '',
      save: false
    };
    this.setState({ speakerArray: [...this.state.speakerArray, addObject] });
    console.log('after add speaker list', this.state.speakerArray);
  };

  saveSpeakerDetails = (child, agenda) => {
    let _speakerArray = Object.assign([], this.state.speakerArray);
    console.log('_speakerArray', _speakerArray);
    for (let index = 0; index < _speakerArray.length; index++) {
      let element = _speakerArray[index];
      if (element.child === child) {
        element['save'] = true;
        this.setState({
          speakerArray: _speakerArray
        });
        break;
      }
    }
    this.props.agenda['save'] = true;
    console.log(this.state.speakerArray);
    console.log('this.props.agenda', this.props.agenda);
    this.props.updateAgendaArray(
      this.props.agenda.node,
      child,
      Object.assign([], this.state.speakerArray),
      Object.assign([], agenda)
    );
  };

  render() {
    const _speakerList = this.props.speakerList;
    const _this = this;
    const _node = this.props.agenda.node;
    return (
      <li id="singleRow" className="singleRow">
        <div className="agendaSummery">
          <div className="row">
            <div className="col-md-7">
              <div className="form-group">
                <label htmlFor="usr">
                  Agenda Summery #
                  {/* {this.props.agenda.agendaList.length + 1 || 1} */}
                </label>
                <input
                  type="text"
                  className="form-control input-control"
                  placeholder="Agenda title"
                  id="agendaTitle"
                  name="agendaTitle"
                  onChange={event => {
                    this.onNewAgendaFieldChange(event);
                  }}
                  value={this.state.agendaTitle}
                />
              </div>
            </div>
            <div className="col-md-5">
              <div className="form-group">
                <label htmlFor="usr">&nbsp;</label>
                <div className="agendaSummryInput">
                  <div className="form-control input-control flex-row">
                    <TimePicker
                      className={`selectTime agendaStartTime${_node}`}
                      placeholder=""
                      showSecond={false}
                      onChange={momentObj => {
                        this.onAgendaTimePickerValueChange(
                          momentObj,
                          'startTimestamp'
                        );
                      }}
                    />
                    <span
                      id="timepick1"
                      className="selectTime startTime"
                      onClick={() => {
                        const temp = $(
                          `.rc-time-picker.selectTime.agendaStartTime${_node}`
                        ).find('input.rc-time-picker-input');
                        temp.trigger('click');
                      }}
                    >
                      {this.props.agenda.startTimestamp
                        ? moment(this.props.agenda.startTimestamp).format(
                            'HH:mm'
                          )
                        : 'Start Time'}
                      <i className="fa fa-clock-o" aria-hidden="true" />
                    </span>

                    <span className="hyphen" />
                    <TimePicker
                      className={`selectTime agendaEndTime${_node}`}
                      placeholder=""
                      showSecond={false}
                      onChange={momentObj => {
                        this.onAgendaTimePickerValueChange(
                          momentObj,
                          'endTimestamp'
                        );
                      }}
                    />
                    <span
                      className="selectTime endTime"
                      onClick={() => {
                        const temp = $(
                          `.rc-time-picker.selectTime.agendaEndTime${_node}`
                        ).find('input.rc-time-picker-input');
                        temp.trigger('click');
                      }}
                    >
                      {this.props.agenda.endTimestamp
                        ? moment(this.props.agenda.endTimestamp).format('HH:mm')
                        : 'End Time'}
                      <i className="fa fa-clock-o" aria-hidden="true" />
                    </span>
                  </div>
                  <a
                    onClick={() => {
                      this.setState({
                        showSpeakerDetailsHtml: true
                      });
                      document
                        .getElementById('singleRow')
                        .classList.remove('singleRow');
                      this.props.addMoreAgenda();
                    }}
                    className={
                      'btn btnSuccess btnAdd ' +
                      (this.props.agenda.agendaTitle.trim().length > 0
                        ? ''
                        : 'hide')
                    }
                  >
                    <i className="fa fa-plus" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Speaker details will show here and user will select speaker from here */}
        <div
          className={this.showHideAgendaSpeakerDeatils()}
          id="agendaSpeakerDetails"
          name="agendaSpeakerDetails"
        >
          {this.state.speakerArray.map(function(item, index) {
            console.log('this.state.speakerArray', item);
            return (
              <div className="agendaSpeakerDetails">
                <a
                  className="checkBtn"
                  onClick={() => {
                    _this.saveSpeakerDetails(item.child, _this.props.agenda);
                  }}
                >
                  <i className="fa fa-check" />
                </a>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="usr">Select Speaker</label>
                      <select
                        id="speakerId"
                        name="speakerId"
                        className="form-control input-control"
                        onChange={event => {
                          _this.onSpeakerSelection(event, item.child);
                        }}
                      >
                        <option value="0">Select speaker name</option>
                        {_speakerList.map(function(speakerObj) {
                          return (
                            <option
                              key={speakerObj.speakerId}
                              value={speakerObj.speakerId}
                            >
                              {speakerObj.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="usr">Topic</label>
                      <input
                        id="description"
                        name="description"
                        type="text"
                        className="form-control input-control"
                        placeholder="Speaker topic"
                        onChange={event => {
                          _this.onSpeakerSelection(event, item.child);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="usr">Time</label>
                      <div className="form-control input-control flex-row">
                        <TimePicker
                          className={`selectTime speakerStartTime${_node}${
                            item.child
                          }`}
                          placeholder=""
                          showSecond={false}
                          onChange={momentObj => {
                            _this.onTimePickerValueChange(
                              momentObj,
                              'startTimestamp',
                              item.child
                            );
                          }}
                        />
                        <span
                          className="selectTime startTime"
                          onClick={() => {
                            const temp = $(
                              `.rc-time-picker.selectTime.speakerStartTime${_node}${
                                item.child
                              }`
                            ).find('input.rc-time-picker-input');
                            temp.trigger('click');
                          }}
                        >
                          {item.startTimetamp}
                          {item.startTimestamp
                            ? moment(item.startTimestamp).format('HH:mm')
                            : 'Start Time'}
                          <i className="fa fa-clock-o" aria-hidden="true" />
                        </span>

                        <span className="hyphen" />
                        <TimePicker
                          className={`selectTime speakerEndTime${_node}${
                            item.child
                          }`}
                          placeholder=""
                          showSecond={false}
                          onChange={momentObj => {
                            _this.onTimePickerValueChange(
                              momentObj,
                              'endTimestamp',
                              item.child
                            );
                          }}
                        />
                        <span
                          className="selectTime endTime"
                          onClick={() => {
                            const temp = $(
                              `.rc-time-picker.selectTime.speakerEndTime${_node}${
                                item.child
                              }`
                            ).find('input.rc-time-picker-input');
                            temp.trigger('click');
                          }}
                        >
                          {item.endTimestamp
                            ? moment(item.endTimestamp).format('HH:mm')
                            : 'End Time'}
                          <i className="fa fa-clock-o" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="oneMoreAgendaSpeakerDetails hide"> */}
                <div
                  className={
                    _this.state.speakerArray.length === index + 1
                      ? 'oneMoreAgendaSpeakerDetails'
                      : 'oneMoreAgendaSpeakerDetails hide'
                  }
                >
                  <a
                    className="addPlusBtn"
                    onClick={() => {
                      _this.addMoreSpeakerList();
                    }}
                  >
                    <i className="fa fa-plus" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* <div
          className={this.showHideAgendaSpeakerDeatils()}
          id="agendaSpeakerDetails"
          name="agendaSpeakerDetails"
        >
          <div className="agendaSpeakerDetails">
            <a
              className="checkBtn"
              onClick={() => {
                // this.onSaveNewAgedaDetails();
              }}
            >
              <i className="fa fa-check" />
            </a>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="usr">Select Speaker</label>
                  <select
                    id="speakerId"
                    name="speakerId"
                    className="form-control input-control"
                    onChange={event => {
                      this.onSpeakerSelection(event);
                    }}
                  >
                    <option value="0">Select speaker name</option>
                    {this.props.speakerList.map(function(speakerObj) {
                      return (
                        <option
                          key={speakerObj.speakerId}
                          value={speakerObj.speakerId}
                        >
                          {speakerObj.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="usr">Topic</label>
                  <input
                    id="newAgendaTopic"
                    name="newAgendaTopic"
                    type="text"
                    className="form-control input-control"
                    placeholder="Speaker topic"
                    onChange={event => {
                      this.onNewAgendaFieldChange(event);
                    }}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label htmlFor="usr">Time</label>
                  <div className="form-control input-control flex-row">
                    <span
                      ref={el => (this.state.timepick1 = el)}
                      id="timepick1"
                      className="selectTime startTime"
                      onClick={() => {
                        const temp = $(
                          '.rc-time-picker.selectTime.speakerStartTime'
                        ).find('input.rc-time-picker-input');
                        temp.trigger('click');
                      }}
                    >
                      {this.state.newAgendaSpeakerStartTime
                        ? moment(this.state.newAgendaSpeakerStartTime).format(
                            'HH:mm'
                          )
                        : 'Start Time'}
                      <i className="fa fa-clock-o" aria-hidden="true" />
                    </span>
                    <TimePicker
                      className="selectTime speakerStartTime"
                      placeholder=""
                      showSecond={false}
                      onChange={momentObj => {
                        this.onTimePickerValueChange(
                          momentObj,
                          'newAgendaSpeakerStartTime'
                        );
                      }}
                    />
                    <span className="hyphen" />
                    <span
                      className="selectTime endTime"
                      onClick={() => {
                        const temp = $(
                          '.rc-time-picker.selectTime.speakerEndTime'
                        ).find('input.rc-time-picker-input');
                        temp.trigger('click');
                      }}
                    >
                      {this.state.newAgendaSpeakerEndTime
                        ? moment(this.state.newAgendaSpeakerEndTime).format(
                            'HH:mm'
                          )
                        : 'End Time'}
                      <i className="fa fa-clock-o" aria-hidden="true" />
                    </span>
                    <TimePicker
                      className="selectTime speakerEndTime"
                      placeholder=""
                      showSecond={false}
                      onChange={momentObj => {
                        this.onTimePickerValueChange(
                          momentObj,
                          'newAgendaSpeakerEndTime'
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="oneMoreAgendaSpeakerDetails">
              <a className="addPlusBtn">
                <i className="fa fa-plus" />
              </a>
            </div>
          </div>
        </div> */}
      </li>
    );
  }
}

export default AddNewAgenda;
