import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ErrorToaster, SuccessToaster } from '../toaster/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sendEnquiry } from '../action';
import SelectionList from '../core/selectionList';

var statusOptions = [
  {
    value: 'Industrial and manufacturing',
    label: 'Industrial and manufacturing'
  },
  {
    value: 'Business and Financial Operations',
    label: 'Business and Financial Operations'
  },
  { value: 'Computer and Mathematical', label: 'Computer and Mathematical' },
  {
    value: 'Architecture and Engineering',
    label: 'Architecture and Engineering'
  },
  {
    value: 'Life, Physical, and Social Science',
    label: 'Life, Physical, and Social Science'
  },
  {
    value: 'Community and Social Service',
    label: 'Community and Social Service'
  },
  { value: 'Legal', label: 'Legal' },
  {
    value: 'Law Enforcement and Armed Forces',
    label: 'Law Enforcement and Armed Forces'
  },
  {
    value: 'Education, Training, and Library',
    label: 'Education, Training, and Library'
  },
  { value: 'Science and technology', label: 'Science and technology' },
  {
    value: 'Arts, Design, Entertainment, Sports, and Media',
    label: 'Arts, Design, Entertainment, Sports, and Media'
  },
  {
    value: 'Healthcare Practitioners and Technical',
    label: 'Healthcare Practitioners and Technical'
  },
  { value: 'Protective Service', label: 'Protective Service' },
  {
    value: 'Food Preparation and Serving Related',
    label: 'Food Preparation and Serving Related'
  },
  {
    value: 'Building and Grounds Cleaning and Maintenance',
    label: 'Building and Grounds Cleaning and Maintenance'
  },
  { value: 'Personal Care and Service', label: 'Personal Care and Service' },
  { value: 'Sales and Related', label: 'Sales and Related' },
  {
    value: 'Office and Administrative Support',
    label: 'Office and Administrative Support'
  },
  {
    value: 'Farming, Fishing, and Forestry',
    label: 'Farming, Fishing, and Forestry'
  },
  {
    value: 'Construction and Extraction',
    label: 'Construction and Extraction'
  },
  {
    value: 'Installation, Maintenance, and Repair',
    label: 'Installation, Maintenance, and Repair'
  },
  { value: 'Transportation', label: 'Transportation' }
];

const customContentStyle = {
  width: '100%',
  maxWidth: 'none'
};

class ContactForm extends Component {
  state = {
    name: '',
    email: '',
    subject: '',
    profession: '',
    message: '',
    nameFieldError: false,
    emailFieldError: false,
    subjectFieldError: false,
    professionFieldError: false,
    messageFieldError: false,
    openBusinessList: false
  };

