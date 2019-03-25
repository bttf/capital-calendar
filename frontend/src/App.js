import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import './App.css';

const APP_QUERY = gql`
  {
    viewer {
      hello
    }
  }
`;

class App extends Component {
  render() {
    const {
      loading,
      error,
      data,
    } = this.props;

    if (loading) return 'Loading...';

    if (error) return `Error: ${error}`;

    console.log('data', data);
    console.log('props', this.props);

    return (
      <h1>{data.viewer.hello}</h1>
    );
  }
}

export default () => (
  <Query query={APP_QUERY}>
    {(props) => (
      <App {...props} />
    )}
  </Query>
)
