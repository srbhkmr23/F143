import React, { Component } from 'react';
import { DatePicker } from 'react-md';
import moment from 'moment';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import classNames from 'classnames';
import { Prompt } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  actionCreateCoupon,
  actionDeleteCoupon,
  actionUpdateCoupon
} from '../../common/action/index';

import { showWarningToast } from '../../common/core/common-functions';
import 'react-datepicker/dist/react-datepicker.css';
import AlertModal from '../../common/alert-box/alert-modal';
import Sprite from '../../img/sprite.svg';

class Coupons extends Component {
  constructor(props) {
    super(props);

    this.state = {
      couponList: [],
      offerList: [],
      dropDownList: [],
      selectedOfferList: [],
      description: '',
      code: '',
      fromDate: null,
      toDate: null,
      percent: '',
      showFromDatePicker: false,
      showToDatePicker: false,
      isAddCouponVisible: false,
      showDeleteModal: false,
      deleteCoupon: {},
      prompt: false
    };

    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillReceiveProps(res) {
    // this.state.couponList = res.parentCouponList || [];

    console.log('res.parentOfferList', res.parentOfferList);

    let offerList = res.parentOfferList || [];
    let dropDownList = [];
    dropDownList = offerList.map(offer => {
      return {
        value: offer.id,
        label: offer.description
      };
    });

    let couponList = res.parentCouponList || [];

    couponList.map(coupon => {
      coupon['selectedOfferList'] = [];
      if (coupon.applicableOffers) {
        coupon.applicableOffers.map(offer => {
          let obj = {};
          obj.value = offer.id;
          obj.label = offer.description;
          coupon['selectedOfferList'].push(obj);
        });
      }
    });

    this.setState(
      {
        couponList: couponList || [],
        offerList: offerList || [],
        dropDownList: dropDownList || []
      },
      () => {
        this.updateDimensions();
      }
    );

    // console.log('res.parentCouponList', res.parentCouponList);
  }

  setPromptFlag() {
    this.setState({
      prompt: true
    });
  }

  setPromptFlagFalse() {
    this.setState({
      prompt: false
    });
  }

  updateDimensions() {
    try {
      let height1 = document.getElementsByClassName('discountCoupon')[0]
        .offsetHeight;
      let elements = document.getElementsByClassName('couponLabel');

      Array.prototype.forEach.call(elements, element => {
        element.setAttribute('style', `width:${height1}px`);
      });
    } catch (err) {
      // console.log('err2', err);
    }
  }

  componentDidMount() {
    // this.state.couponList = this.props.parentCouponList || [];
    // this.setState({
    //   couponList: this.props.parentCouponList || [],
    //   offerList: this.props.parentOfferList || []
    // });
  }

  handleUserInput(e) {
    this.setPromptFlag();
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  handleUserPercentInput(e) {
    this.setPromptFlag();
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      let val = parseInt(value);
      if (val > 100) return;
      this.setState({ [name]: value });
    }
  }

  showAddCoupon = () => {
    this.setState({ isAddCouponVisible: true });
  };

  onAddNewCoupon = () => {
    // console.log(this.state);
    this.setPromptFlagFalse();

    if (
      this.state.description.trim() == '' ||
      this.state.percent.trim() == '' ||
      this.state.fromDate == null ||
      this.state.toDate == null ||
      this.state.code.trim() == ''
    ) {
      showWarningToast('Fields can not be empty');
      return;
    }

    // "applicableCoupons": [
    //   {
    //     "id": "string",
    //     "couponCode": "string",
    //     "expiryTimeStamp": "2018-03-16T20:00:11.262Z",
    //     "applicableFromTimeStamp": "2018-03-16T20:00:11.262Z",
    //     "description": "string",
    //     "createdBy": "string",
    //     "applicableInZones": [
    //       "string"
    //     ],
    //     "totalApplicableCount": 0,
    //     "applicablePerUserCount": 0,
    //     "discountPercentage": 0
    //   }
    // ]

    let selectedOfferList = [];

    this.state.selectedOfferList.map(offer => {
      selectedOfferList.push(offer.value);
    });

    let newCoupon = {};
    newCoupon = {
      discountPercentage: parseInt(this.state.percent.trim()),
      description: this.state.description.trim(),
      applicableFromTimeStamp: this.state.fromDate,
      expiryTimeStamp: this.state.toDate,
      couponCode: this.state.code.trim(),
      createdBy: this.props.userId,
      applicableWithOffersList: selectedOfferList
    };

    let couponList = this.state.couponList;
    newCoupon['eventId'] = this.props.eventId;

    console.log('newCoupon', newCoupon);

    this.props.actionCreateCoupon(newCoupon).then(res => {
      if (res.payload && res.payload.data && res.payload.data.status == 200) {
        // console.log('coupon Create successfully.');
        this.props.updatePageWithLatestdata(this.props.eventId);
        this.setState({
          description: '',
          percent: '',
          fromDate: null,
          toDate: null,
          code: '',
          isAddCouponVisible: false,
          selectedOfferList: []
        });
      }
    });

    // couponList.push(newCoupon);
    // this.setState({
    //   couponList,
    //   description: '',
    //   percent: '',
    //   fromDate: null,
    //   toDate: null,
    //   code: '',
    //   isAddCouponVisible: false
    // });
  };

  onCloseAddCoupon = () => {
    this.setPromptFlagFalse();
    this.setState({
      fromDate: null,
      toDate: null,
      percent: '',
      code: '',
      description: '',
      selectedOfferList: [],
      isAddCouponVisible: false
    });
  };

  onDeleteCoupon = coupon => {
    // let couponList = this.state.couponList;
    // let couponIndex = couponList.indexOf(coupon);
    // couponList.splice(couponIndex, 1);
    // this.setState({ couponList });

    let sendObj = {
      eventId: this.props.eventId,
      couponId: coupon.id
    };

    this.props.actionDeleteCoupon(sendObj).then(res => {
      if (res.payload && res.payload.data && res.payload.data.status == 200) {
        // console.log('coupon deleted successfully.');
        this.props.updatePageWithLatestdata(this.props.eventId);
      }
    });
  };

  showDeleteAlert = coupon => {
    this.setState({
      showDeleteModal: true,
      deleteCoupon: coupon
    });
  };

  hideDeleteAlert = () => {
    this.setState({
      showDeleteModal: false
    });
  };

  updateCouponList = () => {
    this.setState({ couponList: this.state.couponList }, () => {
      this.updateDimensions();
    });
  };

  /////////////////////////////////////////////////////////////////////// from date validation

  showFromDate = () => {
    this.setState({ showFromDatePicker: true });
  };

  handleChangeFromDate = (value, dateValue, event) => {
    let zoneDate = this.getDateTimeInZoneFormat(
      moment(dateValue).format('YYYY-MM-DD')
    );
    if (this.state.toDate && zoneDate > this.state.toDate) {
      showWarningToast('Start date can not more than end date');
      return;
    }

    let eventStartDateWithZone = this.props.eventStartDate;
    // if (zoneDate < eventStartDateWithZone) {
    //   showWarningToast('Date must be greater than event start date');
    //   return;
    // }

    let eventEndDateWithZone = this.props.eventEndDate;
    if (zoneDate > eventEndDateWithZone) {
      showWarningToast('Date must be less than event end date');
      return;
    }

    let currentDate = moment(moment().format('YYYY-MM-DD')).valueOf();
    let selectedDateWithCurrentTimeZone = moment(
      moment(dateValue).format('YYYY-MM-DD')
    ).valueOf();
    if (selectedDateWithCurrentTimeZone < currentDate) {
      showWarningToast('Coupons can not be created on past date');
      return;
    }
    this.setPromptFlag();

    let selectedDateWithCurrentZone = moment(
      moment(dateValue).format('YYYY-MM-DD')
    ).valueOf();

    this.setState({
      fromDate: selectedDateWithCurrentZone
    });
  };

  handleVisibilityChangeFromDate = (visible, e) => {
    this.setState({
      showFromDatePicker: visible
    });
  };

  ////////////////////////////////////////////////////////////////////////////// to date validation

  showToDate = () => {
    this.setState({ showToDatePicker: true });
  };

  handleChangeToDate = (value, dateValue, event) => {
    let zoneDate = this.getDateTimeInZoneFormat(
      moment(dateValue).format('YYYY-MM-DD')
    );

    console.log('zoneDate', zoneDate);

    let currentDate = moment(moment().format('YYYY-MM-DD')).valueOf();
    let selectedDateWithCurrentTimeZone = moment(
      moment(dateValue).format('YYYY-MM-DD')
    ).valueOf();
    if (selectedDateWithCurrentTimeZone < currentDate) {
      showWarningToast('Coupons can not be created on past date');
      return;
    }

    if (
      this.state.fromDate &&
      selectedDateWithCurrentTimeZone < this.state.fromDate
    ) {
      showWarningToast('End date can not less than start date');
      return;
    }

    let eventEndDateWithZone = this.props.eventEndDate;
    if (zoneDate > eventEndDateWithZone) {
      showWarningToast('Date must be less than event end date');
      return;
    }
    this.setPromptFlag();

    let selectedDateWithCurrentZone = moment(
      moment(dateValue).format('YYYY-MM-DD') + ' 23:59:59'
    ).valueOf();

    console.log('selectedDateWithCurrentZone', selectedDateWithCurrentZone);

    this.setState({
      toDate: selectedDateWithCurrentZone
    });
  };

  handleVisibilityChangeToDate = (visible, e) => {
    this.setState({
      showToDatePicker: visible
    });
  };

  //////////////////////////////////////////////////////////////////////////////
  getDateTimeInZoneFormat = date => {
    return moment.tz(date, this.props.eventTimeZone).valueOf();
  };
  //////////////////////////////////////////////////////////////////////////////

  getDateTimeInZoneFormatWithTime = date => {
    date = date + ' 23:59:59';
    return moment.tz(date, this.props.eventTimeZone).valueOf();
  };
  //////////////////////////////////////////////////////////////////////////////

  render() {
    if (this.props.showCoupon == true) {
      return (
        <div>
          <Prompt
            when={this.state.prompt}
            message="You may lost any unsaved data, click cancel to stay on the same screen and click on next button  to save the changes."
          />
          {this.renderCouponList()}

          {this.renderAddCoupon()}

          {this.state.isAddCouponVisible == false ? (
            <a
              href="javascript:void(0);"
              onClick={() => {
                this.showAddCoupon();
              }}
              className="moreDiscountsLink"
            >
              <span className="ico-plus-create">
                <svg>
                  <use xlinkHref={`${Sprite}#plusCreate`} />
                </svg>
              </span>
              Add more coupons
            </a>
          ) : null}

          <AlertModal
            confirmedMe={() => this.onDeleteCoupon(this.state.deleteCoupon)}
            eventType="delete"
            customClass="deleteIconDiv"
            alertMessage="Are you sure you want to delete?"
            showDeleteModal={this.state.showDeleteModal}
            hideDeleteModal={this.hideDeleteAlert}
          />
        </div>
      );
    } else {
      return null;
    }
  }

  renderCouponList = () => {
    return (
      <div>
        {this.state.couponList.map((coupon, couponIndex) => {
          return (
            <div key={couponIndex}>
              {coupon.isEdit == true
                ? this.renderEditCoupon(coupon, couponIndex)
                : this.renderCoupon(coupon, couponIndex)}
            </div>
          );
        })}
      </div>
    );
  };

  onOfferSelect = offer => {
    console.log('offer', offer);
    this.setPromptFlag();
    let selectedOfferList = [];
    selectedOfferList = offer;
    this.setState({ selectedOfferList });
  };

  renderAddCoupon = () => {
    if (this.state.isAddCouponVisible == true) {
      return (
        <div className="discountsMore">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="usr">From date</label>
                  <input
                    type="text"
                    className="form-control input-control"
                    placeholder="From date"
                    value={
                      this.state.fromDate
                        ? moment(this.state.fromDate).format('MMMM DD, YYYY')
                        : ''
                    }
                    onClick={event => {
                      this.showFromDate();
                    }}
                    readOnly
                    style={{ backgroundColor: '#fff' }}
                  />

                  <DatePicker
                    // id="date-picker-controlled"
                    label="Select date"
                    visible={this.state.showFromDatePicker}
                    className="md-cell cls-discount-datepicker"
                    textFieldClassName="hide"
                    autoOk={true}
                    value={
                      this.state.fromDate
                        ? moment(this.state.fromDate).toDate()
                        : null
                    }
                    onChange={this.handleChangeFromDate}
                    onVisibilityChange={this.handleVisibilityChangeFromDate}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label htmlFor="usr">To date</label>
                  <input
                    type="text"
                    className="form-control input-control"
                    placeholder="To date"
                    value={
                      this.state.toDate
                        ? moment(this.state.toDate).format('MMMM DD, YYYY')
                        : ''
                    }
                    onClick={event => {
                      this.showToDate();
                    }}
                    readOnly
                    style={{ backgroundColor: '#fff' }}
                  />
                  <DatePicker
                    // id="date-picker-controlled"
                    label="Select date"
                    visible={this.state.showToDatePicker}
                    className="md-cell cls-discount-datepicker"
                    textFieldClassName="hide"
                    autoOk={true}
                    value={
                      this.state.toDate
                        ? moment(this.state.toDate).toDate()
                        : null
                    }
                    onChange={this.handleChangeToDate}
                    onVisibilityChange={this.handleVisibilityChangeToDate}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-20">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="usr">Discount(%)</label>
                <input
                  type="text"
                  className="form-control input-control"
                  placeholder="Discount percentage"
                  maxLength="3"
                  name="percent"
                  value={this.state.percent}
                  onChange={this.handleUserPercentInput.bind(this)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="usr">Coupon code</label>
                <input
                  type="text"
                  className="form-control input-control"
                  placeholder="Coupon code"
                  maxLength="20"
                  name="code"
                  value={this.state.code}
                  onChange={this.handleUserInput.bind(this)}
                />
              </div>
            </div>
          </div>

          <div className="row mt-20">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="usr">Description</label>
                <textarea
                  className="form-control textarea-control"
                  rows="2"
                  placeholder="Description"
                  name="description"
                  value={this.state.description}
                  maxLength="100"
                  onChange={this.handleUserInput.bind(this)}
                />
              </div>
            </div>
          </div>

          <div className="row mt-20">
            <div className="col-md-12">
              <div className={classNames('form-group')}>
                <label htmlFor="offer">Applicable with (offers)</label>
                <Select
                  multi
                  className="selectCategoryInput"
                  name="offer"
                  placeholder="Select offer"
                  value={this.state.selectedOfferList}
                  options={this.state.dropDownList}
                  onChange={this.onOfferSelect}
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-20">
            <a
              onClick={() => this.onAddNewCoupon()}
              className="btn btnSuccess btnAdd ripple"
            >
              ADD
            </a>

            {'  '}
            <a
              onClick={() => this.onCloseAddCoupon()}
              className="btn btnCancel btnAdd ripple"
            >
              CANCEL
            </a>
          </div>
        </div>
      );
    }
  };

  onClickEdit = coupon => {
    this.setPromptFlagFalse();
    coupon.lastNonEditValues = {
      des: coupon.description,
      cod: coupon.couponCode,
      from: coupon.applicableFromTimeStamp,
      to: coupon.expiryTimeStamp,
      per: coupon.discountPercentage,
      selOffer: coupon.selectedOfferList
    };

    coupon.isEdit = true;
    this.updateCouponList();
  };

  onCancle = coupon => {
    this.setPromptFlagFalse();
    coupon.description = coupon.lastNonEditValues.des;
    coupon.couponCode = coupon.lastNonEditValues.cod;
    coupon.applicableFromTimeStamp = coupon.lastNonEditValues.from;
    coupon.expiryTimeStamp = coupon.lastNonEditValues.to;
    coupon.discountPercentage = coupon.lastNonEditValues.per;
    coupon.selectedOfferList = coupon.lastNonEditValues.selOffer;
    coupon.isEdit = false;
    this.updateCouponList();
  };

  onUpdate = coupon => {
    try {
      if (
        coupon.description.toString().trim() == '' ||
        coupon.discountPercentage.toString().trim() == '' ||
        coupon.applicableFromTimeStamp == null ||
        coupon.expiryTimeStamp == null ||
        coupon.couponCode.toString().trim() == ''
      ) {
        showWarningToast('Fields can not be empty');
        return;
      }

      let sendObj = JSON.parse(JSON.stringify(coupon));

      sendObj.applicableWithOffersList = [];
      sendObj.selectedOfferList.map(offer => {
        sendObj.applicableWithOffersList.push(offer.value);
      });

      sendObj['createdBy'] = this.props.userId;
      this.props.actionUpdateCoupon(sendObj).then(res => {
        if (res.payload && res.payload.data && res.payload.data.status == 200) {
          // console.log('coupon updated successfully.');
          this.props.updatePageWithLatestdata(this.props.eventId);
        }
      });
      this.setPromptFlagFalse();
      // coupon.isEdit = false;
      // this.updateCouponList();
    } catch (err) {
      console.log(err);
    }
  };

  renderCoupon = (coupon, couponIndex) => {
    return (
      <div className="discount-coupon discountCoupon" key={couponIndex}>
        <div className="couponLabel couponLabel">
          <label>Coupon</label>
        </div>
        <div className="registerLock">
          <div className="actionBtn">
            <a
              href="javascript:void(0);"
              onClick={() => this.showDeleteAlert(coupon)}
            >
              <span className="ico-delete">
                <svg>
                  <use xlinkHref={`${Sprite}#deleteIco`} />
                </svg>
              </span>
            </a>
            <a
              href="javascript:void(0);"
              onClick={() => {
                this.onClickEdit(coupon);
              }}
            >
              <span className="ico-pen">
                <svg>
                  <use xlinkHref={`${Sprite}#penIco`} />
                </svg>
              </span>
            </a>
          </div>
          <p className="couponText">
            {/* Register before 30 May, 2018 to receive 30% off on registration
              with the coupon code <a href="javascript:void(0);">INNO2929</a> */}

            {/* {`Register before ${moment(coupon.expiryTimeStamp).format(
              'DD MMM, YYYY'
            )} to receive ${coupon.discountPercentage}% off on registration
              with the coupon code`}

            <a href="javascript:void(0);">{coupon.couponCode}</a> */}

            {coupon.description}
          </p>
          <ul className="regtimeLock">
            <li>
              <p className="yellow">Start Date</p>
              <p>
                {moment(coupon.applicableFromTimeStamp).format('DD-MM-YYYY')}

                {/* 21-02-2018 */}
              </p>
            </li>
            <li>
              <p className="yellow">End Date</p>
              <p>
                {moment(coupon.expiryTimeStamp).format('DD-MM-YYYY')}
                {/* 22-02-2018 */}
              </p>
            </li>
          </ul>
          <div className="clearfix" />
        </div>
      </div>
    );
  };

  ////////////////////////////////////////////////////////////////////////////// on edit date validation
  showEditFromDate = coupon => {
    coupon.showFromDatePicker = true;
    this.updateCouponList();
  };

  handleEditFromDate = (value, dateValue, event, coupon) => {
    let zoneDate = this.getDateTimeInZoneFormat(
      moment(dateValue).format('YYYY-MM-DD')
    );

    if (zoneDate > coupon.expiryTimeStamp) {
      showWarningToast('Start date can not more than end date');
      return;
    }

    let eventStartDateWithZone = this.props.eventStartDate;
    // if (zoneDate < eventStartDateWithZone) {
    //   showWarningToast('Date must be greater than event start date');
    //   return;
    // }

    let eventEndDateWithZone = this.props.eventEndDate;
    if (zoneDate > eventEndDateWithZone) {
      showWarningToast('Date must be less than event end date');
      return;
    }

    let currentDate = moment(moment().format('YYYY-MM-DD')).valueOf();
    let selectedDateWithCurrentTimeZone = moment(
      moment(dateValue).format('YYYY-MM-DD')
    ).valueOf();
    if (selectedDateWithCurrentTimeZone < currentDate) {
      showWarningToast('Coupons can not be created on past date');
      return;
    }

    let selectedDateWithCurrentZone = moment(
      moment(dateValue).format('YYYY-MM-DD')
    ).valueOf();

    coupon.applicableFromTimeStamp = selectedDateWithCurrentZone; //zoneDate;
    this.updateCouponList();
    this.setPromptFlag();
  };

  handleVisibilityEditFromDate = (visible, coupon) => {
    coupon.showFromDatePicker = false;
    this.updateCouponList();
  };

  ////////////////////////////////////////////////////////////////
  showEditToDate = coupon => {
    coupon.showToDatePicker = true;
    this.updateCouponList();
  };

  handleEditToDate = (value, dateValue, event, coupon) => {
    let zoneDate = this.getDateTimeInZoneFormat(
      moment(dateValue).format('YYYY-MM-DD')
    );

    let currentDate = moment(moment().format('YYYY-MM-DD')).valueOf();
    let selectedDateWithCurrentTimeZone = moment(
      moment(dateValue).format('YYYY-MM-DD')
    ).valueOf();
    if (selectedDateWithCurrentTimeZone < currentDate) {
      showWarningToast('Coupons can not be created on past date');
      return;
    }

    if (selectedDateWithCurrentTimeZone < coupon.applicableFromTimeStamp) {
      showWarningToast('End date can not less than start date');
      return;
    }

    let eventEndDateWithZone = this.props.eventEndDate;
    if (zoneDate > eventEndDateWithZone) {
      showWarningToast('Date must be less than event end date');
      return;
    }

    let selectedDateWithCurrentZone = moment(
      moment(dateValue).format('YYYY-MM-DD') + ' 23:59:59'
    ).valueOf();

    console.log('selectedDateWithCurrentZone', selectedDateWithCurrentZone);

    coupon.expiryTimeStamp = selectedDateWithCurrentZone; //zoneDate;
    this.updateCouponList();
    this.setPromptFlag();
  };

  handleVisibilityEditToDate = (visible, coupon) => {
    coupon.showToDatePicker = false;
    this.updateCouponList();
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  onEditPercentage = (event, coupon) => {
    this.setPromptFlag();
    let value = event.target.value;
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      let val = parseInt(value);
      if (val > 100) return;
      coupon.discountPercentage = value;
      this.updateCouponList();
    }
  };

  onEditOffer = (offer, coupon) => {
    this.setPromptFlag();
    coupon.selectedOfferList = offer;
    this.updateCouponList();
  };

  /////////////////////////////////////////////////////////

  renderEditCoupon = (coupon, couponIndex) => {
    return (
      <div className="discountsMore">
        <div className="row ">
          <div className="col-md-8 col-md-offset-2">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="usr">From date</label>
                <input
                  type="text"
                  className="form-control input-control"
                  placeholder="From date"
                  value={
                    coupon.applicableFromTimeStamp
                      ? moment(coupon.applicableFromTimeStamp).format(
                          'MMMM DD, YYYY'
                        )
                      : ''
                  }
                  onClick={event => {
                    this.showEditFromDate(coupon);
                  }}
                  readOnly
                  style={{ backgroundColor: '#fff' }}
                />

                <DatePicker
                  // id="date-picker-controlled"
                  label="Select date"
                  visible={coupon.showFromDatePicker}
                  className="md-cell cls-discount-datepicker"
                  textFieldClassName="hide"
                  autoOk={true}
                  value={
                    coupon.applicableFromTimeStamp
                      ? moment(coupon.applicableFromTimeStamp).toDate()
                      : null
                  }
                  onChange={(value, dateValue, event) =>
                    this.handleEditFromDate(value, dateValue, event, coupon)
                  }
                  onVisibilityChange={visible =>
                    this.handleVisibilityEditFromDate(visible, coupon)
                  }
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="usr">To date</label>
                <input
                  type="text"
                  className="form-control input-control"
                  placeholder="To date"
                  value={
                    coupon.expiryTimeStamp
                      ? moment(coupon.expiryTimeStamp).format('MMMM DD, YYYY')
                      : ''
                  }
                  onClick={event => {
                    this.showEditToDate(coupon);
                  }}
                  readOnly
                  style={{ backgroundColor: '#fff' }}
                />
                <DatePicker
                  // id="date-picker-controlled"
                  label="Select date"
                  visible={coupon.showToDatePicker}
                  className="md-cell cls-discount-datepicker"
                  textFieldClassName="hide"
                  autoOk={true}
                  value={
                    coupon.expiryTimeStamp
                      ? moment(coupon.expiryTimeStamp).toDate()
                      : null
                  }
                  onChange={(value, dateValue, event) =>
                    this.handleEditToDate(value, dateValue, event, coupon)
                  }
                  onVisibilityChange={visible =>
                    this.handleVisibilityEditToDate(visible, coupon)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-20">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="usr">Discount(%)</label>
              <input
                type="text"
                className="form-control input-control"
                placeholder="Discount percentage"
                maxLength="3"
                name="percent"
                value={coupon.discountPercentage}
                onChange={event => {
                  this.onEditPercentage(event, coupon);
                }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="usr">Coupon code</label>
              <input
                type="text"
                className="form-control input-control"
                placeholder="Coupon code"
                maxLength="20"
                name="code"
                value={coupon.couponCode}
                onChange={event => {
                  coupon.couponCode = event.target.value;
                  this.updateCouponList();
                  this.setPromptFlag();
                }}
              />
            </div>
          </div>
        </div>

        <div className="row mt-20">
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="usr">Description</label>
              <textarea
                className="form-control textarea-control"
                rows="2"
                placeholder="Description"
                name="description"
                value={coupon.description}
                maxLength="100"
                onChange={event => {
                  coupon.description = event.target.value;
                  this.updateCouponList();
                  this.setPromptFlag();
                }}
              />
            </div>
          </div>
        </div>

        <div className="row mt-20">
          <div className="col-md-12">
            <div className={classNames('form-group')}>
              <label htmlFor="offer">Applicable with (offers)</label>
              <Select
                multi
                className="selectCategoryInput"
                name="offer"
                placeholder="Select offer"
                value={coupon.selectedOfferList}
                options={this.state.dropDownList}
                onChange={offer => this.onEditOffer(offer, coupon)}
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-20">
          <a
            onClick={() => this.onUpdate(coupon)}
            className="btn btnSuccess btnAdd ripple"
          >
            UPDATE
          </a>

          {'  '}
          <a
            onClick={() => this.onCancle(coupon)}
            className="btn btnCancel btnAdd ripple"
          >
            CANCEL
          </a>
        </div>
      </div>
    );
  };
}

// export default Coupons;

function mapStateToProps(state) {
  return {
    discount: state.discount
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actionCreateCoupon,
      actionDeleteCoupon,
      actionUpdateCoupon
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Coupons);
