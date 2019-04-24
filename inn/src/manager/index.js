import React, { Component } from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import Transition from 'react-transition-group/Transition';
import { connect } from 'react-redux';

import Header from '../common/header/header';
import AsideMenu from './common/asideMenu';
import EventList from './event/eventList';
import AddEvent from './event/addEvent';
import AddSpeaker from './speaker/addSpeaker';
import AddNewSpeaker from './speaker/addNewSpeaker';
import EditSpeaker from './speaker/editSpeaker';
import SpeakerList from './speaker/speakerList';
import AllSpeakerList from './speaker/allSpeakerList';
import Speakers from './speaker/speakers';
import AllSponsorList from './sponsor/allSponsorList';
import Sponsors from './sponsor/sponsors';
import EventMedia from './event/eventMedia';
import AddSponsor from './sponsor/addSponsor';
import AddNewSponsor from './sponsor/addNewSponsor';
import EditSponsor from './sponsor/editSponsor';
import SponsorList from './sponsor/sponsorList';
import AgendaTimeLineNew from './agenda/agendaTimeLineNew';
import AgendaTimeLine from './agenda/agendaTimeLine';
import updateEvent from './event/updateEvent';
import InvitationList from './invitation/invitationList';
import Discount from '../manager/discount/discount';
import EventDetails from './event/eventDetails';
import UserList from './user/userList';
import Profile from './profile/profile';
import UserListView from './user/userListView';
import { removeCookie, ZoomInAndOut } from '../common/core/common-functions';
import Calender from '../common/event/calender';
import SummaryDetails from '../common/event/summaryDetails';
import SearchEvent from '../common/event/searchEvent';
import ErrorPage from '../common/error/errorPage';

const getConfirmation = (message, callback) => {
  const allowTransition = window.confirm(message);
  callback(allowTransition);
};

class ManagerView extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      activeAsideMenu: 'eventList',
      hideAsideMenu: [
        '/manager/searchEvent',
        '/manager/eventDetails',
        '/manager/calendar',
        '/manager/summaryDetails'
      ]
    };

    this.setActiveAsideMenu = this.setActiveAsideMenu.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
  }

  setActiveAsideMenu(menuName) {
    this.setState({ activeAsideMenu: menuName });
  }

  onLogoutClick() {
    removeCookie('userInfo');
    window.scrollTo(0, 0);
    this.props.history.push('/');
  }

  componentWillMount() {
    if (this.props.userInfo == null || this.props.userInfo == '') {
      this.props.history.push('/');
    } else {
      const userInfo = this.props.userInfo;
      if (userInfo && userInfo.userTypeId !== 2) {
        // Following redirection is quick fix will modify later to make it perfect
        this.props.history.push('/');
      }
    }
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  render() {
    return (
      <div className="main-page">
        <div className="dashboard">
          <ToastContainer
            autoClose={3000}
            className="custom-toaster-main-cls"
            toastClassName="custom-toaster-bg"
            transition={ZoomInAndOut}
          />
          <Header
            navigateByUrlName={this.navigateByUrlName}
            parentProps={this.props}
            setActiveAsideMenu={this.setActiveAsideMenu}
            onLogoutClick={this.onLogoutClick}
          />

          {this.state.hideAsideMenu.indexOf(this.props.location.pathname) ===
          -1 ? (
            <AsideMenu
              parentProps={this.props}
              activeTabName={this.state.activeAsideMenu}
              setActiveAsideMenu={this.setActiveAsideMenu}
            />
          ) : (
            ''
          )}

          <Switch>
            <Route
              exact
              path={`${this.props.match.path}/eventList`}
              component={EventList}
            />
            <Route
              exact
              path={`${this.props.match.path}/addEvent`}
              component={AddEvent}
            />
            <Route
              exact
              path={`${this.props.match.path}/editEvent`}
              component={updateEvent}
            />
            <Route
              exact
              path={`${this.props.match.path}/speakerList`}
              component={SpeakerList}
            />
            <Route
              exact
              path={`${this.props.match.path}/eventMedia`}
              component={EventMedia}
            />
            <Route
              exact
              path={`${this.props.match.path}/eventDetails`}
              component={EventDetails}
            />
            <Route
              exact
              path={`${this.props.match.path}/addSpeaker`}
              component={AddSpeaker}
            />
            <Route
              exact
              path={`${this.props.match.path}/addNewSpeaker`}
              component={AddNewSpeaker}
            />
            <Route
              exact
              path={`${this.props.match.path}/editSpeaker/:id`}
              component={EditSpeaker}
            />
            <Route
              exact
              path={`${this.props.match.path}/allSpeakerList`}
              component={AllSpeakerList}
            />
            <Route
              exact
              path={`${this.props.match.path}/speakers`}
              component={Speakers}
            />
            <Route
              exact
              path={`${this.props.match.path}/sponsorList`}
              component={SponsorList}
            />
            <Route
              exact
              path={`${this.props.match.path}/addSponsor`}
              component={AddSponsor}
            />
            <Route
              exact
              path={`${this.props.match.path}/addNewSponsor`}
              component={AddNewSponsor}
            />
            <Route
              exact
              path={`${this.props.match.path}/editSponsor/:id`}
              component={EditSponsor}
            />
            <Route
              exact
              path={`${this.props.match.path}/allSponsorList`}
              component={AllSponsorList}
            />
            <Route
              exact
              path={`${this.props.match.path}/Sponsors`}
              component={Sponsors}
            />
            <Route
              exact
              path={`${this.props.match.path}/agendaTimeLine`}
              component={AgendaTimeLineNew}
              getUserConfirmation={getConfirmation}
            />

            <Route
              exact
              path={`${this.props.match.path}/agendaTimeLineold`}
              component={AgendaTimeLine}
            />

            <Route
              exact
              path={`${this.props.match.path}/invitationList`}
              component={InvitationList}
            />

            <Route
              exact
              path={`${this.props.match.path}/discount`}
              component={Discount}
            />

            <Route
              exact
              path={`${this.props.match.path}/userList`}
              component={UserList}
            />

            <Route
              exact
              path={`${this.props.match.path}/profile`}
              component={Profile}
            />

            <Route
              exact
              path={`${this.props.match.path}/user`}
              component={UserListView}
            />

            <Route
              exact
              path={`${this.props.match.path}/calendar`}
              component={Calender}
            />

            <Route
              exact
              path={`${this.props.match.path}/summaryDetails`}
              component={SummaryDetails}
            />

            <Route
              exact
              path={`${this.props.match.path}/searchEvent`}
              component={SearchEvent}
            />
            <Redirect from="*" to="/error" />
          </Switch>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { userInfo: state.profileData };
}

export default connect(mapStateToProps)(ManagerView);
