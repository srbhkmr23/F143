import React, { Component } from 'react';

export class ErrorToaster extends Component {
  render() {
    return (
      <div>
        <span className="error-cross-span">
          <i className="fa fa-times" />
        </span>{' '}
        <span>{this.props.message}</span>
      </div>
    );
  }
}

export class SuccessToaster extends Component {
  render() {
    return (
      <div>
        <span className="success-check-span">
          <i className="fa fa-check" />
        </span>{' '}
        <span>{this.props.message}</span>
      </div>
    );
  }
}

// Entered credentials are wrong. Please try again
