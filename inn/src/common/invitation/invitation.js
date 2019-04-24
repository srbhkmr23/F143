import React, { Component } from 'react';

import '../../css/style.css';
import logo from '../../img/innovecsyslogoblack.png';
import lights from '../../img/lights.jpg';
import imgMother from '../../img/mother.jpg';
import Sprite from '../../img/sprite.svg';

class Invitation extends Component {
  constructor(props) {
    super(props);
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  render() {
    return (
      <div>
        {/*NAVBAR*/}
        <nav className="navbar navbar-default navbar-fixed-top custom-navbar">
          <div className="brand">
            <a href="javascript:void(0);">
              <img src={logo} alt="Logo" className="img-responsive pc-view" />
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
                    </span>LOGIN / REGISTER
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/*NAVBAR*/}

        {/*<!--main content starts-->*/}

        <div id="myevents_sec" className="main-page-wrapper">
          <div className="main">
            <section className="invitfor-sec">
              <div className="container">
                <div className="common-sub-heading">
                  <h3>INVITATIONS</h3>
                </div>
                <div className="inviWrapper">
                  <div className="row">
                    <div className="col-sm-6 pr0">
                      <div className="in-r-img">
                        <img src={imgMother} className="img-responsive" />
                        <div className="invitLabel">Conference</div>
                      </div>
                    </div>
                    <div className="col-sm-6 pl0">
                      <div className="invition_text_wrap">
                        <div className="invit_address">
                          <ul className="list-inline">
                            <li>
                              <span className="ico-map-pin">
                                <svg>
                                  <use xlinkHref={`${Sprite}#map-pinIco`} />
                                </svg>
                              </span>
                            </li>
                            <li>123 6th St. Melbourne, Fl 32904</li>
                            <li>$15</li>
                          </ul>
                        </div>
                        <div className="invite_content">
                          <h4>Cure Diabetes</h4>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500
                            when an unknown printer took a galley of type and
                            scrambled it to make a type specimen book. It has
                            survived not only five centuries, but also the leap
                            into electronic typesetting, remaining essentially
                            unchanged.
                          </p>
                        </div>
                        <div className="invite_button">
                          <a href="" className="btn-arrow">
                            GET TICKET
                            <span className="ico-r-arrow">
                              <svg>
                                <use xlinkHref={`${Sprite}#r-arrowIco`} />
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="inviWrapper">
                  <div className="row">
                    <div className="col-sm-6 pr0">
                      <div className="in-r-img">
                        <img src={imgMother} className="img-responsive" />
                        <div className="invitLabel">Work in group</div>
                      </div>
                    </div>
                    <div className="col-sm-6 pl0">
                      <div className="invition_text_wrap">
                        <div className="invite_content invitecontent_wrapsec">
                          <h4>Space Invitation</h4>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500
                            when an unknown printer took a galley of type and
                            scrambled it to make a type specimen book. It has
                            survived not only five centuries, but also the leap
                            into electronic typesetting, remaining essentially
                            unchanged.
                          </p>
                        </div>
                        <div className="invite_button">
                          <ul className="list-inline">
                            <li>
                              <button className="invit_accept" type="button">
                                <span className="invit_btnicon">
                                  <span className="ico-correctIco">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#correctIco`} />
                                    </svg>
                                  </span>
                                </span>Accept
                              </button>
                            </li>
                            <li>
                              <button className="invit_reject" type="button">
                                <span className="invit_btnicon">
                                  {' '}
                                  <span className="ico-cancle">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#closeIco`} />
                                    </svg>
                                  </span>
                                </span>Reject
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="inviWrapper">
                  <div className="row">
                    <div className="col-sm-6 pr0">
                      <div className="in-r-img">
                        <img src={imgMother} className="img-responsive" />
                        <div className="invitLabel">Conference</div>
                      </div>
                    </div>
                    <div className="col-sm-6 pl0">
                      <div className="invition_text_wrap">
                        <div className="invit_address">
                          <ul className="list-inline">
                            <li>
                              <span className="ico-map-pin">
                                <svg>
                                  <use xlinkHref={`${Sprite}#map-pinIco`} />
                                </svg>
                              </span>
                            </li>
                            <li>123 6th St. Melbourne, Fl 32904</li>
                            <li>$45</li>
                          </ul>
                        </div>
                        <div className="invite_content">
                          <h4>Parenting</h4>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500
                            when an unknown printer took a galley of type and
                            scrambled it to make a type specimen book. It has
                            survived not only five centuries, but also the leap
                            into electronic typesetting, remaining essentially
                            unchanged.
                          </p>
                        </div>
                        <div className="invite_button">
                          <a href="" className="btn-arrow">
                            GET TICKET
                            <span className="ico-r-arrow">
                              <svg>
                                <use xlinkHref={`${Sprite}#r-arrowIco`} />
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="inviWrapper">
                  <div className="row">
                    <div className="col-sm-6 pr0">
                      <div className="in-r-img">
                        <img src={imgMother} className="img-responsive" />
                        <div className="invitLabel">Work in group</div>
                      </div>
                    </div>
                    <div className="col-sm-6 pl0">
                      <div className="invition_text_wrap">
                        <div className="invite_content invitecontent_wrapsec">
                          <h4>Space Invitation</h4>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500
                            when an unknown printer took a galley of type and
                            scrambled it to make a type specimen book. It has
                            survived not only five centuries, but also the leap
                            into electronic typesetting, remaining essentially
                            unchanged.
                          </p>
                        </div>
                        <div className="invite_button">
                          <ul className="list-inline">
                            <li>
                              <button className="invit_accept" type="button">
                                <span className="invit_btnicon">
                                  <span className="ico-correctIco">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#correctIco`} />
                                    </svg>
                                  </span>
                                </span>Accept
                              </button>
                            </li>
                            <li>
                              <button className="invit_reject" type="button">
                                <span className="invit_btnicon">
                                  {' '}
                                  <span className="ico-cancle">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#closeIco`} />
                                    </svg>
                                  </span>
                                </span>Reject
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="inviWrapper">
                  <div className="row">
                    <div className="col-sm-6 pr0">
                      <div className="in-r-img">
                        <img src={imgMother} className="img-responsive" />
                        <div className="invitLabel">Work in group</div>
                      </div>
                    </div>
                    <div className="col-sm-6 pl0">
                      <div className="invition_text_wrap">
                        <div className="invite_content invitecontent_wrapsec">
                          <h4>Space Invitation</h4>
                          <p>
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500
                            when an unknown printer took a galley of type and
                            scrambled it to make a type specimen book. It has
                            survived not only five centuries, but also the leap
                            into electronic typesetting, remaining essentially
                            unchanged.
                          </p>
                        </div>
                        <div className="invite_button">
                          <ul className="list-inline">
                            <li>
                              <button className="invit_accept" type="button">
                                <span className="invit_btnicon">
                                  <span className="ico-correctIco">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#correctIco`} />
                                    </svg>
                                  </span>
                                </span>Accept
                              </button>
                            </li>
                            <li>
                              <button className="invit_reject" type="button">
                                <span className="invit_btnicon">
                                  {' '}
                                  <span className="ico-cancle">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#closeIco`} />
                                    </svg>
                                  </span>
                                </span>Reject
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
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
export default Invitation;
