import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import URLSearchParams from 'url-search-params';
import Select from 'react-select';
import StripeCheckout from 'react-stripe-checkout';
import Countdown from 'react-countdown-now';
import Helmet from 'react-helmet';

import {
  actionGetDiscount,
  actionGetEventAmountToPay,
  actionPayAndSubscribeEvent,
  showLoader,
  hideLoader,
  actionMemberEventDetailsObjectData,
  actiongGetProfileDataById,
  updateUserInfo
} from '../../common/action/index';

import TermsAndCondition from '../../common/termsAndCondition/termsAndCondition';
import config from '../../common/core/config';
import ReactTooltip from 'react-tooltip';
import {
  CreateStripeObject,
  showWarningToast
} from '../../common/core/common-functions';
import innovecsysApiService from '../../common/core/api';
import Config from '../../common/core/config';
import 'react-select/dist/react-select.css';
import { showSuccessToast } from '../../common/core/common-functions';

import logo from '../../img/innovecsyslogoblack.png';
import arrow from '../../img/back_arrow.png';
import { stat } from 'fs';
import Sprite from '../../img/sprite.svg';

let scriptLoaded = false;
let scriptLoading = false;
let scriptDidError = false;

class JoinEventPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: '',
      eventBasePrice: '',
      eventName: '',
      eventCompany: '',
      isOfferVisible: false,
      discountList: [],
      companyDiscountList: [],
      offerList: [],
      allOfferList: [],
      companyOfferList: [],
      companyAllOfferList: [],
      allIndependentOfferList: [],
      couponList: [],
      companyCouponList: [],
      allCouponList: [],
      companyAllCouponList: [],

      combinedCouponList: [],
      combinedAllCouponList: [],

      combinedOfferList: [],
      combinedAllOfferList: [],

      delegateList: [],
      selectedDelegate: '',
      selectedDelegateObject: {},
      selectedDelegateDiscountList: [],
      selectedOfferList: [],
      selectedCouponList: [],
      acceptChecked: false,
      selectedOfferFromCouponId: '',

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
      stripe: window.Stripe(config.StripeKey),
      card: '',
      email: '',
      disableButton: true,
      cardValidation: false,
      acceptTerms: false,
      openDialog: false
    };
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
    this.generateStripeFields = this.generateStripeFields.bind(this);
    this.setOutcome = this.setOutcome.bind(this);
    this.createToken = this.createToken.bind(this);
    this.handleAcceptTerms = this.handleAcceptTerms.bind(this);
    this.checkEventPublishedOrNot = this.checkEventPublishedOrNot.bind(this);
    this.openDialogHandler = this.openDialogHandler.bind(this);
  }

  componentWillMount() {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    // const eventId = params.get('eventId') || '';
    // const eventBasePrice = params.get('eventBasePrice') || '';
    // const eventName = params.get('eventName') || '';
    // const eventCompany = params.get('eventCompany') || '';

    // let redirectLocation=window.redirectLocation ? window.redirectLocation.pathname : '';
    let lastStateLocation = this.props.history.location;
    if (
      lastStateLocation &&
      lastStateLocation.state &&
      lastStateLocation.state.throughJoinEventPage != true
    ) {
      // if(redirectLocation){
      //   this.props.history.push(redirectLocation);
      // }
      // else{
      //   this.props.history.goBack();
      // }

      this.props.history.goBack();
    }

    const paramEventId = params.get('eventId') || '';

    try {
      this.props.history.replace({
        pathname: this.props.location.pathname,
        search: '?eventId=' + paramEventId,
        state: {}
      });
    } catch (err) {
      console.log(err);
    }

    this.checkEventPublishedOrNot(paramEventId);

    let eventId = '';
    let eventBasePrice = '';
    let eventName = '';
    let eventCompany = '';
    let buyEventDetails = {};

    if (this.props.member) {
      buyEventDetails = this.props.member.buyEventDetails || {};
    }

    if (buyEventDetails.eventId) {
      eventId = buyEventDetails.eventId || '';
      eventBasePrice = buyEventDetails.eventBasePrice || '';
      eventName = buyEventDetails.eventName || '';
      eventCompany = buyEventDetails.eventCompany || '';
    }

    if (eventId === '') {
      this.navigateByUrlName('/member/eventDetails?eventId=' + paramEventId);
    } else {
      this.setState({ eventId, eventBasePrice, eventName, eventCompany }, () =>
        this.getTotalAmount(res => {})
      );
      this.getDiscount(eventId);
    }
  }

  openDialogHandler(isOpen) {
    this.setState({
      openDialog: isOpen
    });
  }

  checkEventPublishedOrNot(eventId) {
    let _this = this;
    let sendObject = {};
    let callerMemberUserId = this.props.userInfo.id || '';
    this.props.showLoader();
    sendObject = {
      eventId,
      callerMemberUserId
    };

    this.props
      .actionMemberEventDetailsObjectData(sendObject)
      .then(res => {
        _this.props.hideLoader();
        try {
          if (res.payload.data.status === 404)
            _this.navigateByUrlName('/error');
          else if (!res.payload.data.resourceData.published) {
            showSuccessToast("Can't pay for unpublished event");
            this.navigateByUrlName('/error');
          }
        } catch (error) {}
      })
      .catch(error => {
        _this.props.hideLoader();
      });
  }

  componentDidMount() {
    console.log('this.props', this.props);
    console.log('this.props.history', this.props.history);

    this.generateStripeFields();
  }

  componentWillUnmount() {
    window.previousLocation = this.props.location;
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
    return 1;
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
            isNameOfCardHolderValid: false
            //disableButton: true
          },
          () => {
            this.valCardDetails();
          }
        );
      } else if (this.state.cardValidation && this.state.acceptTerms) {
        this.setState({
          isNameOfCardHolderValid: true
          //disableButton: false
        });
      } else {
        this.setState({
          isNameOfCardHolderValid: true
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

  getDiscount = eventId => {
    this.props.actionGetDiscount(eventId).then(
      res => {
        if (
          res &&
          res.payload &&
          res.payload.data &&
          res.payload.data.resourceData
        ) {
          let resourceData = res.payload.data.resourceData;

          let discountList = [];
          let companyDiscountList = [];
          let offerList = [];
          let companyOfferList = [];
          let couponList = [];
          let companyCouponList = [];

          let allOfferList = [];
          let companyAllOfferList = [];
          let allCouponList = [];
          let companyAllCouponList = [];

          if (resourceData.discounts) {
            discountList = resourceData.discounts.innovecsysDiscounts || [];
            companyDiscountList = resourceData.discounts.companyDiscounts || [];
          }

          if (resourceData.offers) {
            offerList = resourceData.offers.innovecsysOffers || [];
            allOfferList = resourceData.offers.innovecsysOffers || [];

            companyOfferList = resourceData.offers.companyOffers || [];
            companyAllOfferList = resourceData.offers.companyOffers || [];
          }

          if (resourceData.coupons) {
            couponList = resourceData.coupons.innovecsysCoupons || [];
            allCouponList = resourceData.coupons.innovecsysCoupons || [];

            companyCouponList = resourceData.coupons.companyCoupons || [];
            companyAllCouponList = resourceData.coupons.companyCoupons || [];
          }

          let combinedCouponList =
            companyAllCouponList.concat(allCouponList) || [];
          let combinedAllCouponList =
            companyAllCouponList.concat(allCouponList) || [];

          let combinedOfferList =
            companyAllOfferList.concat(allOfferList) || [];
          let combinedAllOfferList =
            companyAllOfferList.concat(allOfferList) || [];

          // let discountList = resourceData.innovecsysDiscountsResponseList || [];
          // let offerList = resourceData.innovecsysOffersResponseList || [];
          // let allOfferList = resourceData.innovecsysOffersResponseList || [];
          // let couponList = resourceData.innovecsysCouponResponseList || [];
          // let allCouponList = resourceData.innovecsysCouponResponseList || [];
          let delegateList = [];

          delegateList = discountList.map(discount => {
            return {
              value: discount.id,
              label: discount.delegateType
            };
          });

          delegateList.push({ value: null, label: 'None' }); // added none

          this.setState(
            {
              discountList: discountList || [],
              companyDiscountList: companyDiscountList || [],
              offerList: offerList || [],
              allOfferList: allOfferList || [],
              couponList: couponList || [],
              allCouponList: allCouponList || [],
              delegateList: delegateList || [],
              combinedCouponList: combinedCouponList || [],
              combinedAllCouponList: combinedAllCouponList || [],
              combinedOfferList: combinedOfferList || [],
              combinedAllOfferList: combinedAllOfferList || []
            },
            () => {
              this.getIndependentsOfferList();
            }
          );
        }
      },
      err => {
        console.log(err);
      }
    );
  };

  getIndependentsOfferList = () => {
    let allCouponOffer = [];
    let allIndependentOfferList = [];
    let allIndependentOfferListIds = [];

    try {
      let combinedAllCouponList =
        JSON.parse(JSON.stringify(this.state.combinedAllCouponList)) || [];
      // get all offers which associate with coupons
      combinedAllCouponList.map(coupon => {
        if (coupon.applicableOffers) {
          coupon.applicableOffers.map(offer => {
            let index = allCouponOffer.indexOf(offer.id);
            if (index < 0) {
              allCouponOffer.push(offer.id);
            }
          });
        }
      });
      // console.log("allCouponOffer",allCouponOffer)

      let combinedAllOfferList =
        JSON.parse(JSON.stringify(this.state.combinedAllOfferList)) || [];

      // get all offers which are not associate with coupons
      combinedAllOfferList.map(offer => {
        let index = allCouponOffer.indexOf(offer.id);
        if (index < 0) {
          let innerIndex = allIndependentOfferListIds.indexOf(offer.id);
          if (innerIndex < 0) {
            allIndependentOfferListIds.push(offer.id);
            allIndependentOfferList.push(offer);
          }
        }
      });

      // console.log("allIndependentOfferList",allIndependentOfferList)
      this.setState({ allIndependentOfferList });
    } catch (err) {
      console.log(err);
    }
  };

  delegateChange = selectedDelegate => {
    if (selectedDelegate) {
      let selectedDelegateObject = this.returnSelectedDelegateObject(
        selectedDelegate.value
      );
      this.setState({
        selectedDelegate: selectedDelegate.value,
        selectedDelegateObject: selectedDelegateObject,
        selectedDelegateDiscountList: []
      });
    } else {
      this.setState({
        selectedDelegate: '',
        selectedDelegateObject: {},
        selectedDelegateDiscountList: []
      });
    }
  };

  onClickOffer = offer => {
    if (offer.applicable == false) {
      showWarningToast(
        'Sorry!! you are not eligible to avail this offer, Upgrade your plan to get more offers.'
      );
      return;
    }

    let listOfGuest = this.props.member.joinEventMembers || [];
    let numberOfMembers = listOfGuest.length + 1;

    if (numberOfMembers < offer.minAllowedUser) {
      showWarningToast(
        'Minimum member should be ' + offer.minAllowedUser + ' for this offer'
      );
      return;
    }

    if (numberOfMembers > offer.maxAllowedUser) {
      showWarningToast(
        'Maximum member should be ' + offer.maxAllowedUser + ' for this offer'
      );
      return;
    }

    let selectedOfferList = this.state.selectedOfferList || [];
    let index = selectedOfferList.indexOf(offer.id);

    if (index > -1) {
      selectedOfferList.splice(index, 1);
    } else {
      selectedOfferList = [];
      selectedOfferList.push(offer.id);
    }

    this.setState({ selectedOfferList });
  };

  onClickCoupon = coupon => {
    if (coupon.applicable == false) {
      showWarningToast(
        'Sorry!! you are not eligible to avail this coupon, Upgrade your plan to get more offers.'
      );
      return;
    }

    let selectedCouponList = this.state.selectedCouponList || [];
    let index = selectedCouponList.indexOf(coupon.id);

    if (index > -1) {
      selectedCouponList.splice(index, 1);
    } else {
      selectedCouponList = [];
      selectedCouponList.push(coupon.id);
    }

    console.log('selectedCouponList', selectedCouponList);

    // filter coupons
    let couponList = [];
    if (selectedCouponList.length > 0) {
      couponList = JSON.parse(JSON.stringify([coupon]));
    } else {
      couponList = this.state.allCouponList || [];
    }

    // filter offers
    let offerList = [];

    if (selectedCouponList.length > 0) {
      offerList = JSON.parse(JSON.stringify(coupon.applicableOffers)) || [];
    } else {
      offerList = this.state.allOfferList || [];
    }

    let selectedOfferList = this.state.selectedOfferList || [];
    let newSelectedOfferList = [];

    offerList.map(offer => {
      selectedOfferList.map((selOfferId, index) => {
        if (offer.id == selOfferId) {
          newSelectedOfferList.push(selOfferId);
        }
      });
    });

    // if (selectedCouponList.length == 0) {
    //   newSelectedOfferList = []
    // }

    this.setState({
      couponList,
      selectedCouponList,
      offerList,
      selectedOfferList: newSelectedOfferList
    });
  };

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  onClickViewOffers = () => {
    this.setState({
      isOfferVisible: true
    });
  };

  onClickCloseOffer = () => {
    this.getTotalAmount(res => {});

    this.setState({
      isOfferVisible: false
    });
  };

  getTotalAmount = cb => {
    let eventId = this.state.eventId || '';
    let listOfAppliedDiscountOrOfferIds = [];
    let listOfGuestUsers = [];

    this.state.selectedOfferList.forEach(offer => {
      listOfAppliedDiscountOrOfferIds.push(offer);
    });
    // this.state.selectedCouponList.forEach(coupon => {
    //   listOfAppliedDiscountOrOfferIds.push(coupon.id);
    // });

    let appliedCouponCode = '';
    let selectedCouponId = '';
    if (this.state.selectedCouponList.length > 0) {
      selectedCouponId = this.state.selectedCouponList[0]; //this.state.selectedCouponList[0].id;
    }

    this.state.allCouponList.map(coupon => {
      if (coupon.id == selectedCouponId) {
        appliedCouponCode = coupon.couponCode || '';
      }
    });

    let delegateType = this.state.selectedDelegate || '';

    if (delegateType != '') listOfAppliedDiscountOrOfferIds.push(delegateType);

    let listOfGuest = this.props.member.joinEventMembers || [];

    listOfGuest.map(guest => {
      guest['firstName'] = guest['name'];
      guest['lastName'] = '';
      guest['gender'] = '';
    });
    listOfGuestUsers = listOfGuest || [];

    // check company and innovacsys discount

    let companyDiscountPresent = false;
    let innovecysDiscountPresent = false;
    try {
      let discountPercentList = this.state.selectedDelegateDiscountList || [];
      if (discountPercentList.indexOf('ownerDiscountPercentage') > -1) {
        companyDiscountPresent = true;
      }

      if (discountPercentList.indexOf('innovecsysDiscountPercentage') > -1) {
        innovecysDiscountPresent = true;
      }
    } catch (err) {
      console.log(err);
    }

    let sendDataObject = {
      eventId,
      delegateType: '',
      appliedCouponCode,
      listOfAppliedDiscountOrOfferIds,
      listOfGuestUsers,
      currency: 'USD',
      payerUserId: this.props.userInfo.id,
      innovecysDiscountPresent,
      companyDiscountPresent
    };

    this.props.actionGetEventAmountToPay(sendDataObject).then(
      res => {
        if (
          res &&
          res.payload &&
          res.payload.data &&
          res.payload.data.resourceData
        ) {
          console.log(res.payload.data.resourceData);
          console.log(res.payload.data.resourceData[0]);
          let finalAmountToPay = {};
          // finalAmountToPay={
          //   coupon:res.payload.data.resourceData.coupon || {},
          //   offer:res.payload.data.resourceData.offer || {},
          //   other:res.payload.data.resourceData.other || {}
          // }
          this.setState({
            finalAmountToPay: res.payload.data.resourceData[0] || {}
          });
        }
      },
      err => {
        console.log(err);
      }
    );

    cb('res');
    // this.generateStripeFields();
  };

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
      _this.setOutcome(event);
    });

    this.setState({ card });
  }

  setOutcome(result) {
    console.log('result', result);
    let _this = this;

    let listOfGuest = this.props.member.joinEventMembers || [];
    listOfGuest.map(guest => {
      guest['firstName'] = guest['name'];
      guest['lastName'] = '';
      guest['gender'] = '';
    });
    let listOfGuestUsers = listOfGuest || [];

    const finalAmountToPay = this.state.finalAmountToPay.hasOwnProperty('other')
      ? this.state.finalAmountToPay.other.amountToPay
      : null;
    if (result.token) {
      const token = result.token;

      let payAndSubscribe = {
        eventId: this.state.eventId,
        description: '',
        finalAmountToPay,
        currency: 'USD',
        stripeEmail: this.state.email,
        stripeToken: token.id,
        payerUserId: this.props.userInfo.id,
        listOfAppliedDiscountOrOfferIds: [''],
        appliedCouponCode: '',
        delegateType: '',
        listOfGuestUsers: listOfGuestUsers,
        paymentAdditonalDetailsRequest: {
          innovecsysDiscount: 0,
          appliedDiscountId: '',
          appliedCouponId: '',
          appliedOfferId: '',
          basePrice: '',
          priceAfterDisount: '',
          priceAfterCoupon: '',
          priceAfterOffer: '',
          finalPrice: finalAmountToPay
        },
        planId: ''
      };

      // check plan id same or not

      console.log('this.props.userInfo', this.props.userInfo);
      let oldPlanId = this.props.userInfo.planId || '';

      this.validatePlan(
        oldPlanId,
        this.props.userInfo.id,
        (mached, newPlanId) => {
          if (mached == true) {
            innovecsysApiService('payAndSubscribeEvent', payAndSubscribe)
              .then(result => {
                try {
                  _this.props.hideLoader();
                  if (
                    result.data.status === 200 ||
                    result.data.status === 409
                  ) {
                    window.previousLocation = _this.props.location;
                    _this.props.history.push(
                      'eventDetails?eventId=' + _this.state.eventId
                    );
                  }
                } catch (error) {}
              })
              .catch(error => {
                _this.props.hideLoader();
              });
          } else {
            _this.props.hideLoader();
            if (newPlanId != '') {
              showWarningToast(
                'Sorry can not proceed due to change in your subscription. Please try again.'
              );
              _this.props.updateUserInfo({ planId: newPlanId });
              _this.props.history.push(
                'eventDetails?eventId=' + _this.state.eventId
              );
            } else {
              showWarningToast('Error in getting new plan details.');
            }
          }
        }
      );

      // innovecsysApiService('payAndSubscribeEvent', payAndSubscribe)
      //   .then(result => {
      //     try {
      //       _this.props.hideLoader();
      //       if (result.data.status === 200 || result.data.status === 409) {
      //         window.previousLocation = _this.props.location;
      //         _this.props.history.push(
      //           'eventDetails?eventId=' + _this.state.eventId
      //         );
      //       }
      //     } catch (error) {}
      //   })
      //   .catch(error => {
      //     _this.props.hideLoader();
      //   });
    } else if (result) {
      try {
        if (result.empty === false && result.complete === true) {
          console.log('card validated');
          this.setState({
            cardValidation: true
          });
          if (this.state.isNameOfCardHolderValid && this.state.acceptTerms) {
            console.log('name validated');
            this.setState({
              //disableButton: false
            });
          } else {
            console.log('name In validated');
          }
        } else {
          console.log('card invalid');
          this.setState({
            //disableButton: true,
            cardValidation: false
          });
        }
      } catch (error) {}
    }
    this.valCardDetails();

    // $rootScope.isloadingData = false;

    // var successElement = document.querySelector(".success");
    // var errorElement = document.querySelector(".error");
    // successElement.classList.remove("visible");
    // errorElement.classList.remove("visible");
    // errorElement.textContent = "";

    // $scope.$apply(function() {
    //   vm.cardValidation = result.complete == true ? false : true;
    // });

    // if (result.token) {
    //   // Use the token to create a charge or a customer
    //   // https://stripe.com/docs/charges
    //   // successElement.querySelector('.token').textContent = result.token.id;
    //   // successElement.classList.add('visible');
    //   if ($stateParams.planType && $stateParams.planType == "add-on") {
    //     // sendAddOnToken(userId, tenantId, planId, result.token.id);
    //     // userQuantity, tenantId, planId, token, awareOfExtraUser
    //     sendAddOnToken(
    //       vm.planInfo.maxUser,
    //       tenantId,
    //       planId,
    //       result.token.id,
    //       true
    //     );
    //   } else {
    //     sendToken(
    //       userId,
    //       tenantId,
    //       planId,
    //       result.token.id,
    //       vm.planInfo.asTrial
    //     );
    //   }
    // } else if (result.error) {
    //   errorElement.textContent = result.error.message;
    //   errorElement.classList.add("visible");
    // }
  }

  validatePlan = (oldPlanId, userId, cb) => {
    console.log('oldPlanId', oldPlanId);
    this.props.actiongGetProfileDataById(userId).then(res => {
      console.log('res', res);
      try {
        if (
          res &&
          res.payload &&
          res.payload.data &&
          res.payload.data.resourceData &&
          res.payload.data.resourceData &&
          res.payload.data.resourceData.planSubscriptionResponse &&
          res.payload.data.resourceData.planSubscriptionResponse.planResponse
        ) {
          let newPlanId =
            res.payload.data.resourceData.planSubscriptionResponse.planResponse
              .planId;
          console.log('newPlanId', newPlanId);

          if (oldPlanId == newPlanId) {
            cb(true, newPlanId);
          } else {
            cb(false, newPlanId);
          }
        } else {
          cb(false, '');
        }
      } catch (err) {
        cb(false, '');
      }
    });
  };

  createToken() {
    var extraDetails = {
      name: this.state.nameOfCardHolder,
      phone_no: this.state.phoneNoOfCardHolder,
      address_zip: this.state.zipCodeForCardPayment
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

  goToEventPage = () => {
    this.navigateByUrlName(
      '/member/eventDetails?eventId=' + this.state.eventId
    );
  };

  render() {
    return (
      <div className="h-100">
        <ReactTooltip effect="solid" type="error" place="bottom" />

        <Helmet
          bodyAttributes={{
            // class: this.state.isOfferVisible? 'abc' : 'ijk',
            style: this.state.isOfferVisible
              ? 'overflow:visible'
              : 'overflow:hidden'
          }}
        />

        <div className="h-100">
          <section className="join_event_payment h-100">
            <div className="blkevt-bg">
              <div className="container">
                <div className="row">
                  <div className="col-xs-8">
                    <div className="in-head event_headtext">
                      <h3 className="text-white tText m0">
                        <span
                          class="ico-arrowIncircle goBackIcon"
                          onClick={this.props.history.goBack}
                        >
                          <svg>
                            <use xlinkHref={`${Sprite}#arrowIncircleIco`} />
                          </svg>
                        </span>
                        {this.state.eventName}
                      </h3>
                      {/* <div className="rating ratingstar">
                        <i className="fa fa-star on" />
                        <i className="fa fa-star on" />
                        <i className="fa fa-star on" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                      </div> */}
                      <p>{this.state.eventCompany}</p>
                    </div>
                  </div>
                  <div className="col-xs-4">
                    <div className="pricing_listwrap text-right">
                      <ul className="evtpricing_list">
                        <li>
                          <span
                            className="ico-cancle"
                            onClick={() => {
                              this.goToEventPage();
                            }}
                          >
                            <svg>
                              <use xlinkHref={`${Sprite}#closeIco`} />
                            </svg>
                          </span>
                        </li>
                        <li>Price: ${this.state.eventBasePrice}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container h-100">
              <div className="jointevtpay h-100">
                {/* <img
                  src={arrow}
                  className="goBackImg"
                  onClick={this.props.history.goBack}
                /> */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="joint-eventpay-wrap">
                      <form className="evtformpay_first" action="#">
                        <div className="form-group text-center">
                          <label
                            className="offerinput_label"
                            htmlFor="offercode"
                          >
                            Select Offer and Discounts here
                          </label>
                          {/* <div className="input-group text-center offerinput_field">
                            <input
                              id="offercode"
                              type="text"
                              className="form-control"
                              name="msg"
                              placeholder="ENTER YOUR DISCOUNT CODE"
                            />
                            <span className="input-group-addon">Check</span>
                          </div> */}
                        </div>
                      </form>

                      {/* view_offer_wrap start*/}
                      <div className="view_offer_wrap">
                        {/* view_offer_sec start*/}
                        <div className="view_offer_sec text-center">
                          {(() => {
                            if (this.state.isOfferVisible == false) {
                              return (
                                <a
                                  className="viewoffer_btn"
                                  href="javascript:void(0)"
                                  onClick={() => this.onClickViewOffers()}
                                >
                                  View Offers and Discounts
                                  <span className="ico-tag">
                                    <svg>
                                      <use xlinkHref="{`${Sprite}#`}tagIco" />
                                    </svg>
                                  </span>
                                </a>
                              );
                            } else {
                              return (
                                <a
                                  className="cross_btn"
                                  href="javascript:void(0)"
                                  onClick={() => this.onClickCloseOffer()}
                                >
                                  <span className="ico-cancle">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#closeIco`} />
                                    </svg>
                                  </span>
                                </a>
                              );
                            }
                          })()}
                        </div>
                        {/* view_offer_sec end*/}

                        <div
                          className={classNames('wrap', {
                            active: this.state.isOfferVisible == true
                          })}
                        >
                          {this.renderDelegateDiscountDiv()}

                          {this.renderCouponsDiv()}

                          {this.state.allIndependentOfferList &&
                          this.state.allIndependentOfferList.length > 0
                            ? this.renderIndependentOfferList()
                            : null}
                        </div>
                      </div>
                      {/* view_offer_wrap end*/}

                      {/* offerapplied_wrap start*/}
                      <div className="offerapplied_wrap">
                        {this.state.isOfferVisible == false
                          ? this.renderAppliedDiscount()
                          : null}
                      </div>
                      {/* offerapplied_wrap start*/}

                      {/* paymentcard_wrap start*/}
                      {/* {this.state.isOfferVisible == false
                        ? this.renderCard()
                        : ''} */}
                      {this.renderCard()}
                      {/* paymentcard_wrap end*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="wrapper_sidepop hide">
              <div className="sidepopup">
                <div id="darkBack" />
                <div id="popUp">
                  <div id="close" className="close">
                    <span className="ico-cancle">
                      <svg>
                        <use xlinkHref={`${Sprite}#closeIco`} />
                      </svg>
                    </span>
                  </div>
                  <div id="new">
                    <span>NEW!</span>
                  </div>
                  <h2>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been simply of the
                    industry's.
                  </h2>
                  <br />
                  <a
                    href="javascript:void(0);"
                    target="_blank"
                    className="btn btnInfo button ripple"
                  >
                    Proceed
                  </a>
                </div>
                <div id="plus">
                  <span>
                    NEW <br /> &nbsp;&nbsp;
                    <i className="fa fa-plus" />
                  </span>
                </div>
              </div>

              <div id="popupbody" />
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

  onSelectDelegateDiscount = (event, requestedDiscount) => {
    event.stopPropagation();
    if (requestedDiscount == 'innovecsysDiscountPercentage') {
      if (
        this.state.selectedDelegateObject &&
        this.state.selectedDelegateObject.applicable == false
      ) {
        showWarningToast(
          'Sorry!! you are not eligible to avail this offer, Upgrade your plan to get more offers.'
        );
        return;
      }
    }

    let selectedDelegateDiscountList =
      this.state.selectedDelegateDiscountList || [];
    let index = selectedDelegateDiscountList.indexOf(requestedDiscount);

    if (index > -1) {
      selectedDelegateDiscountList.splice(index, 1);
    } else {
      selectedDelegateDiscountList.push(requestedDiscount);
    }
    this.setState({ selectedDelegateDiscountList });
  };

  returnCompanyDiscount = id => {
    let companyDiscountList = this.state.companyDiscountList || [];

    for (let discount of companyDiscountList) {
      if (discount.id == id) {
        return discount.ownerDiscountPercentage;
      }
    }
  };

  // renderDelegateDiscountList = () => {
  //   return (
  //     <div>
  //       <div
  //         className="col-sm-6 plr-5"
  //         onClick={() =>
  //           this.onSelectDelegateDiscount('ownerDiscountPercentage')
  //         }
  //       >
  //         <div className="discount_box">
  //           <p className="couponNofferText">
  //             <span className="ico-tag">
  //               <svg>
  //                 <use xlinkHref="{`${Sprite}#`}tagIco" />
  //               </svg>
  //             </span>
  //             <span>Discount</span>
  //           </p>

  //           <div
  //             class="offerChecked"
  //             className={classNames('offerChecked', {
  //               ShowOfferCheck:
  //                 this.state.selectedDelegateDiscountList.indexOf(
  //                   'ownerDiscountPercentage'
  //                 ) > -1
  //             })}
  //           >
  //             <span class="ico-rightTick">
  //               <svg>
  //                 <use xlinkHref={`${Sprite}#rightTickIco`} />
  //               </svg>
  //             </span>
  //           </div>
  //           <p className="descriptionText">
  //             {/* {Company Name} offering 10% discount for {delegate type} */}
  //             {this.state.selectedDelegateObject &&
  //             this.state.selectedDelegateObject.userResponse
  //               ? this.state.selectedDelegateObject.userResponse.company
  //               : ''}{' '}
  //             offering{' '}
  //             {this.state.selectedDelegateObject
  //               ? this.returnCompanyDiscount(
  //                   this.state.selectedDelegateObject.id
  //                 )
  //               : ''}% discount for{' '}
  //             {this.state.selectedDelegateObject
  //               ? this.state.selectedDelegateObject.delegateType
  //               : ''}
  //           </p>
  //         </div>
  //       </div>

  //       <div
  //         className="col-sm-6 plr-5"
  //         onClick={() =>
  //           this.onSelectDelegateDiscount('innovecsysDiscountPercentage')
  //         }
  //       >
  //         <div className="discount_box">
  //           <p className="couponNofferText">
  //             <span className="ico-tag">
  //               <svg>
  //                 <use xlinkHref="{`${Sprite}#`}tagIco" />
  //               </svg>
  //             </span>
  //             <span>Discount</span>
  //           </p>

  //           <div
  //             class="offerChecked"
  //             className={classNames('offerChecked', {
  //               ShowOfferCheck:
  //                 this.state.selectedDelegateDiscountList.indexOf(
  //                   'innovecsysDiscountPercentage'
  //                 ) > -1
  //             })}
  //           >
  //             <span class="ico-rightTick">
  //               <svg>
  //                 <use xlinkHref={`${Sprite}#rightTickIco`} />
  //               </svg>
  //             </span>
  //           </div>
  //           <p className="descriptionText">
  //             {/* Innovecsys giving Additional 20% for {delegate type} */}
  //             Innovecsys giving Additional{' '}
  //             {this.state.selectedDelegateObject
  //               ? this.state.selectedDelegateObject.innovecsysDiscountPercentage
  //               : ''}% for{' '}
  //             {this.state.selectedDelegateObject
  //               ? this.state.selectedDelegateObject.delegateType
  //               : ''}
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // renderOfferList = () => {
  //   return this.state.offerList.map((offer, offerIndex) => {
  //     return (
  //       <div
  //         className="col-sm-6 plr-5"
  //         onClick={() => this.onClickOffer(offer)}
  //         key={offerIndex}
  //       >
  //         <div className="discount_box">
  //           <p className="couponNofferText">
  //             <span className="ico-tag">
  //               <svg>
  //                 <use xlinkHref="{`${Sprite}#`}tagIco" />
  //               </svg>
  //             </span>
  //             <span>Offer</span>
  //           </p>

  //           <div
  //             class="offerChecked"
  //             className={classNames('offerChecked', {
  //               ShowOfferCheck:
  //                 this.state.selectedOfferList.indexOf(offer.id) > -1
  //             })}
  //           >
  //             <span class="ico-rightTick">
  //               <svg>
  //                 <use xlinkHref={`${Sprite}#rightTickIco`} />
  //               </svg>
  //             </span>
  //           </div>

  //           <p className="descriptionText">
  //             {/* Register by
  //             <b>

  //               {moment(offer.applicableTillDate).format('MMM DD, YYYY')}
  //             </b>{' '}
  //             to receive {offer.discountPercentage}% off your registration! */}

  //             {offer.description}
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   });
  // };

  // renderCompanyOfferList = () => {
  //   return this.state.companyOfferList.map((offer, offerIndex) => {
  //     return (
  //       <div
  //         className="col-sm-6 plr-5"
  //         onClick={() => this.onClickOffer(offer)}
  //         key={offerIndex}
  //       >
  //         <div className="discount_box">
  //           <p className="couponNofferText">
  //             <span className="ico-tag">
  //               <svg>
  //                 <use xlinkHref="{`${Sprite}#`}tagIco" />
  //               </svg>
  //             </span>
  //             <span>Offer</span>
  //           </p>

  //           <div
  //             class="offerChecked"
  //             className={classNames('offerChecked', {
  //               ShowOfferCheck:
  //                 this.state.selectedOfferList.indexOf(offer.id) > -1
  //             })}
  //           >
  //             <span class="ico-rightTick">
  //               <svg>
  //                 <use xlinkHref={`${Sprite}#rightTickIco`} />
  //               </svg>
  //             </span>
  //           </div>

  //           <p className="descriptionText">
  //             {/* Register by
  //             <b>

  //               {moment(offer.applicableTillDate).format('MMM DD, YYYY')}
  //             </b>{' '}
  //             to receive {offer.discountPercentage}% off your registration! */}

  //             {offer.description}
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   });
  // };

  // renderCouponList = () => {
  //   return this.state.couponList.map((coupon, couponIndex) => {
  //     return (
  //       <div
  //         className="col-sm-6 plr-5"
  //         onClick={() => this.onClickCoupon(coupon)}
  //         key={couponIndex}
  //       >
  //         <div className="discount_box">
  //           <p className="couponNofferText">
  //             <span className="ico-tag">
  //               <svg>
  //                 <use xlinkHref="{`${Sprite}#`}tagIco" />
  //               </svg>
  //             </span>
  //             <span>Coupon</span>
  //           </p>

  //           <div
  //             class="offerChecked"
  //             className={classNames('offerChecked', {
  //               ShowOfferCheck:
  //                 this.state.selectedCouponList.indexOf(coupon.id) > -1
  //             })}
  //           >
  //             <span class="ico-rightTick">
  //               <svg>
  //                 <use xlinkHref={`${Sprite}#rightTickIco`} />
  //               </svg>
  //             </span>
  //           </div>

  //           <p className="descriptionText">
  //             {/* Register 3 for the price of 2 with coupon code{' '}
  //             <b> "{coupon.couponCode}"</b> */}

  //             {coupon.description}
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   });
  // };

  // renderCompanyCouponList = () => {
  //   return this.state.companyCouponList.map((coupon, couponIndex) => {
  //     return (
  //       <div
  //         className="col-sm-6 plr-5"
  //         onClick={() => this.onClickCoupon(coupon)}
  //         key={couponIndex}
  //       >
  //         <div className="discount_box">
  //           <p className="couponNofferText">
  //             <span className="ico-tag">
  //               <svg>
  //                 <use xlinkHref="{`${Sprite}#`}tagIco" />
  //               </svg>
  //             </span>
  //             <span>Coupon</span>
  //           </p>

  //           <div
  //             class="offerChecked"
  //             className={classNames('offerChecked', {
  //               ShowOfferCheck:
  //                 this.state.selectedCouponList.indexOf(coupon.id) > -1
  //             })}
  //           >
  //             <span class="ico-rightTick">
  //               <svg>
  //                 <use xlinkHref={`${Sprite}#rightTickIco`} />
  //               </svg>
  //             </span>
  //           </div>

  //           <p className="descriptionText">
  //             {/* Register 3 for the price of 2 with coupon code{' '}
  //             <b> "{coupon.couponCode}"</b> */}

  //             {coupon.description}
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   });
  // };

  renderAppliedDiscount = () => {
    return (
      <div className="offerapplied_inner">
        <table className="table offerappliedTable">
          <thead>
            <tr>
              <th>Applied Discounts</th>
              <th className="totalDiscount">
                <span className="totalText mr-10">Total:</span>{' '}
                <span className="totalAmount">
                  {this.state.finalAmountToPay.hasOwnProperty('other')
                    ? `$ ${this.state.finalAmountToPay.other.amountToPay}`
                    : null}
                </span>
              </th>
            </tr>
          </thead>

          {this.renderFinalAmountToPay()}
        </table>
      </div>
    );
  };

  renderFinalAmountToPay = () => {
    return (
      <tbody>
        {this.state.finalAmountToPay.hasOwnProperty('offer')
          ? this.renderAppliedOfferList()
          : null}

        {this.state.finalAmountToPay.discount &&
        (this.state.finalAmountToPay.discount.innovecsysDiscountPercentage ||
          this.state.finalAmountToPay.discount.ownerDiscountPercentage)
          ? this.renderAppliedDiscountList()
          : null}

        {this.state.finalAmountToPay.hasOwnProperty('coupon')
          ? this.renderAppliedCouponList()
          : null}
      </tbody>
    );
  };

  returnTotalDiscountPercent = () => {
    try {
      let ownerDiscountPercentage = 0;
      let innovecsysDiscountPercentage = 0;
      if (
        this.state.finalAmountToPay &&
        this.state.finalAmountToPay.discount &&
        this.state.finalAmountToPay.discount.hasOwnProperty(
          'ownerDiscountPercentage'
        )
      ) {
        ownerDiscountPercentage = parseInt(
          this.state.finalAmountToPay.discount.ownerDiscountPercentage
        );
      }

      if (
        this.state.finalAmountToPay &&
        this.state.finalAmountToPay.discount &&
        this.state.finalAmountToPay.discount.hasOwnProperty(
          'innovecsysDiscountPercentage'
        )
      ) {
        innovecsysDiscountPercentage = parseInt(
          this.state.finalAmountToPay.discount.innovecsysDiscountPercentage
        );
      }

      let totalPercent = ownerDiscountPercentage + innovecsysDiscountPercentage;
      return totalPercent;
    } catch (err) {
      return '';
    }
  };

  returnSelectedDelegate = () => {
    try {
      let delegateList = JSON.parse(JSON.stringify(this.state.delegateList));
      for (let delegate of delegateList) {
        if (delegate.value == this.state.selectedDelegate) {
          return delegate.label;
        }
      }
    } catch (err) {
      return '';
    }
  };

  returnSelectedDelegateObject = selectedDelegate => {
    try {
      let discountList = JSON.parse(JSON.stringify(this.state.discountList));
      for (let delegate of discountList) {
        if (delegate.id == selectedDelegate) {
          return delegate;
        }
      }
    } catch (err) {
      return '';
    }
  };

  renderOwnderDiscount = discount => {
    if (
      discount.ownerDiscountPercentage &&
      discount.ownerDiscountPercentage > 0
    ) {
      let returnString = `Owner discount of ${
        this.state.finalAmountToPay.discount.ownerDiscountPercentage
      }%`;
      if (
        discount.innovecsysDiscountPercentage &&
        discount.innovecsysDiscountPercentage > 0
      ) {
        returnString = returnString + ' and ';
      }
      return returnString;
    }
  };
  renderInnovecsysDiscount = discount => {
    if (
      discount.innovecsysDiscountPercentage &&
      discount.innovecsysDiscountPercentage > 0
    ) {
      return `Innovecsys discount of ${
        this.state.finalAmountToPay.discount.innovecsysDiscountPercentage
      }% `;
    }
  };

  renderAppliedDiscountList = () => {
    return (
      <tr>
        <td>
          <div className="appliedDiscount">
            <span className="ico-close">
              <svg>
                <use xlinkHref={`${Sprite}#closeIco`} />
              </svg>
            </span>
            {this.renderOwnderDiscount(this.state.finalAmountToPay.discount)}
            {this.renderInnovecsysDiscount(
              this.state.finalAmountToPay.discount
            )}
            discount on delegate type {this.returnSelectedDelegate()}
            {/* Owner discount of{'  '}
            {this.state.finalAmountToPay.discount.ownerDiscountPercentage}% and
            Innovecsys discount of{' '}
            {this.state.finalAmountToPay.discount.innovecsysDiscountPercentage}% */}
            {/* Special {this.returnTotalDiscountPercent()}% */}
            {/* discount on delegate type {this.returnSelectedDelegate()} */}
            {/* if you register before 30 May 2018. */}
          </div>
        </td>
        <td className="discountApplied">
          <span className="totalDistAmt mr-10">
            ${this.state.finalAmountToPay.discount.amountBeforeOwnerDiscount ||
              this.state.finalAmountToPay.discount
                .amountBeforeInnovecsysDiscount}
          </span>{' '}
          <span>
            ${this.state.finalAmountToPay.discount.afterInnovecsysDiscount ||
              this.state.finalAmountToPay.discount.afterOwnerDiscount}
          </span>
        </td>
      </tr>
    );
  };

  renderAppliedCouponList = () => {
    return (
      <tr>
        <td>
          <div className="appliedDiscount">
            <span className="ico-close">
              <svg>
                <use xlinkHref={`${Sprite}#closeIco`} />
              </svg>
            </span>
            coupon discount of{'  '}
            {this.state.finalAmountToPay.coupon.couponDiscountPercentage}%
            {/* if you register before 30 May 2018. */}
          </div>
        </td>
        <td className="discountApplied">
          <span className="totalDistAmt mr-10">
            ${this.state.finalAmountToPay.coupon.amountbeforeCoupon}
          </span>
          {'  '}
          <span>${this.state.finalAmountToPay.coupon.afterCouponApply}</span>
        </td>
      </tr>
    );
  };

  renderAppliedOfferList = () => {
    return (
      <tr>
        <td>
          <div className="appliedDiscount">
            <span className="ico-close">
              <svg>
                <use xlinkHref={`${Sprite}#closeIco`} />
              </svg>
            </span>
            offer discount of{' '}
            {this.state.finalAmountToPay.offer.offerDiscountPercentage}%
            {/* if you register before 30 May 2018. */}
          </div>
        </td>
        <td className="discountApplied">
          <span className="totalDistAmt mr-10">
            ${this.state.finalAmountToPay.offer.amountBeforeOffer}
          </span>
          {'  '}
          <span>${this.state.finalAmountToPay.offer.afterOfferApply}</span>
        </td>
      </tr>
    );
  };

  ///////////////////////////////////////////////////////////////////////////////////// new Templates ///////////////////////////////////////////

  renderDelegateDiscountDiv = () => {
    return (
      <div className="content ">
        <div className="view_offer_heading">
          <div className="row mb-30">
            <div className="col-sm-3" />
            <div className="col-sm-6">
              <h4 className="text-center">Please select a Discount Card</h4>
            </div>
            <div className="col-sm-3">
              <div className="selectOfferDiv">
                <Select
                  className="selectCategoryInput"
                  name="delegate"
                  value={this.state.selectedDelegate}
                  options={this.state.delegateList}
                  onChange={delegate => this.delegateChange(delegate)}
                  placeholder="Select Delegate"
                />
              </div>
            </div>
          </div>

          {this.state.selectedDelegate
            ? this.renderDelegateDiscountDivList()
            : ''}
        </div>
      </div>
    );
  };

  renderDelegateDiscountDivList = () => {
    return (
      <div className="row">
        <div
          className="col-sm-6"
          onClick={event =>
            this.onSelectDelegateDiscount(event, 'ownerDiscountPercentage')
          }
        >
          <div
            className={classNames('discountCard', {
              selected:
                this.state.selectedDelegateDiscountList.indexOf(
                  'ownerDiscountPercentage'
                ) > -1
            })}
          >
            <div
              className={classNames('discountSelected', {
                checkSelected:
                  this.state.selectedDelegateDiscountList.indexOf(
                    'ownerDiscountPercentage'
                  ) > -1
              })}
            >
              <span className="ico-rightTick">
                <svg>
                  <use xlinkHref={`${Sprite}#rightTickIco`} />
                </svg>
              </span>
            </div>

            {/* Discount text rotate div */}
            <div className="discountTextDiv">
              <label>Discount</label>
            </div>

            {/* Circle Designs */}
            <span
              className={classNames('topCircle btDesignCircle ', {
                circleAfterSelect:
                  this.state.selectedDelegateDiscountList.indexOf(
                    'ownerDiscountPercentage'
                  ) > -1
              })}
            />
            <span
              className={classNames('bottomCircle btDesignCircle ', {
                circleAfterSelect:
                  this.state.selectedDelegateDiscountList.indexOf(
                    'ownerDiscountPercentage'
                  ) > -1
              })}
            />

            <span
              className={classNames('leftCircle lrDesignCircle ', {
                circleAfterSelect:
                  this.state.selectedDelegateDiscountList.indexOf(
                    'ownerDiscountPercentage'
                  ) > -1
              })}
            />
            <span
              className={classNames('rightCircle lrDesignCircle ', {
                circleAfterSelect:
                  this.state.selectedDelegateDiscountList.indexOf(
                    'ownerDiscountPercentage'
                  ) > -1
              })}
            />

            <h3 className="ctitleText">Early Bird Discount</h3>
            <div className="discountPrcntDiv">
              {/* <p>
                Company Discount <span>20%</span>
              </p> */}
              <p>
                Company Discount
                <span>
                  {' '}
                  {this.state.selectedDelegateObject
                    ? this.returnCompanyDiscount(
                        this.state.selectedDelegateObject.id
                      )
                    : ''}%
                </span>
              </p>
              {/* <p>
                Innovecsys Discount <span>20%</span>
              </p> */}
            </div>

            {this.state.selectedDelegateDiscountList.indexOf(
              'ownerDiscountPercentage'
            ) > -1 ? (
              <p className="selectedCardText">You have selected this card!</p>
            ) : (
              <div className="getDiscountCheck">
                <label class="custom-label label--checkbox">
                  Get This Discount
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={true}
                    onClick={event => {
                      event.stopPropagation();
                    }}
                  />
                  <div class="control__indicator" />
                </label>
              </div>
            )}
          </div>
        </div>

        <div
          className="col-sm-6"
          onClick={event =>
            this.onSelectDelegateDiscount(event, 'innovecsysDiscountPercentage')
          }
        >
          <div
            className={classNames('discountCard', {
              selected:
                this.state.selectedDelegateDiscountList.indexOf(
                  'innovecsysDiscountPercentage'
                ) > -1
            })}
          >
            <div
              className={classNames('discountSelected', {
                checkSelected:
                  this.state.selectedDelegateDiscountList.indexOf(
                    'innovecsysDiscountPercentage'
                  ) > -1
              })}
            >
              <span className="ico-rightTick">
                <svg>
                  <use xlinkHref={`${Sprite}#rightTickIco`} />
                </svg>
              </span>
            </div>

            {/* Discount text rotate div */}
            <div className="discountTextDiv">
              <label>Discount </label>
            </div>

            {/* Circle Designs */}
            <span
              className={classNames('topCircle btDesignCircle', {
                circleAfterSelect:
                  this.state.selectedDelegateDiscountList.indexOf(
                    'innovecsysDiscountPercentage'
                  ) > -1
              })}
            />
            <span
              className={classNames('bottomCircle btDesignCircle ', {
                circleAfterSelect:
                  this.state.selectedDelegateDiscountList.indexOf(
                    'innovecsysDiscountPercentage'
                  ) > -1
              })}
            />

            <span
              className={classNames('leftCircle lrDesignCircle', {
                circleAfterSelect:
                  this.state.selectedDelegateDiscountList.indexOf(
                    'innovecsysDiscountPercentage'
                  ) > -1
              })}
            />

            <span
              className={classNames('rightCircle lrDesignCircle ', {
                circleAfterSelect:
                  this.state.selectedDelegateDiscountList.indexOf(
                    'innovecsysDiscountPercentage'
                  ) > -1
              })}
            />

            <h3 className="ctitleText">Early Bird Discount</h3>
            <div className="discountPrcntDiv">
              {/* <p>
                Company Discount
                <span>{this.state.selectedDelegateObject? this.returnCompanyDiscount(this.state.selectedDelegateObject.id): ''}%</span>
              </p> */}
              <p>
                Innovecsys Discount
                <span>
                  {' '}
                  {this.state.selectedDelegateObject
                    ? this.state.selectedDelegateObject
                        .innovecsysDiscountPercentage
                    : ''}%
                </span>
              </p>
            </div>

            {this.state.selectedDelegateDiscountList.indexOf(
              'innovecsysDiscountPercentage'
            ) > -1 ? (
              <p className="selectedCardText">You have selected this card!</p>
            ) : (
              <div className="getDiscountCheck">
                <label class="custom-label label--checkbox">
                  Get This Discount
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={true}
                    onClick={event => {
                      event.stopPropagation();
                    }}
                  />
                  <div class="control__indicator" />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  onSelectCoupon = coupon => {
    if (coupon.applicable == false) {
      showWarningToast(
        'Sorry!! you are not eligible to avail this coupon, Upgrade your plan to get more offers.'
      );
      return;
    }

    let selectedCouponList = this.state.selectedCouponList || [];
    let index = selectedCouponList.indexOf(coupon.id);

    if (index > -1) {
      selectedCouponList.splice(index, 1);
    } else {
      selectedCouponList = [];
      selectedCouponList.push(coupon.id);
    }

    console.log('selectedCouponList', selectedCouponList);

    // filter coupons
    let combinedCouponList = [];
    if (selectedCouponList.length > 0) {
      combinedCouponList = JSON.parse(JSON.stringify([coupon]));
    } else {
      combinedCouponList = this.state.combinedAllCouponList || [];
    }

    // filter offers
    // let offerList = [];
    // offerList = JSON.parse(JSON.stringify(coupon.applicableOffers)) || [];

    // if (selectedCouponList.length > 0) {
    //   offerList = JSON.parse(JSON.stringify(coupon.applicableOffers)) || [];
    // }
    // else {
    //   offerList = this.state.allOfferList || [];
    // }

    let selectedOfferList = this.state.selectedOfferList || [];
    let newSelectedOfferList = selectedOfferList || [];

    if (coupon.id != this.state.selectedOfferFromCouponId) {
      newSelectedOfferList = [];
    }

    // offerList.map(offer => {
    //   selectedOfferList.map((selOfferId, index) => {
    //     if (offer.id == selOfferId) {
    //       newSelectedOfferList.push(selOfferId);
    //     }
    //   });
    // });

    // if (selectedCouponList.length == 0) {
    //   newSelectedOfferList = []
    // }

    this.setState({
      // combinedCouponList,
      selectedCouponList,
      // offerList,
      selectedOfferList: newSelectedOfferList,
      selectedOfferFromCouponId: coupon.id
    });
  };

  onSelectOffer = (offer, couponId) => {
    if (offer.applicable == false) {
      showWarningToast(
        'Sorry!! you are not eligible to avail this offer, Upgrade your plan to get more offers.'
      );
      return;
    }

    let listOfGuest = this.props.member.joinEventMembers || [];
    let numberOfMembers = listOfGuest.length + 1;

    if (numberOfMembers < offer.minAllowedUser) {
      showWarningToast(
        'Minimum member should be ' + offer.minAllowedUser + ' for this offer'
      );
      return;
    }

    if (numberOfMembers > offer.maxAllowedUser) {
      showWarningToast(
        'Maximum member should be ' + offer.maxAllowedUser + ' for this offer'
      );
      return;
    }

    let selectedOfferList = this.state.selectedOfferList || [];
    let index = selectedOfferList.indexOf(offer.id);

    if (index > -1) {
      if (couponId == this.state.selectedOfferFromCouponId)
        selectedOfferList.splice(index, 1);
    } else {
      selectedOfferList = [];
      selectedOfferList.push(offer.id);
    }

    let selectedCouponList = this.state.selectedCouponList || [];

    if (couponId != this.state.selectedOfferFromCouponId) {
      selectedCouponList = [];
    }

    this.setState({
      selectedOfferList,
      selectedOfferFromCouponId: couponId,
      selectedCouponList
    });
  };

  isCheckedCoupon = coupon => {
    let selectedCouponId = '';
    if (this.state.selectedCouponList.length > 0) {
      selectedCouponId = this.state.selectedCouponList[0] || ''; //this.state.selectedCouponList[0].id;
    }
    if (coupon.id == selectedCouponId) {
      return true;
    }
    return false;
  };

  isCheckedOffer = offer => {
    let selectedOfferId = '';
    if (this.state.selectedOfferList.length > 0) {
      selectedOfferId = this.state.selectedOfferList[0] || '';
    }

    if (offer.id == selectedOfferId) {
      return true;
    }
    return false;
  };

  renderCouponsDiv = () => {
    return this.state.combinedCouponList.map((coupon, couponIndex) => {
      return (
        <div key={couponIndex} className="content ">
          <div className="view_offer_heading">
            <div className="row mb-20">
              <div className="col-sm-12">
                <h4 class="text-center">Please select Coupons / Offers</h4>
              </div>
            </div>
            <div className="row">
              <div
                className="col-sm-6 col-sm-offset-3"
                onClick={() => this.onSelectCoupon(coupon)}
              >
                <div
                  className="discountCard"
                  className={classNames('discountCard', {
                    selected: this.isCheckedCoupon(coupon)
                  })}
                >
                  <div
                    className={classNames('discountSelected', {
                      checkSelected: this.isCheckedCoupon(coupon)
                    })}
                  >
                    <span className="ico-rightTick">
                      <svg>
                        <use xlinkHref={`${Sprite}#rightTickIco`} />
                      </svg>
                    </span>
                  </div>

                  {/* Discount text rotate div */}
                  <div className="discountTextDiv">
                    <label>Discount</label>
                  </div>

                  {/* Circle Designs */}
                  <span
                    className={classNames('topCircle btDesignCircle ', {
                      circleAfterSelect: this.isCheckedCoupon(coupon)
                    })}
                  />
                  <span
                    className={classNames('bottomCircle btDesignCircle ', {
                      circleAfterSelect: this.isCheckedCoupon(coupon)
                    })}
                  />

                  <span
                    className={classNames('leftCircle lrDesignCircle ', {
                      circleAfterSelect: this.isCheckedCoupon(coupon)
                    })}
                  />
                  <span
                    className={classNames('rightCircle lrDesignCircle ', {
                      circleAfterSelect: this.isCheckedCoupon(coupon)
                    })}
                  />

                  <h3 className="ctitleText">
                    {/* Early Bird Discount */}
                    {/* {coupon.description} */}
                    Coupon discount {coupon.discountPercentage}%
                  </h3>
                  <div className="discountPrcntDiv">
                    <p>
                      {/* Company Discount <span>20%</span> */}
                      {coupon.description}
                    </p>
                    {/* <p>
                      Innovecsys Discount <span>20%</span>
                    </p> */}
                  </div>

                  {this.isCheckedCoupon(coupon) ? (
                    <p className="selectedCardText">
                      You have selected this card!
                    </p>
                  ) : (
                    <div className="getDiscountCheck">
                      <label class="custom-label label--checkbox">
                        Get This Discount
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={true}
                          onClick={event => {
                            event.stopPropagation();
                          }}
                        />
                        <div class="control__indicator" />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {coupon.applicableOffers && coupon.applicableOffers.length > 0
              ? this.renderOfferDiv(coupon)
              : null}
          </div>

          {/* {this.state.selectedDelegate
            ? this.renderDelegateDiscountList()
            : ''}

          {this.renderCouponList()}

          {this.renderOfferList()} */}
        </div>
      );
    });
  };

  renderOfferDiv = coupon => {
    let offerList = [];
    offerList = coupon.applicableOffers ? coupon.applicableOffers : [];

    return (
      <div className="selectCouponOffers_Sec">
        <div className="row mb-15">
          <div className="col-sm-12">
            <h4 class="text-center">Please select Coupons / Offers</h4>
          </div>
        </div>
        <div className="row">
          {offerList.map((offer, offerIndex) => {
            return (
              <div
                key={offerIndex}
                className="col-sm-6 col-md-4"
                onClick={() => this.onSelectOffer(offer, coupon.id)}
              >
                <div className="discountCard">
                  <div
                    className={classNames('discountSelected', {
                      checkSelected:
                        this.isCheckedOffer(offer) &&
                        coupon.id == this.state.selectedOfferFromCouponId
                    })}
                  >
                    <span className="ico-rightTick">
                      <svg>
                        <use xlinkHref={`${Sprite}#rightTickIco`} />
                      </svg>
                    </span>
                  </div>

                  {/* Discount text rotate div */}
                  <div className="discountTextDiv">
                    <label>offer</label>
                  </div>

                  {/* Circle Designs */}
                  <span className="topCircle btDesignCircle " />
                  <span className="bottomCircle btDesignCircle " />

                  <span className="leftCircle lrDesignCircle " />
                  <span className="rightCircle lrDesignCircle " />

                  <h3 className="ctitleText">
                    {/* Early Bird Discount */}
                    {/* {offer.description} */}
                    Offer discount {offer.discountPercentage}%
                  </h3>
                  <div className="discountPrcntDiv">
                    <p>{offer.description}</p>
                    {/* <p>
                      Innovecsys Discount <span>20%</span>
                    </p> */}
                  </div>

                  {this.isCheckedOffer(offer) &&
                  coupon.id == this.state.selectedOfferFromCouponId ? (
                    <p className="selectedCardText">
                      You have selected this card!
                    </p>
                  ) : (
                    <div className="getDiscountCheck">
                      <label class="custom-label label--checkbox">
                        Get This Discount
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={true}
                          onClick={event => {
                            event.stopPropagation();
                          }}
                        />
                        <div class="control__indicator" />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  renderIndependentOfferList = () => {
    return (
      <div className="content ">
        <div className="view_offer_heading">
          <div className="selectCouponOffers_Sec">
            <div className="row mb-15">
              <div className="col-sm-12">
                <h4 class="text-center">Please select Coupons / Offers</h4>
              </div>
            </div>
            <div className="row">
              {this.state.allIndependentOfferList.map((offer, offerIndex) => {
                return (
                  <div
                    key={offerIndex}
                    className="col-sm-6 col-md-4"
                    onClick={() => this.onSelectOffer(offer, '')}
                  >
                    <div className="discountCard">
                      <div
                        className={classNames('discountSelected', {
                          checkSelected: this.isCheckedOffer(offer)
                        })}
                      >
                        <span className="ico-rightTick">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightTickIco`} />
                          </svg>
                        </span>
                      </div>

                      {/* Discount text rotate div */}
                      <div className="discountTextDiv">
                        <label>offer</label>
                      </div>

                      {/* Circle Designs */}
                      <span className="topCircle btDesignCircle " />
                      <span className="bottomCircle btDesignCircle " />

                      <span className="leftCircle lrDesignCircle " />
                      <span className="rightCircle lrDesignCircle " />

                      <h3 className="ctitleText">
                        {/* Early Bird Discount */}
                        {/* {offer.description} */}
                        Offer discount {offer.discountPercentage}%
                      </h3>
                      <div className="discountPrcntDiv">
                        <p>{offer.description}</p>
                        {/* <p>
                            Innovecsys Discount <span>20%</span>
                          </p> */}
                      </div>

                      {this.isCheckedOffer(offer) ? (
                        <p className="selectedCardText">
                          You have selected this card!
                        </p>
                      ) : (
                        <div className="getDiscountCheck">
                          <label class="custom-label label--checkbox">
                            Get This Discount
                            <input
                              type="checkbox"
                              name="acceptTerms"
                              checked={true}
                              onClick={event => {
                                event.stopPropagation();
                              }}
                            />
                            <div class="control__indicator" />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
    // })
  };

  renderCard = () => {
    return (
      <div
        className={`paymentcard_wrap ${
          this.state.isOfferVisible ? 'hide' : ''
        }`}
      >
        {/* <StripeCheckout
          token={token => console.log(token)}
          stripeKey={config.stre}
        /> */}
        {/* <form action="#">
          <div className="paymentcard-inner">
            <div className="paymentcard_price">
              <ul className="list-inline">
                <li className="event_whiteround" />
                <li className="event_totalcount text-right">
                  Total:{' '}
                  <span>
                    {' '}
                    {this.state.finalAmountToPay.hasOwnProperty('other')
                      ? `$ ${this.state.finalAmountToPay.other.amountToPay}`
                      : null}
                  </span>
                </li>
              </ul>
            </div>

            <div className="cardnosec cardElementSec">
              <div
                id="card-element"
                ref={element => (this.cardElement = element)}
                class="field is-empty"
              />
            </div>

            <div className="col-xs-10">
              <div className="cardnosec">
                <div className="namecard">
                  <div className="col-xs-12 clrpad-left">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        id="cardnme"
                        name="nameOfCardHolder"
                        placeholder="Name on card"
                        value={this.state.nameOfCardHolder}
                        onChange={event => this.handleUserInput(event)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xs-2 clear-padding">
              <div className="roundclr_box">
                <ul className="list-inline">
                  <li />
                  <li />
                </ul>
              </div>
            </div>
          </div>

          <div className="btn_pay text-center">
            <ul className="list-inline">
              <li>
                <button
                  type="button"
                  className="btn btnInfo paymentbtn ripple"
                  onClick={() => this.createToken()}
                  disabled={this.state.disableButton}
                >
                  Make Payment
                </button>
              </li>
            </ul>
          </div>
        </form> */}

        {/* NEW CARD START */}
        <div className="paymentcrad-sec">
          <h3>
            Payment Details{' '}
            <span className="pull-right">
              {/* Timer Count */}

              <Countdown
                date={Date.now() + 60000}
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
                        this.state.nameOfCardHolderErrorMessage.length > 0,
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
                      onFocus={event => this.onControlFocus(event)}
                      onChange={event => this.handleUserInput(event)}
                      // onBlur={e =>
                      //   this.validateName(this.state.nameOfCardHolder)
                      // }
                      data-tip={this.state.nameOfCardHolderErrorMessage}
                    />
                    {this.state.nameOfCardHolderErrorMessage.length > 0 ? (
                      <i className="fa fa-exclamation-triangle alertIcon" />
                    ) : (
                      ''
                    )}
                    {this.state.isNameOfCardHolderValid == true ? (
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
                        this.state.phoneNoOfCardHolderErrorMessage.length > 0,
                      tbFocus: this.state.phoneNoOfCardHolderActive
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
                      onFocus={event => this.onControlFocus(event)}
                      onChange={event => this.handleMobileInput(event)}
                      // onBlur={e =>
                      //   this.validateMobileNumber(
                      //     this.state.phoneNoOfCardHolder
                      //   )
                      // }
                      data-tip={this.state.phoneNoOfCardHolderErrorMessage}
                    />
                    {this.state.phoneNoOfCardHolderErrorMessage.length > 0 ? (
                      <i className="fa fa-exclamation-triangle alertIcon" />
                    ) : (
                      ''
                    )}
                    {this.state.isPhoneNoOfCardHolderValid == true ? (
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
                        this.state.zipCodeForCardPaymentErrorMessage.length > 0,
                      tbFocus: this.state.zipCodeForCardPaymentActive
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
                      onFocus={event => this.onControlFocus(event)}
                      onChange={event => this.handleZipInput(event)}
                      // onBlur={e =>
                      //   this.validateZipNumber(this.state.zipCodeForCardPayment)
                      // }
                      data-tip={this.state.zipCodeForCardPaymentErrorMessage}
                    />
                    {this.state.zipCodeForCardPaymentErrorMessage.length > 0 ? (
                      <i className="fa fa-exclamation-triangle alertIcon" />
                    ) : (
                      ''
                    )}
                    {this.state.isZipCodeForCardPaymentValid == true ? (
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
                      ref={element => (this.cardElement = element)}
                      class="field is-empty"
                    />
                  </div>
                </div>
                {/* <div className="col-xs-8 pr-5">
                      <div class="form-group">
                        <input
                          type="text"
                          class="form-control"
                          id="cardNo"
                          name="cardNo"
                          placeholder="Card Number"
                          value=""
                        />
                      </div>
                    </div>
                    <div className="col-xs-4 pl-5">
                      <div class="form-group">
                        <input
                          type="text"
                          class="form-control"
                          id="cardExp"
                          name="cardExp"
                          placeholder="MM/YY"
                          value=""
                        />
                      </div>
                    </div> */}
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

        {/* NEW CARD END */}
      </div>
    );
  };
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
    {
      actionGetDiscount,
      actionGetEventAmountToPay,
      actionPayAndSubscribeEvent,
      showLoader,
      hideLoader,
      actionMemberEventDetailsObjectData,
      actiongGetProfileDataById,
      updateUserInfo
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinEventPayment);

// export default JoinEventPayment;
