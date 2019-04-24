import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import {
  actionDashboardData,
  actionUserLogout
} from '../../common/action/index';
import ChangePassword from '../../common/change-password/change-password';
import Notification from './notification';

import imgHeaderLogo from '../../img/logo-dash.png';
import imgUserDefault from '../../img/user_default.jpg';
// import imgTimerIcon from '../../img/timer-icon.png';
import imgCalenderIcon from '../../img/calender-icon.png';
import logo from '../../img/innovecsyslogoblack.png';
import Sprite from '../../img/sprite.svg';

import { stat } from 'fs';

let $ = require('jquery');

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChangePassword: false,
      activeMenu: '',
      managerHeader: false,
      memberHeader: false,
      landingHeader: false,
      userTypeId: ''
    };
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
    this.showChangePasswordHandler = this.showChangePasswordHandler.bind(this);
    this.logOutClicked = this.logOutClicked.bind(this);
  }

  componentDidMount() {
    this.props.actionDashboardData();
    this.getPath();

    var self = this;
    $(window).scroll(function() {
      var headerVal = $(window).scrollTop();
      if (headerVal > 50) {
        $('.main-header').addClass('fixedHeader');
        $('.ifContainer')
          .addClass('container-fluid')
          .removeClass('container');
      } else {
        $('.main-header').removeClass('fixedHeader');
        $('.ifContainer')
          .removeClass('container-fluid')
          .addClass('container');
      }
    });
  }

  componentWillReceiveProps(res) {
    // console.log(res);
    if (res.userInfo) {
      this.setState({ userTypeId: res.userInfo.userTypeId });
    }
  }

  showChangePasswordHandler() {
    this.setState({
      showChangePassword: true
    });
  }

  getPath = () => {
    let currentPath = window.location.pathname;
    switch (currentPath) {
      case '/member/home':
        this.setActiveMenu('home');
        break;
      case '/member/calender':
        this.setActiveMenu('calender');
        break;
      case '/member/myEvents':
        this.setActiveMenu('event');
        break;
    }
  };

  navigateByUrlName = urlName => {
    this.props.navigateByUrlName(urlName);
  };

  setActiveMenu = menuName => {
    this.setState({ activeMenu: menuName });
  };

  onCloseChangePassword = () => {
    this.setState({
      showChangePassword: false
    });
  };

  componentWillMount() {
    this.getPath();
    if (this.props.userInfo == null || this.props.userInfo == '') {
      //this.props.history.push('/');
    }
    /*if(this.props.userInfo.id == '') {
      this.props.history("/");
    }*/
  }

  capitalizeFirstLetter(string) {
    if (string)
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  logOutClicked() {
    this.props.actionUserLogout();
    this.props.onLogoutClick();
  }

  // navigateByUrlName(pageName) {
  //   this.props.parentProps.history.push(pageName);
  // }

  openProfile = () => {
    const userTypeId = this.props.userInfo.userTypeId;
    switch (userTypeId) {
      case 1:
        this.navigateByUrlName('/member/profile');
        break;
      case 2:
        break;
      case 3:
        break;
      default:
        break;
    }
  };

  toggleSideBar = () => {
    try {
      const sideMenu = document.getElementById('leftSidebar');
      const classes = sideMenu.className.split(' ');
      if (classes.indexOf('toggledLeftSideBar') >= 0) {
        sideMenu.classList.remove('toggledLeftSideBar');
      } else {
        sideMenu.classList.add('toggledLeftSideBar');
      }
    } catch (err) {}
  };

  render() {
    let userName = 'Manager';
    let userImage = '';
    try {
      // console.log(this.props.userInfo);
      userName = this.props.userInfo.firstName;
      userImage = this.props.userInfo
        ? this.props.userInfo.profilePhotoURL
        : imgUserDefault;
    } catch (e) {}
    let userTypeId =
      this.props.userInfo && this.props.userInfo.userTypeId
        ? this.props.userInfo.userTypeId
        : '';

    //console.log(userImage);

    return [
      // Header for manager and Admin
      <header
        className={`mainHeader ${
          userTypeId === 2 || userTypeId === 3 ? '' : 'hide'
        }`}
      >
        <a className="logoTag" onClick={() => this.navigateByUrlName('/')}>
          <img src={imgHeaderLogo} alt="" />
        </a>
        <nav className="evMenu">
          <ul className="evrntNotificatoinNav active">
            <li>
              <div className="totalEv">
                <span className="ico-totalmember evIcons">
                  <svg>
                    <use xlinkHref={`${Sprite}#totalmemberIco`} />
                  </svg>
                </span>
                <span className="showAllev">Total Members: </span>
                <a>{this.props.countData.totalMembers}</a>
              </div>
            </li>
            <li>
              <div className="totalEv">
                <span className="ico-totalevent evIcons">
                  <svg>
                    <use xlinkHref={`${Sprite}#totaleventIco`} />
                  </svg>
                </span>
                <span className="showAllev">Total Events: </span>
                <a>{this.props.countData.totalPublishedEvents}</a>
              </div>
            </li>
            <li>
              <div className="totalEv">
                <span className="ico-totalspeaker evIcons">
                  <svg>
                    <use xlinkHref={`${Sprite}#totalspeakerIco`} />
                  </svg>
                </span>
                <span className="showAllev">Total Speakers: </span>
                <a>{this.props.countData.totalSpeakers}</a>
              </div>
            </li>
            <li>
              <div className="totalEv">
                <span className="ico-totalsponsor evIcons">
                  <svg>
                    <use xlinkHref={`${Sprite}#totalsponsorIco`} />
                  </svg>
                </span>
                <span className="showAllev">Total sponsors: </span>
                <a>{this.props.countData.totalSponsors}</a>
              </div>
            </li>
            <li className="hide">
              <span>
                <img src={imgCalenderIcon} className="calender-icon" /> Upcoming
                Event:
              </span>
              <a> Upcoming Event Name</a>
            </li>
          </ul>
          <a
            className="toggle-leftSideNav"
            href="javascript:void(0)"
            onClick={() => this.toggleSideBar()}
          >
            <i className="fa fa-bars" />
          </a>
        </nav>

        {/* <div className="loginTag flex-row ">
          <p>
            Hello, <span className="bold">{loginUserName}</span>{" "}
            <i className="fa fa-caret-down" />
          </p>
          <span className="managerProfile">
            <img src={imgUserDefault} alt="" />
          </span>
        </div> */}

        <div className="rightContMobView">
          <a className="btn btnInfo ripple inHeadpublish">
            <i className="fa fa-bullhorn" /> PUBLISH{' '}
          </a>
          <div className="loginTag dropdown">
            <div className="dropdown-toggle flex-row " data-toggle="dropdown">
              <p>
                Hello,{' '}
                <span className="bold">
                  {this.capitalizeFirstLetter(userName)}
                </span>{' '}
              </p>

              <span className="ico-rightarrow">
                <svg>
                  <use xlinkHref={`${Sprite}#rightarrowIco`} />
                </svg>
              </span>

              <span className="managerProfile">
                {this.props.userInfo && this.props.userInfo.userTypeId == 1 ? (
                  <img
                    src={userImage ? userImage : imgUserDefault}
                    alt="2"
                    onError={e => {
                      e.target.src = imgUserDefault;
                    }}
                  />
                ) : (
                  <img src={imgUserDefault} alt={imgUserDefault} />
                )}
              </span>
            </div>
            <ul className="dropdown-menu">
              {this.props.userInfo && this.props.userInfo.userTypeId == 1 ? (
                <li>
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      this.openProfile();
                    }}
                  >
                    <span>Profile</span>
                    <span className="ico-user">
                      <svg>
                        <use xlinkHref={`${Sprite}#userIco`} />
                      </svg>
                    </span>
                  </a>
                </li>
              ) : null}

              <li>
                <a onClick={this.showChangePasswordHandler}>
                  <span>Change password</span>
                  <span className="ico-user">
                    <svg>
                      <use xlinkHref={`${Sprite}#lockIco`} />
                    </svg>
                  </span>
                </a>
              </li>
              {/*<li>

                <a>
                  Notifications
                  <span className="ico-user">
                    <svg>
                      <use xlinkHref="/img/sprite.svg#notificationIco" />
                    </svg>
                  </span>
                </a>
              </li> */}
              <li>
                <a onClick={() => this.logOutClicked()}>
                  <span>Logout</span>
                  <span className="ico-user">
                    <svg>
                      <use xlinkHref={`${Sprite}#logoutIco`} />
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <ChangePassword
          openDialog={this.state.showChangePassword}
          onCloseChangePassword={this.onCloseChangePassword}
          userInfo={this.props.userInfo}
        />
      </header>,
      // ***********************Header for memeber*******************************
      <header
        className={`main-header isHome ${userTypeId === 1 ? '' : 'hide'}`}
      >
        <nav className="navbar navbar-default navbar-fixed-top custom-navbar">
          <div
            className="brand cursorPointer"
            onClick={() => this.navigateByUrlName('/')}
          >
            {/* <Link to="/"> */}
            <img src={logo} alt="" className="img-responsive pc-view" />
            {/* </Link> */}
          </div>
          <div className="container-fluid">
            <div className="nav navbar-nav navbar-left">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#dash-nav"
              >
                <span className="sr-only">Toggle</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <ul
                className="nav navbar-nav navbar-collapse collapse"
                id="dash-nav"
              >
                <li>
                  <a
                    href="javascript:void(0);"
                    className={classNames({
                      activeMenu: this.state.activeMenu == 'home'
                    })}
                    onClick={() => {
                      this.navigateByUrlName('');
                      this.setActiveMenu('home');
                    }}
                  >
                    Home
                  </a>
                </li>

                <li>
                  <a
                    href="javascript:void(0);"
                    className={classNames({
                      activeMenu: this.state.activeMenu == 'calender'
                    })}
                    onClick={() => {
                      this.navigateByUrlName('/member/calendar');
                      this.setActiveMenu('calender');
                    }}
                  >
                    Event Calender
                  </a>
                </li>

                <li>
                  <a
                    href="javascript:void(0);"
                    className={classNames({
                      activeMenu: this.state.activeMenu == 'event'
                    })}
                    onClick={() => {
                      this.navigateByUrlName('/member/myEvents');
                      this.setActiveMenu('event');
                    }}
                  >
                    My Events
                  </a>
                </li>
                {/* <li className="dropdown event_dropdown">
        <a className="dropdown-toggle" data-toggle="dropdown" href="#">
          Events
          <span className="ico-rightarrow">
            <svg>
              <use xlinkHref="/img/sprite.svg#rightarrowIco" />
            </svg>
          </span>
        </a>
        <ul className="dropdown-menu">
          <li>
            <a
              href="javascript:void(0);"
              onClick={() => this.navigateByUrlName('/member/calender')}
            >
              Event Calender
            </a>
          </li>
          <li>
            <a
              href="javascript:void(0);"
              onClick={() => this.navigateByUrlName('/member/myEvents')}
            >
              My Events
            </a>
          </li>
        </ul>
      </li>*/}
                {/*<li>
        <a href="#">Education Corner</a>
      </li>
      <li>
        <a href="#">Contact</a>
      </li>*/}
              </ul>
            </div>
            {this.props.isLogin ? (
              ''
            ) : (
              <div className={userName ? 'navbar-menu hide' : 'navbar-menu'}>
                <ul className="nav navbar-nav navbar-right login-btn-position">
                  <li>
                    <button className="btn btn-icon sign-btn">
                      <span className="ico-lock mr-10">
                        <svg>
                          <use xlinkHref={`${Sprite}#lockIco`} />
                        </svg>
                      </span>
                      <span onClick={() => this.navigateByUrlName('/login')}>
                        &nbsp;LOGIN
                      </span>&nbsp; /&nbsp;
                      <span onClick={() => this.navigateByUrlName('/signup')}>
                        &nbsp;REGISTER
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <div className="rightContNav">
              <Notification navigateByUrlName={this.navigateByUrlName} />
              {/* <div className="notiificationDiv">
                <span className="ico-bell">
                  <i className="fa fa-bell-o" aria-hidden="true" />
                  <span className="totalNotify">5</span>
                </span>
                <div className="NotificatoinDropDown active">
                  <h4 className="Ntitle">Notifications</h4>
                  <ul className="userListNotify">
                    <li>
                      <div className="userNotiInfo">
                        <img src={imgUserDefault} alt="" />
                        <p className="readText">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting Industry.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="userNotiInfo">
                        <img src={imgUserDefault} alt="" />
                        <p className="readText">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting Industry.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="userNotiInfo">
                        <img src={imgUserDefault} alt="" />
                        <p className="readText">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting Industry.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="userNotiInfo">
                        <img src={imgUserDefault} alt="" />
                        <p className="readText">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting Industry.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="userNotiInfo">
                        <img src={imgUserDefault} alt="" />
                        <p className="readText">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting Industry.
                        </p>
                      </div>
                    </li>
                  </ul>
                  <a href="javascript:void(0);" className="viewmoreLink">
                    {' '}
                    view more{' '}
                  </a>
                </div>
                {/* <span className="ico-bell"><svg><use xlinkHref="/img/sprite.svg#belIco"></use></svg></span> */}
              {/*</div> */}
              <div
                className={
                  userName ? 'loginTag dropdown' : 'loginTag dropdown hide'
                }
              >
                <div
                  className="dropdown-toggle flex-row "
                  data-toggle="dropdown"
                >
                  <p>
                    Hello,{' '}
                    <span className="bold">
                      {this.capitalizeFirstLetter(userName)}
                    </span>{' '}
                  </p>

                  <span className="ico-rightarrow">
                    <svg>
                      <use xlinkHref={`${Sprite}#rightarrowIco`} />
                    </svg>
                  </span>

                  <span className="managerProfile">
                    {this.props.userInfo &&
                    this.props.userInfo.userTypeId == 1 ? (
                      <img
                        src={userImage ? userImage : imgUserDefault}
                        alt="2"
                        onError={e => {
                          e.target.src = imgUserDefault;
                        }}
                      />
                    ) : (
                      <img src={imgUserDefault} alt={imgUserDefault} />
                    )}
                  </span>
                </div>
                <ul className="dropdown-menu">
                  {this.props.userInfo &&
                  this.props.userInfo.userTypeId == 1 ? (
                    <li>
                      <a
                        href="javascript:void(0)"
                        onClick={() => this.openProfile()}
                      >
                        <span>Profile</span>
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#userIco`} />
                          </svg>
                        </span>
                      </a>
                    </li>
                  ) : null}

                  {/* <li>
                    <a>
                      <span>Settings</span>
                      <span className="ico-user">
                        <svg>
                          <use xlinkHref="/img/sprite.svg#settingIco" />
                        </svg>
                      </span>
                    </a>
                  </li> */}
                  <li>
                    <a onClick={this.showChangePasswordHandler}>
                      <span>Change password</span>
                      <span className="ico-user">
                        <svg>
                          <use xlinkHref={`${Sprite}#lockIco`} />
                        </svg>
                      </span>
                    </a>
                  </li>

                  <li>
                    <a
                      onClick={() => {
                        this.props.navigateByUrlName({
                          pathname: '/member/plan',
                          state: { upgrade: true }
                        });
                      }}
                    >
                      <span>Upgrade Plan</span>
                      <span className="ico-user">
                        <svg>
                          <use xlinkHref={`${Sprite}#upgradeIco`} />
                        </svg>
                      </span>
                    </a>
                  </li>

                  {/* <li>
                    <a>
                      Notifications
                      <span className="ico-user">
                        <svg>
                          <use xlinkHref="/img/sprite.svg#notificationIco" />
                        </svg>
                      </span>
                    </a>
                  </li> */}
                  <li>
                    <a onClick={() => this.logOutClicked()}>
                      <span>Logout</span>
                      <span className="ico-user">
                        <svg>
                          <use xlinkHref={`${Sprite}#logoutIco`} />
                        </svg>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ChangePassword
            openDialog={this.state.showChangePassword}
            onCloseChangePassword={this.onCloseChangePassword}
            userInfo={this.props.userInfo}
          />
        </nav>
      </header>
      // Header for admin
      // <header
      //   className={`main-header isHome ${
      //     this.props.userInfo.userTypeId === 3 ? '' : 'hide'
      //   }`}
      // >
      //   <a className="logoTag" onClick={() => this.navigateByUrlName('/')}>
      //     <img src={imgHeaderLogo} alt="" />
      //   </a>
      //   <nav className="evMenu">
      //     <ul className="evrntNotificatoinNav active">
      //       <li>
      //         <div className="totalEv">
      //           <span className="ico-totalmember evIcons">
      //             <svg>
      //               <use xlinkHref="/img/sprite.svg#totalmemberIco" />
      //             </svg>
      //           </span>
      //           <span className="showAllev">Total Members:</span>
      //           <a>
      //             {this.props.countData.totalMembers
      //               ? this.props.countData.totalMembers
      //               : 0}
      //           </a>
      //         </div>
      //       </li>
      //       <li>
      //         <div className="totalEv">
      //           <span className="ico-totalevent evIcons">
      //             <svg>
      //               <use xlinkHref="/img/sprite.svg#totaleventIco" />
      //             </svg>
      //           </span>
      //           <span className="showAllev">Total Events: </span>
      //           <a>
      //             {this.props.countData.totalPublishedEvents
      //               ? this.props.countData.totalPublishedEvents
      //               : 0}
      //           </a>
      //         </div>
      //       </li>
      //       <li>
      //         <div className="totalEv">
      //           <span className="ico-totalspeaker evIcons">
      //             <svg>
      //               <use xlinkHref="/img/sprite.svg#totalspeakerIco" />
      //             </svg>
      //           </span>
      //           <span className="showAllev">Total Speakers: </span>
      //           <a>
      //             {this.props.countData.totalSpeakers
      //               ? this.props.countData.totalSpeakers
      //               : 0}
      //           </a>
      //         </div>
      //       </li>
      //       <li>
      //         <div className="totalEv">
      //           <span className="ico-totalsponsor evIcons">
      //             <svg>
      //               <use xlinkHref="/img/sprite.svg#totalsponsorIco" />
      //             </svg>
      //           </span>
      //           <span className="showAllev">Total sponsors: </span>
      //           <a>
      //             {this.props.countData.totalSponsors
      //               ? this.props.countData.totalSponsors
      //               : 0}
      //           </a>
      //         </div>
      //       </li>
      //       <li className="hide">
      //         <span>
      //           <img src={imgCalenderIcon} className="calender-icon" /> Upcoming
      //           Event:
      //         </span>
      //         <a> Upcoming Event Name</a>
      //       </li>
      //     </ul>
      //   </nav>
      //   <div className="loginTag dropdown">
      //     <div className="dropdown-toggle flex-row " data-toggle="dropdown">
      //       <p>
      //         Hello,{' '}
      //         <span className="bold">
      //           {this.capitalizeFirstLetter(userName)}
      //         </span>{' '}
      //       </p>

      //       <span className="ico-rightarrow">
      //         <svg>
      //           <use xlinkHref="/img/sprite.svg#rightarrowIco" />
      //         </svg>
      //       </span>

      //       <span className="managerProfile">
      //         <img src={imgUserDefault} alt="" />
      //       </span>
      //     </div>
      //     <ul className="dropdown-menu">
      //       <li>
      //         <a>
      //           Profile
      //           <span className="ico-user">
      //             <svg>
      //               <use xlinkHref="/img/sprite.svg#userIco" />
      //             </svg>
      //           </span>
      //         </a>
      //       </li>
      //       <li>
      //         <a onClick={this.showChangePasswordHandler}>
      //           Change password
      //           <span className="ico-user">
      //             <svg>
      //               <use xlinkHref="/img/sprite.svg#lockIco" />
      //             </svg>
      //           </span>
      //         </a>
      //       </li>
      //       <li>
      //         <a onClick={() => this.logOutClicked()}>
      //           Logout
      //           <span className="ico-user">
      //             <svg>
      //               <use xlinkHref="/img/sprite.svg#logoutIco" />
      //             </svg>
      //           </span>
      //         </a>
      //       </li>
      //     </ul>
      //   </div>
      //   <ChangePassword
      //     openDialog={this.state.showChangePassword}
      //     onCloseChangePassword={this.onCloseChangePassword}
      //     userInfo={this.props.userInfo}
      //   />
      // </header>
    ];
  }
}

function mapStateToProps(state) {
  return { userInfo: state.profileData, countData: state.events.countList };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actionDashboardData,
      actionUserLogout
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
