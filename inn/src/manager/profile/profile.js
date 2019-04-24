// import React, { Component } from 'react';

// class Profile extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {

//     };

//   }

//   render() {

//     return (
//         <div>
//         <h1>Neha Neema Neha Neema Neha Neema Neha Neema Neha Neema </h1>
//         <h1>Neha Neema Neha Neema Neha Neema Neha Neema Neha Neema </h1>
//         <h1>Neha Neema Neha Neema Neha Neema Neha Neema Neha Neema </h1>
//         <h1>Neha Neema Neha Neema Neha Neema Neha Neema Neha Neema </h1>
//         <h1>Neha Neema Neha Neema Neha Neema Neha Neema Neha Neema </h1>
//         </div>
//     );
//   }
// }

// export default Profile;

import React, { Component } from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroller';
import classNames from 'classnames';

import {
  actiongGetProfileDataById,
  actionGetAllCategory
} from '../../common/action/index';
import ProfileEdit from './profileEdit';
import Img from '../../common/core/img';

import logo from '../../img/innovecsyslogoblack.png';
import lights from '../../img/lights.jpg';
import nature from '../../img/nature.jpg';
import event_1 from '../../img/event_1.jpg';
import profileImg from '../../img/profileImg.png';
import adminuser from '../../img/admin-user.png';
import fourColimg from '../../img/fourColimg.png';
import uerDefault from '../../img/user_default.jpg';
import Sprite from '../../img/sprite.svg';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditProfileModal: false,
      userProfileData: {
        profession: [],
        addressResponse: {}
      },
      userAllCategoryList: [],
      showAllInterests: false
    };
  }

  componentWillMount() {
    try {
      this.props.actiongGetProfileDataById(this.props.userInfo.id);
      this.props.actionGetAllCategory().then(res => {
        let categoryList = res.payload.data.resourceData || [];
        let selectedUserCategoryList = [];

        categoryList.map(categoryObj => {
          let catObj = {};
          catObj['id'] = categoryObj.categoryId;
          catObj['listOfIdAndName'] = [];
          selectedUserCategoryList.push(catObj);
          categoryObj['selectedIds'] = [];
        });

        console.log('userAllCategoryList', categoryList);

        this.setState(
          {
            userAllCategoryList: categoryList,
            selectedUserCategoryList: selectedUserCategoryList
          },
          () => {
            this.setSelectedCategoryIds();
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.setProfile(this.props.userProfileData.userProfileDataById);
  }

  componentWillReceiveProps(res) {
    console.log('userAllCategoryList', this.state.userAllCategoryList);
    this.setProfile(res.userProfileData.userProfileDataById);
    this.setSelectedCategoryIds();
  }

  setProfile = profileData => {
    this.setState(
      {
        userProfileData: profileData
      },
      () => {
        this.setSelectedCategoryIds();
      }
    );
  };

  showEditPrifile = () => {
    // this.setSelectedCategoryIds();

    this.setState(
      { showEditProfileModal: !this.state.showEditProfileModal },
      () => {
        let $ = require('jquery');
        $('#myModal').modal();
      }
    );
  };

  setSelectedCategoryIds = () => {
    // set selected ids
    let selectedIds = this.state.userProfileData.listOfCategoryId || [];
    let userAllCategoryList =
      JSON.parse(JSON.stringify(this.state.userAllCategoryList)) || [];
    userAllCategoryList.map(categoryObj => {
      categoryObj['selectedIds'] = [];
      selectedIds.map(selObj => {
        if (categoryObj.categoryId == selObj.id) {
          selObj.listOfIdAndName.forEach(item => {
            categoryObj['selectedIds'].push(item.id);
          });
        }
      });
    });

    this.setState({ userAllCategoryList: userAllCategoryList });
  };

  refresProfileData = () => {
    this.props.actiongGetProfileDataById(this.props.userInfo.id);
  };

  render() {
    const profileImage = this.state.userProfileData['profilePhotoURL']
      ? this.state.userProfileData['profilePhotoURL']
      : '';
    return (
      <div className="main-page-wrapper">
        <div className="main">
          <section className="">
            <div className="container">
              <div className="profileWrapper">
                <div className="profile-Sec">
                  <a
                    href="javascript:void(0);"
                    className="pEditIcon"
                    onClick={() => this.showEditPrifile()}
                  >
                    <span className="ico-pen">
                      <svg>
                        <use xlinkHref={`${Sprite}#penIco`} />
                      </svg>
                    </span>
                  </a>

                  <div className="profileImg">
                    <Img src={profileImage} default={uerDefault} />
                  </div>
                  <div className="pDescription">
                    <h4 className="cName">{`${
                      this.state.userProfileData.firstName
                    } ${this.state.userProfileData.lastName}`}</h4>
                    <p className="cPosition">
                      {/* President & Chief Executive Officer */}
                      {this.state.userProfileData.profession
                        ? this.state.userProfileData.profession[0]
                        : null}
                    </p>
                    <p className="cInstitute">
                      {/* PALTOWN Development Foundation */}
                      {this.state.userProfileData.organization}
                    </p>
                    <p className="cLocation">
                      <span className="ico-user">
                        <svg>
                          <use xlinkHref={`${Sprite}#app-pinIco`} />
                        </svg>
                      </span>
                      {/* 71 Pilgrim Avenue Chevy Chase, MD 20815 */}
                      {this.state.userProfileData.addressResponse
                        ? this.state.userProfileData.addressResponse
                            .detailedLocation
                        : ''}
                    </p>
                    <ul className="social-contact">
                      <li>
                        <a href="javascript:void(0);">
                          <i className="fa fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0);">
                          <i className="fa fa-linkedin" />
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0);">
                          <i className="fa fa-facebook" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pDashboard">
                  <h4>Your Dashboard</h4>
                  <div className="row">
                    <div className="col-md-4 col-lg-4">
                      <div className="eventsDetails">
                        <h3 className="evCounts">00</h3>
                        <p className="evTillyou">Plan purchased</p>
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4">
                      <div className="eventsDetails">
                        <h3 className="evCounts">48</h3>
                        <p className="evTillyou">Event attended till now</p>
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4">
                      <div className="eventsDetails">
                        <h3 className="evCounts">00</h3>
                        <p className="evTillyou">Member is spaces</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="Interests-Sec">{this.renderInterest()}</div>

                <div className="activityLog-Sec">
                  <h3>Your Activity Log</h3>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="pActivity-Col mb-20">
                        <img src={adminuser} alt="" />
                        <p className="activitiText">
                          <span className="logName">Gorden Freeman</span> liked
                          a{' '}
                          <a href="javascript:void(0);" className="link">
                            Link
                          </a>{' '}
                          you shared
                        </p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="pActivity-Col mb-20">
                        <img src={adminuser} alt="" />
                        <p className="activitiText">
                          <span className="logName">Gorden Freeman</span> liked
                          a{' '}
                          <a href="javascript:void(0);" className="link">
                            Link
                          </a>{' '}
                          you shared
                        </p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="pActivity-Col mb-20">
                        <img src={adminuser} alt="" />
                        <p className="activitiText">
                          <span className="logName">Gorden Freeman</span> liked
                          a{' '}
                          <a href="javascript:void(0);" className="link">
                            Link
                          </a>{' '}
                          you shared
                        </p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="pActivity-Col mb-20">
                        <img src={adminuser} alt="" />
                        <p className="activitiText">
                          <span className="logName">Gorden Freeman</span> liked
                          a{' '}
                          <a href="javascript:void(0);" className="link">
                            Link
                          </a>{' '}
                          you shared
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-center">
                    <a href="javascript:void(0);" className="allViewLink">
                      View All Activities
                    </a>
                  </p>
                </div>
              </div>

              {/*=========== Edit Modal Start ==========*/}
              {this.renderEditProfileModal()}
            </div>
          </section>
        </div>
      </div>
    );
  }

  renderInterest = () => {
    return (
      <div>
        <div className="subTitle">
          <h3>Interests</h3>
        </div>
        <div className="">
          <div
            className="interestsDiv showAllInterests"
            className={classNames('interestsDiv', {
              showAllInterests: this.state.showAllInterests == true
            })}
          >
            <ul className="insterestList">
              {this.state.userAllCategoryList.map(interestCtegory => {
                return interestCtegory.subCategoryRes.map(
                  (subCategory, index) => {
                    return interestCtegory.selectedIds.indexOf(
                      subCategory.subCategoryId
                    ) > -1 ? (
                      <li key={subCategory.subCategoryId}>
                        <a>{subCategory.subCategoryName}</a>
                      </li>
                    ) : null;
                  }
                );
              })}
            </ul>
          </div>
          <p className="text-center">
            <a
              href="javascript:void(0);"
              className="allViewLink"
              onClick={() => {
                this.setState({
                  showAllInterests: !this.state.showAllInterests
                });
              }}
            >
              {this.state.showAllInterests ? 'View Less' : 'View All Interests'}
            </a>
          </p>
        </div>
      </div>
    );
  };

  renderEditProfileModal = () => {
    return (
      <div>
        <ProfileEdit
          userProfileData={this.state.userProfileData}
          userAllCategoryList={this.state.userAllCategoryList}
          selectedUserCategoryList={this.state.selectedUserCategoryList}
          userId={this.props.userInfo ? this.props.userInfo.id : ''}
          refresProfileData={this.refresProfileData}
          showEditProfileModal={this.state.showEditProfileModal}
        />
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    userInfo: state.profileData,
    userProfileData: state.userProfileData
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actiongGetProfileDataById: actiongGetProfileDataById,
      actionGetAllCategory: actionGetAllCategory
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
