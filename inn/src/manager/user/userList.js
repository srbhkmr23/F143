import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { getAllUsers, actionGetAllMemberPlan } from '../../common/action/index';

import imgUserDefault from '../../img/user_default.jpg';
import AlphabeticalFilter from '../common/alphabeticalFilter';
import SearchFilter from '../common/searchFilter';
import imgSearchIcon from '../../img/evSearchIcon.png';
import imgDownCaretIcon from '../../img/downCaretIcon.png';
import Img from '../../common/core/img';
import Config from '../../common/core/config';
import { displayThumbImage } from '../../common/core/common-functions';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      selectedUserList: [],
      filteredUsers: [],
      search: '',
      showDropDownList: false,
      searchKeyword: '',
      allPlanList: [],
      selectedPlan: '',
      selectedStatus: '',
      bucketName: Config.S3BucketName,
      resizedBucketName: Config.S3ResizeBucketName
    };
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterUsers = this.filterUsers.bind(this);
    window.addEventListener('click', this.handleDocumentClick);
  }

  componentWillMount() {
    this.props.getAllUsers().then(res => {
      if (res.payload && res.payload.data && res.payload.data.resourceData) {
        this.setState({
          userList: this.props.userData.all
        });
      }
    });

    this.props.actionGetAllMemberPlan().then(res => {
      if (res.payload && res.payload.data && res.payload.data.resourceData) {
        let allPlanList = res.payload.data.resourceData || [];
        this.setState({
          allPlanList: allPlanList
        });
      }
    });
  }

  // componentDidMount() {
  //   let userIds = [];
  //   if (this.props.userData.speakerListActiveEvent) {
  //     userIds = this.props.userData.speakerListActiveEvent.map(item => {
  //       return item.userIds;
  //     });
  //   }

  //   this.setState({
  //     selectedUserList: userIds
  //   });
  // }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  handleDocumentClick = evt => {
    try {
      const area = ReactDOM.findDOMNode(this.refs.dropDownArea);
      //console.log(area,evt.target);
      if (!area.contains(evt.target)) {
        this.collapse();
      }
    } catch (err) {
      // console.log(err);
    }
  };

  collapse = () => {
    this.setState({ showDropDownList: false });
  };

  filterUsers(filteredData) {
    this.setState({
      userList: filteredData,
      filteredUsers: filteredData,
      search: ''
    });
    // setTimeout(() => {
    //   this.setState({
    //     filteredUsers: this.state.userList,
    //     search: ''
    //   });
    // }, 200);
  }

  handleChange(target) {
    let userInialList = [];
    if (target.value) {
      userInialList = this.state.filteredUsers.length
        ? this.state.filteredUsers
        : this.state.userList;
      this.setState({
        userList: userInialList.filter(
          user =>
            String(user.firstName)
              .toLowerCase()
              .indexOf(String(target.value).toLowerCase()) != -1
        )
      });
    } else {
      this.setState({
        userList: this.props.userData.all
      });
    }
    // setTimeout(() => {
    //   this.setState({
    //     filteredUsers: userInialList,
    //     search: target.value
    //   });
    // }, 200);
    this.setState({
      filteredUsers: userInialList,
      search: target.value
    });
  }

  onTextChange = (text, list) => {
    let li = this.searchFilter(JSON.parse(JSON.stringify(list)), text);
    this.setState({
      search: text,
      userList: li,
      selectedPlan: '',
      selectedStatus: ''
    });
  };

  clearText = () => {
    this.setState({
      search: '',
      userList: this.props.userData.all || []
    });
  };

  searchFilter = (items, term) => {
    if (Array.isArray(items) && items.length && term && term.length) {
      return items.filter(item => {
        let keys = Object.keys(item);
        if (Array.isArray(keys) && keys.length) {
          for (let key of keys) {
            if (
              item.hasOwnProperty(key) &&
              item[key] &&
              item[key].length &&
              item[key]
                .toString()
                .toLowerCase()
                .replace(/ /g, '')
                .includes(
                  term
                    .toString()
                    .toLowerCase()
                    .replace(/ /g, '')
                )
            ) {
              return true;
            }
          }
          return false;
        } else {
          return false;
        }
      });
    } else {
      return items;
    }
  };

  filerWithStatus = text => {
    let filteredList = [];
    let allUserList = this.props.userData.all || [];
    switch (text) {
      case 'ACTIVE':
        filteredList = allUserList.filter(user => {
          return user.active == true;
        });
        break;
      case 'INACTIVE':
        filteredList = allUserList.filter(user => {
          return user.active == false;
        });
        break;

      case 'ALL':
        filteredList = allUserList;
    }
    this.setState({
      userList: filteredList,
      // showDropDownList: false,
      // selectedCategory: text,
      search: text,
      selectedPlan: '',
      selectedStatus: ''
    });
  };

  filterWithPlan = plan => {
    console.log('plan', plan);
    let planName = plan.planName || '';

    let filteredList = [];
    let allUserList = this.props.userData.all || [];

    switch (planName) {
      case 'Free':
        filteredList = allUserList.filter(user => {
          if (user.planResponse) return user.planResponse.planName == 'Free';
        });
        break;
      case 'Paid':
        filteredList = allUserList.filter(user => {
          if (user.planResponse) return user.planResponse.planName == 'Paid';
        });
        break;
      case 'Enterprise':
        filteredList = allUserList.filter(user => {
          if (user.planResponse)
            return user.planResponse.planName == 'Enterprise';
        });
    }

    this.setState({
      userList: filteredList,
      // showDropDownList: false,
      search: planName
    });
  };

  filterWithPlanAndStatus = (plan, status) => {
    let planName = plan || '';
    let statusName = status || '';

    let filteredList = [];
    let allUserList = this.props.userData.all || [];

    // switch (planName) {
    //   case 'Free':
    //     filteredList = allUserList.filter(user => {
    //       if (
    //         user.planSubscriptionResponse &&
    //         user.planSubscriptionResponse.planResponse
    //       )
    //         return (
    //           user.planSubscriptionResponse.planResponse.planName == 'Free'
    //         );
    //     });
    //     break;
    //   case 'Paid':
    //     filteredList = allUserList.filter(user => {
    //       if (
    //         user.planSubscriptionResponse &&
    //         user.planSubscriptionResponse.planResponse
    //       )
    //         return (
    //           user.planSubscriptionResponse.planResponse.planName == 'Paid'
    //         );
    //     });
    //     break;
    //   case 'Enterprise':
    //     filteredList = allUserList.filter(user => {
    //       if (
    //         user.planSubscriptionResponse &&
    //         user.planSubscriptionResponse.planResponse
    //       )
    //         return user.planSubscriptionResponse.planResponse == 'Enterprise';
    //     });
    //     break;
    //   case '':
    //     filteredList = allUserList;
    // }

    filteredList = allUserList.filter(user => {
      if (
        user.planSubscriptionResponse &&
        user.planSubscriptionResponse.planResponse
      )
        return user.planSubscriptionResponse.planResponse.planName == planName;
    });

    if (planName == '') {
      filteredList = allUserList;
    }

    let newFilteredList = [];

    switch (statusName) {
      case 'ACTIVE':
        newFilteredList = filteredList.filter(user => {
          return user.active == true;
        });
        break;
      case 'INACTIVE':
        newFilteredList = filteredList.filter(user => {
          return user.active == false;
        });
        break;
      case '':
      case 'ALL':
        newFilteredList = filteredList;
    }

    this.setState({
      userList: newFilteredList,
      search: ''
    });
  };

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
                      filterHandler={this.filterUsers}
                      filterFrom={
                        this.props.userData ? this.props.userData.all : []
                      }
                      matchKey="firstName"
                    />
                  </div>
                  <div className="col-md-4">
                    <div
                      className={classNames('eventSearchDiv', {
                        closeList: this.state.showDropDownList == false
                      })}
                      ref="dropDownArea"
                    >
                      <input
                        type="text"
                        className={classNames('form-control evSearchBox', {
                          inputFocus:
                            this.state.showDropDownList == true ||
                            this.state.search.length > 0
                        })}
                        name="Search"
                        placeholder="Search"
                        onFocus={() => {
                          this.setState({ showDropDownList: true });
                        }}
                        onChange={event => {
                          this.onTextChange(
                            event.target.value,
                            this.props.userData.all
                          );
                        }}
                        value={this.state.search}
                        ref="keyword"
                      />
                      {this.state.search.length > 0 ? (
                        <span
                          onClick={() => {
                            this.clearText();
                          }}
                          className="SelectClear"
                        >
                          ×
                        </span>
                      ) : null}

                      {this.state.showDropDownList == true ||
                      this.state.search.length > 0 ? (
                        <span className="carretDown">
                          <img src={imgDownCaretIcon} />
                        </span>
                      ) : null}

                      <img
                        src={imgSearchIcon}
                        alt=""
                        className="evSearchIcon"
                      />
                      <ul className="listCategory">
                        <li
                          className="dropdown-header"
                          onClick={event => this.filerWithStatus('ALL')}
                        >
                          ALL
                        </li>

                        {this.state.allPlanList.map((plan, planIndex) => {
                          return (
                            <li
                              class="chooseStatus"
                              key={planIndex}
                              onClick={() => {
                                // this.filterWithPlan(plan);
                                this.setState({ selectedPlan: plan.planName });
                                this.filterWithPlanAndStatus(
                                  plan.planName,
                                  this.state.selectedStatus
                                );
                              }}
                            >
                              <div>
                                <input
                                  id={`radio-plan-${planIndex}`}
                                  class="radio-custom"
                                  name="radio-group-plan"
                                  type="radio"
                                  checked={
                                    this.state.selectedPlan == plan.planName
                                  }
                                />
                                <label
                                  for={`radio-plan-${planIndex}`}
                                  class="radio-custom-label"
                                >
                                  {plan.planName}
                                </label>
                              </div>
                            </li>
                          );
                        })}

                        {/* <li>BASIC</li>
                        <li>PAID</li>
                        <li>Enterprice</li> */}
                        <li className="dropdown-header">STATUS</li>
                        <li
                          class="chooseStatus"
                          onClick={event => {
                            this.setState({ selectedStatus: 'ALL' });
                            this.filterWithPlanAndStatus(
                              this.state.selectedPlan,
                              'ALL'
                            );
                          }}
                        >
                          <div>
                            <input
                              id="radio-1"
                              class="radio-custom"
                              name="radio-group-status"
                              type="radio"
                              checked={this.state.selectedStatus == 'ALL'}
                            />
                            <label for="radio-1" class="radio-custom-label">
                              All
                            </label>
                          </div>
                        </li>
                        <li
                          class="chooseStatus"
                          onClick={event => {
                            this.setState({ selectedStatus: 'ACTIVE' });
                            this.filterWithPlanAndStatus(
                              this.state.selectedPlan,
                              'ACTIVE'
                            );
                          }}
                        >
                          <div>
                            <input
                              id="radio-2"
                              class="radio-custom"
                              name="radio-group-status"
                              type="radio"
                              checked={this.state.selectedStatus == 'ACTIVE'}
                            />
                            <label for="radio-2" class="radio-custom-label">
                              ACTIVE
                            </label>
                          </div>
                        </li>
                        <li
                          class="chooseStatus"
                          onClick={event => {
                            this.setState({ selectedStatus: 'INACTIVE' });
                            this.filterWithPlanAndStatus(
                              this.state.selectedPlan,
                              'INACTIVE'
                            );
                          }}
                        >
                          <div>
                            <input
                              id="radio-3"
                              class="radio-custom"
                              name="radio-group-status"
                              type="radio"
                              checked={this.state.selectedStatus == 'INACTIVE'}
                            />
                            <label for="radio-3" class="radio-custom-label">
                              INACTIVE
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                    {/* <SearchFilter
                      handleChange={this.handleChange}
                      placeholder="Search Users"
                    /> */}
                  </div>
                </div>
              </div>

              <div className="row">
                {this.state.userList.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="col-sm-6 col-md-3 addspeaker_overlay "
                      onClick={() => {
                        this.navigateByUrlName(
                          '/manager/user?userId=' + item.id
                        );
                      }}
                    >
                      <div
                        className={
                          this.state.selectedUserList.indexOf(item.userIds) > -1
                            ? 'addSelect-speaker mb-5 manageUserBox addSelected-speaker'
                            : 'addSelect-speaker mb-5 manageUserBox'
                        }
                      >
                        <div className="ribbon">
                          <span className="basicUserRibbon">
                            {item.planResponse
                              ? item.planResponse.planName
                              : ''}
                          </span>
                        </div>

                        {this.renderRibon(item)}

                        {/* <div className="ribbon">
                          <span className="basicUserRibbon">Basic</span>
                        </div> */}

                        {/* <div className="ribbon">
                          <span className="paidUserRibbon">Paid</span>
                        </div> */}

                        {/* <div className="ribbon">
                          <span className="enterpriseUserRibbon">Enterprise</span>
                        </div> */}

                        <div className="spImg">
                          <img
                            src={
                              item.profilePhotoURL
                                ? displayThumbImage(
                                    item.profilePhotoURL,
                                    Config.S3AlbumForMember,
                                    Config.S3Thumbnail200
                                  )
                                : imgUserDefault
                            }
                            alt=""
                          />
                        </div>

                        <div className="spInfoContainer">
                          <div className="spInfo">
                            <p className="cName text-ellipsis">
                              {item.firstName}{' '}
                            </p>
                            <p className="client-position text-ellipsis">
                              {item.profession ? item.profession[0] : ''}
                            </p>
                            <p className="client-institute text-ellipsis">
                              {item.organization}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/*<!-- EVENT SPEAKER --> */}
            <div className="events-page-footer" />
            {/*<!-- EVENT PAGE FOOTER -->*/}
          </div>
        </div>
      </div>
    );
  }

  renderRibon = user => {
    if (
      user.planSubscriptionResponse &&
      user.planSubscriptionResponse.planResponse
    ) {
      let planName = user.planSubscriptionResponse.planResponse.planName || '';

      switch (planName) {
        case 'Free':
        case 'Free Plan':
          return (
            <div className="ribbon">
              <span className="basicUserRibbon">{planName}</span>
            </div>
          );
          break;
        case 'Paid':
        case 'Base Plan':
          return (
            <div className="ribbon">
              <span className="paidUserRibbon">{planName}</span>
            </div>
          );
          break;
        case 'Enterprise':
          return (
            <div className="ribbon">
              <span className="enterpriseUserRibbon">{planName}</span>
            </div>
          );
          break;
      }
    }
  };
}

function mapStateToProps(state) {
  return {
    userData: state.userInfo,
    userInfo: state.profileData
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({ getAllUsers, actionGetAllMemberPlan }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
