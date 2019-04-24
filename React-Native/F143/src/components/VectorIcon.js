import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
// const myIcon = <Icon name="rocket" size={30} color="#900" />;
import Colors from '../constants/Colors';
export default class VectorIcon extends React.Component {
    render() {
      return (
        <Icon
          name={this.props.name}
          size={this.props.size ? this.props.size : 25}
          // style={{ marginBottom: -3 }}
          style={ this.props.style ? this.props.style : {marginBottom: -3}}
          color={this.props.color ? this.props.color : Colors.tabIconDefault}
        />
      );
    }
  }