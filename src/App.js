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
      <div className="container">
        <div className="App">
          <div className="row">
            <div className="col-12">
              <header className="App-header">
                <h1 className="App-title">Find National Trust Shops near you</h1>
              </header>
            </div>
            <div className="row">
              <div className="col">
                <PostcodeForm ee={this.ee} />
              <div className="col">
              </div>
                <RoughDistances ee={this.ee} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
