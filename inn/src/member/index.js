import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Transition from 'react-transition-group/Transition';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeCookie, ZoomInAndOut } from '../common/core/common-functions';
import { actiongGetProfileDataById } from '../common/action/index';
import SearchEvent from '../common/event/searchEvent';
import MyEvents from './event/myEvents';
import SummaryDetails from '../common/event/summaryDetails';
import PlanPurchase from './event/planPurchase';

import EventDetails from './event/eventDetails';
import JoinEvent from './event/joinEvent';
import JoinEventPayment from './event/joinEventPayment';
import TermAndCondition from './event/termAndCondition';

// import Calender from './event/calender';
import Calender from '../common/event/calender';
import Profile from './profile/profile';
import UnSubscribe from './event/unSubscribe';

// import Header from './common/header';
import Header from '../common/header/header';
import Plan from './plan/plan';
import PurchaseMemberPlan from './plan/purchaseMemberPlan';
import ErrorPage from '../common/error/errorPage';

class MemberView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAsideMenu: 'eventList',
      hideHeader: [
        //  '/member/plan',
        '/member/purchaseMemberPlan',
        '/member/joinEvent',
        '/member/joinEventPayment',
        '/member/unsubscribeSetting',
        '/member/termAndCondition'
      ]
    };

    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
    this.checkMemberAndAllowPages = this.checkMemberAndAllowPages.bind(this);

    try {
      if (this.props.userInfo)
        this.props.actiongGetProfileDataById(this.props.userInfo.id);
    } catch (err) {}
  }

  componentWillReceiveProps(res) {
    if (res.match.path === '/member') {
      if (
        this.props.userInfo &&
        (this.props.userInfo.planId == null || this.props.userInfo.isExpired)
      ) {
        if (
          this.state.hideHeader.indexOf(res.location.pathname) === -1 &&
          res.location.pathname !== '/member/plan'
        ) {
          let upgrade = false;
          if (this.props.userInfo.isExpired == true) {
            upgrade = true;
          }
          this.props.history.push({
            pathname: '/member/plan',
            state: { upgrade: upgrade }
          });
        }
      }
    }
  }

  componentWillMount() {
    this.checkMemberAndAllowPages();
  }

  checkMemberAndAllowPages() {
    try {
      if (this.props.userInfo.userTypeId !== 1) {
        this.props.history.push('/');
      }
    } catch (error) {
      if (this.props.location.pathname == '/member/unsubscribeSetting') {
        return true;
      }

      this.props.history.push('/');
    }
  }

  onLogoutClick() {
    removeCookie('userInfo');
    window.scrollTo(0, 0);
    this.props.history.push('/');
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  render() {
    return (
      <div className="h-100">
        <ToastContainer
          autoClose={3000}
          className="custom-toaster-main-cls"
          toastClassName="custom-toaster-bg"
          transition={ZoomInAndOut}
        />
        {this.state.hideHeader.indexOf(this.props.location.pathname) === -1 ? (
          <Header
            navigateByUrlName={this.navigateByUrlName}
            userInfo={this.props.userInfo}
            onLogoutClick={this.onLogoutClick}
            userName={this.props.userProfileData.userProfileDataById.firstName}
          />
        ) : (
          ''
        )}

        <Switch>
          <Route
            exact
            path={`${this.props.match.path}/searchEvent`}
            component={SearchEvent}
          />

          <Route
            exact
            path={`${this.props.match.path}/myEvents`}
            component={MyEvents}
          />

          <Route
            exact
            path={`${this.props.match.path}/summaryDetails`}
            component={SummaryDetails}
          />

          <Route
            exact
            path={`${this.props.match.path}/planPurchase`}
            component={PlanPurchase}
          />

          <Route
            exact
            path={`${this.props.match.path}/calendar`}
            component={Calender}
          />

          <Route
            exact
            path={`${this.props.match.path}/eventDetails`}
            component={EventDetails}
          />

          <Route
            exact
            path={`${this.props.match.path}/joinEvent`}
            component={JoinEvent}
          />
          <Route
            exact
            path={`${this.props.match.path}/joinEventPayment`}
            component={JoinEventPayment}
          />

          <Route
            exact
            path={`${this.props.match.path}/profile`}
            component={Profile}
          />

          <Route
            exact
            path={`${this.props.match.path}/plan`}
            component={Plan}
          />

          <Route
            exact
            path={`${this.props.match.path}/purchaseMemberPlan`}
            component={PurchaseMemberPlan}
          />

          <Route
            exact
            path={`${this.props.match.path}/unsubscribeSetting`}
            component={UnSubscribe}
          />

          <Route
            exact
            path={`${this.props.match.path}/termAndCondition`}
            component={TermAndCondition}
          />

          <Redirect from="*" to="/error" />
        </Switch>
      </div>
    );
  }
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
      actiongGetProfileDataById: actiongGetProfileDataById
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(MemberView);
