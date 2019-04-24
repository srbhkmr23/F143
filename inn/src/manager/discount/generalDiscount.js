import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Prompt } from 'react-router';

import {
  actionCreateGeneralDiscount,
  actionUpdateGeneralDiscount,
  actionDeleteGeneralDiscount
} from '../../common/action/index';

import { showWarningToast } from '../../common/core/common-functions';
import AlertModal from '../../common/alert-box/alert-modal';
import Sprite from '../../img/sprite.svg';

class GeneralDiscount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      discountList: [],
      delegateType: '',
      companyDiscount: '',
      innovecsysDiscount: '',
      totalDiscount: '',
      editMode: false,
      editInfo: '',
      showDeleteModal: false,
      deleteDiscount: {},
      prompt: false
    };
  }

  componentWillReceiveProps(res) {
    console.log('res======>', res);
    this.state.discountList = res.parentDiscountList || [];
  }

  componentDidMount() {
    console.log('res======>', this.props);
    this.state.discountList = this.props.parentDiscountList || [];
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

  handleUserAlphabetInput(e) {
    this.setPromptFlag();
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  handleUserNumericInput(e) {
    this.setPromptFlag();
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      let val = parseInt(value);
      if (val > 100) return;
      this.setState({
        [name]: value
      });
    }
  }

  updateTotalDiscount = () => {
    let totalDiscount = 0;
    let comDis = parseInt(this.state.companyDiscount) || 0;
    let innDis = parseInt(this.state.innovecsysDiscount) || 0;
    totalDiscount = comDis + innDis;
    this.setState({
      ['totalDiscount']: totalDiscount
    });
  };

  onAddNewDiscount = () => {
    if (
      this.state.delegateType.trim() == '' ||
      this.state.companyDiscount.trim() == '' ||
      this.state.innovecsysDiscount.trim() == '' ||
      this.state.totalDiscount == 0
    ) {
      showWarningToast('Fields can not be empty');
      return;
    }

    let totalDisc =
      parseInt(this.state.companyDiscount.trim()) +
      parseInt(this.state.innovecsysDiscount.trim());

    if (totalDisc > 100) {
      showWarningToast('Total discount can not more then 100%');
      return;
    }

    //   "applicableDiscounts": [
    //     {
    //       "id": "string",
    //       "delgateType": "string",
    //       "ownerDiscountPercentage": 0,
    //       "innovecsysDiscountPercentage": 0,
    //       "createdByUserId": "string",
    //       "applicableInZones": [
    //         "string"
    //       ]
    //     }
    //   ]
    this.setPromptFlagFalse();
    let newDiscount = {};
    newDiscount = {
      delegateType: this.state.delegateType.trim(),
      ownerDiscountPercentage: parseInt(this.state.companyDiscount.trim()),
      innovecsysDiscountPercentage: parseInt(
        this.state.innovecsysDiscount.trim()
      ),
      createdByUserId: this.props.userId
    };
    let discountList = this.state.discountList;

    newDiscount['eventId'] = this.props.eventId;

    this.props.actionCreateGeneralDiscount(newDiscount).then(res => {
      if (res.payload && res.payload.data && res.payload.data.status == 200) {
        console.log('discount Create successfully.');
        this.props.updatePageWithLatestdata(this.props.eventId);
        this.setState({
          delegateType: '',
          companyDiscount: '',
          innovecsysDiscount: '',
          totalDiscount: ''
        });
      }
    });

    // discountList.push(newDiscount);
    // this.setState({
    //   discountList,
    //   delegateType: '',
    //   companyDiscount: '',
    //   innovecsysDiscount: '',
    //   totalDiscount: ''
    // });
  };

  onDeleteDiscount = discount => {
    // let discountList = this.state.discountList;
    // let index = discountList.indexOf(discount);
    // discountList.splice(index, 1);
    // this.setState({ discountList });

    let sendObj = {
      eventId: this.props.eventId,
      discountId: discount.id
    };

    this.props.actionDeleteGeneralDiscount(sendObj).then(res => {
      if (res.payload && res.payload.data && res.payload.data.status == 200) {
        console.log('discount deleted successfully.');
        this.props.updatePageWithLatestdata(this.props.eventId);
      }
    });
  };

  showDeleteAlert = discount => {
    this.setState({
      showDeleteModal: true,
      deleteDiscount: discount
    });
  };

  onEditDiscount = editDiscount => {
    this.setPromptFlagFalse();
    this.setState({
      editMode: true,
      editInfo: editDiscount,
      delegateType: editDiscount.delegateType,
      companyDiscount: editDiscount.ownerDiscountPercentage.toString(),
      innovecsysDiscount: editDiscount.innovecsysDiscountPercentage.toString(),
      totalDiscount:
        editDiscount.ownerDiscountPercentage +
        editDiscount.innovecsysDiscountPercentage
    });
  };

  onEditDiscountSave = () => {
    this.setPromptFlagFalse();
    if (
      this.state.delegateType.trim() == '' ||
      this.state.companyDiscount.trim() == '' ||
      this.state.innovecsysDiscount.trim() == '' ||
      this.state.totalDiscount == 0
    ) {
      showWarningToast('Fields can not be empty');
      return;
    }

    let totalDisc =
      parseInt(this.state.companyDiscount.trim()) +
      parseInt(this.state.innovecsysDiscount.trim());

    if (totalDisc > 100) {
      showWarningToast('Total discount can not more then 100%');
      return;
    }

    this.state.editInfo.delegateType = this.state.delegateType.trim();
    this.state.editInfo.ownerDiscountPercentage = parseInt(
      this.state.companyDiscount.trim()
    );
    this.state.editInfo.innovecsysDiscountPercentage = parseInt(
      this.state.innovecsysDiscount.trim()
    );

    let sendObj = JSON.parse(JSON.stringify(this.state.editInfo));
    sendObj['createdByUserId'] = this.props.userId;
    this.props.actionUpdateGeneralDiscount(sendObj).then(res => {
      if (res.payload && res.payload.data && res.payload.data.status == 200) {
        console.log('coupon updated successfully.');
        this.props.updatePageWithLatestdata(this.props.eventId);
        this.resetFields();
      }
    });

    // this.setState(
    //   { discountList: this.state.discountList, editMode: false },
    //   () => {
    //     this.resetFields();
    //   }
    // );
  };

  onRevert = () => {
    this.setPromptFlagFalse();
    this.setState({
      delegateType: '',
      companyDiscount: '',
      innovecsysDiscount: '',
      totalDiscount: '',
      editMode: false
    });
  };

  resetFields = () => {
    this.setState({
      delegateType: '',
      companyDiscount: '',
      innovecsysDiscount: '',
      totalDiscount: '',
      editMode: false
    });
  };

  hideDeleteModal = () => {
    this.setState({
      showDeleteModal: false
    });
  };

  render() {
    if (this.props.showGeneral == true) {
      return (
        <div className="table-responsive">
          <Prompt
            when={this.state.prompt}
            message="You may lost any unsaved data, click cancel to stay on the same screen and click on next button  to save the changes."
          />
          <table className="discountTable table form-card">
            <thead>
              <tr>
                <th>Delegate Type</th>
                <th>Company Discount(%)</th>
                <th>Innovecsys Discount(%)</th>
                <th className="hide">Total Discount(%)</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="width-40p">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control input-control"
                      // placeholder="Delegate Type"
                      name="delegateType"
                      value={this.state.delegateType}
                      maxLength="50"
                      onChange={this.handleUserAlphabetInput.bind(this)}
                    />
                  </div>
                </td>
                <td className="width-17p">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control input-control"
                      // placeholder="30%"
                      name="companyDiscount"
                      value={this.state.companyDiscount}
                      maxLength="50"
                      onChange={this.handleUserNumericInput.bind(this)}
                      onKeyUp={() => this.updateTotalDiscount()}
                    />
                  </div>
                </td>
                <td className="width-17p">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control input-control"
                      // placeholder="10%"
                      name="innovecsysDiscount"
                      value={this.state.innovecsysDiscount}
                      maxLength="50"
                      onChange={this.handleUserNumericInput.bind(this)}
                      onKeyUp={() => this.updateTotalDiscount()}
                    />
                  </div>
                </td>
                <td className="width-17p hide">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control input-control"
                      placeholder=""
                      name="totalDiscount"
                      readOnly
                      value={this.state.totalDiscount}
                    />
                  </div>
                </td>
                <td className="width-9p">
                  {/* <a href="javascript:void(0)" className="listdelete">
                                  <span className="ico-close">
                                  <svg>
                                      <use xlinkHref={`${Sprite}#closeIco`} />
                                  </svg>
                                  </span>
                              </a> */}

                  {this.state.editMode == false ? (
                    <a
                      className="btn btnSuccess btnAdd"
                      onClick={() => this.onAddNewDiscount()}
                    >
                      <i className="fa fa-plus" />
                    </a>
                  ) : (
                    <span>
                      <a
                        onClick={() => this.onEditDiscountSave()}
                        className="btn btnSuccess btnAdd"
                      >
                        <i className="fa fa-check" />{' '}
                      </a>
                      <a
                        onClick={() => this.onRevert()}
                        className="btn btnSuccess btnAdd"
                      >
                        <i className="fa fa-reply" />{' '}
                      </a>
                    </span>
                  )}
                </td>
              </tr>

              {this.state.discountList.map((discount, discountIndex) => {
                return (
                  <tr key={discountIndex}>
                    <td>{discount.delegateType}</td>
                    <td>{discount.ownerDiscountPercentage}</td>
                    <td>{discount.innovecsysDiscountPercentage}</td>
                    <td className="hide">
                      {discount.ownerDiscountPercentage +
                        discount.innovecsysDiscountPercentage}
                    </td>
                    <td className="editLinksForTable">
                      {this.state.editMode == true &&
                      this.state.editInfo.id == discount.id ? null : (
                        <a href="javascript:void(0);" className="">
                          <span
                            onClick={() => {
                              this.showDeleteAlert(discount);
                            }}
                            className="ico-delete"
                          >
                            <svg>
                              <use xlinkHref={`${Sprite}#deleteIco`} />
                            </svg>
                          </span>
                        </a>
                      )}

                      <a href="javascript:void(0);" className="ml-5">
                        <span
                          onClick={() => {
                            this.onEditDiscount(discount);
                          }}
                          className="ico-pen"
                        >
                          <svg>
                            <use xlinkHref={`${Sprite}#penIco`} />
                          </svg>
                        </span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <AlertModal
            confirmedMe={() => this.onDeleteDiscount(this.state.deleteDiscount)}
            eventType="delete"
            customClass="deleteIconDiv"
            alertMessage="Are you sure you want to delete?"
            showDeleteModal={this.state.showDeleteModal}
            hideDeleteModal={this.hideDeleteModal}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

// export default GeneralDiscount;

function mapStateToProps(state) {
  return {
    discount: state.discount
  };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actionCreateGeneralDiscount,
      actionUpdateGeneralDiscount,
      actionDeleteGeneralDiscount
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralDiscount);
