import React, { Component } from 'react';

import { getFileInformation } from '../../common/core/aws-s3';

import imgPdfFile from '../../img/pdfFile.jpg';
import imgTextFile from '../../img/textFileLogo.png';
import imgDocFile from '../../img/docFileLogo.png';
import imgXlsFile from '../../img/xlsFileLogo.png';
import imgFileDefault from '../../img/defaultFileLogo.png';

class EventMediaItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageExtensions: ['png', 'jpg', 'jpeg'],
      id: '',
      fileExtension: '',
      fileName: '',
      eventId: ''
    };

    this.callAwsToGetFileInformation = this.callAwsToGetFileInformation.bind(
      this
    );
    this.setFileOrLogoUrl = this.setFileOrLogoUrl.bind(this);
  }

  componentWillMount() {
    //console.log(this.props.fileInfo);
    // console.log(bytesToSize(this.props.fileInfo.fileSize));
    // id: count,
    // source: imgFileTypeOne,
    // AWSURL: '',
    // progress: 0,
    // uploaded: false

    this.setState({
      eventId: this.props.fileInfo.eventId,
      id: this.props.fileInfo.id,
      fileName: this.props.fileInfo.fileName,
      fileSize: this.props.fileInfo.fileSize
    });
  }

  componentDidMount() {
    const fileName = this.state.fileName;
    const fileExtension = fileName.split('.')[1];
    this.setState({
      fileExtension
    });
  }

  callAwsToGetFileInformation() {
    const eventId = this.state.eventId;
    getFileInformation(eventId, (error, data) => {
      console.log('get file information ', error, data);
    });
  }

  setFileOrLogoUrl(fileExtension) {
    switch (fileExtension) {
      case 'png':
      case 'jpg':
      case 'jpeg':
        return this.props.fileInfo.source;

      case 'pdf':
        return imgPdfFile;

      case 'txt':
      case 'text':
        return imgTextFile;

      case 'doc':
      case 'docx':
        return imgDocFile;

      case 'xls':
      case 'xlsx':
        return imgXlsFile;

      default:
        return imgFileDefault;
    }
  }

  render() {
    return (
      <div className="uploaded-files-div gal-eff">
        <div className="u-img upld-img-div">
          <img
            src={this.setFileOrLogoUrl(this.state.fileExtension)}
            alt={this.state.fileName}
          />
          <div className="overlay" />
        </div>
        <div className="u-details light-bg filename-text">
          <div>
            <div
              className={
                !this.props.fileInfo.uploaded ? 'progress' : 'progress hide'
              }
              style={{
                width: 50 + '%',
                textAlign: 'center',
                margin: '5px auto auto auto'
              }}
            >
              <div
                className="progress-bar progress-bar-warning"
                role="progressbar"
                aria-valuenow={this.props.fileInfo.progress}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{
                  width: this.props.fileInfo.progress + '%',
                  color: 'red'
                }}
              >
                {this.props.fileInfo.progress}% Complete
              </div>
            </div>
          </div>
          <p className="name all-caps m0 text-ellipsis file-name">
            {this.props.fileInfo.fileName}
          </p>
          <p className="name all-caps m0 text-ellipsis file-size">
            {this.state.fileSize}
          </p>
        </div>
      </div>
    );
  }
}

export default EventMediaItem;
