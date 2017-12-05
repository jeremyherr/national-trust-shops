import React, { Component } from 'react';
import EventEmitter from 'eventemitter3';
import PostcodeForm from './postcode-form';
import RoughDistances from './rough-distances';

import './App.css';

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

export default App;
