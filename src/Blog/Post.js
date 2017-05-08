import React, { Component } from 'react';
import Butter from 'buttercms';
import { Helmet } from "react-helmet";
import './Post.css';

const butter = Butter('5558ac855b95222c7cb4a489910a4f9d60cf4123');

class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  componentWillMount() {
    let slug = this.props.params.slug;

    butter.post.retrieve(slug).then((resp) => {
      this.setState({
        loaded: true,
        post: resp.data.data
      })
    });
  }

  render() {
    if (this.state.loaded) {
      const post = this.state.post;

      return (
        <article>
          <Helmet>
            <title>{post.seo_title}</title>
            <meta name="description" content={post.meta_description} />
            <meta name="og:image" content={post.featured_image} />
          </Helmet>

          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{__html: post.body}} />
        </article>
      );
    } else {
      return (
        <p>
          Loading...
        </p>
      );
    }
  }
}

export default Post;