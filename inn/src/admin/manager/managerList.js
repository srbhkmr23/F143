import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllManagers } from '../../common/action/index';
import { bindActionCreators } from 'redux';
import AlertModal from '../../common/alert-box/alert-modal';
import $ from 'jquery';
import classNames from 'classnames';
import innovecsysApiService from '../../common/core/api';
import {
  showWarningToast,
  showSuccessToast
} from '../../common/core/common-functions';

import AlphabeticalFilter from '../common/alphabeticalFilter';
import SearchFilter from '../common/searchFilter';

import Sprite from '../../img/sprite.svg';

class ManagerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allManagerList: [],
      managerList: [],
      filteredManager: [],
      search: '',
      clickedManagerId: '',
      firstname: '',
      lastname: '',
      email: '',
      mobile: '',
      showDeleteModal: false,
      editMode: false,
      editUserInfo: '',
      showInviteModal: false,
      inviteUserInfo: ''
    };
    this.onDeleteEvent = this.onDeleteEvent.bind(this);
    this.hideDeleteModal = this.hideDeleteModal.bind(this);
    this.onEditUser = this.onEditUser.bind(this);
    this.onResendInvitation = this.onResendInvitation.bind(this);
  }

  componentWillMount() {
    this.getAllManagersList();
  }

  getAllManagersList() {
    this.props.getAllManagers().then(res => {
      console.log(res);
      this.setState({
        allManagerList: this.props.managers.all || [],
        managerList: this.props.managers.all
      });
    });
  }

  showAlert(managerId) {
    console.log(managerId);
    this.setState({
      showDeleteModal: true,
      clickedManagerId: managerId
    });
  }

  onDeleteEvent() {
    if (this.state.clickedManagerId) {
      console.log(this.state.clickedManagerId);
      let managerId = this.state.clickedManagerId;
      innovecsysApiService('deleteManager', { managerId }).then(result => {
        if (result.data && result.data.status && result.data.status === 200) {
          if (result.data.responseMessage) {
            const message = result.data.responseMessage;
          }
          //Call manager list after delete success
          this.getAllManagersList();
        }
      });
    }
  }

  onEditUser(userInfo) {
    console.log('userInfo', userInfo);
    this.setState({
      editMode: true,
      editUserInfo: userInfo,
      firstname: userInfo.firstName,
      lastname: userInfo.lastName,
      email: userInfo.email,
      mobile: userInfo.mobile
    });
  }

  hideDeleteModal = () => {
    this.setState({
      showDeleteModal: false
    });
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  handleUserAlphabetInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[a-zA-Z\s]*$/);
    if (value === '' || regExp.test(value) === true) {
      this.setState({ [name]: value });
    }
  }

  handleUserInputWithFirstCapital(e) {
    const name = e.target.name;
    let value = e.target.value;
    value = value.charAt(0).toUpperCase() + value.slice(1);
    this.setState({ [name]: value });
  }

  handleUserNumericInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[0-9]+\.?[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      this.setState({ [name]: value });
    }
  }

  handleMobileInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    const regExp = new RegExp(/^[0-9]*$/);
    if (value === '' || regExp.test(value) === true) {
      this.setState({ [name]: value });
    }
  }

  handleSubmit() {
    this.state.firstname.toString().trim() == '' ||
      this.state.lastname.toString().trim() == '' ||
      this.state.email.toString().trim() == '' ||
      this.state.mobile.toString().trim() == '';

    if (
      this.state.firstname.toString().trim() == '' ||
      this.state.lastname.toString().trim() == '' ||
      this.state.email.toString().trim() == '' ||
      this.state.mobile.toString().trim() == ''
    ) {
      showWarningToast('Fields can not be empty');
      return;
    }

    if (this.state.email) {
      const regExp = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      if (!regExp.test(this.state.email)) {
        showWarningToast('Email is not valid.');
        return;
      }
    }

    if (this.state.mobile.toString().trim().length < 4) {
      let errMessage = 'Mobile number should be minimum 4 characters';
      showWarningToast(errMessage);
      return;
    }

    if (this.state.editMode) {
      //Code for edit user and update user info on server
      let sendDataObj = this.state.editUserInfo;

      sendDataObj.firstName = this.state.firstname;
      sendDataObj.lastName = this.state.lastname;
      sendDataObj.email = this.state.email;
      sendDataObj.mobile = this.state.mobile;
      sendDataObj.userId = this.state.editUserInfo.id;

      console.log(sendDataObj);

      var self = this;
      innovecsysApiService('updateUser', sendDataObj).then(response => {
        if (response != undefined) {
          if (response.data.status === 200) {
            self.setState({
              firstname: '',
              lastname: '',
              email: '',
              mobile: '',
              editMode: false,
              editUserInfo: ''
            });
            self.getAllManagersList();
          } else {
          }
        }
      });
    } else if (this.props.userInfo && this.props.userInfo.id) {
      //Code for add user create new user on server
      let sendDataObj = {
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        email: this.state.email,
        mobile: this.state.mobile,
        creatorUserId: this.props.userInfo.id
      };

      let self = this;
      innovecsysApiService('addManager', sendDataObj).then(response => {
        if (response != undefined) {
          if (response.data.status == 200) {
            // showSuccessToast('User added successfully');
            self.setState({
              firstname: '',
              lastname: '',
              email: '',
              mobile: ''
            });
            self.getAllManagersList();
          } else {
          }
        }
      });
    } else {
      console.log('user id not found');
    }
  }

  isButtonEnable = () => {
    if (
      this.state.firstname.toString().trim() == '' ||
      this.state.lastname.toString().trim() == '' ||
      this.state.email.toString().trim() == '' ||
      this.state.mobile.toString().trim() == ''
    ) {
      return false;
    }

    return true;
  };

  onResendInvitation() {
    const userId = this.state.inviteUserInfo.id;
    const email = this.state.inviteUserInfo.email;

    innovecsysApiService('userResendInvitation', { userId, email }).then(
      response => {
        console.log('on onResendInvitation', response);
      }
    );
  }

  filteredManager = filteredData => {
    this.setState({
      managerList: filteredData
    });
    setTimeout(() => {
      this.setState({
        filteredManager: this.state.managerList,
        search: ''
      });
    }, 200);
  };

  searchManager = target => {
    let managerInialList = [];
    if (target.value) {
      managerInialList = this.state.filteredManager.length
        ? this.state.filteredManager
        : this.state.managerList;
      this.setState({
        managerList: managerInialList.filter(
          manager =>
            String(manager.firstName)
              .toLowerCase()
              .indexOf(String(target.value).toLowerCase()) != -1
        )
      });
    } else {
      this.setState({
        managerList: this.state.allManagerList || []
      });
    }
    setTimeout(() => {
      this.setState({
        filteredManager: managerInialList,
        search: target.value
      });
    }, 200);
    this.setState({
      search: target.value
    });
  };

  render() {
    return (
      <div id="" className="main-container">
        <div className="manage-Wrapper">
          <section className="membersList-sec">
            {/* AlphabeticalFilter start*/}
            <div className="row mb-30">
              <div className="managerSearch">
                <div className="col-md-8">
                  <AlphabeticalFilter
                    filterHandler={this.filteredManager}
                    filterFrom={this.state.allManagerList}
                    matchKey="firstName"
                  />
                </div>
                <div className="col-md-4">
                  <SearchFilter
                    handleChange={this.searchManager}
                    placeholder="Search Manager"
                  />
                </div>
              </div>
            </div>
            {/* AlphabeticalFilter end*/}

            <div className="row">
              <div className="col-sm-6">
                <div className="common-sub-heading">
                  <h3>Managers List</h3>
                </div>
              </div>
              <div className="col-sm-6">
                <p className="memberCount">
                  <span>{this.state.managerList.length}</span> managers
                </p>
              </div>
            </div>

            <div className="ml-Wrapper">
              <div className="table-responsive">
                <table className="memberListTable table">
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="firstname"
                            value={this.state.firstname}
                            maxLength="50"
                            onChange={this.handleUserInputWithFirstCapital.bind(
                              this
                            )}
                          />
                        </div>
                      </td>

                      <td>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="lastname"
                            maxLength="50"
                            value={this.state.lastname}
                            onChange={this.handleUserInputWithFirstCapital.bind(
                              this
                            )}
                          />
                        </div>
                      </td>

                      <td>
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleUserInput.bind(this)}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="mobile"
                            value={this.state.mobile}
                            maxLength="13"
                            onChange={this.handleMobileInput.bind(this)}
                          />
                        </div>
                      </td>
                      <td className="listAddtd">
                        <a
                          className="btn btnSuccess btnAdd"
                          onClick={this.handleSubmit.bind(this)}
                          className={classNames('btn btnSuccess btnAdd', {
                            disabledProp: this.isButtonEnable() == false
                          })}
                        >
                          <i
                            className={`fa ${
                              this.state.editMode ? 'fa-check' : 'fa-plus'
                            }`}
                          />
                        </a>
                        <a
                          className={`btn btnSuccess btnAdd ${
                            this.state.editMode ? '' : 'hide'
                          }`}
                          onClick={() => {
                            this.setState({
                              editMode: false,
                              editUserInfo: '',
                              firstname: '',
                              lastname: '',
                              email: '',
                              mobile: ''
                            });
                          }}
                        >
                          <i className="fa fa-reply" />
                        </a>
                      </td>
                    </tr>
                    {this.state.managerList.length > 0
                      ? this.state.managerList.map((item, index) => (
                          <tr key={item.id}>
                            <td>{item.firstName}</td>
                            <td>{item.lastName}</td>
                            <td>{item.email !== '' ? item.email : 'N/A'}</td>
                            <td>{item.mobile ? item.mobile : 'N/A'}</td>
                            <td>
                              <a
                                className=""
                                onClick={() => {
                                  const userInfo = item;
                                  this.setState({
                                    showInviteModal: true,
                                    inviteUserInfo: userInfo
                                  });
                                }}
                              >
                                <span className="ico-mailweb">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#mailwebIco`} />
                                  </svg>
                                </span>
                              </a>
                              <a
                                className=""
                                onClick={() => {
                                  const userInfo = item;
                                  this.onEditUser(userInfo);
                                }}
                              >
                                <span className="ico-pen">
                                  <svg>
                                    <use xlinkHref={`${Sprite}#penIco`} />
                                  </svg>
                                </span>
                              </a>
                              {this.state.editMode == true &&
                              this.state.editUserInfo &&
                              this.state.editUserInfo.id == item.id ? null : (
                                <a
                                  onClick={() => this.showAlert(item.id)}
                                  className="ml-5"
                                >
                                  <span className="ico-delete">
                                    <svg>
                                      <use xlinkHref={`${Sprite}#deleteIco`} />
                                    </svg>
                                  </span>
                                </a>
                              )}
                            </td>
                          </tr>
                        ))
                      : 'No managers available.'}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
        <AlertModal
          confirmedMe={this.onDeleteEvent}
          eventType="delete"
          customClass="deleteIconDiv"
          alertMessage="Are you sure you want to delete?"
          showDeleteModal={this.state.showDeleteModal}
          hideDeleteModal={this.hideDeleteModal}
        />

        <AlertModal
          confirmedMe={this.onResendInvitation}
          eventType="envelop"
          customClass="envelopIconDiv"
          alertMessage="Are you sure you want to send invitation?"
          showDeleteModal={this.state.showInviteModal}
          hideDeleteModal={() => {
            this.setState({
              showInviteModal: false,
              inviteUserInfo: ''
            });
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { managers: state.admin, userInfo: state.profileData };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      getAllManagers
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerList);
