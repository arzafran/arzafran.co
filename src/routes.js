import React from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import Page from './Blog/Page';
import Post from './Blog/Post';
import About from './About/About';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App}>
      <Route path="/about" component={About} />
      <Route path="/blog" component={Page} />
      <Route path="/post/:slug" component={Post} />
    </Route>
  </Router>
);

export default Routes;