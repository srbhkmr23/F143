import React, { Component } from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ZoomInAndOut } from '../core/common-functions';
import InfiniteScroll from 'react-infinite-scroller';

import '../../css/style.css';
import logo from '../../img/innovecsyslogoblack.png';
import lights from '../../img/lights.jpg';
import nature from '../../img/nature.jpg';
import event_1 from '../../img/event_1.jpg';
import profileImg from '../../img/profileImg.png';
import adminuser from '../../img/admin-user.png';
import fourColimg from '../../img/fourColimg.png';
import Sprite from '../../img/sprite.svg';

class ProfileView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {/*NAVBAR*/}
        <nav className="navbar navbar-default navbar-fixed-top custom-navbar">
          <div className="brand">
            <a href="javascript:void(0);">
              <img
                src={logo}
                alt="iCoach Logo"
                className="img-responsive pc-view"
              />
            </a>
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
                <li className="">
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">About</a>
                </li>
                <li className="dropdown event_dropdown">
                  <a
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    href="#"
                  >
                    Events
                    <span className="ico-rightarrow">
                      <svg>
                        <use xlinkHref={`${Sprite}#rightarrowIco`} />
                      </svg>
                    </span>
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#">Education Corner</a>
                    </li>
                    <li>
                      <a href="#">Contact</a>
                    </li>
                    <li>
                      <a href="#">Page 1-3</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">Education Corner</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
            <div className="navbar-menu">
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
          </div>
        </nav>
        {/*NAVBAR*/}
        <div className="main-page-wrapper">
          <div className="main">
            <section className="">
              <div className="container">
                <div className="profileWrapper">
                  <div className="profile-Sec">
                    <a href="javascript:void(0);" className="backToReadMore">
                      <span className="ico-arrowIncircle">
                        <svg>
                          <use xlinkHref={`${Sprite}#arrowIncircleIco`} />
                        </svg>
                      </span>
                    </a>
                    <div className="profileImg">
                      <img src={profileImg} className="" alt="" />
                    </div>
                    <div className="pDescription pViewDescription">
                      <h4 className="cName">Erika Brown</h4>
                      <p className="cPosition">
                        President & Chief Executive Officer
                      </p>
                      <p className="cInstitute">
                        PALTOWN Development <br /> Foundation
                      </p>

                      <div className="pViewContent">
                        <p className="text">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s,
                          when an unknown printer took a galley of type and
                          scrambled it to make a type specimen book. It has
                          survived not only five centuries, but also the leap
                          into electronic typesetting, remaining essentially
                          unchanged. It was popularised in the 1960s with the
                          release of Letraset sheets containing Lorem Ipsum
                          passages, and more recently with desktop publishing
                          software like Aldus PageMaker including versions of
                          Lorem Ipsum.
                        </p>
                        <p className="text">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s,
                          when an unknown printer took a galley of type and
                          scrambled it to make a type specimen book. It has
                          survived not only five centuries, but also the leap
                          into electronic typesetting, remaining essentially
                          unchanged.
                        </p>
                      </div>

                      {/* <p className="cLocation">
                        <span className="ico-user">
                          <svg>
                            <use xlinkHref={`${Sprite}#map-pinIco`} />
                          </svg>
                        </span>
                        71 Pilgrim Avenue Chevy Chase, MD 20815
                      </p> */}
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
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileView;
