import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionGetMemberAllEvents } from '../../common/action/index';
import Sprite from '../../img/sprite.svg';

class TermAndCondition extends Component {
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
        <div className="main">
          <section className="blkevt-bg">
            <div className="container">
              <div className="row">
                <div className="col-sm-8">
                  <div className="in-head event_headtext">
                    <h3 className="text-white m0">Terms And Conditions</h3>
                    {/* <p>Terms And Conditions</p> */}
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="pricing_listwrap text-right">
                    <ul className="evtpricing_list">
                      <li>
                        <span
                          className="ico-cancle"
                          onClick={this.props.history.goBack}
                        >
                          <svg>
                            <use xlinkHref={`${Sprite}#closeIco`} />
                          </svg>
                        </span>
                      </li>
                      {/* <li>Price: ${this.state.eventBasePrice}</li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default TermAndCondition;
