import React, { Component } from 'react';
import { postcodeAreaLocations } from './postcode-area-locations';

class PostcodeForm extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      postcode: '',
      errorMessage: '',
      googleMapsApiReady: false
    };
    this.ee = properties.ee;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    window.initMap = function() {
      console.log('initMap');
      this.setState({googleMapsApiReady: true});
    }.bind(this);

    const apiKey = 'AIzaSyBapgm2ILdfCzrDpUGVddGUmlEXOev3v4M';
    const docHead = document.getElementsByTagName('head')[0];
    const docScript = document.createElement('script');
    docScript.type = 'text/javascript';
    docScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    docHead.appendChild(docScript);

    console.log('PostcodeForm constructor');
  }

  handleChange(event) {
    const postcode = event.target.value;
    this.setState({postcode: postcode});

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
    this.ee.emit('google-result', false);
  }

  handleSubmit(event) {
    event.preventDefault();
    // TODO Allow user to select transportation mode in form
    this.ee.emit('get-google-distances', this.state.postcode, 'DRIVING');
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Your postcode<br />
          <input type="text" value={this.state.postcode} onChange={this.handleChange} /><br />
          <span className="input-error">{this.state.errorMessage}</span>
        </label>
        <div>
          <input disabled={this.state.errorMessage || !this.state.postcode || !this.state.googleMapsApiReady} type="submit" value="Query Google Maps API for closest shops" />
        </div>
      </form>
    );
  }
}

export default PostcodeForm;