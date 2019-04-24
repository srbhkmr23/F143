import React, { Component } from 'react';
import Config from '../../common/core/config';
import imgsearch from '../../img/search-icon.png';

class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }
  // handleChange({ target }) {
  //   this.setState({
  //     search: target.value
  //   });
  //   this.props.handleChange(target);
  // }
  handleChange({ target }) {
    const name = target.name;
    const value = target.value;
    //console.log("eeee-",value.trim());
    const regExp = new RegExp(Config.regExp_alphaNumSpace);
    if (value === '' || regExp.test(value.trim()) === true) {
      //debugger;
      this.setState({
        [name]: value,
        search: target.value
      });
      this.props.handleChange(target);
    }
  }

  render() {
    return (
      <div className="relative">
        <input
          type="text"
          className="form-control spSearchBox"
          name="search"
          placeholder={this.props.placeholder}
          value={this.state.search}
          onChange={this.handleChange}
        />
        <img src={imgsearch} alt="" className="search-icon" />
      </div>
    );
  }
}

export default SearchFilter;
