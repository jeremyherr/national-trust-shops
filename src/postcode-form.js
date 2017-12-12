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
    const postcode = event.target.value;
    this.setState({value: postcode});

    if (postcode === '') {
      this.setState({errorMessage: ''});
      this.ee.emit('postcode', '');
      return;
    }

    const postcodeAreaMatch = postcode.match(/^([A-Za-z]+)/);
    if (postcodeAreaMatch === null) {
      this.setState({errorMessage: 'invalid postcode'});
      this.ee.emit('postcode', '');
      return;
    }
    const postcodeArea = postcodeAreaMatch[1].toLowerCase();

    if (!(postcodeArea in postcodeAreaLocations)) {
      this.setState({errorMessage: `${postcodeArea} is not a valid postcode area`});
      this.ee.emit('postcode', '');
      return;
    }

    this.setState({errorMessage: ''});

    this.ee.emit('postcode', postcode.toLowerCase());
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Your postcode<br />
          <input type="text" value={this.state.value} onChange={this.handleChange} /><br />
          <span className="input-error">{this.state.errorMessage}</span>
        </label>
        <div>
          <input disabled={this.state.errorMessage || !this.state.value} type="submit" value="Query Google Maps API for closest shops" />
        </div>
      </form>
    );
  }
}

export default PostcodeForm;