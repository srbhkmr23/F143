import React from 'react';
import { handleApiError, getImageName } from '../core/common-functions';
import InnovecsysConfig from '../core/config';
import { Config } from 'aws-sdk';
// const albumBucketName = 'innovecsys-dev';
const albumBucketName = InnovecsysConfig.S3BucketName;
const resizedAlbumBucketName = InnovecsysConfig.S3ResizeBucketName;
// const bucketRegion = 'us-west-2';
const bucketRegion = InnovecsysConfig.S3BucketRegion;
const IdentityPoolId = InnovecsysConfig.S3IdentityPoolId;
// const IdentityPoolId = 'us-east-1:d630c636-0129-40b3-ae10-3b4d8c8e5150';
// const IdentityPoolId = 'us-east-1:99881b46-3bff-41ce-aca8-44d91360c76a';

/** Initialize AWS SDK */
var AWS = window.AWS;
// var AWS = require('aws-sdk');
// console.log("AWS=================", AWS);

window.AWS.config.update({
  region: InnovecsysConfig.S3BucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: bucketRegion,
  params: { Bucket: albumBucketName }
});

/** END Initialize AWS SDK */

/**
 * Innovecsys custom functions for ASWS S3
 */

export function addPhoto(
  albumName,
  fileElement,
  customFileName,
  index,
  cb,
  progressBarCb
) {
  var files = fileElement.files;
  if (!files.length) {
    return alert('Please choose a file to upload first.');
  }
  var file = index ? files[index] : files[0];
  var fileName = file.name;
  if (customFileName) fileName = customFileName;
  // var albumPhotosKey = 'event/'+encodeURIComponent(albumName) + '/';
  var albumPhotosKey = albumName + '/';

  var photoKey = albumPhotosKey + fileName;

  console.log(albumName, fileElement, {
    Key: photoKey,
    Body: file,
    ACL: 'public-read'
  });

  s3
    .upload(
      {
        Key: photoKey,
        Body: file,
        ACL: 'public-read'
      },
      function(err, data) {
        if (cb) cb(err, data);
        if (err) {
          handleApiError(err.message);
          return alert(
            'There was an error uploading your photo: ',
            err.message
          );
        }
        // alert('Successfully uploaded photo.');
        // viewAlbum(albumName);
      }
    )
    .on('httpUploadProgress', function(evt) {
      console.log(
        'Uploaded :: ' + parseInt(evt.loaded * 100 / evt.total) + '%'
      );
      if (progressBarCb) {
        progressBarCb(parseInt(evt.loaded * 100 / evt.total));
      }
    });
}

// export function createEventDirectory(eventId, cb) {
//   console.log('eventId', eventId);
//   const albumName = eventId.trim();
//   if (!albumName) {
//     return alert('Album names must contain at least one non-space character.');
//   }
//   if (albumName.indexOf('/') !== -1) {
//     return alert('Album names cannot contain slashes.');
//   }
//   var albumKey = encodeURIComponent(albumName) + '/';
//   s3.headObject({ Key: albumKey }, function(err, data) {
//     if (!err) {
//       cb({ directoryStatus: true });
//       // alert('Album already exists.')
//       return;
//     }
//     if (err.code !== 'NotFound') {
//       cb({ directoryStatus: false });
//       // alert('There was an error creating your album: ' + err.message)
//       return;
//     }
//     s3.putObject({ Key: albumKey }, function(err, data) {
//       if (err) {
//         cb({ directoryStatus: false });
//         // alert('There was an error creating your album: ' + err.message)
//         return;
//       }
//       cb({ directoryStatus: true });
//       console.log('Successfully created album.');
//       // viewAlbum(albumName);
//     });
//   });
// }

