let getAPIURL = () => {
  let returnUrl = '';
  switch (window.location.hostname) {
    case '103.76.253.133':
      returnUrl = '103.76.253.133';
      break;

    case '103.76.253.134':
      returnUrl = '103.76.253.134';
      break;
    case '18.219.145.205':
    case 'ec2-18-219-145-205.us-east-2.compute.amazonaws.com':
      returnUrl = '18.219.145.205';
      break;

    default:
      returnUrl = '103.76.253.133';
      break;
  }
  return returnUrl;
};

let config = {
  S3BucketName: 'innovecsys-developement',
  S3ResizeBucketName: 'innovecsys-developementresized',
  S3BucketRegion: 'us-east-1',
  S3IdentityPoolId: 'us-east-1:10a36bff-ce57-465c-b849-28127b6ccdd9',

  S3AlbumForBanner: 'banner',
  S3AlbumForEvent: 'event',
  S3AlbumForMember: 'profile/member',
  S3AlbumForManager: 'profile/manager',
  S3AlbumForSpeaker: 'profile/speaker',
  S3AlbumForSponsor: 'profile/sponsor',

  S3Thumbnail200: '/200x200',
  S3Thumbnail373: '/373x233',
  S3Thumbnail728: '/728x728',

  API_URL_JAVA: 'http://' + getAPIURL() + ':8582',
  API_URL_Node: 'http://' + getAPIURL() + ':3001',
  StripeKey: 'pk_test_Q8UKfs16Gr8oEtuJuuCskR3X',

  // regular expressions
  regExp_alphabet: '^[a-zA-Z]*$',
  regExp_number: '^[0-9]*$',
  regExp_alphaNumeric: '^[a-zA-Z0-9]+$',
  regExp_alphaNumSpace: '^[a-zA-Z0-9 ]+$'
};

export default config;
