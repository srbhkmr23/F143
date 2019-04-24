import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { stat } from 'fs';

import Landing from '../landing/landing';
import Login from '../login/login';
import Signup from '../signup/signup';
import Invitation from '../invitation/invitation';
import ManagerView from '../../manager/index';
import MemberView from '../../member/index';
import AdminView from '../../admin/index';
import ProfileView from '../profile/profileView';
import UnSubscribe from '../event/unSubscribe';

import ErrorPage from '../error/errorPage';
import ResetPassword from '../resetPassword/resetPassword';
import {
  actionGetNotificationFromSocket,
  actionUserLogout
} from '../action/index';
import { socket } from './socketIO';

import imgLoader from '../../img/loader/loader.png';

class InnovecsysRoute extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   idleTime: 0
    // };
    this.idleTime = 0;
    this.idleTimeCounter = this.idleTimeCounter.bind(this);
    this.timerIncrement = this.timerIncrement.bind(this);
    this.bindSocketNotificationListener = this.bindSocketNotificationListener.bind(
      this
    );
  }

  bindSocketNotificationListener() {
    let _this = this;
    try {
      socket.on('notification', notification => {
        try {
          const userId = _this.props.userInfo.id;
          _this.props.actionGetNotificationFromSocket(notification, userId);
        } catch (e) {}
      });
    } catch (error) {
      // alert("notification listenr binding error");
      console.log('Notification bind error', error);
      setTimeout(() => {
        _this.bindSocketNotificationListener();
      }, 1000);
    }
  }

  componentDidMount() {
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 1000);
    //window.scrollTo(0, 0);
    this.idleTimeCounter();
    this.bindSocketNotificationListener();
  }

  idleTimeCounter() {
    let idleInterval = setInterval(this.timerIncrement, 60000); // 1 minute
    let _this = this;

    //Zero the idle timer on mouse movement.
    window.document.addEventListener('mousemove', e => {
      _this.idleTime = 0;
    });
    window.document.addEventListener('keypress', e => {
      _this.idleTime = 0;
    });
  }

  timerIncrement() {
    let idleTime = this.idleTime + 1;

    console.log('idleTime', idleTime);
    if (idleTime > 10) {
      // 10 minutes
      this.props.actionUserLogout();
      window.location.href = '/';
    }
    this.idleTime = idleTime;
  }

  render() {
    return [
      <div
        className={`loaders ${
          this.props.loader.showLoader === true ? '' : 'hide'
        }`}
      >
        <div className="loader">
          <div className="loader-inner square-spin">
            <img src={imgLoader} alt="" />
          </div>
        </div>
      </div>,
      <BrowserRouter>
        <Provider store={this.props.store}>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Login} />
            <Route path="/invitation" component={Invitation} />
            <Route path="/admin" component={AdminView} />
            <Route path="/manager" component={ManagerView} />
            <Route path="/member" component={MemberView} />
            <Route path="/profileView" component={ProfileView} />
            <Route path="/resetPassword" component={ResetPassword} />
            <Route path="/unsubscribeSetting" component={UnSubscribe} />
            <Route path="/error" component={ErrorPage} />
            <Route path="*" exact={true} component={ErrorPage} />
          </Switch>
        </Provider>
      </BrowserRouter>
    ];
  }
}

const mapStateToProps = state => {
  return {
    loader: state.loader,
    socket: state.state.socket,
    userInfo: state.userInfo
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      actionGetNotificationFromSocket,
      actionUserLogout
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(InnovecsysRoute);

window.onbeforeunload = function(events) {
  var prevent = false;
  if (events && events.emit)
    events.emit('will-leave', {
      preventDefault: function(reason) {
        prevent = reason;
      }
    });
  if (prevent) return prevent;
};
