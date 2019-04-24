import React, { Component } from 'react';
import imgsearch from '../../img/search-icon.png';
import imgSearchIcon from '../../img/evSearchIcon.png';
import imgDownCaretIcon from '../../img/downCaretIcon.png';

class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange({ target }) {
    this.setState({
      search: target.value
    });
    this.props.handleChange(target);
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
