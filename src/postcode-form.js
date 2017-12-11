import React, { Component } from 'react';
import { postcodeAreaLocations } from './postcode-area-locations';

class PostcodeForm extends Component {
  constructor(properties) {
    super(properties);
    this.state = {value: '', errorMessage: ''};
    this.ee = properties.ee;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});

    if (event.target.value === '') {
      this.setState({errorMessage: ''});
      this.ee.emit('postcode', '');
      return;
    }

    const postcodeAreaMatch = event.target.value.match(/^([A-Za-z]+)/);
    if (postcodeAreaMatch === null) {
      this.setState({errorMessage: 'invalid postcode'});
      this.ee.emit('postcode', '');
      return;
    }
    const postcodeArea = postcodeAreaMatch[1];

    if (!(postcodeArea in postcodeAreaLocations)) {
      this.setState({errorMessage: `${postcodeArea} is not a valid postcode area`});
      this.ee.emit('postcode', '');
      return;
    }

    this.setState({errorMessage: ''});

    this.ee.emit('postcode', event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Enter your postcode:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
          <p className="input-error">{this.state.errorMessage}</p>
        </label>
        <input disabled={this.state.errorMessage || !this.state.value} type="submit" value="Query Google Maps API for closest shops" />
      </form>
    );
  }
}

export default PostcodeForm;