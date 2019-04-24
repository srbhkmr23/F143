import React, { Component } from 'react';
import classNames from 'classnames';
import '../../css/style.css';
import logo from '../../img/innovecsyslogoblack.png';
import lights from '../../img/lights.jpg';
import nature from '../../img/nature.jpg';
import event_1 from '../../img/event_1.jpg';

import imgHeaderLogo from '../../img/logo-dash.png';
import imgUserDefault from '../../img/user_default.jpg';
import imgTimerIcon from '../../img/timer-icon.png';
import imgEventDefault from '../../img/def_event.jpg';
import Sprite from '../../img/sprite.svg';

import { connect } from 'react-redux';
import {
  fetchEvents,
  actionMemberEventDetailsObject
} from '../../common/action';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

let $ = require('jquery');

class Calender extends Component {
  constructor(props) {
    super(props);
    this.daysInWeek = [
      // {dayName:'Sun',dayIndex:0},
      // {dayName:'Mon',dayIndex:1},
      // {dayName:'Tue',dayIndex:2},
      // {dayName:'Wed',dayIndex:3},
      // {dayName:'Thu',dayIndex:4},
      // {dayName:'Fri',dayIndex:5},
      // {dayName:'Sat',dayIndex:6}
    ];
    this.monthNames = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC'
    ];

    this.monthNamesList = [];
    // this.addMonthsInArray(new Date().getFullYear() - 1);
    this.addMonthsInArray(new Date().getFullYear());

