export default {
  login: {
    url:
      '/userauth/oauth/token?grant_type=password&username=:userName&password=:password',
    method: 'POST',
    data: {},
    showResultMessage: false,
    showErrorMessage: true,
    loader: true
  },
  signup: {
    url: '/api/v1/public/user/register',
    method: 'POST',
    data: {
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      oldPassword: '',
      password: '',
      coverPhotoId: '',
      profilePhotoId: '',
      mobile: '',
      profession: [],
      interest: [],
      organization: '',
      dateOfBirth: '',
      gender: '',
      companyId: '',
      addressRequest: {
        detailedLocation: '',
        city: '',
        state: '',
        country: '',
        latitude: '',
        longitude: ''
      },
      userTypeId: '',
      listOfCategoryId: []
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  getAllEvents: {
    url:
      '/api/v1/user/dashboard/manager/events/all?published=&managerUserId=:userId&pageNumber=:pageNumber&pageSize=:pageSize',
    data: { userId: '' },
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  managerSelectedEventDetails: {
    url: '/api/v1/user/event/:eventId',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  getUpcomingEvents: {
    url:
      '/api/v1/public/user/member/upcoming?pageNumber=:pageNumber&pageSize=:pageSize',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  addEvent: {
    url: '/api/v1/user/event',
    data: {
      createrUserId: '',
      eventName: '',
      startTimestamp: '',
      endTimestamp: '',
      venue: '',
      timeZone: '',
      duration: '',
      fees: '',
      description: '',
      address: '',
      sponsorsList: '',
      speakersList: '',
      bannerImageURL: '',
      categoryId: '',
      subCatIds: []
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  updateEvent: {
    url: '/api/v1/user/event/:eventId ',
    data: {
      createrUserId: '',
      eventName: '',
      startTimestamp: '',
      endTimestamp: '',
      venue: '',
      timeZone: '',
      duration: '',
      fees: '',
      description: '',
      address: '',
      sponsorsList: '',
      speakersList: '',
      bannerImageURL: '',
      mediaImageURLs: '',
      categoryId: '',
      subCatIds: []
    },
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },
  deleteEvent: {
    url: '/api/v1/user/event?userId=:userId&eventId=:eventId',
    data: {},
    method: 'DELETE',
    showResultMessage: true,
    showErrorMessage: true
  },
  getAllSpeakers: {
    url: '/api/v1/public/user/speaker/all',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  getAllUsers: {
    url: '/api/v1/user/member/all',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  getAllSponsors: {
    url: '/api/v1/user/sponsor/allsponsor',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  addSpeaker: {
    url: '/api/v1/user/speaker',
    data: {
      speakerRequests: [
        {
          name: '',
          position: '',
          company: '',
          about: '',
          rating: 0,
          createrUserId: '',
          listOfSocialMediaUrl: '',
          noOfAwards: '',
          noOfPatents: '',
          noOfGrants: '',
          noOfPublications: ''
        }
      ],
      createrUserId: ''
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  editSpeaker: {
    url: '/api/v1/user/speaker/update/:speakerId',
    data: {
      speakerId: '',
      name: '',
      position: '',
      company: '',
      about: '',
      rating: 0,
      createrUserId: '',
      imageURL: '',
      listOfSocialMediaUrl: '',
      noOfAwards: '',
      noOfPatents: '',
      noOfGrants: '',
      noOfPublications: ''
    },
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },
  addSponsor: {
    url: '/api/v1/user/sponsor/:eventId',
    data: {
      createrUserId: '',
      sponsorRequests: [
        {
          sponserName: '',
          webSiteLink: '',
          about: '',
          image: ''
        }
      ]
      // eventId: ''
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  editSponsor: {
    url: '/api/v1/user/sponsor/update/:sponsorId',
    data: {
      sponserName: '',
      webSiteLink: '',
      about: '',
      imageURL: ''
    },
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },
  setSpeaker: {
    url: '/api/v1/user/speaker',
    data: {
      listOfId: [],
      eventId: ''
    },
    method: 'PUT',
    showResultMessage: false,
    showErrorMessage: true
  },
  setSponsor: {
    url: '/api/v1/user/sponsor',
    data: {
      listOfId: [],
      eventId: ''
    },
    method: 'PUT',
    showResultMessage: false,
    showErrorMessage: true
  },
  addEventAgenda: {
    url: '/api/v1/user/agenda',
    data: {
      eventId: 'string',
      timeBasedAgendaRequestList: [
        {
          startTime: '2018-02-20T13:51:00',
          listOfAgendas: [
            {
              agendaTitle: '',
              startTimestamp: '2018-02-20T13:51:00',
              endTimestamp: '2018-02-20T14:51:00',
              listOfAgendaDetails: [
                {
                  speakerId: 'string',
                  startTimestamp: '2018-02-20T13:51:00',
                  endTimestamp: '2018-02-20T14:15:00',
                  description: 'string'
                }
              ]
            }
          ]
        }
      ]
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  getAllAgendaOfEvent: {
    url: '/api/v1/user/agenda/ofevent/:eventId',
    data: {
      eventId: 'string'
    },
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  getSpeakersOfEvent: {
    url: '/api/v1/user/speaker/all/speakers/:eventId',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  getSponsorsOfEvent: {
    url: '/api/v1/user/sponsor/:eventId',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  publishEvent: {
    url: '/api/v1/user/event/publish/:eventId ',
    data: {},
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },
  getPublicUserEvents: {
    url: '/api/v1/public/user/searchkeyword?keyword=:keyword',
    data: {},
    method: 'GET',
    showResultMessage: true,
    showErrorMessage: true
  },
  getUserEventsByNode: {
    nodeUrl: '/events',
    data: {
      keyword: '',
      page: '',
      perPageData: ''
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  getAllCategory: {
    url: '/api/v1/public/user',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  fetchEvents: {
    url:
      '/api/v1/user/event/fetchEvents?fromDate=:fromDate&toDate=:toDate&pageNumber=:pageNumber&pageSize=:pageSize',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  addUpdateEventMedia: {
    url: '/api/v1/user/event/media',
    data: {
      eventId: '',
      listOfMedia: [
        {
          id: '',
          name: '',
          type: '',
          mediaURL: ''
        }
      ]
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  deleteEventMedia: {
    url: '/api/v1/user/event/deletemedia',
    data: {
      eventId: '',
      listOfId: []
    },
    method: 'DELETE',
    showResultMessage: true,
    showErrorMessage: true
  },

  memberAllEvents: {
    url: '/api/v1/user/member/all/events/:memberUserId',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  memberSelectedEventDetails: {
    url:
      '/api/v1/user/member/event?eventId=:eventId&callerMemberUserId=:callerMemberUserId',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  getDashboardItems: {
    url: '/api/v1/user/dashboard/counts',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  getProfileDataById: {
    url: '/api/v1/user/retrieve/:userId',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  updateProfileById: {
    url: '/api/v1/user/:userId',
    method: 'PUT',
    data: {
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      oldPassword: '',
      password: '',
      coverPhotoURL: '',
      profilePhotoURL: '',
      mobile: '',
      profession: [],
      interest: [],
      organization: '',
      dateOfBirth: '',
      gender: '',
      companyId: '',
      addressRequest: {
        detailedLocation: '',
        city: '',
        state: '',
        country: '',
        latitude: '',
        longitude: ''
      },
      userTypeId: '',
      listOfCategoryId: [],
      notificationSettingRequest: {}
    },
    showResultMessage: true,
    showErrorMessage: true
  },

  getAllManagers: {
    url: '/api/v1/user/dashboard/managers',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  forgotpassword: {
    url: '/api/v1/public/user/forgotpassword/:email',
    data: {},
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },
  tokenResetPassword: {
    url: '/api/v1/public/user/mail/checklink?token=:token',
    data: {},
    method: 'GET',
    showResultMessage: true,
    showErrorMessage: true
  },
  deleteManager: {
    url: '/api/v1/user/admin/manager/:managerId',
    data: {},
    method: 'DELETE',
    showResultMessage: true,
    showErrorMessage: true
  },
  addManager: {
    url: '/api/v1/user/admin/manager',
    method: 'POST',
    data: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      creatorUserId: '',
      userTypeId: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  updateUser: {
    url: '/api/v1/user/:userId',
    method: 'PUT',
    data: {
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      oldPassword: '',
      password: '',
      coverPhotoURL: '',
      profilePhotoURL: '',
      mobile: '',
      profession: [],
      organization: '',
      dateOfBirth: '2018-03-15T06:15:59.379Z',
      gender: '',
      companyId: '',
      creatorUserId: '',
      userTypeId: 0,
      addressRequest: {
        detailedLocation: '',
        city: '',
        state: '',
        country: '',
        latitude: '',
        longitude: ''
      },
      listOfCategoryId: []
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  userResendInvitation: {
    url: '/api/v1/user/admin/resendInvite',
    method: 'PUT',
    data: {
      userId: '',
      email: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  updatePassword: {
    url: '/api/v1/user/password/:userId',
    data: {
      password: '',
      oldPassword: ''
    },
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },
  createDiscount: {
    url: '/api/v1/user/discountcoupon/bind',
    data: {
      eventId: '',
      applicableDiscounts: [],
      applicableOffers: [],
      applicableCoupons: []
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  getDiscount: {
    url: '/api/v1/user/discountcoupon/:eventId',
    data: {},
    GET: 'POST',
    showResultMessage: false,
    showErrorMessage: true
  },
  createGeneralDiscount: {
    url: '/api/v1/user/discountcoupon/discount/:eventId',
    data: {
      id: '',
      discountName: '',
      delegateType: '',
      ownerDiscountPercentage: 0,
      innovecsysDiscountPercentage: 0,
      createdByUserId: '',
      applicableInZones: []
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  updateGeneralDiscount: {
    url: '/api/v1/user/discountcoupon/discount',
    data: {
      id: '',
      discountName: '',
      delegateType: '',
      ownerDiscountPercentage: 0,
      innovecsysDiscountPercentage: 0,
      createdByUserId: '',
      applicableInZones: []
    },
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },
  deleteGeneralDiscount: {
    url:
      '/api/v1/user/discountcoupon/discount?eventId=:eventId&discountId=:discountId',
    data: {},
    method: 'DELETE',
    showResultMessage: true,
    showErrorMessage: true
  },

  createCoupon: {
    url: '/api/v1/user/discountcoupon/coupon/:eventId',
    data: {
      id: '',
      couponCode: '',
      expiryTimeStamp: 0,
      applicableFromTimeStamp: 0,
      description: '',
      createdBy: '',
      applicableInZones: [],
      totalApplicableCount: '',
      applicablePerUserCount: '',
      discountPercentage: '',
      applicableWithOffersList: []
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  updateCoupon: {
    url: '/api/v1/user/discountcoupon/coupon',
    data: {
      id: '',
      couponCode: '',
      expiryTimeStamp: 0,
      applicableFromTimeStamp: 0,
      description: '',
      createdBy: '',
      applicableInZones: [],
      totalApplicableCount: '',
      applicablePerUserCount: '',
      discountPercentage: '',
      applicableWithOffersList: []
    },
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },
  deleteCoupon: {
    url:
      '/api/v1/user/discountcoupon/coupon?eventId=:eventId&couponId=:couponId',
    data: {},
    method: 'DELETE',
    showResultMessage: true,
    showErrorMessage: true
  },
  createOffer: {
    url: '/api/v1/user/discountcoupon/offer/:eventId',
    data: {
      id: '',
      offerName: '',
      discountPercentage: 0,
      applicableCount: 0,
      description: '',
      createdByUserId: '',
      applicableInZones: [],
      applicableFromDate: 0,
      applicableTillDate: 0,
      maxAllowedUser: 0,
      minAllowedUser: 0
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  updateOffer: {
    url: '/api/v1/user/discountcoupon/offer',
    data: {
      id: '',
      offerName: '',
      discountPercentage: 0,
      applicableCount: 0,
      description: '',
      createdByUserId: '',
      applicableInZones: [],
      applicableFromDate: 0,
      applicableTillDate: 0,
      maxAllowedUser: 0,
      minAllowedUser: 0
    },
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },
  deleteOffer: {
    url: '/api/v1/user/discountcoupon/offer?eventId=:eventId&offerId=:offerId',
    data: {},
    method: 'DELETE',
    showResultMessage: true,
    showErrorMessage: true
  },

  sendEnquiry: {
    url: '/api/v1/public/user/enquiry',
    method: 'PUT',
    data: {
      name: '',
      email: '',
      email: '',
      profession: '',
      querySubject: '',
      description: ''
    },
    showResultMessage: true,
    showErrorMessage: true
  },
  deleteSpeader: {
    url: '/api/v1/user/speaker/delete/:speakerId',
    data: {},
    method: 'DELETE',
    showResultMessage: true,
    showErrorMessage: true
  },
  deleteSponsor: {
    url: '/api/v1/user/sponsor/delete/:sponsorId',
    data: {},
    method: 'DELETE',
    showResultMessage: true,
    showErrorMessage: true
  },
  eventAmountToPay: {
    url: '/api/v1/user/event/finalamounttopay',
    data: {
      eventId: '',
      description: '',
      finalAmountToPay: '',
      currency: '',
      stripeEmail: '',
      stripeToken: '',
      payerUserId: '',
      listOfAppliedDiscountOrOfferIds: [],
      innovecysDiscountPresent: '',
      companyDiscountPresent: '',
      appliedCouponCode: '',
      delegateType: '',
      listOfGuestUsers: [],
      paymentAdditonalDetailsRequest: {},
      planId: ''
    },
    method: 'PUT',
    showResultMessage: false,
    showErrorMessage: true
  },
  getCommentsByEventId: {
    url: '/api/v1/user/event/getcomments/:eventId',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  setCommentByEventId: {
    url: '/api/v1/user/event/comment',
    data: {
      commentId: '',
      eventId: '',
      comment: '',
      commentorUserId: ''
    },
    method: 'POST',
    showResultMessage: false,
    showErrorMessage: true
  },
  setLikeByEventId: {
    url:
      '/api/v1/user/event/like?eventId=:eventId&likedByUserId=:likedByUserId',
    data: {},
    method: 'POST',
    showResultMessage: false,
    showErrorMessage: true
  },
  getNotification: {
    url:
      '/api/v1/user/notify/retrieve/:userId?pageNumber=:pageNumber&pageSize=:pageSize',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  setNotificationsAsClicked: {
    url: '/api/v1/user/notify/setclicked?userId=:userId',
    data: {
      listOfId: []
    },
    method: 'PUT',
    showResultMessage: false,
    showErrorMessage: true
  },
  setNotificationAsRead: {
    url:
      '/api/v1/user/notify/setread?notificationId=:notificationId&userId=:userId',
    data: {},
    method: 'PUT',
    showResultMessage: false,
    showErrorMessage: true
  },
  payAndSubscribeEvent: {
    url: '/api/v1/user/event/subscribe',
    data: {
      eventId: '',
      description: '',
      finalAmountToPay: 0,
      currency: '',
      stripeEmail: '',
      stripeToken: '',
      payerUserId: '',
      listOfAppliedDiscountOrOfferIds: [''],
      appliedCouponCode: '',
      delegateType: '',
      listOfGuestUsers: [
        {
          email: '',
          firstName: '',
          lastName: '',
          mobile: '',
          gender: ''
        }
      ],
      paymentAdditonalDetailsRequest: {
        innovecsysDiscount: 0,
        appliedDiscountId: '',
        appliedCouponId: '',
        appliedOfferId: '',
        basePrice: '',
        priceAfterDisount: '',
        priceAfterCoupon: '',
        priceAfterOffer: '',
        finalPrice: ''
      },
      planId: ''
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  setForgotPassword: {
    url:
      '/api/v1/public/user/newpassword?token=:token&newPassword=:newPassword',
    data: {},
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },
  getAllMemberPlan: {
    url: '/api/v1/user/plan',
    data: {},
    method: 'GET',
    showResultMessage: false,
    showErrorMessage: true
  },
  purchaseMemberPlan: {
    url: '/api/v1/user/plan/subscribe',
    data: {
      planId: '',
      buyerUserId: '',
      basePrice: '',
      innovecsysDiscount: 0,
      finalPrice: '',
      ifSubscriptionWithStripe: {
        token: '',
        description: ''
      }
    },
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  updateMemberPlan: {
    url: '/api/v1/user/plan/upgrade/subscription',
    data: {
      planId: '',
      buyerUserId: '',
      basePrice: '',
      innovecsysDiscount: 0,
      finalPrice: '',
      ifSubscriptionWithStripe: {
        token: '',
        description: ''
      }
    },
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },
  createCategory: {
    url: '/api/v1/user/category/create',
    data: {
      creatorUserId: '',
      listOfCategory: []
    },
    method: 'POST',
    showResultMessage: false,
    showErrorMessage: true
  },
  changeUserActiveStatus: {
    url: '/api/v1/user/change/activestatus/:userId',
    data: {},
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  },
  eventNotificationToMembers: {
    url: '/api/v1/user/notify/:eventId',
    data: {},
    method: 'POST',
    showResultMessage: true,
    showErrorMessage: true
  },
  unsubscribe: {
    url: '/api/v1/public/user/mail/unsubscribe',
    data: {
      offEmailFromInnovecsys: '',
      offForThisCategory: '',
      offEmailForThisEvent: '',
      token: '',
      eventId: ''
    },
    method: 'PUT',
    showResultMessage: true,
    showErrorMessage: true
  }
};

// data: {
//   planId: "",
//   "buyerUserId": "",
//   "basePrice": "",
//   "innovecsysDiscount": 0,
//   "appliedDiscountId": "",
//   "appliedCouponId": "",
//   "appliedOfferId": "",
//   "finalPrice": "",
//   "ifSubscriptionWithStripe": {
//     "token": "",
//     "description": ""
//   }
// },
