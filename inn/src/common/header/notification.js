import React, { Component } from 'react';
import Loader from 'react-loader';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import imgEventDefault from '../../img/def_event.jpg';
import Sprite from '../../img/sprite.svg';

import {
  actionGetNotification,
  actionSetNotificationsAsClicked,
  actionSetNotificationsAsRead,
  actionUpdateNotificationPageNumber
} from '../action/index';
import Img from '../core/img';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotificationList: false,
      markNotificationClicked: [],
      unClickedNotificationCount: 0,
      pageNumber: 1,
      pageSize: 10,
      loaded: false
    };
    this.toggleNotificationList = this.toggleNotificationList.bind(this);
    this.markNotificationClicked = this.markNotificationClicked.bind(this);
    this.loadMoreNotification = this.loadMoreNotification.bind(this);
    this.navigateToEvent = this.navigateToEvent.bind(this);
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
    window.addEventListener('click', this.handleDocumentClick);
    window.addEventListener('touchstart', this.handleDocumentClick);
  }

  componentDidMount() {
    // Call API to get notifications
    try {
      const userId = this.props.userInfo.id;
      let _this = this;
      this.props
        .actionGetNotification(
          userId,
          this.state.pageNumber,
          this.state.pageSize
        )
        .then(result => {
          if (
            result.payload &&
            result.payload.data &&
            result.payload.data.resourceData &&
            result.payload.data.resourceData.length > 9
          )
            _this.props.actionUpdateNotificationPageNumber(
              this.state.pageNumber + 1
            );
        });
    } catch (error) {}
  }

  componentWillReceiveProps(res) {
    let counter = 0;
    for (let index = 0; index < this.props.notification.all.length; index++) {
      const element = this.props.notification.all[index];
      if (element.clicked === false) {
        counter++;
      }
    }
    this.setState({
      unClickedNotificationCount: counter
    });

    if (
      res.notification.pageNumber &&
      res.notification.pageNumber !== this.state.pageNumber
    ) {
      const pageNumber = res.notification.pageNumber;
      const pageSize = res.notification.pageSize;
      this.setState({
        pageNumber,
        pageSize
      });
    }
  }

  handleDocumentClick = evt => {
    try {
      const area = ReactDOM.findDOMNode(this.refs.notificationDropDownArea);
      if (!area.contains(evt.target)) {
        this.setState({
          showNotificationList: false
        });
      }
    } catch (err) {
      // console.log(err);
    }
  };

  toggleNotificationList() {
    //When notification bell icon click to open notification list, all notification will mark as clicked and update on server
    if (!this.state.showNotificationList) {
      this.markNotificationClicked();
    }
    this.setState({
      showNotificationList: !this.state.showNotificationList
    });
  }

  markNotificationClicked() {
    let listOfId = [];
    let _this = this;
    const userId = this.props.userInfo.id;
    for (let index = 0; index < this.props.notification.all.length; index++) {
      const element = this.props.notification.all[index];
      if (element.clicked === false) {
        listOfId.push(element.notificationId);
      }
    }

    if (listOfId.length > 0) {
      this.props
        .actionSetNotificationsAsClicked(userId, listOfId)
        .then(result => {
          _this.props.actionGetNotification(
            userId,
            // _this.state.pageNumber,
            1,
            _this.state.pageSize,
            true
          );
          _this.props.actionGetNotification(
            userId,
            _this.state.pageNumber,
            _this.state.pageSize,
            true
          );
        });
    }
  }

  navigateByUrlName(path) {
    if (
      this.props.navigateByUrlName &&
      typeof this.props.navigateByUrlName === 'function'
    )
      this.props.navigateByUrlName(path);
  }

  navigateToEvent(eventDetails) {
    try {
      const eventId = eventDetails.eventResponse.eventId;
      this.navigateByUrlName('/member/eventDetails?eventId=' + eventId);
      // this.navigateByUrlName('/member/eventDetails/' + eventId);
    } catch (error) {
      // console.log("error ", error);
    }
    // this.props.history.push()
  }

  markNotificationAsRead(notificationId) {
    const userId = this.props.userInfo.id;
    this.props.actionSetNotificationsAsRead(userId, notificationId);
  }

  loadMoreNotification() {
    try {
      const userId = this.props.userInfo.id;
      let _this = this;
      this.props
        .actionGetNotification(
          userId,
          this.state.pageNumber,
          this.state.pageSize
        )
        .then(result => {
          if (result.payload.data.resourceData.length > 9)
            _this.props.actionUpdateNotificationPageNumber(
              this.state.pageNumber + 1
            );
          if (
            this.state.pageNumber != 1 &&
            result.payload.data.resourceData.length > 1
          ) {
            this.setState({
              loaded: true
            });
            setTimeout(() => this.setState({ loaded: false }), 500);
          }
        });
    } catch (error) {}
  }

  render() {
    return (
      <div className="notiificationDiv" ref="notificationDropDownArea">
        <span
          className="ico-bell"
          onClick={() => this.toggleNotificationList()}
        >
          <svg>
            {/* <use xlinkHref="/img/sprite.svg#bellIco" /> */}
            <use xlinkHref={`${Sprite}#bellIco`} />
          </svg>
          <span className="totalNotify">
            {this.state.unClickedNotificationCount}
          </span>
        </span>

        {/* <span
          className="ico-bell"
          onClick={() => this.toggleNotificationList()}
        >
          <i className="fa fa-bell-o" aria-hidden="true" />

          <span className="totalNotify">
            {this.state.unClickedNotificationCount}
          </span>
        </span> */}
        <div
          className={`NotificatoinDropDown ${
            this.state.showNotificationList ? '' : 'hide'
          }`}
        >
          <h4 className="Ntitle">Notifications</h4>
          <ul className="userListNotify">
            {this.props.notification.all.map((item, index) => {
              let bannerImageURL = '';
              let title = '';
              try {
                bannerImageURL = item.eventResponse.bannerImageURL || '';
                title = item.eventResponse.eventName || '';
              } catch (error) {}
              // console.log(item);

              return (
                <li
                  key={item.notificationId}
                  onClick={() => {
                    this.markNotificationAsRead(item.notificationId);
                    this.navigateToEvent(item);
                    this.setState({
                      showNotificationList: false
                    });
                  }}
                  title={title}
                >
                  <div className="userNotiInfo">
                    {/* <img src={imgEventDefault} alt="" /> */}
                    <Img src={bannerImageURL} default={imgEventDefault} />
                    <p
                      className={`readText ${
                        item.read == false ? 'unreadText' : ''
                      }`}
                    >
                      {item.messageToShow}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <a
            className="viewmoreLink"
            onClick={() => this.loadMoreNotification()}
          >
            {this.state.loaded === true ? <Loader /> : ''}
            View more
          </a>
        </div>
        {/* <span className="ico-bell"><svg><use xlinkHref="/img/sprite.svg#belIco"></use></svg></span> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
    notification: state.notification
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionGetNotification,
      actionSetNotificationsAsClicked,
      actionSetNotificationsAsRead,
      actionUpdateNotificationPageNumber
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
