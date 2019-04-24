import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import innovecsysApiService from '../../common/core/api';

import {
  getAllEvents,
  actionSetAllSpeakersActiveEvent,
  actionGetAllSpeakersByEvent
} from '../../common/action/index';

import StepNavBar from '../common/stepNavBar';
import Sprite from '../../img/sprite.svg';
// import imgSpeaker from '../../img/team1.jpg';
// import imgAddSpeaker from '../../img/added_speakers-icon.png';

class InvitationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: []
    };
    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {}

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

  render() {
    return (
      <div className="main-container">
        <div className="inner-page">
          <StepNavBar
            navigateToUrlPage={this.navigateToUrlPage}
            tabName="eventInvitation"
            isEditEvent={this.props.events.isEditEvent}
          />

          <div className="events-page design-bg">
            <div className="inviteMembers-Sec">
              <h3 className="text-center ">Invite Members</h3>

              <div className="addedUserEmail-Sec">
                <form className="form-card ">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="usr">Invite Members</label>
                        <div className="inviteEmailInput">
                          <input
                            type="text"
                            className="form-control input-control ripple mb-5"
                            placeholder="Enter Email"
                          />
                          <a
                            href="javascript:void(0)"
                            className="btn btnSuccess btnAddUser"
                          >
                            Add User
                          </a>
                        </div>
                        <a
                          href="javascript:void(0);"
                          className="labelText linkText pull-right"
                        >
                          Suggest Members
                        </a>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="addedUser-Sec">
                <p className="addedUserBadge">
                  <a href="javascript:void(0);">
                    Added Users <span className="badge">22</span>
                  </a>
                </p>

                <div className="row">
                  <div className="addedUserList">
                    <div className="col-sm-6 col-md-3 col-lg-15">
                      <div className="addedUsercol">
                        <p className="addeduserName text-ellipsis">User Name</p>
                        <span className="ico-close">
                          <svg>
                            <use xlinkHref={`${Sprite}#close`} />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-15">
                      <div className="addedUsercol">
                        <p className="addeduserName text-ellipsis">User Name</p>
                        <span className="ico-close">
                          <svg>
                            <use xlinkHref={`${Sprite}#close`} />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-15">
                      <div className="addedUsercol">
                        <p className="addeduserName text-ellipsis">User Name</p>
                        <span className="ico-close">
                          <svg>
                            <use xlinkHref={`${Sprite}#close`} />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-15">
                      <div className="addedUsercol">
                        <p className="addeduserName text-ellipsis">User Name</p>
                        <span className="ico-close">
                          <svg>
                            <use xlinkHref={`${Sprite}#close`} />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-15">
                      <div className="addedUsercol">
                        <p className="addeduserName text-ellipsis">User Name</p>
                        <span className="ico-close">
                          <svg>
                            <use xlinkHref={`${Sprite}#close`} />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-15">
                      <div className="addedUsercol">
                        <p className="addeduserName text-ellipsis">User Name</p>
                        <span className="ico-close">
                          <svg>
                            <use xlinkHref={`${Sprite}#close`} />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-15">
                      <div className="addedUsercol">
                        <p className="addeduserName text-ellipsis">User Name</p>
                        <span className="ico-close">
                          <svg>
                            <use xlinkHref={`${Sprite}#close`} />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-15">
                      <div className="addedUsercol">
                        <p className="addeduserName text-ellipsis">User Name</p>
                        <span className="ico-close">
                          <svg>
                            <use xlinkHref={`${Sprite}#close`} />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-15">
                      <div className="addedUsercol">
                        <p className="addeduserName text-ellipsis">User Name</p>
                        <span className="ico-close">
                          <svg>
                            <use xlinkHref={`${Sprite}#close`} />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-15">
                      <div className="addedUsercol">
                        <p className="addeduserName text-ellipsis">User Name</p>
                        <span className="ico-close">
                          <svg>
                            <use xlinkHref={`${Sprite}#close`} />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3 col-lg-15">
                      <div className="addedUsercol">
                        <p className="addeduserName text-ellipsis">User Name</p>
                        <span className="ico-close">
                          <svg>
                            <use xlinkHref={`${Sprite}#close`} />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center">
                <a className="btn btnInfo btnInvite ripple">INVITE</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    userInfo: state.profileData,
    speakers: state.speakers
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      getAllEvents,
      actionSetAllSpeakersActiveEvent,
      actionGetAllSpeakersByEvent
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(InvitationList);
