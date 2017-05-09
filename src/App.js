import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import Header from './Header/Header';
import './App.css';

class App extends Component {
  render() {
    return (
      <section className="app">
        <button className="back" onClick={browserHistory.goBack}>
          <span className="fa fa-arrow-left"/>
        </button>
        {this.props.children ? this.props.children :
          <ul className="nav">
            <li><Link to="/blog">TAKE ME TO THE BLOG</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>}
        <Header />
      </section>
    );
  }
}

export default App;