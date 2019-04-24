import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import '../../css/style.css';
import logo from '../../img/innovecsyslogoblack.png';
import lights from '../../img/lights.jpg';
import imgMother from '../../img/mother.jpg';
import imgUserDefault from '../../img/user_default.jpg';
import Sprite from '../../img/sprite.svg';
// import event_1 from '../../img/event_1.jpg';

class SummaryDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      summaryDetails: {
        agendaDetailsResponse: []
      },
      eventTimeZone: ''
    };
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  componentDidMount() {
    let summaryDetails = this.props.memberActiveSummary.summary || {};
    let eventTimeZone = this.props.memberActiveSummary.eventTimeZone || '';

    if (summaryDetails.hasOwnProperty('agendaTitle')) {
      this.setState({ summaryDetails, eventTimeZone }, () => {
        console.log('this.state', this.state);
      });
    } else {
      this.props.history.goBack();
    }
  }

  componentWillReceiveProps(res) {}

  render() {
    return (
      <div id="scheduleDetailsPage" className="main  main-container">
        <div className="container">
          <div className="sDetails-sec">
            <span
              class="ico-arrowIncircle"
              onClick={() => {
                this.props.history.goBack();
              }}
            >
              <svg>
                <use xlinkHref={`${Sprite}#arrowIncircleIco`} />
              </svg>
            </span>
            <div className="agendaTimeline form-card">
              <div className="timelineContent">
                <ul className="timelineDataList">
                  <li className="savedAgendaSummery">
                    <span className="timeForAddedSummary">
                      {/* 04:00  */}
                      {/* {this.state.summaryDetails.startTimestamp} */}
                      {this.state.eventTimeZone
                        ? moment(this.state.summaryDetails.startTimestamp)
                            .tz(this.state.eventTimeZone)
                            .format('hh:mm')
                        : null}
                      <span>
                        {this.state.eventTimeZone
                          ? moment(this.state.summaryDetails.startTimestamp)
                              .tz(this.state.eventTimeZone)
                              .format('A')
                          : null}
                      </span>
                    </span>
                    <div className="keynoteText">
                      <p>
                        {/* Opening Keynote Session – Historical Perspective &
                        Current State of the Industry */}

                        {this.state.summaryDetails.agendaTitle}
                      </p>
                    </div>
                  </li>
                  {/* ========== clientScheduleDetails ======= */}

                  {this.renderSpeakerDetails()}

                  {/* ========== clientScheduleDetails ======= */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderSpeakerDetails = () => {
    return this.state.summaryDetails.agendaDetailsResponse.map(
      (speaker, speakerIndex) => {
        return (
          <li className="clientScheduleDetails" key={speakerIndex}>
            <div className="row">
              <div className="col-md-12">
                <div className="client-profile-div">
                  <span className="agendaUserIcon">
                    <img
                      src={speaker.speakerResponse.imageURL || imgUserDefault}
                      alt=""
                    />
                  </span>
                  <div className="clientDetails">
                    <p className="topicName">
                      {speaker.description}
                      <div className="actionBtn">
                        <p className="client-time">
                          {/* 04:00 <small> PM</small> */}
                          {this.state.eventTimeZone
                            ? moment(speaker.startTimestamp)
                                .tz(this.state.eventTimeZone)
                                .format('LT')
                            : null}
                        </p>
                      </div>
                    </p>
                    <h4 className="text-left mb-0">
                      <span className="client-name">
                        {speaker.speakerResponse.name}
                      </span>
                    </h4>
                    <p className="client-position">
                      {/* Chief, Section of Cytokines and Immunity */}
                      {speaker.speakerResponse.position}
                    </p>
                    <p className="client-institute">
                      {/* NIH - National Cancer Center - Center for Cancer
                      Research */}
                      {speaker.speakerResponse.company}
                    </p>
                    <div className="clientDescription">
                      <p>
                        {/* Scott Durum trained in immunology at Wake
                        Forest, Oak Ridge, National Jewish and Yale
                        before coming to the National Cancer Institute,
                        National Institutes of Health. His lab has been
                        interested in the IL-7 pathway for a number of
                        years. Recently, together with collaborators,
                        they found that this is a major pathway driving
                        Acute Lymphoblastic Leukemia, the most common
                        cancer in children. They are working to develop
                        therapeutics directed against the IL-7 pathway
                        in this disease. */}
                        {speaker.speakerResponse.about}
                      </p>
                      {/* <p>
                        Scott Durum trained in immunology at Wake
                        Forest, Oak Ridge, National Jewish and Yale
                        before coming to the National Cancer Institute,
                        National Institutes of Health. His lab has been
                        interested in the IL-7 pathway for a number of
                        years. Recently, together with collaborators,
                        they found that this is a major pathway driving
                        Acute Lymphoblastic Leukemia, the most common
                        cancer in children. They are working to develop
                        therapeutics directed against the IL-7 pathway
                        in this disease.
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      }
    );
  };
}

function mapStateToProps(state) {
  return {
    memberActiveSummary: state.member.memberActiveSummary
  };
}

// const mapDispatchToProps = function(dispatch) {
//   return bindActionCreators(
//     { fetchEvents, actionMemberEventDetailsObject },
//     dispatch
//   );
// };

export default connect(mapStateToProps)(SummaryDetails);