    this.state = {
      userTypeId: '',
      weekArray: [],
      otherMonthWeekArray: [],
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      activeMonth: new Date().getMonth(),
      activeYear: new Date().getFullYear(),
      showEventModal: false,
      modalEventList: [],
      modalDate: '',
      showModal: false
    };
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
    this.onClickPrevMonth = this.onClickPrevMonth.bind(this);
    this.onClickNextMonth = this.onClickNextMonth.bind(this);
  }

  componentWillMount() {
    window.scrollTo(0, 0);
    this.createMonth(this.state.currentMonth, this.state.currentYear);

    this.otherMonthWeekArray();
    this.fetchEvents();
    // this.scroll(new Date().getMonth(), new Date().getFullYear());
  }

  componentWillReceiveProps(res) {
    console.log('res=======================>', res);
    if (res.userInfo) {
      let userTypeId = res.userInfo.userTypeId || '';
      this.setState({ userTypeId });
    }
  }

  componentDidMount() {
    $('#root').addClass('ifCalenderPage');

    this.setPosition(this.state.activeMonth);

    // var viewportTop = $(window).scrollTop();
    // var viewportBottom = viewportTop + 150//$(window).height();

    // alert(viewportTop+"====>"+viewportBottom)
    // alert($(window).height())

    // this.setPosition(0);

    // let comp = $('#monthHeader');
    // let currentMonthSpan = $('#currentMonth');
    // let distance=( currentMonthSpan.parent().offset().top-currentMonthSpan.offset().top)
    // comp.css('top',distance);

    this.scrollFirstTime(new Date().getMonth(), new Date().getFullYear());
    // setTimeout(() => {
    //   this.onScrollSetMonth();
    // }, 15000);
    // this.onScrollSetMonth();
  }

  fetchEvents() {
    let y = this.state.currentYear,
      m = 0;
    let firstDay = new Date(y, 0, 1); //2018-03-01
    let lastDay = new Date(y + 2, 11, 31); //2018-03-31

    let firstDayInUtc = moment
      .utc(moment(firstDay).format('YYYY-MM-DD') + ' 00:00:00')
      .valueOf(); //moment(firstDay).format('YYYY-MM-DD') + ' 00:00:00';
    let lastDayInUtc = moment
      .utc(moment(lastDay).format('YYYY-MM-DD') + ' 11:59:59')
      .valueOf(); //moment(lastDay).format('YYYY-MM-DD') + ' 11:59:59';

    let pageNumber = 1;
    let pageSize = 500;

    this.props
      .fetchEvents(firstDayInUtc, lastDayInUtc, pageNumber, pageSize)
      .then(res => {
        // this.scroll(new Date().getMonth(), new Date().getFullYear());
      });
  }

  date_sort_desc(date1, date2) {
    // This is a comparison function that will result in dates being sorted in
    // DESCENDING order.
    if (date1 > date2) return -1;
    if (date1 < date2) return 1;
    return 0;
  }

  date_sort_asc(date1, date2) {
    // This is a comparison function that will result in dates being sorted in
    // ASCENDING order. As you can see, JavaScript's native comparison operators
    // can be used to compare dates. This was news to me.
    if (date1 > date2) return 1;
    if (date1 < date2) return -1;
    return 0;
  }

  addMonthsInArray(year) {
    for (let i = 0; i, i <= 11; i++) {
      var tempdate = new Date(year, i, 1);
      this.monthNamesList.push(tempdate);
    }

    this.monthNamesList.sort(this.date_sort_asc);

    // new code for set current month on top (make current month first)
    try {
      let matchedIndex = -1;
      let currentMonthFirstDate;
      currentMonthFirstDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      this.monthNamesList.map((date, index) => {
        if (Number(currentMonthFirstDate) == Number(date)) {
          matchedIndex = index;
        }
      });
      let firstHalfMonth = this.monthNamesList.slice(0, matchedIndex);
      let secondHalfMonth = this.monthNamesList.slice(matchedIndex);
      let mergedArray = secondHalfMonth.concat(firstHalfMonth);
      this.monthNamesList = mergedArray || [];
    } catch (err) {}

    // console.log("currentMonthFirstDate",currentMonthFirstDate)
    // console.log("index of ",this.monthNamesList.indexOf(currentMonthFirstDate))
    console.log('this.monthNamesList', this.monthNamesList);
  }

  onScrollSetMonth = () => {
    $.fn.isInViewport = function() {
      var elementTop = $(this).offset().top; //+ 600;
      var elementBottom = elementTop + $(this).outerHeight();

      var viewportTop = $(window).scrollTop() + 250;
      var viewportBottom = viewportTop + 100; //$(window).height();

      return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    $(window).on('resize scroll', () => {
      let self = this;
      $('.cls-one').each(function() {
        var activeMonth = $(this).attr('id');
        if ($(this).isInViewport()) {
          let activeMonthIndex = parseInt(activeMonth.split('-')[1]);
          self.setPosition(activeMonthIndex - 1);
          $('#calender-year').text(activeMonth.split('-')[2]);

          // self.setState(
          //   {
          //     activeYear: parseInt(activeMonth.split('-')[2])

          //   })
        } else {
          // let activeMonthIndex = parseInt(activeMonth.split('-')[1]);
          // self.setPosition(activeMonthIndex - 1);
        }
      });
    });
  };

  setPosition(currentMonth) {
    let comp = $('#monthHeader');

    let elemCurrentMonth = $('#currentMonth');
    let topPosition = elemCurrentMonth.position().top;

    let position = 0;

    // new code for set current month on top
    try {
      let monthIndex = 0;
      this.monthNamesList.map((date, index) => {
        if (date.getMonth() == currentMonth) {
          monthIndex = index;
        }
      });
      position = monthIndex * 50;
    } catch (err) {
      console.log(err);
    }

    // switch (currentMonth) {
    //   case 0:
    //     position = 0;
    //     break;
    //   case 1:
    //     position = 50;
    //     break;
    //   case 2:
    //     position = 100;
    //     break;
    //   case 3:
    //     position = 150;
    //     break;
    //   case 4:
    //     position = 200;
    //     break;
    //   case 5:
    //     position = 250;
    //     break;
    //   case 6:
    //     position = 300;
    //     break;
    //   case 7:
    //     position = 350;
    //     break;
    //   case 8:
    //     position = 400;
    //     break;
    //   case 9:
    //     position = 450;
    //     break;
    //   case 10:
    //     position = 500;
    //     break;
    //   case 11:
    //     position = 550;
    //     break;
    // }
    // position = topPosition;
    comp.css('top', -position);
  }

  onClickPrevMonth(currentMonth, currentYear) {
    // let comp = $('#monthHeader');
    // let newHeight = parseInt(comp.css('top'));
    // console.log('newHeight', newHeight + 50);
    // comp.css('top', newHeight + 50);
    // console.log(comp);

    // console.log("currentMonth",currentMonth)

    // if(currentMonth <= (new Date()).getMonth()) {
    //   return;
    // }

    let currentFirstDayOfMonth = new Date(currentYear, currentMonth, 1);
    let prevFirstDayOfMonth;
    if (currentFirstDayOfMonth.getMonth() == 0) {
      prevFirstDayOfMonth = new Date(
        currentFirstDayOfMonth.getFullYear() - 1,
        11,
        1
      );
      // this.addMonthsInArray(currentFirstDayOfMonth.getFullYear() - 1);
    } else {
      prevFirstDayOfMonth = new Date(
        currentFirstDayOfMonth.getFullYear(),
        currentFirstDayOfMonth.getMonth() - 1,
        1
      );
    }

    this.setState(
      {
        activeMonth: prevFirstDayOfMonth.getMonth(),
        activeYear: prevFirstDayOfMonth.getFullYear()
      },
      () => {
        // this.setPosition(this.state.activeMonth);
        // this.createMonth(this.state.activeMonth, this.state.activeYear);
        this.scroll(this.state.activeMonth, this.state.activeYear);
      }
    );

    // setTimeout(() => {
    //   this.fetchEvents();
    // }, 200);
  }

  onClickNextMonth(currentMonth, currentYear) {
    // monthHeader
    // let comp = $('#monthHeader');
    // let newHeight = parseInt(comp.css('top'));
    // console.log('newHeight', newHeight - 50);
    // comp.css('top', newHeight - 50);
    // console.log(comp);

    let currentFirstDayOfMonth = new Date(currentYear, currentMonth, 1);
    let nextFirstDayOfMonth;
    if (currentFirstDayOfMonth.getMonth() == 11) {
      nextFirstDayOfMonth = new Date(
        currentFirstDayOfMonth.getFullYear() + 1,
        0,
        1
      );

      // this.addMonthsInArray(currentFirstDayOfMonth.getFullYear() + 1);
    } else {
      nextFirstDayOfMonth = new Date(
        currentFirstDayOfMonth.getFullYear(),
        currentFirstDayOfMonth.getMonth() + 1,
        1
      );
    }
    this.setState(
      {
        activeMonth: nextFirstDayOfMonth.getMonth(),
        activeYear: nextFirstDayOfMonth.getFullYear()
      },
      () => {
        // this.setPosition(this.state.activeMonth);
        // this.createMonth(this.state.activeMonth, this.state.activeYear);

        this.scroll(this.state.activeMonth, this.state.activeYear);
      }
    );

    // setTimeout(() => {
    //   this.fetchEvents();
    // }, 200);
  }

  scroll = (month, year) => {
    try {
      let id = `#1-${month + 1}-${year}`;
      let target = $(id);
      if (target.offset()) {
        $('html, body').animate(
          {
            scrollTop: target.offset().top - 280
          },
          1
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  scrollFirstTime = (month, year) => {
    try {
      let id = `#1-${month + 1}-${year}`;
      let target = $(id);
      if (target.offset()) {
        $('html, body').animate(
          {
            scrollTop: target.offset().top - 280
          },
          {
            duration: 1,
            complete: () => {
              this.onScrollSetMonth();
            }
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  createMonth(month, year) {
    let monthArray = this.getDaysArray(year, month + 1);
    let weekArray = this.getWeeksInMonth(month, year);
    weekArray.map(weekObj => {
      let weekDaysArray = [
        { dayName: 'Sun', dayIndex: 0, exist: false },
        { dayName: 'Mon', dayIndex: 1, exist: false },
        { dayName: 'Tue', dayIndex: 2, exist: false },
        { dayName: 'Wed', dayIndex: 3, exist: false },
        { dayName: 'Thu', dayIndex: 4, exist: false },
        { dayName: 'Fri', dayIndex: 5, exist: false },
        { dayName: 'Sat', dayIndex: 6, exist: false }
      ];
      monthArray.map(dayObj => {
        if (dayObj.date >= weekObj.start && dayObj.date <= weekObj.end) {
          weekDaysArray.forEach(dayObjLocal => {
            if (dayObjLocal.dayIndex == dayObj.daysIndex) {
              Object.keys(dayObj).forEach(key => {
                dayObjLocal[key] = JSON.parse(JSON.stringify(dayObj[key]));
              });
              dayObjLocal['exist'] = true;
            }
          });
        }
      });
      weekObj['weekDaysArray'] = weekDaysArray;
    });
    this.setState({
      weekArray: weekArray
    });
  }

  otherMonthWeekArray = () => {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();

    let otherMonthWeekArray = [];

    for (let i = 0; i < 48; i++) {
      let tempmonth = i + 1;
      let tempyear = new Date().getFullYear() - 1;

      // if (i > 11 && i <= 23) {
      //   tempmonth = i - 12 + 1;
      //   tempyear = tempyear + 1;
      // } else if (i > 23) {
      //   tempmonth = i - 24 + 1;
      //   tempyear = tempyear + 2;
      // }

      if (i > 11 && i <= 23) {
        tempmonth = i - 12 + 1;
        tempyear = tempyear + 1;
      } else if (i > 23 && i <= 35) {
        tempmonth = i - 24 + 1;
        tempyear = tempyear + 2;
      } else if (i > 35) {
        tempmonth = i - 36 + 1;
        tempyear = tempyear + 3;
      }

      let provideMonth = tempmonth; //tempmonth > 12 ? tempmonth : tempmonth;
      let provideYear = tempyear; //tempmonth > 12 ? year + 1 : year;

      let monthArray = this.getDaysArray(provideYear, provideMonth);
      let weekArray = this.getWeeksInMonth(provideMonth - 1, provideYear);

      weekArray.map(weekObj => {
        let weekDaysArray = [
          { dayName: 'Sun', dayIndex: 0, exist: false },
          { dayName: 'Mon', dayIndex: 1, exist: false },
          { dayName: 'Tue', dayIndex: 2, exist: false },
          { dayName: 'Wed', dayIndex: 3, exist: false },
          { dayName: 'Thu', dayIndex: 4, exist: false },
          { dayName: 'Fri', dayIndex: 5, exist: false },
          { dayName: 'Sat', dayIndex: 6, exist: false }
        ];

        monthArray.map(dayObj => {
          if (dayObj.date >= weekObj.start && dayObj.date <= weekObj.end) {
            weekDaysArray.forEach(dayObjLocal => {
              if (dayObjLocal.dayIndex == dayObj.daysIndex) {
                Object.keys(dayObj).forEach(key => {
                  dayObjLocal[key] = JSON.parse(JSON.stringify(dayObj[key]));
                });
                dayObjLocal['exist'] = true;
              }
            });
          }
        });
        weekObj['weekDaysArray'] = weekDaysArray;

        weekObj['month'] = provideMonth;
        weekObj['year'] = provideYear;
      });

      otherMonthWeekArray.push(weekArray);
    }

    console.log('otherMonthWeekArray==>', otherMonthWeekArray);

    this.setState({
      otherMonthWeekArray: otherMonthWeekArray
    });
  };

  getDaysArray(year, month) {
    let numDaysInMonth, daysInWeek, daysIndex, index, i, l, daysArray;
    let daysInFeb = year % 4 == 0 ? 29 : 28;
    numDaysInMonth = [31, daysInFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    daysInWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
    daysIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    index = daysIndex[new Date(year, month - 1, 1).toString().split(' ')[0]];
    daysArray = [];

    for (i = 0, l = numDaysInMonth[month - 1]; i < l; i++) {
      let dayObj = {};
      dayObj['dayName'] = daysInWeek[index++];
      dayObj['dayNameShort'] = dayObj['dayName'].substring(0, 3);
      dayObj['date'] = i + 1;
      dayObj['dateString'] = i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1);
      dayObj['daysIndex'] = daysIndex[dayObj['dayNameShort']];

      daysArray.push(dayObj);
      if (index == 7) index = 0;
    }

    return daysArray;
  }

  getWeeksInMonth(month, year) {
    var weeks = [],
      firstDate = new Date(year, month, 1),
      lastDate = new Date(year, month + 1, 0),
      numDays = lastDate.getDate();

    var start = 1;
    var end = 7 - firstDate.getDay();
    while (start <= numDays) {
      weeks.push({ start: start, end: end });
      start = end + 1;
      end = end + 7;
      if (end > numDays) end = numDays;
    }
    return weeks;
  }

  componentWillUnmount() {
    window.redirectLocation = this.props.location;
    $('#root').removeClass('ifCalenderPage');
    window.scrollTo(0, 0);
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  showModal = (date, month, year, eventList) => {
    let modalEventList = [];
    eventList.map(event => {
      if (
        moment(event.startTimestamp).date() == date &&
        moment(event.startTimestamp).month() == month - 1 &&
        moment(event.startTimestamp).year() == year
      ) {
        modalEventList.push(event);
      }
    });

    let modalDate = '';
    modalDate = moment([year, month - 1, date, 0, 0, 0]).format('dddd, LL');
    this.setState({ modalEventList, modalDate, showEventModal: true });

    // console.log("modalEventList",modalEventList)
    //Saturday, August 06, 2018
    //Friday, April 13, 2018
    // Friday, April 13, 2018 12:00 AM
  };

  renderEvent(date, month, year) {
    let count = 0;
    return _.map(this.props.eventlist, (event, eventIndex) => {
      if (
        event &&
        event.eventId &&
        count <= 2 &&
        moment(event.startTimestamp).date() == date &&
        moment(event.startTimestamp).month() == month - 1 &&
        moment(event.startTimestamp).year() == year
      ) {
        count++;
        return (
          <div
            className="eventInfo"
            key={event.eventId}
            onClick={() => {
              this.showEventDetails(event);
            }}
          >
            <p className="info">{event.eventName}</p>
            <span className="duration">
              {moment(event.startTimestamp).format('LT')}
            </span>
          </div>
        );
      } else if (Object.keys(this.props.eventlist).length > 3 && count == 3) {
        count++;
        return (
          <div key={event.eventId} className="showMoreText">
            {/* <Link to="/member/calender">Show more</Link> */}
            <a
              onClick={() =>
                this.showModal(date, month, year, this.props.eventlist)
              }
            >
              {' '}
              Show more{' '}
            </a>
          </div>
        );
      } else {
        return '';
      }
    });
  }

  showEventDetails = event => {
    // this.props.actionMemberEventDetailsObject({ _id: event.eventId });
    switch (this.state.userTypeId) {
      case 1:
        this.props.history.push(
          '/member/eventDetails?eventId=' + event.eventId
        );
        break;
      case 2:
        this.props.history.push(
          '/manager/eventDetails?eventId=' + event.eventId
        );
        break;
      case 3:
        break;
      default:
        break;
    }
  };

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  render() {
    return (
      <div>
        {/*<!--main content starts-->*/}
        <div className="main calender-sec">
          <div className="calender-panel">
            <div className="calender-header-panel">
              <div className="calender-header-inner">
                <div className="row">
                  <div className="col-sm-2">
                    <div className="month-title">
                      <a
                        href="javascript:void(0)"
                        onClick={() =>
                          this.onClickPrevMonth(
                            this.state.activeMonth,
                            this.state.activeYear
                          )
                        }
                      >
                        <i className="fa fa-arrow-up" />
                      </a>
                      <div className="monthSpanList">
                        <h1 id="monthHeader">
                          {this.monthNamesList.map((date, index) => {
                            return date.toString() ==
                              new Date(
                                new Date().getFullYear(),
                                new Date().getMonth(),
                                1
                              ).toString() ? (
                              <span id="currentMonth" key={index}>
                                {this.monthNames[date.getMonth()]}
                              </span>
                            ) : (
                              <span key={index}>
                                {this.monthNames[date.getMonth()]}
                              </span>
                            );
                          })}
                        </h1>
                      </div>
                      <h2 className="calender-year" id="calender-year">
                        {this.state.activeYear}
                      </h2>
                      <a
                        href="javascript:void(0)"
                        onClick={() =>
                          this.onClickNextMonth(
                            this.state.activeMonth,
                            this.state.activeYear
                          )
                        }
                      >
                        <i className="fa fa-arrow-down" />
                      </a>
                    </div>
                  </div>
                  <div className="col-sm-10">
                    <div className="calender-header">
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="row">
                            <div className="col-xs-6">
                              <p className="eventTag">Featured Event</p>
                            </div>
                            <div className="col-xs-6">
                              <p className="eventTag blue">Multi-day Event</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="durationType">
                            <label htmlFor="">show me events for:</label>
                            <a href="javascript:void(0)">everything </a>
                            <i className="fa fa-angle-right" />
                          </div>
                        </div>
                      </div>
                      <ul className="weekdays">
                        <li>S</li>
                        <li>M</li>
                        <li>T</li>
                        <li>W</li>
                        <li>T</li>
                        <li>F</li>
                        <li>S</li>
                      </ul>
                    </div>
                    {/*<!-- CALENDER HEADER -->*/}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-2" />
              <div className="col-sm-10">{this.renderOtherMonths()}</div>
            </div>
          </div>
        </div>

        {this.state.showEventModal == true ? this.renderModal() : ''}
        {/* {this.renderModal() } */}
      </div>
    );
  }

  renderOtherMonths = () => {
    return this.state.otherMonthWeekArray.map((month, monthIndex) => {
      return (
        <div className="calender-body">
          {month.map((weekObj, mainIndex) => {
            return (
              <ul key={mainIndex} className="daysList">
                {weekObj.weekDaysArray.map((dayObj, index) => {
                  return (
                    <li
                      key={index}
                      id={
                        dayObj.date == 1
                          ? `${dayObj.date}-${weekObj.month}-${weekObj.year}`
                          : ''
                      }
                      className={classNames({
                        'opacity-0': dayObj.exist == false,
                        'cls-one': dayObj.date == 1
                      })}
                    >
                      <div
                        className={
                          moment().format('YYYY-MM-DD') ==
                          `${weekObj.year}-${this.returnFormatMonth(
                            weekObj.month
                          )}-${dayObj.dateString}`
                            ? 'date today'
                            : 'date'
                        }
                      >
                        <h1>{dayObj.date}</h1>
                        <p>{dayObj.dayNameShort}</p>
                      </div>
                      {this.renderEvent(
                        dayObj.date,
                        weekObj.month,
                        weekObj.year
                      )}
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </div>
      );
    });
  };

  returnFormatMonth = month => {
    if (month < 10) {
      return '0' + month;
    } else {
      return month;
    }
  };

  closeEventModal = () => {
    this.setState({ showEventModal: false });
  };

  renderModal = () => {
    return (
      <div>
        <Dialog
          open={this.state.showEventModal}
          keepMounted
          onClose={this.closeEventModal}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth={true}
          maxWidth={'sm'}
          className="calendarEventModal"
        >
          <DialogTitle className="mdl-header">
            {/* {'Saturday, August 06, 2018'} */}
            {this.state.modalDate}
            <span
              className="ico-close pull-right"
              onClick={() => this.closeEventModal()}
            >
              <svg>
                <use xlinkHref={`${Sprite}#closeIco`} />
              </svg>
            </span>
          </DialogTitle>

          <DialogContent>
            <div className="mdl-body">
              {this.state.modalEventList.map((event, eventIndex) => {
                return (
                  <div className="evSec" key={eventIndex}>
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="c-Ev-img">
                          <img src={event.bannerImageURL || imgEventDefault} />
                        </div>
                      </div>
                      <div className="col-sm-8">
                        <div className="c-Ev-text-wrap">
                          <div className="ev-Content">
                            <h4>
                              {/* Lorem Ipsum is the dummy text */}
                              {event.eventName}
                            </h4>
                            <p>
                              {/* {moment(event.startTimestamp)
                              .tz(event.timeZone)
                              .format('MMMM Do YYYY, h:mm:ss a')} */}
                              {/* <span>04:00 PM,</span> <span>30 Min</span> */}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };
}

//export default Calender;
function mapStateToProps(state) {
  return {
    eventlist: state.events.eventlist,
    userInfo: state.profileData
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    { fetchEvents, actionMemberEventDetailsObject },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Calender);
