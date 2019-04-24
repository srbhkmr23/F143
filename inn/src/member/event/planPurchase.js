import React, { Component } from 'react';

import '../../css/style.css';
import logo from '../../img/innovecsyslogoblack.png';
import lights from '../../img/lights.jpg';
import imgMother from '../../img/mother.jpg';
import imgAdminUser from '../../img/admin-user.png';
import Sprite from '../../img/sprite.svg';
// import event_1 from '../../img/event_1.jpg';

class PlanPurchase extends Component {
  constructor(props) {
    super(props);
    this.navigateByUrlName = this.navigateByUrlName.bind(this);
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  render() {
    return (
      <div className="bg-dark h-100">
        <section className="h-100">
          <div className="container">
            <div className="price-heading text-center">
              <h3 className="pricingTitle">Plans and Pricing</h3>
              <p className="text-dark">Unlock access to Innovecsys</p>
            </div>

            <div className="pricingWrapper">
              <div className="row">
                <div className="col-sm-4">
                  <div className="planPriceCard gal-eff mt-25">
                    <div className="plan-header">
                      <h2>Basic Free</h2>
                    </div>

                    <div className="price">
                      <span>$</span>
                      <span>10</span>
                      <span>/month</span>
                    </div>

                    <div className="planDetails">
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Track income & expensens</p>
                      </div>
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Maximize tax dedutions </p>
                      </div>
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Invoice & accept payments</p>
                      </div>
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Run reports</p>
                      </div>
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Send estimates</p>
                      </div>
                    </div>
                    <div className="footer-btn">
                      <button
                        className="btn btn-dark o-border pull-left ripple"
                        type="button"
                      >
                        BUY THIS PLAN
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="planPriceCard active gal-eff">
                    <div className="plan-header">
                      <h2>Paid</h2>
                    </div>

                    <div className="price">
                      <span>$</span>
                      <span>100</span>
                      <span>/month</span>
                    </div>

                    <div className="planDetails">
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Track income & expensens</p>
                      </div>
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Maximize tax dedutions </p>
                      </div>
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Invoice & accept payments</p>
                      </div>
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Run reports</p>
                      </div>
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Send estimates</p>
                      </div>
                    </div>

                    <div className="selectPlan">
                      <span>
                        <input
                          id="radio-1"
                          className="radio-custom"
                          name="radio-group"
                          type="radio"
                        />
                        <label for="radio-1" className="radio-custom-label">
                          Monthly
                        </label>
                      </span>
                      <span>
                        <input
                          id="radio-2"
                          className="radio-custom"
                          name="radio-group"
                          type="radio"
                          checked
                        />
                        <label for="radio-2" className="radio-custom-label">
                          Yearly
                        </label>
                      </span>
                    </div>

                    <div className="footer-btn">
                      <button
                        className="btn btn-dark o-border pull-left ripple"
                        type="button"
                      >
                        BUY THIS PLAN
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="planPriceCard gal-eff mt-25">
                    <div className="plan-header">
                      <h2>Enterprise</h2>
                    </div>

                    <div className="price">
                      <span>$</span>
                      <span>300</span>
                      <span>/just once</span>
                    </div>

                    <div className="planDetails">
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Track income & expensens</p>
                      </div>
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Maximize tax dedutions </p>
                      </div>
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Invoice & accept payments</p>
                      </div>
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use href={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Run reports</p>
                      </div>
                      <div className="planOffers">
                        <span className="ico-rightplanPurchase">
                          <svg>
                            <use xlinkHref={`${Sprite}#rightplanPurchaseIco`} />
                          </svg>
                        </span>
                        <p>Send estimates</p>
                      </div>
                    </div>

                    <div className="footer-btn">
                      <button
                        className="btn btn-dark o-border pull-left ripple"
                        type="button"
                      >
                        BUY THIS PLAN
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default PlanPurchase;
