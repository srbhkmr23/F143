import React, { Component } from 'react';
import ContactForm from './contactForm';

class Footer extends Component {
  state = {};

  render() {
    return (
      <footer className="footer" id="contactus">
        <div className="container">
          <div className="main-heading text-white">
            <span className="">CONNECT WITH US TO KNOW MORE</span>
            <h3 className="text-white fw-400">CONTACT US</h3>
          </div>
          <div className="footerContent">
            <div className="row">
              <div className="col-md-6">
                <p className="text-dark mb-30">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s,Lorem Ipsum is simply
                  dummy text of the printing and typesetting industry. Lorem
                  Ipsum has been the industry's standard dummy text ever since
                  the 1500s,
                </p>

                <ul className="social">
                  <li>
                    <a href="" className="text-white">
                      <i className="fa fa-linkedin lin" />
                    </a>
                  </li>
                  <li>
                    <a href="" className="text-white">
                      <i className="fa fa-twitter twt" />
                    </a>
                  </li>
                  <li>
                    <a href="" className="text-white">
                      <i className="fa fa-facebook fb" />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
