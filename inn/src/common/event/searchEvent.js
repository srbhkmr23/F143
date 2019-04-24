import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
import { ToastContainer } from 'react-toastify';
import LazyLoad from 'react-lazyload';
import Config from '../../common/core/config';

// import Loader from 'react-loaders'
// import { BeatLoader } from 'react-spinners';

import InfiniteScroll from 'react-infinite-scroller';
import { showWarningToast, displayThumbImage } from '../core/common-functions';
// import '../../css/style.css';

import {
  actionGetPublicUserEvents,
  actionMemberEventDetailsObject,
  showLoader,
  hideLoader
} from '../../common/action/index';

import imgEventDefault from '../../img/def_event.jpg';
import Sprite from '../../img/sprite.svg';
import Img from '../../common/core/img';

// import imgEventDefault from '../../img/loader.png';

class SearchEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventList: [],
      keyword: '',
      hasMoreItems: true,
      currentPage: 0,
      perPageData: 5,
      showLoader: false,
      bucketName: Config.S3BucketName,
      resizedBucketName: Config.S3ResizeBucketName,
      apiRequestPage: []
    };

    this.navigateByUrlName = this.navigateByUrlName.bind(this);
    this.handleEnterKeyUp = this.handleEnterKeyUp.bind(this);
    this.onSearchEvent = this.onSearchEvent.bind(this);
  }

  componentWillMount() {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const keyword = params.get('keyword');
    this.setState({ searchText: keyword });

    if (keyword == '' || keyword == undefined) return;

    this.setState({ keyword }, () => {
      this.onSearchEvent();
    });
  }

  componentWillUnmount() {
    window.redirectLocation = this.props.location;
  }

  navigateByUrlName(pageName) {
    this.props.history.push(pageName);
  }

  onSearchEvent() {
    const keyword = this.state.keyword;
    if (!keyword.toString().trim().length) {
      showWarningToast('Please enter search keyword');
      return;
    }
    const page = 1;
    const perPageData = this.state.perPageData;

    this.setState({ searchText: keyword });

    try {
      if (window.history.pushState) {
        var newurl =
          window.location.protocol +
          '//' +
          window.location.host +
          window.location.pathname +
          '?keyword=' +
          keyword;
        window.history.pushState({ path: newurl }, '', newurl);
      }
    } catch (err) {
      console.log(err);
    }

    this.props.showLoader();
    this.props.actionGetPublicUserEvents({ keyword, page, perPageData }).then(
      res => {
        this.props.hideLoader();
        if (res.payload && res.payload.data && res.payload.data.data) {
          this.setState({
            eventList: res.payload.data.data || [],
            currentPage: res.payload.data.currentPage,
            hasMoreItems: true,
            apiRequestPage: []
            // showLoader: false
          });
        }
      },
      err => {
        console.log('err', err);
        this.props.hideLoader();
        // this.setState({ showLoader: false });
      }
    );
  }

  loadItems(pageNum) {
    // let self = this;
    // if (self.state.currentPage == 0) return;
    // let pageNo = self.state.currentPage + 1;

    // axios
    //   .post(self.url + '/events', {
    //     perPageData: 5,
    //     page: pageNo,
    //     keyword: this.state.keyword
    //   })
    //   .then(function(response) {
    //     if (self.state.currentPage >= response.data.totalPage) {
    //       self.setState({
    //         currentPage: response.data.currentPage,
    //         hasMoreItems: false
    //       });
    //     } else {
    //       let list = self.state.showEventList;
    //       list = list.concat(response.data.data);
    //       self.setState({
    //         showEventList: list,
    //         currentPage: response.data.currentPage
    //       });
    //     }
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });

    let apiRequestPage = this.state.apiRequestPage || [];
    if (apiRequestPage.indexOf(pageNum) > -1) {
      return;
    }
    apiRequestPage.push(pageNum);
    this.setState({ apiRequestPage });

    if (this.state.currentPage == 0) return;

    const keyword = this.state.keyword;
    const page = this.state.currentPage + 1;
    const perPageData = this.state.perPageData;

    this.props.actionGetPublicUserEvents({ keyword, page, perPageData }).then(
      res => {
        if (res.payload && res.payload.data && res.payload.data.data) {
          if (this.state.currentPage >= res.payload.data.totalPage) {
            this.setState({
              currentPage: res.payload.data.currentPage,
              hasMoreItems: false
            });
          } else {
            let list = this.state.eventList;
            list = list.concat(res.payload.data.data);
            this.setState({
              eventList: list,
              currentPage: res.payload.data.currentPage
            });
          }
        }
      },
      err => {
        console.log('err', err);
        this.setState({
          hasMoreItems: false
        });
      }
    );
  }

  showEventDetails = event => {
    // this.props.actionMemberEventDetailsObject(event);

    const userTypeId = this.props.userInfo.userTypeId;
    switch (userTypeId) {
      case 1:
        this.props.history.push('/member/eventDetails?eventId=' + event._id);
        break;
      case 2:
        this.props.history.push('/manager/eventDetails?eventId=' + event._id);
        break;
      case 3:
        this.props.history.push('/admin/eventDetails?eventId=' + event._id);
        break;
      default:
        break;
    }

    // this.navigateByUrlName('/member/eventDetails?eventId=' + event._id);
  };

  //Check enter key press on password field
  handleEnterKeyUp(e) {
    if (e.key == 'Enter') {
      this.setState({ searchText: this.state.keyword });
      this.onSearchEvent();
    }
  }

  render() {
    var items = [];
    this.state.eventList.map((event, index) => {
      const bannerImageURL = event.bannerImageURL
        ? displayThumbImage(
            event.bannerImageURL,
            Config.S3AlbumForBanner,
            Config.S3Thumbnail200
          )
        : imgEventDefault;

      // console.log(bannerImageURL);
      items.push(
        <div key={index} className="col-sm-6 col-md-4">
          <div className="eventBox gal-eff u-box">
            <div className="evImg u-img">
              <LazyLoad debounce={200} height={100 + '%'}>
                <Img
                  src={
                    event.bannerImageURL
                      ? displayThumbImage(
                          event.bannerImageURL,
                          Config.S3AlbumForBanner,
                          Config.S3Thumbnail200
                        )
                      : imgEventDefault
                  }
                  default={imgEventDefault}
                />
              </LazyLoad>
              <div className="overlay">
                <ul className="social-contact action-tag text-center">
                  <li>
                    <a
                      href="javascript:void(0)"
                      onClick={() => this.showEventDetails(event)}
                    >
                      <span className="ico-eye">
                        <svg>
                          <use xlinkHref={`${Sprite}#eyeIco`} />
                        </svg>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="evInfo u-details white-bg h-170">
              <div className="evDiscription">
                <p className="name all-caps m0">
                  <b>{event.eventName}</b>
                </p>
                {/* <div className="rating">
                  <i className="fa fa-star on" />
                  <i className="fa fa-star on" />
                  <i className="fa fa-star on" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                </div> */}
                <p className="degi text-dark">
                  {event.description}
                  {/* Lorem Ipsum is simply dummy text of the
                    printing and typesetting industry. Lorem Ipsum
                    has been the industry's standard dummy text
                    ever since the 1500s, */}
                </p>
              </div>
              {/* <a
                href="javascript:void(0)"
                className="btn-arrow"
                onClick={() => this.showEventDetails(event)}
              >
                READ
                <span className="ico-r-arrow">
                  <svg>
                    <use xlinkHref="/img/sprite.svg#r-arrowIco" />
                  </svg>
                </span>
              </a> */}
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="main-page-wrapper">
        <section className="">
          <div className="topBanner bg-banner">
            <div className="bannerSearch content-center h-100">
              <div className="searchBoxWrapper text-center text-white">
                <h4>GET YOUR FAVOURATE TOPICS HERE</h4>
                <div className="searchBox">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search here..."
                      name="keyword"
                      onChange={event => {
                        this.setState({ keyword: event.target.value });
                      }}
                      onKeyUp={this.handleEnterKeyUp}
                      value={this.state.keyword}
                    />
                    <span
                      className="ico-search cls-cursor"
                      onClick={this.onSearchEvent}
                    >
                      <svg>
                        <use xlinkHref={`${Sprite}#searchIco`} />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="searchEventPage">
              <div>
                {this.state.eventList.length > 0 ? (
                  <h3 className="titletext">
                    {this.state.eventList.length} RESULTS FOUND FOR YOUR SEARCH
                    "{this.state.searchText}"
                  </h3>
                ) : (
                  ''
                )}
              </div>
              {/* <div className="main-heading">
                <span className="text-dark">
                  HEIGEST RATED MEDIA
                </span>
                <h3>TRENDING TOPICS</h3>
              </div> */}

              {/* {this.state.showLoader == true ? (
                <div className="loderDiv text-center">
                  <BeatLoader size="100" color={'#edae0e'} loading={true} />
                </div>
              ) : null} */}
              {this.state.hasMoreItems == false &&
              this.state.eventList.length == 0 ? (
                <div>
                  <h3>NO MATCHING EVENT FOUND</h3>
                </div>
              ) : null}

              <div className="evListAllCards">
                <div className="row">
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadItems.bind(this, this.state.currentPage)}
                    hasMore={this.state.hasMoreItems == true}
                    loader={
                      <div className="loader" key={0}>
                        .
                      </div>
                    }
                    // useWindow={true}
                    // threshold={0}
                  >
                    {items}
                  </InfiniteScroll>
                </div>
                {/*<!-- row end -->*/}
              </div>
            </div>
          </div>
        </section>
        {/* <!-- section end -->*/}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { events: state.events, userInfo: state.profileData };
}

const mapDispatchToProps = function(dispatch) {
  return bindActionCreators(
    {
      actionGetPublicUserEvents,
      actionMemberEventDetailsObject,
      showLoader,
      hideLoader
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchEvent);
