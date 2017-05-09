import React, { Component } from 'react';
import { Link } from 'react-router';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <header className="header">
        <h2 className="heading">
          <Link to="/">arzafran.co</Link>
        </h2>
      </header>
    );
  }
}

export default Header;