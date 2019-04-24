import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="videoBox">
        <div style={{ margin: '20px 20px 20px 20px' }}>
          <Link to="/" className="btn btn-info">
            BACK TO HOME
          </Link>
        </div>

        <div className="errorMsgBox">
          <h2>ERROR! 404</h2>
          <p>PAGE NOT FOUND</p>
          <p style={{ fontSize: '16px' }}>WHERE ARE THE CARROTS?</p>
        </div>

        <video width="400" autoPlay loop>
          <source src="media/bunny-404.mp4" type="video/mp4" /> Your browser
          does not support HTML5 video.
        </video>
      </div>
    );
  }
}

export default ErrorPage;
