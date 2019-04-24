import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Transition from 'react-transition-group/Transition';
import { connect } from 'react-redux';
import Header from '../common/header/header';
import AsideMenu from './common/asideMenu';
import ManagerList from './manager/managerList';
import { removeCookie, ZoomInAndOut } from '../common/core/common-functions';
import SearchEvent from '../common/event/searchEvent';

class AdminView extends Component {
  constructor(props) {
    super(props);
    this.state = { activeAsideMenu: 'managerList' };

    this.setActiveAsideMenu = this.setActiveAsideMenu.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
  }

  setActiveAsideMenu(menuName) {
    this.setState({ activeAsideMenu: menuName });
  }

  onLogoutClick() {
    removeCookie('userInfo');
    this.props.history.push('/');
  }

  componentWillMount() {
    console.log('userInfo', this.props.userInfo);
    const userInfo = this.props.userInfo;
    if (userInfo && userInfo.userTypeId !== 3) {
      console.log('invalid access');
      // Following redirection is quick fix will modify later to make it perfect
      this.props.history.push('/');
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
            parentProps={this.props}
            setActiveAsideMenu={this.setActiveAsideMenu}
            onLogoutClick={this.onLogoutClick}
            navigateByUrlName={this.navigateByUrlName}
          />
          <AsideMenu
            parentProps={this.props}
            activeTabName={this.state.activeAsideMenu}
            setActiveAsideMenu={this.setActiveAsideMenu}
          />

          <Switch>
            <Route exact path={this.props.match.path} component={ManagerList} />

            <Route
              exact
              path={`${this.props.match.path}/managerList`}
              component={ManagerList}
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

export default connect(mapStateToProps)(AdminView);
