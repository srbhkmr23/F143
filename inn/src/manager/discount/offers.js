import React, { Component } from 'react';
import { DatePicker } from 'react-md';
import moment from 'moment';
import { Prompt } from 'react-router';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  actionCreateOffer,
  actionDeleteOffer,
  actionUpdateOffer
} from '../../common/action/index';

import { showWarningToast } from '../../common/core/common-functions';
import AlertModal from '../../common/alert-box/alert-modal';
import Sprite from '../../img/sprite.svg';
import 'react-datepicker/dist/react-datepicker.css';
class Offers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offerList: [],
      description: '',
      percent: '',
      fromDate: null,
      toDate: null,
      maxAllowedPerson: '',
      minAllowedPerson: '',
      showFromDatePicker: false,
      showToDatePicker: false,
      isAddOfferVisible: false,
      showDeleteModal: false,
      deleteOffer: {},
      prompt: false
    };
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillReceiveProps(res) {
    // this.state.offerList = res.parentOfferList || [];
    this.setState(
      {
        offerList: res.parentOfferList || []
      },
      () => {
        this.updateDimensions();
      }
    );
    console.log('res.parentOfferList', res.parentOfferList);
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
      let height1 = document.getElementsByClassName('discountOffer')[0]
        .offsetHeight;
      let elements = document.getElementsByClassName('offerLabel');

      Array.prototype.forEach.call(elements, element => {
        element.setAttribute('style', `width:${height1}px`);
      });
    } catch (err) {
      // console.log('err1', err);
    }

    // try {
    //   let height2 = document.getElementById('discountcoupon2').offsetHeight;
    //   let el2 = document.getElementById('couponLabel2');
    //   el2.setAttribute('style', `width:${height2}px`);
    // } catch (err) {
    //   console.log('err2', err);
    // }
  }

  componentDidMount() {
    this.state.offerList = this.props.parentOfferList || [];
  }

  handleUserInput(e) {
    this.setPromptFlag();
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  handleUserAlphabetInput(e) {
    this.setPromptFlag();
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[a-zA-Z\s]*$/);
    if (value === '' || regExp.test(value) === true) {
      this.setState({ [name]: value });
    }
  }

  handleUserNumericInput(e) {
    this.setPromptFlag();
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      this.setState({ [name]: value });
    }
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

  showAddOffer = () => {
    this.setState({ isAddOfferVisible: true });
  };

  onAddNewOffer = () => {
    this.setPromptFlagFalse();
    console.log(this.state);

    if (
      this.state.description.trim() == '' ||
      this.state.percent.trim() == '' ||
      this.state.fromDate == null ||
      this.state.toDate == null ||
      this.state.minAllowedPerson.trim() == '' ||
      this.state.maxAllowedPerson.trim() == ''
    ) {
      showWarningToast('Fields can not be empty');
      return;
    }

    let min = parseInt(this.state.minAllowedPerson);
    let max = parseInt(this.state.maxAllowedPerson);
    if (min > max) {
      showWarningToast('Min Members can not be more than Max Members');
      return;
    }

    // "applicableOffers": [
    //   {
    //     "id": "string",
    //     "discountPercentage": 0,
    //     "applicableCount": 0,
    //     "description": "string",
    //     "createdByUserId": "string",
    //     "applicableInZones": [
    //       "string"
    //     ],
    //     "applicableFromDate": "2018-03-16T17:54:44.224Z",
    //     "applicableTillDate": "2018-03-16T17:54:44.224Z"
    //   }
    // ],

    let newOffer = {};
    newOffer = {
      discountPercentage: parseInt(this.state.percent.trim()),
      description: this.state.description.trim(),
      applicableFromDate: this.state.fromDate,
      applicableTillDate: this.state.toDate,
      minAllowedUser: parseInt(this.state.minAllowedPerson.trim()),
      maxAllowedUser: parseInt(this.state.maxAllowedPerson.trim()),
      createdByUserId: this.props.userId
    };

    let offerList = this.state.offerList;
    newOffer['eventId'] = this.props.eventId;

    this.props.actionCreateOffer(newOffer).then(res => {
      if (res.payload && res.payload.data && res.payload.data.status == 200) {
        console.log('coupon Create successfully.');
        this.props.updatePageWithLatestdata(this.props.eventId);
        this.setState({
          description: '',
          percent: '',
          fromDate: null,
          toDate: null,
          minAllowedPerson: '',
          maxAllowedPerson: '',
          isAddOfferVisible: false
        });
      }
    });

    // offerList.push(newOffer);
    // this.setState({
    //   offerList,
    //   description: '',
    //   percent: '',
    //   fromDate: null,
    //   toDate: null,
    //   minAllowedPerson: '',
    //   maxAllowedPerson: '',
    //   isAddOfferVisible: false
    // });
  };
  onCloseAddOffer = () => {
    this.setPromptFlagFalse();
    this.setState({
      fromDate: null,
      toDate: null,
      percent: '',
      minAllowedPerson: '',
      maxAllowedPerson: '',
      description: '',
      isAddOfferVisible: false
    });
  };

  onDeleteOffer = offer => {
    // let offerList = this.state.offerList;
    // let offerIndex = offerList.indexOf(offer);
    // offerList.splice(offerIndex, 1);
    // this.setState({ offerList });
    let sendObj = {
      eventId: this.props.eventId,
      offerId: offer.id
    };

    this.props.actionDeleteOffer(sendObj).then(res => {
      if (res.payload && res.payload.data && res.payload.data.status == 200) {
        console.log('coupon deleted successfully.');
        this.props.updatePageWithLatestdata(this.props.eventId);
      }
    });
  };

  showDeleteAlert = offer => {
    this.setState({
      showDeleteModal: true,
      deleteOffer: offer
    });
  };

  hideDeleteAlert = () => {
    this.setState({
      showDeleteModal: false
    });
  };

  updateOfferList = () => {
    this.setState({ offerList: this.state.offerList }, () => {
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
      showWarningToast('Offer can not be created on past date');
      return;
    }
    this.setPromptFlag();

    let selectedDateWithCurrentZone = moment(
      moment(dateValue).format('YYYY-MM-DD')
    ).valueOf();

    // console.log("selectedDateWithCurrentZone",selectedDateWithCurrentZone)
    // console.log("zoneDate",zoneDate)

    this.setState({
      fromDate: selectedDateWithCurrentZone
    });
  };

  handleVisibilityChangeFromDate = (visible, e) => {
    this.setState({
      showFromDatePicker: visible
    });
  };

  getDateTimeInZoneFormat = date => {
    return moment.tz(date, this.props.eventTimeZone).valueOf();
  };

  ////////////////////////////////////////////////////////////////////////////// to date validation

  showToDate = () => {
    this.setState({ showToDatePicker: true });
  };

  handleChangeToDate = (value, dateValue, event) => {
    let zoneDate = this.getDateTimeInZoneFormat(
      moment(dateValue).format('YYYY-MM-DD')
    );

    let currentDate = moment(moment().format('YYYY-MM-DD')).valueOf();
    let selectedDateWithCurrentTimeZone = moment(
      moment(dateValue).format('YYYY-MM-DD')
    ).valueOf();
    if (selectedDateWithCurrentTimeZone < currentDate) {
      showWarningToast('Offer can not be created on past date');
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

  /////////////////////////////////////////////////////////////////////////////////////////////

  render() {
    if (this.props.showEarlyBird == true) {
      return (
        <div>
          <Prompt
            when={this.state.prompt}
            message="You may lost any unsaved data, click cancel to stay on the same screen and click on next button  to save the changes."
          />
          {this.renderOfferCoupon()}

          {this.renderAddOffer()}

          {this.state.isAddOfferVisible == false ? (
            <a
              href="javascript:void(0);"
              onClick={() => {
                this.showAddOffer();
              }}
              className="moreDiscountsLink"
            >
              <span className="ico-plus-create">
                <svg>
                  <use xlinkHref={`${Sprite}#plusCreate`} />
                </svg>
              </span>
              Add more offers
            </a>
          ) : null}

          <AlertModal
            confirmedMe={() => this.onDeleteOffer(this.state.deleteOffer)}
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

  renderOfferCoupon = () => {
    return (
      <div>
        {this.state.offerList.map((offer, offerIndex) => {
          return (
            <div key={offerIndex}>
              {offer.isEdit == true
                ? this.renderEditOffer(offer, offerIndex)
                : this.renderOffer(offer, offerIndex)}
            </div>
          );
        })}
      </div>
    );
  };

  renderAddOffer = () => {
    if (this.state.isAddOfferVisible == true) {
      return (
        <div className="discountsMore">
          {/* <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label htmlFor="usr">Description</label>
                <textarea
                  className="form-control textarea-control"
                  rows="2"
                  id="comment"
                  placeholder="Description"
                  name="description"
                  value={this.state.description}
                  maxLength="100"
                  onChange={this.handleUserInput.bind(this)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="usr">percent</label>
                <input
                  type="text"
                  className="form-control input-control"
                  placeholder="percent"
                  maxLength="3"
                  name="percent"
                  value={this.state.percent}
                  onChange={this.handleUserPercentInput.bind(this)}
                />
              </div>
            </div>
          </div> */}

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
            {/* <div className="col-md-7">
              <div className="form-group">
                <label htmlFor="usr">To date</label>
                <div className="disctInputAdd">
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
                  />

                  <DatePicker
                    id="date-picker-controlled"
                    label="Select date"
                    visible={this.state.showToDatePicker}
                    className="md-cell"
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
                  <a
                    onClick={() => {
                      this.onAddNewOffer();
                    }}
                    className="btn btnSuccess btnAdd ripple"
                  >
                    ADD
                  </a>
                </div>
              </div>
            </div> */}
          </div>

          <div className="row mt-20">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="usr">Discount(%)</label>
                <input
                  type="text"
                  className="form-control input-control"
                  placeholder="Discount"
                  maxLength="3"
                  name="percent"
                  value={this.state.percent}
                  onChange={this.handleUserPercentInput.bind(this)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="usr">Min Members</label>
                <input
                  type="text"
                  className="form-control input-control"
                  placeholder="Min Members"
                  name="minAllowedPerson"
                  value={this.state.minAllowedPerson}
                  maxLength="2"
                  onChange={this.handleUserNumericInput.bind(this)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="usr">Max Members</label>
                <input
                  type="text"
                  className="form-control input-control"
                  placeholder="Max Members"
                  name="maxAllowedPerson"
                  value={this.state.maxAllowedPerson}
                  maxLength="2"
                  onChange={this.handleUserNumericInput.bind(this)}
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
                  id="comment"
                  placeholder="Description"
                  name="description"
                  value={this.state.description}
                  maxLength="100"
                  onChange={this.handleUserInput.bind(this)}
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-20">
            <a
              onClick={() => {
                this.onAddNewOffer();
              }}
              className="btn btnSuccess btnAdd ripple"
            >
              ADD
            </a>

            {'  '}

            <a
              onClick={() => {
                this.onCloseAddOffer();
              }}
              className="btn btnCancel btnAdd ripple"
            >
              CANCEL
            </a>
          </div>
        </div>
      );
    }
  };

  onClickEdit = offer => {
    this.setPromptFlagFalse();
    offer.lastNonEditValues = {
      des: offer.description,
      per: offer.discountPercentage,
      from: offer.applicableFromDate,
      to: offer.applicableTillDate,
      min: offer.minAllowedUser,
      max: offer.maxAllowedUser
    };

    offer.isEdit = true;
    this.updateOfferList();
  };

  onCancle = offer => {
    this.setPromptFlagFalse();
    offer.description = offer.lastNonEditValues.des;
    offer.discountPercentage = offer.lastNonEditValues.per;
    offer.applicableFromDate = offer.lastNonEditValues.from;
    offer.applicableTillDate = offer.lastNonEditValues.to;
    offer.minAllowedUser = offer.lastNonEditValues.min;
    offer.maxAllowedUser = offer.lastNonEditValues.max;

    offer.isEdit = false;
    this.updateOfferList();
  };

  onUpdate = offer => {
    if (
      offer.description.trim() == '' ||
      offer.discountPercentage.toString().trim() == '' ||
      offer.applicableFromDate == null ||
      offer.applicableTillDate == null ||
      offer.minAllowedUser.toString().trim() == '' ||
      offer.maxAllowedUser.toString().trim() == ''
    ) {
      showWarningToast('Fields can not be empty');
      return;
    }

    let min = parseInt(offer.minAllowedUser);
    let max = parseInt(offer.maxAllowedUser);
    if (min > max) {
      showWarningToast('Min Members can not be more than Max Members');
      return;
    }

    let sendObj = JSON.parse(JSON.stringify(offer));
    sendObj['createdByUserId'] = this.props.userId;
    this.props.actionUpdateOffer(sendObj).then(res => {
      if (res.payload && res.payload.data && res.payload.data.status == 200) {
        console.log('offer updated successfully.');
        this.props.updatePageWithLatestdata(this.props.eventId);
      }
    });
    this.setPromptFlagFalse();
    // offer.isEdit = false;
    // this.updateOfferList();
  };

  renderOffer = (offer, offerIndex) => {
    return (
      <div className="discount-coupon discountOffer" key={offerIndex}>
        <div className="couponLabel offerLabel">
          <label>
            {/* Early Bird <br /> Discount */}
            Offers
          </label>
        </div>
        <div className="registerLock">
          <div className="actionBtn">
            <a
              href="javascript:void(0);"
              onClick={() => this.showDeleteAlert(offer)}
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
                this.onClickEdit(offer);
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
            {/* Register before 30 May,2018 to receive 30% off on registration */}
            {/* {`Register before ${moment(offer.applicableTillDate).format(
              'DD MMM, YYYY'
            )} to receive ${offer.discountPercentage}% off on registration`} */}

            {offer.description}
          </p>
          <ul className="regtimeLock">
            <li>
              <p className="yellow">Start Date</p>
              <p>
                {moment(offer.applicableFromDate).format('DD-MM-YYYY')}

                {/* 21-02-2018 */}
              </p>
            </li>
            <li>
              <p className="yellow">End Date</p>
              <p>
                {moment(offer.applicableTillDate).format('DD-MM-YYYY')}

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
  showEditFromDate = offer => {
    offer.showFromDatePicker = true;
    this.updateOfferList();
  };

  handleEditFromDate = (value, dateValue, event, offer) => {
    let zoneDate = this.getDateTimeInZoneFormat(
      moment(dateValue).format('YYYY-MM-DD')
    );

    if (zoneDate > offer.applicableTillDate) {
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
      showWarningToast('Offer can not be created on past date');
      return;
    }
    this.setPromptFlag();

    let selectedDateWithCurrentZone = moment(
      moment(dateValue).format('YYYY-MM-DD')
    ).valueOf();

    offer.applicableFromDate = selectedDateWithCurrentZone; //zoneDate;
    this.updateOfferList();
  };

  handleVisibilityEditFromDate = (visible, offer) => {
    offer.showFromDatePicker = false;
    this.updateOfferList();
  };

  ////////////////////////////////////////////////////////////////
  showEditToDate = offer => {
    offer.showToDatePicker = true;
    this.updateOfferList();
  };

  handleEditToDate = (value, dateValue, event, offer) => {
    let zoneDate = this.getDateTimeInZoneFormat(
      moment(dateValue).format('YYYY-MM-DD')
    );

    let currentDate = moment(moment().format('YYYY-MM-DD')).valueOf();
    let selectedDateWithCurrentTimeZone = moment(
      moment(dateValue).format('YYYY-MM-DD')
    ).valueOf();
    if (selectedDateWithCurrentTimeZone < currentDate) {
      showWarningToast('Offer can not be created on past date');
      return;
    }

    if (selectedDateWithCurrentTimeZone < offer.applicableFromDate) {
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

    this.setPromptFlag();
    offer.applicableTillDate = selectedDateWithCurrentZone; //zoneDate;
    this.updateOfferList();
  };

  handleVisibilityEditToDate = (visible, offer) => {
    offer.showToDatePicker = false;
    this.updateOfferList();
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  onEditPercent = (event, offer) => {
    this.setPromptFlag();
    let value = event.target.value;
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      let val = parseInt(value);
      if (val > 100) return;
      offer.discountPercentage = value;
      this.updateOfferList();
    }
  };

  onEditMinPerson = (event, offer) => {
    this.setPromptFlag();
    let value = event.target.value;
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      offer.minAllowedUser = event.target.value;
      this.updateOfferList();
    }
  };

  onEditMaxPerson = (event, offer) => {
    this.setPromptFlag();
    let value = event.target.value;
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      offer.maxAllowedUser = event.target.value;
      this.updateOfferList();
    }
  };

  //////////////////
  renderEditOffer = (offer, offerIndex) => {
    return (
      <div className="discountsMore">
        {/* <div className="row">
          <div className="col-md-8">
            <div className="form-group">
              <label htmlFor="usr">Description</label>
              <textarea
                className="form-control textarea-control"
                rows="2"
                id="comment"
                placeholder="Description"
                name="description"
                value={offer.description}
                maxLength="100"
                onChange={event => {
                  offer.description = event.target.value;
                  this.updateOfferList();
                }}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="usr">percent</label>
              <input
                type="text"
                className="form-control input-control"
                placeholder="percent"
                maxLength="3"
                name="percent"
                value={offer.discountPercentage}
                onChange={event => {
                  this.onEditPercent(event, offer);
                }}
              />
            </div>
          </div>
        </div> */}

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
                    offer.applicableFromDate
                      ? moment(offer.applicableFromDate).format('MMMM DD, YYYY')
                      : ''
                  }
                  onClick={event => {
                    this.showEditFromDate(offer);
                  }}
                  readOnly
                  style={{ backgroundColor: '#fff' }}
                />

                <DatePicker
                  // id="date-picker-controlled"
                  label="Select date"
                  visible={offer.showFromDatePicker}
                  className="md-cell cls-discount-datepicker"
                  textFieldClassName="hide"
                  autoOk={true}
                  value={
                    offer.applicableFromDate
                      ? moment(offer.applicableFromDate).toDate()
                      : null
                  }
                  onChange={(value, dateValue, event) =>
                    this.handleEditFromDate(value, dateValue, event, offer)
                  }
                  onVisibilityChange={visible =>
                    this.handleVisibilityEditFromDate(visible, offer)
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
                    offer.applicableTillDate
                      ? moment(offer.applicableTillDate).format('MMMM DD, YYYY')
                      : ''
                  }
                  onClick={event => {
                    this.showEditToDate(offer);
                  }}
                  readOnly
                  style={{ backgroundColor: '#fff' }}
                />

                <DatePicker
                  // id="date-picker-controlled"
                  label="Select date"
                  visible={offer.showToDatePicker}
                  className="md-cell cls-discount-datepicker"
                  textFieldClassName="hide"
                  autoOk={true}
                  value={
                    offer.applicableTillDate
                      ? moment(offer.applicableTillDate).toDate()
                      : null
                  }
                  onChange={(value, dateValue, event) =>
                    this.handleEditToDate(value, dateValue, event, offer)
                  }
                  onVisibilityChange={visible =>
                    this.handleVisibilityEditToDate(visible, offer)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-20">
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="usr">Discount(%)</label>
              <input
                type="text"
                className="form-control input-control"
                placeholder="Discount"
                name="discountPercentage"
                value={offer.discountPercentage}
                maxLength="2"
                onChange={event => {
                  this.onEditPercent(event, offer);
                }}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="usr">Min Members</label>
              <input
                type="text"
                className="form-control input-control"
                placeholder="Min Members"
                name="minAllowedUser"
                value={offer.minAllowedUser}
                maxLength="2"
                onChange={event => {
                  this.onEditMinPerson(event, offer);
                }}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label htmlFor="usr"> Max Members</label>
              <input
                type="text"
                className="form-control input-control"
                placeholder="Max Members"
                name="maxAllowedUser"
                value={offer.maxAllowedUser}
                maxLength="2"
                onChange={event => {
                  this.onEditMaxPerson(event, offer);
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
                id="comment"
                placeholder="Description"
                name="description"
                value={offer.description}
                maxLength="100"
                onChange={event => {
                  offer.description = event.target.value;
                  this.updateOfferList();
                  this.setPromptFlag();
                }}
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-20">
          <a
            onClick={() => {
              this.onUpdate(offer);
            }}
            className="btn btnSuccess btnAdd ripple"
          >
            UPDATE
          </a>
          {'  '}
          <a
            onClick={() => {
              this.onCancle(offer);
            }}
            className="btn btnCancel btnAdd ripple"
          >
            CANCEL
          </a>
        </div>
      </div>
    );
  };
}

// export default Offers;

function mapStateToProps(state) {
  return {
    discount: state.discount
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actionCreateOffer,
      actionDeleteOffer,
      actionUpdateOffer
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Offers);