  handleApiError(errorMessage) {
    toast.error(<ErrorToaster message={errorMessage} />, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true
    });
  }

  showSuccessToast(message) {
    toast.success(<SuccessToaster message={message} />, {
      position: toast.POSITION.TOP_RIGHT,
      hideProgressBar: true
    });
  }

  onChangeHandler(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value
    });
    if (value) {
      this.setState({
        [name + 'FieldError']: false
      });
    }
    if (!value) {
      this.setState({
        [name + 'FieldError']: true
      });
    }
  }

  onBlurHandler(event) {
    let name = event.target.name;
    let value = event.target.value;
    if (!value) {
      this.setState({
        [name + 'FieldError']: true
      });
    }
  }

  professionChange(profession) {
    if (profession) {
      this.setState({
        profession: profession.value,
        professionFieldError: false
      });
    } else {
      this.setState({ profession: '', professionFieldError: true });
    }
  }

  onSubmitHandler() {
    let fieldsName = ['name', 'email', 'subject', 'profession', 'message'];
    for (let key in fieldsName) {
      //if (!this.state[fieldsName[key]]) {
      if (!this.state[fieldsName[key]].toString().trim().length) {
        this.setState({
          [fieldsName[key] + 'FieldError']: true
        });
        this.handleApiError(
          fieldsName[key].charAt(0).toUpperCase() +
            fieldsName[key].slice(1) +
            ' is required'
        );
        return;
      }
    }
    if (this.state.email) {
      const regExp = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

      if (!regExp.test(this.state.email)) {
        this.setState({
          emailFieldError: true
        });
        this.handleApiError('Email is not valid.');
        return;
      }
    }
    let formData = {
      name: this.state.name,
      email: this.state.email,
      querySubject: this.state.subject,
      profession: this.state.profession,
      description: this.state.message
    };
    this.props.sendEnquiry(formData);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.enquiryResponse && nextProps.enquiryResponse.status === 200) {
      this.setState({
        name: '',
        email: '',
        subject: '',
        profession: '',
        message: '',
        professionFieldError: false
      });
    }
  }

  render() {
    return (
      <div className="footer-form">
        <form className="form-horizontal contac-form">
          <div className="form-group">
            <div
              className={
                this.state.nameFieldError ? 'col-sm-6 field-error' : 'col-sm-6'
              }
            >
              <input
                type="text"
                className="form-control contact_username"
                placeholder="Name"
                name="name"
                value={this.state.name}
                onChange={this.onChangeHandler.bind(this)}
                onBlur={this.onBlurHandler.bind(this)}
                maxLength="100"
              />
            </div>
            <div
              className={
                this.state.emailFieldError ? 'col-sm-6 field-error' : 'col-sm-6'
              }
            >
              <input
                type="email"
                className="form-control contact_email"
                id="email"
                placeholder="Email"
                name="email"
                value={this.state.email}
                onChange={this.onChangeHandler.bind(this)}
                onBlur={this.onBlurHandler.bind(this)}
                maxLength="100"
              />
            </div>
            <div
              className={
                this.state.subjectFieldError
                  ? 'col-sm-6 field-error'
                  : 'col-sm-6'
              }
            >
              <input
                type="text"
                className="form-control contact_no"
                id="subject"
                placeholder="Subject"
                name="subject"
                value={this.state.subject}
                onChange={this.onChangeHandler.bind(this)}
                onBlur={this.onBlurHandler.bind(this)}
                maxLength="100"
                onFocus={event => {
                  this.setState({
                    openBusinessList: false
                  });
                }}
                onKeyDown={e => {
                  let keyCode = e.keyCode || e.which;
                  if (keyCode === 9) {
                    //Open business drop down
                    this.setState({
                      openBusinessList: true
                    });
                  }
                }}
              />
            </div>
            <div
              className={
                this.state.professionFieldError
                  ? 'col-sm-6 field-error'
                  : 'col-sm-6'
              }
            >
              <SelectionList
                data={statusOptions}
                name="profession"
                value={this.state.profession}
                onChange={this.professionChange.bind(this)}
                placeholder="Profession"
                open={this.state.openBusinessList}
              />
              <i className="arrow down" />
            </div>
            <div
              className={
                this.state.messageFieldError
                  ? 'col-sm-12 field-error'
                  : 'col-sm-12'
              }
            >
              <textarea
                className="form-control textarea-control"
                rows="2"
                id="comment"
                placeholder="Message"
                name="message"
                value={this.state.message}
                onChange={this.onChangeHandler.bind(this)}
                maxLength="250"
                onKeyDown={() => {
                  //Close business drop down
                  this.setState({
                    openBusinessList: false
                  });
                }}
                onBlur={e => {
                  this.onBlurHandler.bind(this);
                  //Close business drop down
                  this.setState({
                    openBusinessList: false
                  });
                }}
              />
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ublue ripple"
            onClick={this.onSubmitHandler.bind(this)}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      sendEnquiry
    },
    dispatch
  );
}
function mapStateToProps(state) {
  return {
    enquiryResponse: state.enquiryResponse.enquiry
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);
