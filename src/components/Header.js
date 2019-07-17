import React, { Component } from 'react';
import '../styles/App.css';

class Header extends Component {
  render () {
    return (
      <h2>Welcome to <a href={this.props.link}>{this.props.shop}</a>!</h2>
    )
  }
}

export default Header