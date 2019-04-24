import React, { Component } from 'react';
import validator from 'validator';
import '../../css/style.css';
import logo from '../../img/innovecsyslogoblack.png';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import URLSearchParams from 'url-search-params';
import {
  actionSetJoinEventMembers,
  actionMemberEventDetailsObjectData,
  showLoader,
  hideLoader
} from '../../common/action/index';
import { showSuccessToast } from '../../common/core/common-functions';
import Sprite from '../../img/sprite.svg';

class JoinEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userEmail: '',
      userMobile: '',
      activeFieldList: [],
      eventId: '',
      eventBasePrice: '',
      eventName: '',
      eventCompany: ''
    };
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
    this.checkEventPublishedOrNot = this.checkEventPublishedOrNot.bind(this);
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  componentDidMount() {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);

    // const eventId = params.get('eventId') || '';
    // const eventBasePrice = params.get('eventBasePrice') || '';
    // const eventName = params.get('eventName') || '';
    // const eventCompany = params.get('eventCompany') || '';

    const paramEventId = params.get('eventId') || '';
    this.checkEventPublishedOrNot(paramEventId);

    let eventId = '';
    let eventBasePrice = '';
    let eventName = '';
    let eventCompany = '';
    let buyEventDetails = {};

    if (this.props.member) {
      buyEventDetails = this.props.member.buyEventDetails || {};
    }

    if (buyEventDetails.eventId) {
      eventId = buyEventDetails.eventId || '';
      eventBasePrice = buyEventDetails.eventBasePrice || '';
      eventName = buyEventDetails.eventName || '';
      eventCompany = buyEventDetails.eventCompany || '';
    }

    let activeFieldList = [];
    if (this.props.member) {
      activeFieldList = this.props.member.joinEventMembers;
    }

    if (eventId == '') {
      this.navigateByUrlName('/member/eventDetails?eventId=' + paramEventId);
    } else {
      this.setState({
        eventId,
        eventBasePrice,
        eventName,
        eventCompany,
        activeFieldList,
        userName: this.props.userProfileData.userProfileDataById.firstName,
        userEmail: this.props.userProfileData.userProfileDataById.email,
        userMobile: this.props.userProfileData.userProfileDataById.mobile
      });
    }
  }

  checkEventPublishedOrNot(eventId) {
    let _this = this;
    let sendObject = {};
    let callerMemberUserId = this.props.userProfileData.userProfileDataById.id;
    this.props.showLoader();
    sendObject = {
      eventId,
      callerMemberUserId
    };
    this.props
      .actionMemberEventDetailsObjectData(sendObject)
      .then(res => {
        _this.props.hideLoader();
        try {
          if (res.payload.data.status === 404)
            _this.navigateByUrlName('/error');
          else if (!res.payload.data.resourceData.published) {
            showSuccessToast("Can't pay for unpublished event");
            this.navigateByUrlName('/error');
          }
        } catch (error) {
          _this.props.hideLoader();
        }
      })
      .catch(error => {});
  }

  componentWillReceiveProps(res) {
    console.log('resresresres', res);
    if (res.userProfileData) {
      this.setState({
        userName: res.userProfileData.userProfileDataById.firstName,
        userEmail: res.userProfileData.userProfileDataById.email,
        userMobile: res.userProfileData.userProfileDataById.mobile
      });
    }
  }

  onAddNewActiveField = () => {
    let activeFieldList = this.state.activeFieldList;
    let newFieldObject = {
      name: '',
      email: '',
      mobile: '',
      isFieldValid: false
    };
    activeFieldList.push(newFieldObject);
    this.setState({ activeFieldList });
  };

  handleUserNumericInput = (e, field) => {
    let value = e.target.value.toString().trim();
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      field.mobile = value;
      this.updateActiveFieldList();
    }
  };

  handleUserAlphabetInputWithSpace(e, field) {
    let value = e.target.value.toString();
    const regExp = new RegExp(/^[a-zA-Z ]*$/);
    if (value === '' || regExp.test(value) === true) {
      field.name = value;
      this.updateActiveFieldList();
    }
  }

  handleUserInput(e, field) {
    let value = e.target.value.toString().trim();
    field.email = value;
    this.updateActiveFieldList();
  }

  updateActiveFieldList = () => {
    this.setState({ activeFieldList: this.state.activeFieldList });
  };

  checkIsFieldValid = field => {
    // validate name
    if (
      field.name.trim().length > 0 &&
      validator.isEmail(field.email) &&
      field.mobile.trim().length > 3
    ) {
      field.isFieldValid = true;
      console.log('f valid');
      this.updateActiveFieldList();
    } else {
      field.isFieldValid = false;
      this.updateActiveFieldList();
    }
  };

  checkIsAllFieldValid = () => {
    // if (this.state.activeFieldList.length == 0) {
    //   return false;
    // }

    for (let field of this.state.activeFieldList) {
      if (field.isFieldValid == false) {
        return false;
      }
    }
    return true;
  };

  onDeleteActiveField = field => {
    let activeFieldList = this.state.activeFieldList;
    let index = activeFieldList.indexOf(field);
    activeFieldList.splice(index, 1);
    this.updateActiveFieldList();
  };

  onClickContinue = () => {
    this.props.actionSetJoinEventMembers(this.state.activeFieldList);
    console.log('activeFieldList', this.state.activeFieldList);
    let eventBasePrice = this.state.eventBasePrice || '';
    let eventName = this.state.eventName || '';
    let eventCompany = this.state.eventCompany || '';

    // this.navigateByUrlName(
    //   '/member/joinEventPayment?eventId=' + this.state.eventId, { throughJoinEvent: true }
    // );

    this.props.history.push({
      pathname: '/member/joinEventPayment', //path
      search: '?eventId=' + this.state.eventId,
      state: { throughJoinEventPage: true } // query param named 'search'
    });
  };

  returnTotalAmount = () => {
    let totalMember = this.state.activeFieldList.length + 1;
    let totalAmount = totalMember * parseInt(this.state.eventBasePrice) || '';
    return totalAmount;
  };

  render() {
    return (
      <div className="h-100">
        <div className="h-100 bg-light">
          <section className="blkevt-bg">
            <div className="container">
              <div className="row">
                <div className="col-sm-8">
                  <div className="in-head event_headtext">
                    <h3 className="text-white m0">{this.state.eventName}</h3>
                    {/* <div className="rating ratingstar">
                      <i className="fa fa-star on" />
                      <i className="fa fa-star on" />
                      <i className="fa fa-star on" />
                      <i className="fa fa-star" />
                      <i className="fa fa-star" />
                    </div> */}
                    <p>{this.state.eventCompany}</p>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="pricing_listwrap text-right">
                    <ul className="evtpricing_list">
                      <li>
                        <span
                          className="ico-cancle"
                          onClick={this.props.history.goBack}
                        >
                          <svg>
                            <use xlinkHref={`${Sprite}#closeIco`} />
                          </svg>
                        </span>
                      </li>
                      <li>Price: ${this.state.eventBasePrice}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="main_join_event">
            <div className="container">
              <div className="row">
                <div className="jointevt col-sm-12">
                  <div className="joint-event-wrap">
                    <form className="evtform_first" action="/action_page.php">
                      <div className="row">
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="email">Member Name</label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Email"
                              value={this.state.userName}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Email"
                              value={this.state.userEmail}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-sm-4">
                          <div className="form-group">
                            <label htmlFor="email">Mobile</label>
                            <input
                              type="tel"
                              className="form-control"
                              id="mobileno"
                              placeholder="Mobile number"
                              value={this.state.userMobile}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </form>

                    <div className="other_member_form col-sm-12">
                      <div className="other_member_head">
                        <h3>Please fill details for other members:</h3>
                      </div>

                      <form action="#">
                        {this.renderFieldList()}

                        <div className="joinEvent_footer">
                          <div>
                            <a
                              className="createNewEvent"
                              onClick={() => this.onAddNewActiveField()}
                            >
                              <span className="ico-plus-create">
                                <svg>
                                  <use xlinkHref={`${Sprite}#plusCreate`} />
                                </svg>
                              </span>
                              Add Member
                            </a>
                          </div>

                          <div className="btn_joinevt">
                            <ul className="list-inline">
                              <li>
                                <button
                                  type="button"
                                  className={classNames(
                                    'btn btnInfo btnCont ripple',
                                    {
                                      disabledProp:
                                        this.checkIsAllFieldValid() == false
                                    }
                                  )}
                                  // onClick={() =>
                                  //   this.navigateByUrlName(
                                  //     '/member/joinEventPayment'
                                  //   )
                                  // }

                                  onClick={() => {
                                    this.onClickContinue();
                                  }}
                                >
                                  Continue
                                  <span className="cont_rgt_arrow">
                                    <span className="ico-rightarrow">
                                      <svg>
                                        <use
                                          xlinkHref={`${Sprite}#rightarrowIco`}
                                        />
                                      </svg>
                                    </span>
                                  </span>
                                </button>
                              </li>
                              <li className="event_totalcount">
                                Total:{' '}
                                <span className="">
                                  ${this.returnTotalAmount()}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  renderFieldList = () => {
    return this.state.activeFieldList.map((field, fieldIndex) => {
      return (
        <div className="inner_memberform" key={fieldIndex}>
          <div className="row">
            <div className="col-sm-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="buytickects"
                  placeholder="Member Name"
                  value={field.name}
                  onChange={e => {
                    this.handleUserAlphabetInputWithSpace(e, field);
                    this.checkIsFieldValid(field);
                  }}
                  // onBlur={()=>{this.checkIsFieldValid(field)}}
                />
              </div>
            </div>

            <div className="col-sm-4">
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={field.email}
                  onChange={e => {
                    this.handleUserInput(e, field);
                    this.checkIsFieldValid(field);
                  }}
                  // onBlur={()=>{this.checkIsFieldValid(field)}}
                />
              </div>
            </div>

            <div className="col-sm-4">
              <div className="form-group">
                <input
                  type="tel"
                  className="form-control"
                  id="mobileno"
                  placeholder="Mobile number"
                  value={field.mobile}
                  maxLength="13"
                  onChange={e => {
                    this.handleUserNumericInput(e, field);
                    this.checkIsFieldValid(field);
                  }}
                  // onBlur={()=>{this.checkIsFieldValid(field)}}
                />
              </div>
            </div>

            <a
              className="evt-delete1"
              onClick={() => {
                this.onDeleteActiveField(field);
              }}
            >
              <span className="ico-delete">
                <svg>
                  <use xlinkHref={`${Sprite}#deleteIco`} />
                </svg>
              </span>
            </a>
          </div>
        </div>
      );
    });
  };
}

function mapStateToProps(state) {
  return {
    events: state.events,
    userProfileData: state.userProfileData,
    member: state.member
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actionSetJoinEventMembers,
      actionMemberEventDetailsObjectData,
      showLoader,
      hideLoader
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinEvent);
// export default JoinEvent;
