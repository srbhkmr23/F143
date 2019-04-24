import React, { Component } from 'react';

class AsideMenu extends Component {
  constructor(props) {
    super(props);
    this.activeTabClass = this.activeTabClass.bind(this);
  }

  activeTabClass(tabName) {
    if (tabName === this.props.activeTabName) return 'active';
    return '';
  }

  componentDidMount() {
    if (this.props.parentProps.location.pathname === '/admin/managerList') {
      this.props.setActiveAsideMenu('managerList');
    }
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
            className={this.activeTabClass('managerList')}
            onClick={() => {
              this.props.setActiveAsideMenu('managerList');
              this.closeSideBar();
            }}
          >
            <a>
              <span>Manage Manager</span>
            </a>
          </li>
        </ul>
      </aside>
    );
  }
}

export default AsideMenu;
