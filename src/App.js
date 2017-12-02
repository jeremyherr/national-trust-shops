import React, { Component } from 'react';
import './App.css';
import EventEmitter from 'eventemitter3';

class App extends Component {
  constructor(properties) {
    super(properties);
    this.ee = new EventEmitter();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Find National Trust Shops near you</h1>
        </header>
        <PostcodeForm ee={this.ee} />
        <RoughDistances ee={this.ee} />
      </div>
    );
  }
}

class PostcodeForm extends React.Component {
  constructor(properties) {
    super(properties);
    this.state = {value: ''};
    this.ee = properties.ee;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    this.ee.emit('postcode', [event.target.value]);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Enter your postcode:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class RoughDistances extends React.Component {
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

export default App;
