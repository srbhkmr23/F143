import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Countdown from 'react-countdown-now';
import {
  showLoader,
  hideLoader,
  updateUserInfo
} from '../../common/action/index';
import {
  handleApiError,
  showSuccessToast
} from '../../common/core/common-functions';
import ReactTooltip from 'react-tooltip';
import innovecsysApiService from '../../common/core/api';

import TermsAndCondition from '../../common/termsAndCondition/termsAndCondition';

import Config from '../../common/core/config';
import 'react-select/dist/react-select.css';
import Sprite from '../../img/sprite.svg';

/*
===========PlanDetails ============
appleProductIdentifier:""
createdTimeStamp:1521699836630
description:"sfjlkdsfdslkjflkdsjflkdsfjlkds lkjflk jlkdsjflkj fdslkjf dsxlk"
freeOfCost:false
isFreeOfCost:false
lastModifiedTimeStamp:1521699836630
planId:"5ace17c25ca0609993aa0803"
planName:"default_299"
price:"10.00"
stripePlanId:""
typeOfPlan:null
*/

class PurchaseMemberPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptChecked: false,

      nameOfCardHolder: '',
      nameOfCardHolderErrorMessage: '',
      isNameOfCardHolderValid: false,
      nameOfCardHolderActive: false,

      phoneNoOfCardHolder: '',
      phoneNoOfCardHolderErrorMessage: '',
      isPhoneNoOfCardHolderValid: false,
      phoneNoOfCardHolderActive: false,

      zipCodeForCardPayment: '',
      zipCodeForCardPaymentErrorMessage: '',
      isZipCodeForCardPaymentValid: false,
      zipCodeForCardPaymentActive: false,
      finalAmountToPay: {},
      stripe: window.Stripe(Config.StripeKey),
      card: '',
      email: '',
      planDetail: '',
      disableButton: true,
      cardValidation: false,
      nameValidation: false,
      upgrade: false,
      openDialog: false
    };
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
    this.generateStripeFields = this.generateStripeFields.bind(this);
    this.setOutcome = this.setOutcome.bind(this);
    this.createToken = this.createToken.bind(this);
    this.handleAcceptTerms = this.handleAcceptTerms.bind(this);
    this.openDialogHandler = this.openDialogHandler.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {
    try {
      if (this.props.location.state) {
        const planDetail = this.props.location.state.planDetails;
        const upgrade = this.props.location.state.upgrade;
        this.setState({ planDetail, upgrade });
        this.generateStripeFields();
      } else {
        this.props.history.push('plan');
      }
    } catch (error) {
      this.props.history.push('plan');
    }
  }

  openDialogHandler(isOpen) {
    this.setState({
      openDialog: isOpen
    });
  }

  valCardDetails() {
    if (
      this.state.nameOfCardHolder.toString().trim().length &&
      this.state.phoneNoOfCardHolder.toString().trim().length &&
      this.state.zipCodeForCardPayment.toString().trim().length &&
      this.state.cardValidation &&
      this.state.acceptChecked === true
    ) {
      this.setState({
        disableButton: false
      });
    } else {
      this.setState({
        disableButton: true
      });
    }
  }

  handleMobileInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(Config.regExp_number);
    if (value === '' || regExp.test(value) === true) {
      this.setState({ [name]: value });
    } else {
      errMessage = 'Mobile number should be a number';
      this.setState({
        isPhoneNoOfCardHolderValid: false,
        phoneNoOfCardHolderErrorMessage: errMessage,
        phoneNoOfCardHolderActive: false
      });
      return 0;
    }

    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Mobile number is required';
      this.setState({
        disableButton: true,
        isPhoneNoOfCardHolderValid: false,
        phoneNoOfCardHolderErrorMessage: errMessage,
        phoneNoOfCardHolderActive: false
      });
      return 0;
    }

    this.setState(
      {
        disableButton: false,
        isPhoneNoOfCardHolderValid: true,
        phoneNoOfCardHolderErrorMessage: '',
        phoneNoOfCardHolderActive: false
      },
      () => {
        this.valCardDetails();
      }
    );
    //this.valCardDetails();
  }

  onControlFocus(e) {
    const name = e.target.name;

    let controlErrorMessage = name + 'ErrorMessage';
    let controlActive = name + 'Active';
    this.setState({
      [controlErrorMessage]: '',
      [controlActive]: true
    });
    ReactTooltip.hide();
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
    if (name === 'nameOfCardHolder') {
      let myVal = String(value).trim();
      if (myVal.length === 0) {
        this.setState(
          {
            nameValidation: false
            //disableButton: true
          },
          () => {
            this.valCardDetails();
          }
        );
      } else if (this.state.cardValidation && this.state.acceptTerms) {
        this.setState({
          nameValidation: true
          //disableButton: false
        });
      } else {
        this.setState({
          nameValidation: true
          //disableButton: true
        });
      }
    }
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Name is required';
      this.setState({
        //disableButton: true,
        isNameOfCardHolderValid: false,
        nameOfCardHolderErrorMessage: errMessage,
        nameOfCardHolderActive: false
      });
      return 0;
    }

    this.setState(
      {
        //disableButton: false,
        isNameOfCardHolderValid: true,
        nameOfCardHolderErrorMessage: '',
        nameOfCardHolderActive: false
      },
      () => {
        this.valCardDetails();
      }
    );
    //this.valCardDetails();
    return 1;
  }

  handleZipInput(e) {
    const name = e.target.name;
    let value = e.target.value;
    const regExp = new RegExp(Config.regExp_alphaNumSpace);
    if (value === '' || regExp.test(value) === true) {
      this.setState({
        [name]: value
      });
    }
    let errMessage;
    if (!value.toString().trim().length) {
      errMessage = 'Zip number is required';
      this.setState({
        disableButton: true,
        isZipCodeForCardPaymentValid: false,
        zipCodeForCardPaymentErrorMessage: errMessage,
        zipCodeForCardPaymentActive: false
      });
      return 0;
    }

    this.setState(
      {
        disableButton: false,
        isZipCodeForCardPaymentValid: true,
        zipCodeForCardPaymentErrorMessage: '',
        zipCodeForCardPaymentActive: false
      },
      () => {
        this.valCardDetails();
      }
    );
    //this.valCardDetails();
    return 1;
  }

  handleAcceptTerms(e) {
    this.setState(
      {
        acceptChecked: !this.state.acceptChecked,
        acceptTerms: !this.state.acceptTerms
      },
      () => {
        if (
          this.state.acceptTerms &&
          this.state.cardValidation &&
          this.state.isNameOfCardHolderValid
        ) {
          this.setState(
            {
              //disableButton: false
            },
            () => {
              this.valCardDetails();
            }
          );
        } else {
          this.setState(
            {
              //disableButton: true
            },
            () => {
              this.valCardDetails();
            }
          );
        }
        //this.valCardDetails();
      }
    );
  }

  handleUserNumericInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      this.setState({ [name]: value });
    }
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  /**
   * Strip code started
   */
  generateStripeFields() {
    let elements = this.state.stripe.elements();
    let _this = this;
    let card = elements.create('card', {
      iconStyle: 'solid',
      hidePostalCode: true,
      style: {
        base: {
          iconColor: '#263238',
          color: '#00000',
          lineHeight: '36px',
          fontWeight: 300,
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '19px',

          '::placeholder': {
            color: '#263238'
          }
        },
        invalid: {
          iconColor: '#e85746',
          color: '#e85746'
        }
      },
      classes: {
        focus: 'is-focused',
        empty: 'is-empty'
      }
    });
    // card.mount("#card-element");
    card.mount(this.cardElement);

    card.on('change', function(event) {
      _this.props.showLoader();
      _this.setOutcome(event);
    });

    this.setState({ card });
  }

  setOutcome(result) {
    // alert('outcome');
    let _this = this;
    this.props.hideLoader();

    if (result.token) {
      const token = result.token;
      const tokenId = token.id;
      const planId = this.state.planDetail.planId;
      const planName = this.state.planDetail.planName;
      const buyerUserId = this.props.userInfo.id;
      // this.props.actionPayAndSubscribeEvent(payAndSubscribe);
      let data = {
        planId,
        buyerUserId,
        basePrice: this.state.planDetail.price,
        innovecsysDiscount: 0,
        finalPrice: this.state.planDetail.price,
        ifSubscriptionWithStripe: {
          token: tokenId,
          description: planName
        }
      };
      // let data = {
      //   planId,
      //   buyerUserId,
      //   basePrice: this.state.planDetail.price,
      //   innovecsysDiscount: 0,
      //   appliedDiscountId: "",
      //   appliedCouponId: "",
      //   appliedOfferId: "",
      //   finalPrice: this.state.planDetail.price,
      //   ifSubscriptionWithStripe: {
      //     token: tokenId,
      //     description: ""
      //   }
      // };

      if (_this.state.upgrade == true) {
        _this.upgradePlan(planId, data);
        return;
      }

      _this.props.showLoader();
      innovecsysApiService('purchaseMemberPlan', data)
        .then(result => {
          _this.props.hideLoader();
          try {
            if (result.data.status === 200) {
              this.props.updateUserInfo({ planId });
              setTimeout(() => {
                _this.props.hideLoader();
                this.props.history.push('/');
              }, 1000);
            } else _this.props.hideLoader();
          } catch (error) {}
        })
        .catch(error => {
          _this.props.hideLoader();
        });
    } else if (result) {
      try {
        if (result.empty === false && result.complete === true) {
          this.setState({
            cardValidation: true
          });
          if (this.state.nameValidation) {
            this.setState({
              //disableButton: false
            });
          }
        } else {
          this.setState({
            //disableButton: true,
            cardValidation: false
          });
        }
      } catch (error) {}
    }
    this.valCardDetails();
  }

  upgradePlan = (planId, data) => {
    let _this = this;
    _this.props.showLoader();
    innovecsysApiService('updateMemberPlan', data)
      .then(result => {
        try {
          if (result.data.status === 200) {
            this.props.updateUserInfo({ planId });
            setTimeout(() => {
              _this.props.hideLoader();
              _this.props.history.push('/');
            }, 1000);
          } else _this.props.hideLoader();
        } catch (error) {}
      })
      .catch(error => {
        _this.props.hideLoader();
      });
  };

  createToken() {
    var extraDetails = {
      name: this.state.nameOfCardHolder
      // tenantId: tenantId,
      // planId: planId,
      // userId: userId,
      // address_zip: vm.paymentZipCode,
      // phone_no: vm.mobileNo
    };
    this.props.showLoader();
    this.state.stripe
      .createToken(this.state.card, extraDetails)
      .then(this.setOutcome);
  }

  // document.querySelector('form').addEventListener('submit', function(e) {
  //   e.preventDefault();
  //   e.stopPropogation();
  //   var form = document.querySelector('form');
  //   var extraDetails = {
  //     name: document.querySelector('input[name=cardholder-name]').value,
  //     tenantId: tenantId,
  //     planId: planId,
  //     userId: userId

  //   };
  //   stripe.createToken(card, extraDetails).then(setOutcome);
  // });

  /**
   * stripe code end
   */

  render() {
    // const disableButton = this.state.disableButton ? 'disabled' : '';
    return (
      <div className="h-100">
        <ReactTooltip effect="solid" type="error" place="bottom" />
        <div className="h-100">
          <section className="join_event_payment h-100">
            <div className="blkevt-bg">
              <div className="container">
                <div className="row">
                  <div className="col-xs-8">
                    <div className="in-head event_headtext">
                      <h3 className="text-white m0">
                        {/* Parental Consultant Conference */}
                        {this.state.planDetail
                          ? this.state.planDetail.planName
                          : ''}
                      </h3>
                      {/* <div className="rating ratingstar">
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                      </div> */}
                      {/* <p>By Hugh Gilgoff, MD</p> */}
                    </div>
                  </div>
                  <div className="col-xs-4">
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
                        <li>
                          Price: ${this.state.planDetail
                            ? this.state.planDetail.price
                            : ''}/{this.state.planDetail.planIntervalType}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="jointevtpay">
                <div className="row">
                  <div className="joint-eventpay-wrap">
                    <div className="paymentcard_wrap">
                      <div className="paymentcrad-sec">
                        <h3>
                          Payment Details{' '}
                          <span className="pull-right">
                            {/* Timer Count */}

                            <Countdown
                              date={Date.now() + 600000}
                              renderer={props => (
                                <div>
                                  {props.minutes}: {props.seconds}
                                </div>
                              )}
                              onComplete={() => {
                                this.props.history.goBack();
                              }}
                            />
                          </span>
                        </h3>
                        <form action="#">
                          <div className="paymentcard">
                            <div className="row">
                              <div className="col-xs-12">
                                <div
                                  className={classNames('form-group ripple', {
                                    tbError:
                                      this.state.nameOfCardHolderErrorMessage
                                        .length > 0,
                                    tbFocus: this.state.nameOfCardHolderActive
                                  })}
                                >
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="cardnme"
                                    name="nameOfCardHolder"
                                    maxLength="30"
                                    placeholder="Name on card"
                                    value={this.state.nameOfCardHolder}
                                    onFocus={event =>
                                      this.onControlFocus(event)
                                    }
                                    onChange={event =>
                                      this.handleUserInput(event)
                                    }
                                    // onBlur={e =>
                                    //   this.validateName(
                                    //     this.state.nameOfCardHolder
                                    //   )
                                    // }
                                    data-tip={
                                      this.state.nameOfCardHolderErrorMessage
                                    }
                                  />
                                  {this.state.nameOfCardHolderErrorMessage
                                    .length > 0 ? (
                                    <i className="fa fa-exclamation-triangle alertIcon" />
                                  ) : (
                                    ''
                                  )}
                                  {this.state.isNameOfCardHolderValid ==
                                  true ? (
                                    <i className="fa fa-check tbCheck" />
                                  ) : (
                                    ''
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-6 pr-5">
                                <div
                                  className={classNames('form-group ripple', {
                                    tbError:
                                      this.state.phoneNoOfCardHolderErrorMessage
                                        .length > 0,
                                    tbFocus: this.state
                                      .phoneNoOfCardHolderActive
                                  })}
                                >
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="phoneNoOfCardHolder"
                                    name="phoneNoOfCardHolder"
                                    placeholder="Phone Number"
                                    maxLength="13"
                                    value={this.state.phoneNoOfCardHolder}
                                    onFocus={event =>
                                      this.onControlFocus(event)
                                    }
                                    onChange={event =>
                                      this.handleMobileInput(event)
                                    }
                                    // onBlur={e =>
                                    //   this.validateMobileNumber(
                                    //     this.state.phoneNoOfCardHolder
                                    //   )
                                    // }
                                    data-tip={
                                      this.state.phoneNoOfCardHolderErrorMessage
                                    }
                                  />
                                  {this.state.phoneNoOfCardHolderErrorMessage
                                    .length > 0 ? (
                                    <i className="fa fa-exclamation-triangle alertIcon" />
                                  ) : (
                                    ''
                                  )}
                                  {this.state.isPhoneNoOfCardHolderValid ==
                                  true ? (
                                    <i className="fa fa-check tbCheck" />
                                  ) : (
                                    ''
                                  )}
                                </div>
                              </div>
                              <div className="col-xs-6 pl-5">
                                <div
                                  className={classNames('form-group ripple', {
                                    tbError:
                                      this.state
                                        .zipCodeForCardPaymentErrorMessage
                                        .length > 0,
                                    tbFocus: this.state
                                      .zipCodeForCardPaymentActive
                                  })}
                                >
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="zipCodeForCardPayment"
                                    name="zipCodeForCardPayment"
                                    placeholder="Zip Code"
                                    maxLength="6"
                                    value={this.state.zipCodeForCardPayment}
                                    onFocus={event =>
                                      this.onControlFocus(event)
                                    }
                                    onChange={event =>
                                      this.handleZipInput(event)
                                    }
                                    // onBlur={e =>
                                    //   this.validateZipNumber(
                                    //     this.state.zipCodeForCardPayment
                                    //   )
                                    // }
                                    data-tip={
                                      this.state
                                        .zipCodeForCardPaymentErrorMessage
                                    }
                                  />
                                  {this.state.zipCodeForCardPaymentErrorMessage
                                    .length > 0 ? (
                                    <i className="fa fa-exclamation-triangle alertIcon" />
                                  ) : (
                                    ''
                                  )}
                                  {this.state.isZipCodeForCardPaymentValid ==
                                  true ? (
                                    <i className="fa fa-check tbCheck" />
                                  ) : (
                                    ''
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xs-12">
                                <div class="form-group">
                                  <div
                                    id="card-element"
                                    ref={element =>
                                      (this.cardElement = element)
                                    }
                                    class="field is-empty"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="TnC_CheckBox">
                              <label class="custom-label label--checkbox">
                                {/* I accept the terms of services. */}
                                <input
                                  type="checkbox"
                                  name="acceptTerms"
                                  onClick={this.handleAcceptTerms}
                                  checked={this.state.acceptTerms}
                                />
                                <div class="control__indicator" />
                              </label>
                              <a
                                href="javascript:void(0);"
                                className="TnC_LinkText"
                                onClick={() => {
                                  this.setState({ openDialog: true });
                                }}
                              >
                                I accept the terms of services.
                              </a>
                            </div>

                            {/* <div className="TnC_CheckBox">
                              <label class="custom-label label--checkbox">
                                I accept the terms of services.
                                <input
                                  type="checkbox"
                                  name="acceptTerms"
                                  onClick={this.handleAcceptTerms}
                                  checked={this.state.acceptTerms}
                                />
                                <div class="control__indicator" />
                              </label>
                            </div> */}

                            <div className="btn_pay text-center">
                              <button
                                type="button"
                                className="btn btnInfo paymentbtn ripple width-100"
                                onClick={() => this.createToken()}
                                disabled={this.state.disableButton}
                              >
                                Make Payment
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <TermsAndCondition
          openDialogHandler={this.openDialogHandler}
          openDialog={this.state.openDialog}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    userProfileData: state.userProfileData,
    userInfo: state.userInfo,
    member: state.member
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    { showLoader, hideLoader, updateUserInfo },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseMemberPlan);

// export default PurchaseMemberPlan;
