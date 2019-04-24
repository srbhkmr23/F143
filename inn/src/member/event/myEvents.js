import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionGetMemberAllEvents } from '../../common/action/index';
import '../../css/style.css';
import logo from '../../img/innovecsyslogoblack.png';
import lights from '../../img/lights.jpg';
// import imgMother from '../../img/mother.jpg';
import imgEventDefault from '../../img/def_event.jpg';
import Config from '../../common/core/config';
import { displayThumbImage } from '../../common/core/common-functions';
import Sprite from '../../img/sprite.svg';

class MyEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberUserId: '',
      memberAllEvents: []
    };
    this.navigateByUrlName = this.navigateByUrlName.bind(this);

    // {
    //   subscriptionId: 'jon2c8f317aac58',
    //   eventResponse: {
    //     eventId: 'evt1ee4634c27f3',
    //     createdByUserId: 'usr5ef93012a2b9',
    //     eventName: 'my new ilu pilu',
    //     startTimestamp: 1521699836630,
    //     endTimestamp: 1521699836630,
    //     venue: '123 6th St. Melbourne, Fl 32904',
    //     timeZone: 'Asia/Calcutta',
    //     duration: 'string',
    //     fees: 10000,
    //     description: 'dsfdsfdsfdsfdsfdsf',
    //     createdTimestamp: 1521786899137,
    //     lastModifiedTimestamp: 1521786899137,
    //     bannerImageURL: '',
    //     likesCount: 0,
    //     published: false
    //   },
    //   dateOfSubscription: 0,
    //   memberTransactionResponse: {
    //     transactionId: 'trnf2cf4e267829',
    //     userResponse: null,
    //     transactionDate: 0,
    //     transStatus: 'succeeded',
    //     amountPaid: '40600.00',
    //     eventId: null
    //   }
    // }
  }

  componentWillMount() {
    if (this.props.profileData && this.props.profileData.id) {
      let memberUserId = this.props.profileData.id;
      this.setState({
        memberUserId
      });
      this.props.actionGetMemberAllEvents(memberUserId);
    }
  }

  componentWillReceiveProps(res) {
    if (res && res.memberAllEvents) {
      let memberAllEvents = res.memberAllEvents || [];
      this.setState({ memberAllEvents });
    }
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  render() {
    return (
      <div className="bg-lightGrey h-100">
        {/*<!--main content starts-->*/}

        <div id="myevents_sec" className="main-page-wrapper">
          <section className="invitfor-sec">
            <div className="container">
              {' '}
              {/*==container==*/}
              <div className="myEvents-Contents">
                <div className="common-sub-heading mb-20">
                  <h3>MY EVENTS</h3>
                </div>
                {this.renderEventList()}
              </div>
              {/*==inviWrapper==*/}
            </div>
            {/*==container==*/}
          </section>
        </div>
      </div>
    );
  }

  showEventDetails = eventId => {
    this.navigateByUrlName('/member/eventDetails?eventId=' + eventId);
  };

  renderEventList = () => {
    return this.state.memberAllEvents.map((event, eventIndex) => {
      return (
        <div className="inviWrapper" key={eventIndex}>
          <div className="row">
            <div className="col-sm-6 pr0">
              <div className="in-r-img">
                <img
                  src={
                    event.eventResponse.bannerImageURL
                      ? displayThumbImage(
                          event.eventResponse.bannerImageURL,
                          Config.S3AlbumForBanner,
                          Config.S3Thumbnail728
                        )
                      : imgEventDefault
                  }
                  className="img-responsive"
                />
                <div className="invitLabel">Conference</div>
              </div>
            </div>
            <div className="col-sm-6 pl0">
              <div className="invition_text_wrap">
                <div className="invit_address">
                  <ul className="list-inline">
                    <li>
                      <span className="ico-map-pin">
                        <svg>
                          <use xlinkHref={`${Sprite}#map-pinIco`} />
                        </svg>
                      </span>
                    </li>
                    <li>
                      {/* 123 6th St. Melbourne, Fl 32904 */}
                      {event.eventResponse.venue}
                    </li>
                    {/*<li>$15</li>*/}
                  </ul>
                </div>
                <div className="invite_content">
                  <h4>
                    {/* Parental Consultation Conference */}
                    {event.eventResponse.eventName}
                  </h4>
                  <p>
                    {event.eventResponse.description}
                    {/* Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the
                      industry's standard dummy text ever since the 1500
                      when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book. It has
                      survived not only five centuries, but also the leap
                      into electronic typesetting, remaining essentially
                      unchanged. */}
                  </p>
                </div>
                <div className="invite_button">
                  <a
                    href="javascript:void(0)"
                    className="btn-arrow"
                    onClick={() =>
                      this.showEventDetails(event.eventResponse.eventId)
                    }
                  >
                    READ MORE
                    <span className="ico-r-arrow">
                      <svg>
                        <use xlinkHref={`${Sprite}#r-arrowIco`} />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };
}
// export default MyEvents;

function mapStateToProps(state) {
  return {
    memberAllEvents: state.member.allEvents,
    profileData: state.profileData
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({ actionGetMemberAllEvents }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MyEvents);
