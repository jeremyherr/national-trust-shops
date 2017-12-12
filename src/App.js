import React, { Component } from 'react';
import EventEmitter from 'eventemitter3';
import PostcodeForm from './postcode-form';
import RoughDistances from './rough-distances';
import GoogleDistances from './google-maps-distance-matrix';

import './App.css';

class App extends Component {
  constructor(properties) {
    super(properties);
    this.ee = new EventEmitter();
  }

  render() {
    return (
      <div className="container">
        <div className="App">
          <div className="row">
            <div className="col-12">
              <header className="App-header">
                <h1 className="App-title">Find National Trust Shops near you</h1>
              </header>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
                <PostcodeForm ee={this.ee} />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <RoughDistances ee={this.ee} />
            </div>
            <div className="col-6">
              <GoogleDistances ee={this.ee} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
