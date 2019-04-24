import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  showWarningToast,
  showSuccessToast
} from '../../common/core/common-functions';
import innovecsysApiService from '../../common/core/api';
import {
  updateUserInfo,
  showLoader,
  hideLoader
} from '../../common/action/index';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import Sprite from '../../img/sprite.svg';
//import $ from 'jquery';
//import AlertModal from '../../common/alert-box/alert-modal';

class Plan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      planList: [],
      upgrade: false,
      planName: '',
      open: false,
      planGroupObject: {}
    };
    this.onBuyPlan = this.onBuyPlan.bind(this);
  }

  componentDidMount() {
    try {
      if (this.props.location.state) {
        const upgrade = this.props.location.state.upgrade;
        this.setState({ upgrade });
      } else {
        this.setState({ upgrade: false });
      }
    } catch (error) {
      console.log(error);
    }

    innovecsysApiService('getAllMemberPlan').then(result => {
      try {
        if (result.data.resourceData.length > 0) {
          let planList = result.data.resourceData;
          this.setState({
            planList: planList //result.data.resourceData
          });
          this.filterPlanWithGroup(planList);
        }
      } catch (error) {}
    });
  }

  filterPlanWithGroup = planList => {
    let planGroupObject = {};
    try {
      planList.map(plan => {
        let groupArray = planGroupObject[plan.token] || [];
        groupArray.push(plan);
        planGroupObject[plan.token] = groupArray;
      });
      console.log(planGroupObject);
      this.setState({ planGroupObject });
    } catch (err) {
      console.log(err);
    }
  };

  onClickBuyPlan = (item, index) => {
    // console.log("intervalOfPlan",this.state.intervalOfPlan)
    let getSendItem = {};
    let intervals = {
      monthly: 'month',
      yearly: 'year'
    };
    let selectedInterval = intervals[this.state.intervalOfPlan];
    // console.log("this.state.planList",this.state.planList)
    if (item.freeOfCost == true) {
      getSendItem = item;
    } else {
      this.state.planList.map(plan => {
        if (
          plan.token == item.token &&
          plan.planIntervalType == selectedInterval
        ) {
          getSendItem = plan;
        }
      });
    }
    // console.log("getSendItem",getSendItem)

    if (
      getSendItem.planId &&
      this.props.userInfo.planId &&
      getSendItem.planId == this.props.userInfo.planId
    ) {
      showWarningToast('You are already subscribed to this plan');
      return;
    }

    this.onBuyPlan(getSendItem, index);
  };

  onBuyPlan(planDetails, index) {
    let _this = this;
    this.setState({ planDetails: planDetails, planName: planDetails.planName });
    if (planDetails.freeOfCost === true) {
      if (this.state.upgrade === true) this.setState({ open: true, action: 1 });
      else {
        this.setState({ action: 1 }, () => {
          this.purchasePlan();
        });
      }
    } else {
      if (this.state.intervalOfPlan) {
        if (this.state.index === index) {
          if (this.state.upgrade === true)
            this.setState({ open: true, action: 2 });
          else {
            this.setState({ action: 2 }, () => {
              this.purchasePlan();
            });
          }
        } else {
          showWarningToast('Please select interval for the same plan');
          return;
        }
      } else {
        showWarningToast('Please select plan interval');
        return;
      }
    }
  }

  /*showAlert(planDetails, index) {
    $('#alert_modal').modal();
    this.setState({
      planDetails: planDetails,
      index : index,
      showDeleteModal: true
    });
  }

  hideDeleteModal = () => {
    this.setState({
      showDeleteModal: false
    });
  };*/

  upgradePlan = (planId, data) => {
    if (planId == this.props.userInfo.planId) {
      this.setState({ open: false });
      showWarningToast('Already subsuscibed this plan');
    } else {
      let _this = this;
      this.props.showLoader();
      innovecsysApiService('updateMemberPlan', data)
        .then(result => {
          try {
            if (result.data.status === 200) {
              this.props.updateUserInfo({ planId });
              setTimeout(() => {
                _this.props.hideLoader();
                _this.props.history.push('/');
                // this.props.history.push('/');
              }, 1000);
            }
          } catch (error) {}
        })
        .catch(error => {
          _this.props.hideLoader();
          console.log(error);
        });
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  purchasePlan() {
    if (this.state.action == 1) {
      let _this = this;
      const planId = this.state.planDetails.planId;
      const buyerUserId = this.props.userInfo.id || '';
      let data = {
        planId,
        buyerUserId
      };

      this.setState({ open: false });
      if (this.state.upgrade == true) {
        this.upgradePlan(planId, data);
        return;
      }

      _this.props.showLoader();
      innovecsysApiService('purchaseMemberPlan', data)
        .then(result => {
          try {
            if (result.data.status === 200) {
              this.props.updateUserInfo({ planId });
              setTimeout(() => {
                _this.props.hideLoader();
                _this.props.history.push('/');
                // this.props.history.push('/');
              }, 1000);
            } else _this.props.hideLoader();
          } catch (error) {}
        })
        .catch(error => {
          _this.props.hideLoader();
          console.log(error);
        });
    }

    if (this.state.action == 2) {
      this.props.history.push({
        pathname: 'purchaseMemberPlan',
        state: {
          planDetails: this.state.planDetails,
          upgrade: this.state.upgrade
        }
      });
    }
  }

  getActivePlanToken = activePlanId => {
    let activePlanToken = '';
    this.state.planList.map(plan => {
      if (plan.planId == activePlanId) {
        activePlanToken = plan.token;
      }
    });
    return activePlanToken;
  };

  render() {
    const activePlanId = this.props.userInfo.planId;
    let keyList = Object.keys(this.state.planGroupObject) || [];
    let planGroupObject = this.state.planGroupObject;
    return (
      <div className="bg-dark mh-100 ">
        <section className="planPricingSec">
          <div className="container">
            <div className="price-heading text-center">
              <h3 className="pricingTitle">Plans and Pricing</h3>
              <p className="text-dark">Unlock access to Innovecsys</p>
            </div>
            <div className="pricingWrapper">
              <div className="row">
                {keyList.map((key, index) => {
                  let item = planGroupObject[key][0];
                  return (
                    <div className="col-sm-4" key={index}>
                      <div className="planPriceCard gal-eff mt-25">
                        <div
                          className={`ribbon ${
                            this.getActivePlanToken(activePlanId) === item.token
                              ? ''
                              : 'hide'
                          }`}
                        >
                          <span className="paidUserRibbon">Purchased</span>
                        </div>
                        <div className="plan-header">
                          <h2>{item.planName}</h2>
                        </div>
                        <div className="price">
                          <span>$</span>
                          <span>{item.price}</span>
                          <span>/month</span>
                        </div>

                        <div className="planDetails">
                          <div className="planOffers">
                            <span className="ico-rightplanPurchase">
                              <svg>
                                <use
                                  xlinkHref={`${Sprite}#rightplanPurchaseIco`}
                                />
                              </svg>
                            </span>
                            <p>{item.description}</p>
                          </div>
                        </div>

                        <div className="footer-btn">
                          {item.freeOfCost !== true ? (
                            <div className="selectPlan">
                              <span>
                                <input
                                  type="radio"
                                  id={'month' + index}
                                  className="radio-custom"
                                  name={'radio-group'}
                                  value="monthly"
                                  onChange={event => {
                                    const planIntervalType = event.target.value;
                                    // item.planIntervalType = planIntervalType;
                                    this.setState({
                                      index: index,
                                      intervalOfPlan: planIntervalType
                                    });
                                  }}
                                />
                                <label
                                  htmlFor={'month' + index}
                                  className="radio-custom-label"
                                >
                                  Monthly
                                </label>
                              </span>
                              <span>
                                <input
                                  type="radio"
                                  id={'year' + index}
                                  className="radio-custom"
                                  name={'radio-group'}
                                  value="yearly"
                                  onChange={event => {
                                    const planIntervalType = event.target.value;
                                    // item.planIntervalType = planIntervalType;
                                    this.setState({
                                      index: index,
                                      intervalOfPlan: planIntervalType
                                    });
                                  }}
                                />
                                <label
                                  htmlFor={'year' + index}
                                  className="radio-custom-label"
                                >
                                  Yearly
                                </label>
                              </span>
                            </div>
                          ) : (
                            ''
                          )}

                          <button
                            className="btn btn-dark o-border pull-left ripple"
                            type="button"
                            onClick={() => {
                              this.onClickBuyPlan(item, index);
                              // this.onBuyPlan(item, index);
                              //this.onBuyPlan(item, index);
                            }}
                          >
                            BUY THIS PLAN
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={'md'}
          className="editEventModal"
        >
          <DialogContent className="editEventModal-body">
            <span className="ico-close" onClick={this.handleClose}>
              <svg>
                <use xlinkHref={`${Sprite}#close`} />
              </svg>
            </span>
            <div className="mdl-BgDesign bg-publish">&nbsp;</div>
            <div className="mdlContent">
              <div className="publishIconDiv">
                <span className="ico-publish">
                  <svg>
                    <use xlinkHref={`${Sprite}#publishIco`} />
                  </svg>
                </span>
              </div>
              <h4>
                Are you sure ? Your current plan subscription will cancel and "{this
                  .state.planName
                  ? this.state.planName
                  : ''}" plan will activate.
              </h4>
            </div>
            <div className="mdl-footer mt-20">
              <button
                type="button"
                className="btn btnSubmit ripple"
                onClick={() => this.purchasePlan()}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn btnCancel ripple ml-20"
                onClick={this.handleClose}
              >
                No
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* <AlertModal
          confirmedMe={this.onBuyPlan}
          eventType="delete"
          customClass="deleteIconDiv"
          alertMessage="Are you sure you want to delete?"
          showDeleteModal={this.state.showDeleteModal}
          hideDeleteModal={this.hideDeleteModal}
        />*/}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { updateUserInfo, showLoader, hideLoader },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