export function createEventDirectory(eventId, cb) {
  console.log('eventId', eventId);
  const albumName = eventId.trim();
  if (!albumName) {
    return alert('Album names must contain at least one non-space character.');
  }

  // var albumKey = encodeURIComponent(albumName) + '/';
  var albumKey = albumName + '/';
  s3.headObject({ Key: albumKey }, function(err, data) {
    // console.log("createEventDirectory ",err, data);
    if (!err) {
      cb({ directoryStatus: true });
      //alert('Album already exists.')
      return;
    }
    // if (err.code !== 'NotFound') {
    //   cb({ directoryStatus: false });
    //   alert('There was an error creating your album: ' + err.message)
    //   return;
    // }
    s3.putObject({ Key: albumKey }, function(err, data) {
      if (err) {
        cb({ directoryStatus: false });
        // alert('There was an error creating your album: ' + err.message)
        return;
      }
      cb({ directoryStatus: true });
      console.log('Successfully created album.');
      // viewAlbum(albumName);
    });
  });
}
export function getFileInformation(eventId, cb) {
  const albumName = eventId.trim();
  if (!albumName) {
    return alert('Album names must contain at least one non-space character.');
  }
  if (albumName.indexOf('/') !== -1) {
    return alert('Album names cannot contain slashes.');
  }
  var albumKey = encodeURIComponent(albumName) + '/';
  s3.headObject({ Key: albumKey }, function(err, data) {
    // console.log('getFileInformation', err, data);
    return cb ? cb(err, data) : '';
  });
}

export function checkEventFolderExistance(eventId, cb) {
  const albumName = eventId;
  var albumPhotosKey = encodeURIComponent(albumName) + '/';
  s3.listObjects({ Prefix: albumPhotosKey }, function(err, data) {
    if (cb) {
      cb(err, data, this);
    }
    if (err) {
      return alert('There was an error viewing your album: ' + err.message);
    }
    // `this` references the AWS.Response instance that represents the response
    var href = this.request.httpRequest.endpoint.href;
    var bucketUrl = href + albumBucketName + '/';
    console.log(err, data);
    console.log(this);
    return;
    //   var photos = data.Contents.map(function(photo) {
    //     var photoKey = photo.Key;
    //     var photoUrl = bucketUrl + encodeURIComponent(photoKey);
    //     return getHtml([
    //       '<span>',
    //       '<div>',
    //       '<img style="width:128px;height:128px;" src="' + photoUrl + '"/>',
    //       '</div>',
    //       '<div>',
    //       '<span onclick="deletePhoto(\'' +
    //         albumName +
    //         "','" +
    //         photoKey +
    //         '\')">',
    //       'X',
    //       '</span>',
    //       '<span>',
    //       photoKey.replace(albumPhotosKey, ''),
    //       '</span>',
    //       '</div>',
    //       '<span>'
    //     ]);
    //   });
    //   var message = photos.length
    //     ? '<p>Click on the X to delete the photo</p>'
    //     : '<p>You do not have any photos in this album. Please add photos.</p>';
    //   var htmlTemplate = [
    //     '<h2>',
    //     'Album: ' + albumName,
    //     '</h2>',
    //     message,
    //     '<div>',
    //     getHtml(photos),
    //     '</div>',
    //     '<input id="photoupload" type="file" accept="image/*">',
    //     '<button id="addphoto" onclick="addPhoto(\'' + albumName + '\')">',
    //     'Add Photo',
    //     '</button>',
    //     '<button onclick="listAlbums()">',
    //     'Back To Albums',
    //     '</button>'
    //   ];
    //   document.getElementById('app').innerHTML = getHtml(htmlTemplate);
  });
}

export function deleteEventImage(albumName, photoKey, cb) {
  s3.deleteObject({ Bucket: albumBucketName, Key: photoKey }, function(
    err,
    data
  ) {
    if (err) {
      console.log('There was an error deleting your photo: ', err.message);
      return;
    }
    //console.log('Successfully deleted photo.');
    return cb ? cb(err, data) : '';
  });
}

