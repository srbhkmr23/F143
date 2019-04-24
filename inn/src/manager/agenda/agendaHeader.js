import React, { Component } from 'react';
import moment from 'moment';

class AgendaHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabDate: '',
      dateFormat: 'ddd, MMM Do YYYY'
    };

    this.renderDayListOnHeader = this.renderDayListOnHeader.bind(this);
    this.onHeaderTabClick = this.onHeaderTabClick.bind(this);
  }

  onHeaderTabClick = dateString => {
    this.setState({ activeTabDate: dateString });
  };

  renderDayListOnHeader = (event, days) => {
    let returnHtml = [];
    for (let index = 0; index <= days; index++) {
      // Tue, Dec 22 2017
      const dateObj = moment(event.startTimestamp).add(index, 'days');
      //To set first date tab active by default
      if (this.state.activeTabDate === '' && index === 0) {
        this.onHeaderTabClick(dateObj.format(this.state.dateFormat));
      }
      //Make array of Header days to render on page
      returnHtml.push(
        <li
          className={
            this.state.activeTabDate === dateObj.format(this.state.dateFormat)
              ? 'active'
              : ''
          }
          onClick={() => {
            this.onHeaderTabClick(dateObj.format(this.state.dateFormat));
          }}
        >
          <a>
            <span className="dayNo">DAY {index + 1}</span>
            <span className="dateNo">
              {dateObj.format(this.state.dateFormat)}
            </span>
          </a>
        </li>
      );
    }
    return returnHtml;
  };

  render() {
    const event = this.props.events;
    const days = moment(event.endTimestamp).diff(
      moment(event.startTimestamp),
      'days'
    );
    return (
      <header className="agendaHeader">
        <ul className="dateTabs flex-row">
          {this.renderDayListOnHeader(event, days)}
          {/* <li
            className={
              this.state.activeTabDate == dateObj.format() ? 'active' : ''
            }
            onClick={() => {
              this.onHeaderTabClick(dateObj.format());
            }}
          >
            <a>
              <span className="dayNo">DAY {index + 1}</span>
              <span className="dateNo">
                {dateObj.format('ddd, MMM Do YYYY')}
              </span>
            </a>
          </li> */}
        </ul>
      </header>
    );
  }
}

export default AgendaHeader;
