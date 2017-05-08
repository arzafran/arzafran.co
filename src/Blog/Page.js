import React, { Component } from 'react';
import Butter from 'buttercms';
import { Link } from 'react-router';
import './Page.css';

const butter = Butter('5558ac855b95222c7cb4a489910a4f9d60cf4123');

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  fetchPosts(page) {
    butter.post.list({
      page: page,
      page_size: 10
    }).then((resp) => {
      this.setState({
        loaded: true,
        resp: resp.data
      })
    });
  }

  componentWillMount() {
    let page = this.props.params.page || 1;

    this.fetchPosts(page)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loaded: false
    });

    let page = nextProps.params.page || 1;

    this.fetchPosts(page)
  }

  render() {
    if (this.state.loaded) {
      const { next_page, previous_page } = this.state.resp.meta;

      return ( 
        <section className="blogpage">
          <ul className="nav">
            {this.state.resp.data.map((post) => {
              return ( 
                <li className="blogpage__posts" key={post.slug} >
                  <Link to={`/post/${post.slug}`} > 
                  {post.title} 
                  </Link>
                </li>
              ) 
            })}
          </ul>
          <div className="blogpage__paginator">
            {previous_page && <Link to={`/p/${previous_page}`}>Prev</Link>}
            {next_page && <Link to={`/p/${next_page}`}>Next</Link>}
          </div> 
        </section>
      );
    } else {
      return ( 
        <p className="loader">
          Loading...
        </p>
      )
    }
  }
}

export default Page;