export function deleteResizedEventImage(albumName, photoKey, cb) {
  console.log('resized------', albumName, photoKey);
  // Bucket: albumBucketName,
  // Key: 'some/subfolders/nameofthefile1.extension'
  s3.deleteObject({ Bucket: resizedAlbumBucketName, Key: photoKey }, function(
    err,
    data
  ) {
    if (err) {
      console.log('There was an error deleting your photo: ', err.message);
      return;
    }
    console.log('Successfully deleted photo.');
    return cb ? cb(err, data) : '';
    // viewAlbum(albumName);
  });
}
/**
 *  END Innovecsys custom functions for ASWS S3
 */

function getHtml(template) {
  return template.join('\n');
}

function listAlbums() {
  s3.listObjects({ Delimiter: '/' }, function(err, data) {
    if (err) {
      return alert('There was an error listing your albums: ' + err.message);
    } else {
      var albums = data.CommonPrefixes.map(function(commonPrefix) {
        var prefix = commonPrefix.Prefix;
        var albumName = decodeURIComponent(prefix.replace('/', ''));
        return getHtml([
          '<li>',
          '<span onclick="deleteAlbum(\'' + albumName + '\')">X</span>',
          '<span onclick="viewAlbum(\'' + albumName + '\')">',
          albumName,
          '</span>',
          '</li>'
        ]);
      });
      var message = albums.length
        ? getHtml([
            '<p>Click on an album name to view it.</p>',
            '<p>Click on the X to delete the album.</p>'
          ])
        : '<p>You do not have any albums. Please Create album.';
      var htmlTemplate = [
        '<h2>Albums</h2>',
        message,
        '<ul>',
        getHtml(albums),
        '</ul>',
        '<button onclick="createAlbum(prompt(\'Enter Album Name:\'))">',
        'Create New Album',
        '</button>'
      ];
      document.getElementById('app').innerHTML = getHtml(htmlTemplate);
    }
  });
}

function createAlbum(albumName) {
  albumName = albumName.trim();
  if (!albumName) {
    return alert('Album names must contain at least one non-space character.');
  }
  if (albumName.indexOf('/') !== -1) {
    return alert('Album names cannot contain slashes.');
  }
  var albumKey = encodeURIComponent(albumName) + '/';
  s3.headObject({ Key: albumKey }, function(err, data) {
    if (!err) {
      return alert('Album already exists.');
    }
    if (err.code !== 'NotFound') {
      return alert('There was an error creating your album: ' + err.message);
    }
    s3.putObject({ Key: albumKey }, function(err, data) {
      if (err) {
        return alert('There was an error creating your album: ' + err.message);
      }
      alert('Successfully created album.');
      viewAlbum(albumName);
    });
  });
}

function viewAlbum(albumName) {
  var albumPhotosKey = encodeURIComponent(albumName) + '/';
  s3.listObjects({ Prefix: albumPhotosKey }, function(err, data) {
    if (err) {
      return alert('There was an error viewing your album: ' + err.message);
    }
    // `this` references the AWS.Response instance that represents the response
    var href = this.request.httpRequest.endpoint.href;
    var bucketUrl = href + albumBucketName + '/';

    var photos = data.Contents.map(function(photo) {
      var photoKey = photo.Key;
      var photoUrl = bucketUrl + encodeURIComponent(photoKey);
      return getHtml([
        '<span>',
        '<div>',
        '<img style="width:128px;height:128px;" src="' + photoUrl + '"/>',
        '</div>',
        '<div>',
        '<span onclick="deletePhoto(\'' +
          albumName +
          "','" +
          photoKey +
          '\')">',
        'X',
        '</span>',
        '<span>',
        photoKey.replace(albumPhotosKey, ''),
        '</span>',
        '</div>',
        '<span>'
      ]);
    });
    var message = photos.length
      ? '<p>Click on the X to delete the photo</p>'
      : '<p>You do not have any photos in this album. Please add photos.</p>';
    var htmlTemplate = [
      '<h2>',
      'Album: ' + albumName,
      '</h2>',
      message,
      '<div>',
      getHtml(photos),
      '</div>',
      '<input id="photoupload" type="file" accept="image/*">',
      '<button id="addphoto" onclick="addPhoto(\'' + albumName + '\')">',
      'Add Photo',
      '</button>',
      '<button onclick="listAlbums()">',
      'Back To Albums',
      '</button>'
    ];
    document.getElementById('app').innerHTML = getHtml(htmlTemplate);
  });
}

