import React, { Component } from 'react';

class RoughDistances extends Component {
  constructor(properties) {
    super(properties);

    this.ee = properties.ee;

    this.state = {
      postcode: ''
    };
  }

  updatePostcode(postcode) {
    this.setState({postcode: postcode});
  }

  componentDidMount() {
    this.ee.on('postcode', this.updatePostcode.bind(this));
  }

  componentWillUnmount() {
    this.ee.removeListener('postcode', this.updatePostcode.bind(this));
  }

  render() {
    return (
      <p>You entered: {this.state.postcode}</p>
    );
  }
}

export default RoughDistances;