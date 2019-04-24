import React, { Component } from 'react';

class AsideMenu extends Component {
  constructor(props) {
    super(props);
    this.activeTabClass = this.activeTabClass.bind(this);
  }

  componentDidMount() {
    let currentPath = this.props.parentProps.location.pathname;
    switch (currentPath) {
      case '/manager/eventList':
        this.props.setActiveAsideMenu('eventList');
        break;
      case '/manager/userList':
        this.props.setActiveAsideMenu('manageUser');
        break;
      case '/manager/speakers':
        this.props.setActiveAsideMenu('manageSpeaker');
        break;
      case '/manager/sponsors':
        this.props.setActiveAsideMenu('manageSponsor');
        break;
    }
  }

  activeTabClass(tabName) {
    if (tabName === this.props.activeTabName) return 'active';
    return '';
  }

  closeSideBar = () => {
    try {
      const sideMenu = document.getElementById('leftSidebar');
      sideMenu.classList.remove('toggledLeftSideBar');
    } catch (err) {}
  };

  render() {
    return (
      <aside id="leftSidebar" className="leftSidebar">
        <ul>
          <li
            className={this.activeTabClass('eventList')}
            onClick={() => {
              this.props.setActiveAsideMenu('eventList');
              this.props.parentProps.history.push('/manager/eventList');
              this.closeSideBar();
            }}
          >
            <a>
              <span>Manage Event</span>
            </a>
          </li>
          {/* <li
            className={this.activeTabClass('createEvent')}
            onClick={() => {
              this.props.setActiveAsideMenu('createEvent');
              this.props.parentProps.history.push('/manager/addEvent');
            }}
          >
            <a>
              <span>Create Event</span>
            </a>
          </li> */}
          <li
            className={this.activeTabClass('manageUser')}
            onClick={() => {
              this.props.setActiveAsideMenu('manageUser');
              this.props.parentProps.history.push('/manager/userList');
              this.closeSideBar();
            }}
          >
            <a>
              <span>Manage Member</span>
            </a>
          </li>
          <li
            className={this.activeTabClass('manageSpeaker')}
            onClick={() => {
              this.props.setActiveAsideMenu('manageSpeaker');
              this.props.parentProps.history.push('/manager/speakers');
              this.closeSideBar();
            }}
          >
            <a>
              <span>Manage Speaker</span>
            </a>
          </li>
          <li
            className={this.activeTabClass('manageSponsor')}
            onClick={() => {
              this.props.setActiveAsideMenu('manageSponsor');
              this.props.parentProps.history.push('/manager/sponsors');
              this.closeSideBar();
            }}
          >
            <a>
              <span>Manage Sponsor</span>
            </a>
          </li>
          {/* <li
            className={this.activeTabClass('manageBiling')}
            onClick={() => {
              this.props.setActiveAsideMenu('manageBiling');
            }}
          >
            <a>
              <span>Manage Billing</span>
            </a>
          </li>
          <li
            className={this.activeTabClass('manageOffer')}
            onClick={() => {
              this.props.setActiveAsideMenu('manageOffer');
            }}
          >
            <a>
              <span>Manage Offers</span>
            </a>
          </li> */}
        </ul>
      </aside>
    );
  }
}

export default AsideMenu;
