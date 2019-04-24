import React, { Component } from 'react';

class AlphabeticalFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredData: []
    };
    this.filterHandler = this.filterHandler.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  filterHandler(text) {
    const dataList = this.props.filterFrom;
    if (text != 'All') {
      this.setState({
        filteredData: dataList.filter(
          data =>
            String(data[this.props.matchKey])
              .toLowerCase()
              .charAt(0) == text.toLowerCase()
        )
      });
    } else {
      this.setState({
        filteredData: this.props.filterFrom
      });
    }
    setTimeout(() => {
      this.props.filterHandler(this.state.filteredData);
    }, 200);
  }

  renderList(filterCharecter) {
    return (
      <li key={filterCharecter}>
        <a
          href="javascript:void(0);"
          onClick={() => this.filterHandler(filterCharecter)}
        >
          {filterCharecter}
        </a>
      </li>
    );
  }

  render() {
    const filterCharecters = [
      'All',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ];
    return (
      <ul className="alfabet-ul">
        {filterCharecters.map(filterCharecter => {
          return this.renderList(filterCharecter);
        })}
      </ul>
    );
  }
}

export default AlphabeticalFilter;
