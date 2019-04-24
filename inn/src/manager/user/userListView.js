import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import URLSearchParams from 'url-search-params';
import {
  actiongGetProfileDataById,
  actionGetAllCategory,
  actionChangeUserActiveStatus
} from '../../common/action/index';
//import ProfileEdit from './profileEdit';
import Img from '../../common/core/img';
import Config from '../../common/core/config';

import profileImg from '../../img/profileImg.png';
import adminuser from '../../img/admin-user.png';
import uerDefault from '../../img/user_default.jpg';
import { displayThumbImage } from '../../common/core/common-functions';
import Sprite from '../../img/sprite.svg';

class UserListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditProfileModal: false,
      isUserActive: '',
      userProfileData: {
        profession: [],
        addressResponse: {}
      },
      userAllCategoryList: [],
      showAllInterests: false,
      bucketName: Config.S3BucketName,
      resizedBucketName: Config.S3ResizeBucketName
    };
  }

  componentWillMount() {
    // let locationPathArray = this.props.location.pathname.split('/');
    // let memberId = locationPathArray[locationPathArray.length - 1];

    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    let memberId = params.get('userId') || '';

    try {
      //this.props.actiongGetProfileDataById(this.props.userInfo.id);
      this.props.actiongGetProfileDataById(memberId).then(res => {
        if (res.payload && res.payload.data && res.payload.data.status == 200) {
          this.setProfile(res.payload.data.resourceData);
          this.setSelectedCategoryIds();
        }
      });
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

        // console.log('userAllCategoryList', categoryList);

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
    //pass all data of member that matches userListId.
    // this.setProfile(this.props.userProfileData.userProfileDataById);
  }

  // componentWillReceiveProps(res) {

  //   if(res && res.userProfileData && res.userProfileData.userProfileDataById){
  //     this.setProfile(res.userProfileData.userProfileDataById);
  //   }
  //   this.setSelectedCategoryIds();
  // }

  setProfile = profileData => {
    let isUserActive = profileData.active;
    this.setState(
      {
        userProfileData: profileData,
        isUserActive: isUserActive
      },
      () => {
        this.setSelectedCategoryIds();
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

  handleActiveChange = ev => {
    // console.log(ev.target.checked)
    this.props
      .actionChangeUserActiveStatus(this.state.userProfileData.id)
      .then(res => {
        if (res.payload && res.payload.data && res.payload.data.status == 200) {
          console.log(res.payload.data);
          let isUserActive = res.payload.data.resourceData;
          this.setState({ isUserActive });
        }
      });
  };

  render() {
    const profileImage = this.state.userProfileData.profilePhotoURL
      ? displayThumbImage(
          this.state.userProfileData.profilePhotoURL,
          Config.S3AlbumForMember,
          Config.S3Thumbnail728
        )
      : '';
    return (
      <div className="main-page-wrapper">
        <div className="main">
          <section className="">
            <div className="container">
              <div className="profileWrapper">
                <div className="profile-Sec">
                  <div className="active_Deactive_Toggled">
                    <label className="switch">
                      <input
                        type="checkbox"
                        id="togBtn"
                        checked={this.state.isUserActive}
                        onClick={ev => this.handleActiveChange(ev)}
                      />
                      {/* <!--ADDED HTML --> */}
                      <div className="slider round">
                        <span className="on">
                          <span class="ico-rightTick">
                            <svg>
                              <use xlinkHref={`${Sprite}#rightTickIco`} />
                            </svg>
                          </span>
                        </span>
                        <span className="off">
                          <span class="ico-close ">
                            <svg>
                              <use xlinkHref={`${Sprite}#close`} />
                            </svg>
                          </span>
                        </span>
                      </div>
                      {/* <!--END--> */}
                    </label>
                  </div>

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
                          <use xlinkHref={`${Sprite}#map-pinIco`} />
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
                        <h3 className="evCounts">
                          {this.state.userProfileData.planResponse
                            ? this.state.userProfileData.planResponse.planName
                            : ''}
                        </h3>
                        <p className="evTillyou">Plan Name</p>
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4">
                      <div className="eventsDetails">
                        <h3 className="evCounts">
                          {this.state.userProfileData.totalSubscribedEvents}
                        </h3>
                        <p className="evTillyou">Event attended till now</p>
                      </div>
                    </div>
                    <div className="col-md-4 col-lg-4">
                      <div className="eventsDetails">
                        <h3 className="evCounts">0</h3>
                        <p className="evTillyou">Member in spaces</p>
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
                        <img src={uerDefault} alt="" />
                        <p className="activitiText">
                          {/* <span className="logName">Gorden Freeman</span> liked
                          a{' '}
                          <a href="javascript:void(0);" className="link">
                            Link
                          </a>{' '}
                          you shared */}
                          Lorem Ipsum has been the industry's standard dummy
                          text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="pActivity-Col mb-20">
                        <img src={uerDefault} alt="" />
                        <p className="activitiText">
                          {/* <span className="logName">Gorden Freeman</span> liked
                          a{' '}
                          <a href="javascript:void(0);" className="link">
                            Link
                          </a>{' '}
                          you shared */}
                          Lorem Ipsum has been the industry's standard dummy
                          text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="pActivity-Col mb-20">
                        <img src={uerDefault} alt="" />
                        <p className="activitiText">
                          {/* <span className="logName">Gorden Freeman</span> liked
                          a{' '}
                          <a href="javascript:void(0);" className="link">
                            Link
                          </a>{' '}
                          you shared */}
                          Lorem Ipsum has been the industry's standard dummy
                          text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="pActivity-Col mb-20">
                        <img src={uerDefault} alt="" />
                        <p className="activitiText">
                          {/* <span className="logName">Gorden Freeman</span> liked
                          a{' '}
                          <a href="javascript:void(0);" className="link">
                            Link
                          </a>{' '}
                          you shared */}
                          Lorem Ipsum has been the industry's standard dummy
                          text ever since the 1500s.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p>
                    <a href="javascript:void(0);" className="allViewLink">
                      View All Activities
                    </a>
                  </p>
                </div>
              </div>

              {/*=========== Edit Modal Start ==========*/}
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
          <p>
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
}

function mapStateToProps(state) {
  return {
    userInfo: state.profileData,
    userProfileData: state.userProfileData
    //userActiveStatus:state.all
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actiongGetProfileDataById: actiongGetProfileDataById,
      actionGetAllCategory: actionGetAllCategory,
      actionChangeUserActiveStatus: actionChangeUserActiveStatus
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UserListView);