function addPhoto2(albumName, fileElement, cb, progressBarCb) {
  var files = fileElement.files;
  if (!files.length) {
    return alert('Please choose a file to upload first.');
  }
  var file = files[0];
  var fileName = file.name;
  var albumPhotosKey = encodeURIComponent(albumName) + '//';

  var photoKey = albumPhotosKey + fileName;

  console.log(albumName, fileElement, {
    Key: photoKey,
    Body: file,
    ACL: 'public-read'
  });

  s3
    .upload(
      {
        Key: photoKey,
        Body: file,
        ACL: 'public-read'
      },
      function(err, data) {
        if (cb) cb(err, data);
        if (err) {
          handleApiError(err.message);
          return alert(
            'There was an error uploading your photo: ',
            err.message
          );
        }
        // alert('Successfully uploaded photo.');
        // viewAlbum(albumName);
      }
    )
    .on('httpUploadProgress', function(evt) {
      console.log(
        'Uploaded :: ' + parseInt(evt.loaded * 100 / evt.total) + '%'
      );
      if (progressBarCb) {
        progressBarCb(parseInt(evt.loaded * 100 / evt.total));
      }
    });
}

// $('#fileUploadForm').submit(function() {
//   var bucket = new AWS.S3({ params: { Bucket: 'BUCKET_NAME' } });
//   var fileChooser = document.getElementById('file');
//   var file = fileChooser.files[0];
//   if (file) {
//     var params = { Key: 'FILE_NAME', ContentType: file.type, Body: file };
//     bucket
//       .upload(params)
//       .on('httpUploadProgress', function(evt) {
//         console.log(
//           'Uploaded :: ' + parseInt(evt.loaded * 100 / evt.total) + '%'
//         );
//       })
//       .send(function(err, data) {
//         alert('File uploaded successfully.');
//       });
//   }
//   return false;
// });

function addPhoto1(albumName) {
  var files = document.getElementById('photoupload').files;
  if (!files.length) {
    return alert('Please choose a file to upload first.');
  }
  var file = files[0];
  var fileName = file.name;
  var albumPhotosKey = encodeURIComponent(albumName) + '//';

  var photoKey = albumPhotosKey + fileName;
  s3.upload(
    {
      Key: photoKey,
      Body: file,
      ACL: 'public-read'
    },
    function(err, data) {
      if (err) {
        return alert('There was an error uploading your photo: ', err.message);
      }
      alert('Successfully uploaded photo.');
      viewAlbum(albumName);
    }
  );
}

export function deletePhoto(albumName, photoKey) {
  let deleteImageName = getImageName(photoKey);
  console.log(deleteImageName);
  var params = {
    Bucket: albumBucketName + '/' + albumName,
    Key: deleteImageName
  };

  s3.deleteObject(params, function(err, data) {
    if (err) {
      return alert('There was an error deleting your photo: ', err.message);
    }
    console.log('Successfully deleted photo.');
  });
}

function deleteAlbum(albumName) {
  var albumKey = encodeURIComponent(albumName) + '/';
  s3.listObjects({ Prefix: albumKey }, function(err, data) {
    if (err) {
      return alert('There was an error deleting your album: ', err.message);
    }
    var objects = data.Contents.map(function(object) {
      return { Key: object.Key };
    });
    s3.deleteObjects(
      {
        Delete: { Objects: objects, Quiet: true }
      },
      function(err, data) {
        if (err) {
          return alert('There was an error deleting your album: ', err.message);
        }
        alert('Successfully deleted album.');
        listAlbums();
      }
    );
  });
}

export function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
// listAlbums();
