import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import bootbox from 'bootbox';
import classNames from 'classnames';
import { Prompt } from 'react-router';

import StepNavBar from '../common/stepNavBar';
import GeneralDiscount from './generalDiscount';
import Offers from './offers';
import Coupons from './coupons';

import {
  actionCreateDiscount,
  actionGetDiscount
} from '../../common/action/index';

import Sprite from '../../img/sprite.svg';

class Discount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: '',
      eventTimeZone: '',
      eventStartDate: '',
      eventEndDate: '',
      showGeneral: true,
      showEarlyBird: false,
      showCoupon: false,
      parentDiscountList: [],
      parentOfferList: [],
      parentCouponList: [],
      prompt: false
    };
    this.navigateToUrlPage = this.navigateToUrlPage.bind(this);
    this.showDiscount = this.showDiscount.bind(this);
    this.handleLastStepOfNavigation = this.handleLastStepOfNavigation.bind(
      this
    );
  }

  componentWillMount() {
    let eventId;
    let eventTimeZone;
    let eventStartDate;
    let eventEndDate;

    if (this.props.events.activeEvent != undefined) {
      eventId = this.props.events.activeEvent.eventId;
      eventTimeZone = this.props.events.activeEvent.timeZone;
      eventStartDate = this.props.events.activeEvent.startTimestamp;
      eventEndDate = this.props.events.activeEvent.endTimestamp;
      this.setState({
        eventId,
        eventTimeZone,
        eventStartDate,
        eventEndDate
      });
    }

    if (eventId == undefined) {
      this.props.history.push('/manager/eventList');
      console.log('eventId not found');
      return;
    }

    this.setState({ eventId });
    this.updatePageWithLatestdata(eventId);
    // this.props.actionGetDiscount(eventId).then(
    //   res => {
    //     console.log('res==========>', res);
    //     if (res && res.payload) {
    //       let resourceData = res.payload.data.resourceData;

    //       this.setState({
    //         parentDiscountList: resourceData.discountsResponseList || [],
    //         parentOfferList: resourceData.offersResponseList || [],
    //         parentCouponList: resourceData.couponResponseList || []
    //       });
    //     }
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  }

  updatePageWithLatestdata = eventId => {
    this.props.actionGetDiscount(eventId).then(
      res => {
        console.log('res==========>', res);
        if (
          res &&
          res.payload &&
          res.payload.data &&
          res.payload.data.resourceData
        ) {
          let resourceData = res.payload.data.resourceData;

          let parentDiscountList = [];
          let parentOfferList = [];
          let parentCouponList = [];

          if (resourceData.discounts) {
            parentDiscountList =
              resourceData.discounts.innovecsysDiscounts || [];
          }

          if (resourceData.offers) {
            parentOfferList = resourceData.offers.innovecsysOffers || [];
          }

          if (resourceData.coupons) {
            parentCouponList = resourceData.coupons.innovecsysCoupons || [];
          }

          this.setState({
            parentDiscountList: parentDiscountList || [],
            parentOfferList: parentOfferList || [],
            parentCouponList: parentCouponList || []
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  };

  componentDidMount() {
    console.log('this.props', this.props.id);
    this.setState({
      prompt: false
    });
  }

  navigateToUrlPage(pageUrl) {
    this.props.history.push(pageUrl);
  }

  showDiscount(showType) {
    if (showType == 'general') {
      this.setState({
        showGeneral: true,
        showEarlyBird: false,
        showCoupon: false
      });
    } else if (showType == 'early') {
      this.setState({
        showGeneral: false,
        showEarlyBird: true,
        showCoupon: false
      });
    } else if (showType == 'coupon') {
      this.setState({
        showGeneral: false,
        showEarlyBird: false,
        showCoupon: true
      });
    }
  }

  saveDiscount = () => {
    // console.log('this.state.parentDiscountList', this.state.parentDiscountList);
    // console.log('this.state.parentOfferList', this.state.parentOfferList);
    // console.log('this.state.parentCouponList', this.state.parentCouponList);

    // this.state.parentDiscountList.map(discount => {
    //   discount['createdByUserId'] = this.props.userId;
    // });

    // this.state.parentOfferList.map(offer => {
    //   offer['createdByUserId'] = this.props.userId;
    // });

    // this.state.parentCouponList.map(coupon => {
    //   coupon['createdBy'] = this.props.userId;
    // });

    // let eventId = this.state.eventId;
    // let sendDiscountData = {
    //   eventId: eventId,
    //   applicableDiscounts: this.state.parentDiscountList,
    //   applicableOffers: this.state.parentOfferList,
    //   applicableCoupons: this.state.parentCouponList
    // };

    // this.props.actionCreateDiscount(sendDiscountData).then(res => {
    //   if (res && res.payload && res.payload.status == 200) {
    //     this.handleLastStepOfNavigation();
    //   }
    // });

    this.handleLastStepOfNavigation();
  };

  handleLastStepOfNavigation = () => {
    let _this = this;
    if (this.props.events.activeEvent != undefined) {
      const event = this.props.events.activeEvent;
      if (event.published === true) {
        bootbox.confirm('Do you need to go on home of Manage Event', result => {
          if (result === true) {
            _this.setState(
              {
                prompt: false //Disable prompt and navigate to user
              },
              () => _this.navigateToUrlPage('/manager/eventList')
            );
          }
        });
      } else {
        bootbox.confirm(
          "Do you need to publish event ? You can publish event later by click on 'PUBLISH' button at bottom left.",
          result => {
            if (result === true) {
              const eventId = event.eventId;
              this.props.publishEvent(eventId).then(function(result) {
                console.log('event published result', result);
              });
            }
          }
        );
      }
    } else {
      console.log('event data not found');
    }
  };

  ////////////////////////////////////////////////////////////////////////////////

  render() {
    return (
      <div className="main-container">
        <Prompt
          when={this.state.prompt}
          message="You may lost any unsaved data, click cancel to stay on the same screen and click on next button  to save the changes."
        />
        <div className="inner-page">
          <StepNavBar
            navigateToUrlPage={this.navigateToUrlPage}
            tabName="discount"
          />
          <div className="events-page discount-Sec">
            <div className="discount-main-page">
              <aside className="discount-LeftSidebar">
                <ul>
                  <li
                    className={classNames({
                      active: this.state.showGeneral == true
                    })}
                  >
                    <a
                      href="javascript:void(0);"
                      onClick={() => this.showDiscount('general')}
                    >
                      <span className="ico-general-discount">
                        <svg>
                          <use xlinkHref={`${Sprite}#generaldiscountIco`} />
                        </svg>
                      </span>
                      General Discount
                    </a>
                  </li>
                  <li
                    className={classNames({
                      active: this.state.showEarlyBird == true
                    })}
                  >
                    <a
                      href="javascript:void(0);"
                      onClick={() => this.showDiscount('early')}
                    >
                      <span className="ico-tag">
                        <svg>
                          <use xlinkHref={`${Sprite}#tagIco`} />
                        </svg>
                      </span>
                      Offers
                    </a>
                  </li>
                  <li
                    className={classNames({
                      active: this.state.showCoupon == true
                    })}
                  >
                    <a
                      href="javascript:void(0);"
                      onClick={() => this.showDiscount('coupon')}
                    >
                      <span className="ico-coupon">
                        <svg>
                          <use xlinkHref={`${Sprite}#couponIco`} />
                        </svg>
                      </span>
                      Coupon
                    </a>
                  </li>
                </ul>
              </aside>
              {/* {this.state.showGeneral
                ? this.renderDiscount()
                : this.state.showEarlyBird
                  ? this.renderOffers()
                  : this.renderCoupon()
              } */}

              {this.renderDiscount()}
              {this.renderOffers()}

              {this.renderCoupon()}
              {/* <div className="btn-footer">
                <a className="btn btnCancel ripple">Cancel</a>
                <a
                  className="btn btnInfo ripple ml-10"
                  href="javascript:void(0)"
                  onClick={() => this.saveDiscount()}
                >
                  {' '}
                  Save{' '}
                </a>
              </div> */}
              <div className="events-page-footer">
                <div className="btnPageNav">
                  <a
                    className="btnTag mb-20"
                    onClick={() =>
                      this.navigateToUrlPage('/manager/sponsorList')
                    }
                  >
                    <i className="fa fa-arrow-left" aria-hidden="true" />
                  </a>

                  {/* <a
                    className="btnTag mb-20"
                    onClick={() => this.saveDiscount()}
                  >
                    <i className="fa fa-arrow-right" aria-hidden="true" />
                  </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderDiscount = () => {
    return (
      <div className="discount-container">
        <GeneralDiscount
          showGeneral={this.state.showGeneral}
          parentDiscountList={this.state.parentDiscountList}
          userId={this.props.userId}
          eventId={this.state.eventId}
          updatePageWithLatestdata={this.updatePageWithLatestdata}
        />
      </div>
    );
  };

  renderOffers = () => {
    return (
      <div className="discount-container">
        <Offers
          showEarlyBird={this.state.showEarlyBird}
          parentOfferList={this.state.parentOfferList}
          userId={this.props.userId}
          eventTimeZone={this.state.eventTimeZone}
          eventStartDate={this.state.eventStartDate}
          eventEndDate={this.state.eventEndDate}
          eventId={this.state.eventId}
          updatePageWithLatestdata={this.updatePageWithLatestdata}
        />
      </div>
    );
  };

  renderCoupon = () => {
    return (
      <div className="discount-container">
        <Coupons
          showCoupon={this.state.showCoupon}
          parentCouponList={this.state.parentCouponList}
          userId={this.props.userId}
          eventTimeZone={this.state.eventTimeZone}
          eventStartDate={this.state.eventStartDate}
          eventEndDate={this.state.eventEndDate}
          eventId={this.state.eventId}
          updatePageWithLatestdata={this.updatePageWithLatestdata}
          parentOfferList={this.state.parentOfferList}
        />
      </div>
    );
  };
}

// export default Discount;

function mapStateToProps(state) {
  return {
    events: state.events,
    discount: state.discount,
    userId: state.profileData ? state.profileData.id : ''
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actionCreateDiscount,
      actionGetDiscount
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Discount);
