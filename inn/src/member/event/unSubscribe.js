import React, { Component } from 'react';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
import { bindActionCreators } from 'redux';
import { actionUnsubscribe } from '../../common/action/index';

class UnSubscribe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offEmailForThisEvent: '',
      offForThisCategory: '',
      offEmailFromInnovecsys: '',
      token: '',
      eventId: '',
      selectedName: ''
    };
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
  }

  componentWillMount() {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const token = params.get('token') || '';
    const eventId = params.get('eventId') || '';

    this.setState({
      token,
      eventId
    });
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  onSelect = name => {
    switch (name) {
      case 'event':
        this.setState({
          offEmailForThisEvent: true,
          offForThisCategory: false,
          offEmailFromInnovecsys: false,
          selectedName: name
        });
        break;
      case 'category':
        this.setState({
          offEmailForThisEvent: false,
          offForThisCategory: true,
          offEmailFromInnovecsys: false,
          selectedName: name
        });
        break;
      case 'innovecsys':
        this.setState({
          offEmailForThisEvent: false,
          offForThisCategory: false,
          offEmailFromInnovecsys: true,
          selectedName: name
        });
        break;
    }
  };

  onClickUnsubscribe = () => {
    let sendObject = {};
    // sendObject = {
    //   offEmailFromInnovecsys: this.state.offEmailFromInnovecsys,
    //   offForThisCategory: this.state.offForThisCategory,
    //   offEmailForThisEvent: this.state.offEmailForThisEvent,
    //   token: this.state.token,
    //   eventId: this.state.eventId
    // };

    sendObject = {
      token: this.state.token,
      eventId: this.state.eventId
    };

    try {
      if (this.state.offEmailFromInnovecsys == true) {
        sendObject['offEmailFromInnovecsys'] = true;
      }

      if (this.state.offForThisCategory == true) {
        sendObject['offForThisCategory'] = true;
      }

      if (this.state.offEmailForThisEvent == true) {
        sendObject['offEmailForThisEvent'] = true;
      }
    } catch (err) {
      console.log(err);
    }

    this.props.actionUnsubscribe(sendObject).then(res => {
      if (res.payload && res.payload.data && res.payload.data.resourceData) {
        this.navigateByUrlName('/login');
      }
    });
  };

  render() {
    return (
      <div id="" className="main unsubscribeSec">
        <div className="content-center h-100">
          <div className="unsubscribe-Div ">
            <div className="header">{/* <i className="fa fa-close" /> */}</div>
            <div className="chooseUnsubscribe">
              <input
                id="radio-1"
                className="radio-custom"
                name="radio-group"
                type="radio"
                checked={this.state.selectedName == 'event'}
                onClick={() => this.onSelect('event')}
              />
              <label for="radio-1" className="radio-custom-label">
                Unsubscribe to this event.
              </label>
            </div>
            <div className="chooseUnsubscribe">
              <input
                id="radio-2"
                className="radio-custom"
                name="radio-group"
                type="radio"
                checked={this.state.selectedName == 'category'}
                onClick={() => this.onSelect('category')}
              />
              <label for="radio-2" className="radio-custom-label">
                Unsubscribe to all events into this category.
              </label>
            </div>
            <div className="chooseUnsubscribe">
              <input
                id="radio-3"
                className="radio-custom"
                name="radio-group"
                type="radio"
                checked={this.state.selectedName == 'innovecsys'}
                onClick={() => this.onSelect('innovecsys')}
              />
              <label for="radio-3" className="radio-custom-label">
                Unsubscribe to any emails from innovecsys.
              </label>
            </div>
            <p className="text-center">
              <a
                href="javascript:void(0);"
                className="btn btnSuccess btnSave"
                onClick={() => {
                  this.onClickUnsubscribe();
                }}
              >
                Done
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
// export default UnSubscribe;

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators({ actionUnsubscribe }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UnSubscribe);
