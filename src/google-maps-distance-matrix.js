import React, { Component } from 'react';
import { ntShops } from './nt-shops';

function onDistanceMatrix(shops, response, status) {
  const distancesFromOrigin = response.rows[0].elements;

  const closestShops = this.closestShopsPostcodeArea.slice();
  // TODO is there a JS equivalent of Python's dict update()?
  closestShops.forEach((shop, i) => {
    shop.status = distancesFromOrigin[i].status;
    shop.distance = distancesFromOrigin[i].distance;
    shop.duration = distancesFromOrigin[i].duration;
  });

  closestShops.sort(function(a, b) {
    if (a.status !== 'OK') { return 1; }
    if (b.status !== 'OK') { return -1; }
    return a.duration.value - b.duration.value;
  });

  // TODO find minimum value in array, record the zip code as you go through the array, then display the zip code.

  // TODO use promises to collect all the results and take action once they have all come back.
  console.log(closestShops.slice(0, 10));

  this.setState({queryInProgress: false, closestShopsGoogleDirections: closestShops.slice(0, 10)});
}

function getDistanceMatrix(origin, travelMode) {
  this.setState({queryInProgress: true});

  const shops = this.closestShopsPostcodeArea;

  const service = new window.google.maps.DistanceMatrixService();

  service.getDistanceMatrix({
      origins: [origin],
      destinations: shops.map(x => x.postcode),
      // travelMode: 'DRIVING',
      travelMode: 'TRANSIT',
      // travelMode: 'WALKING',
      // transitOptions: TransitOptions,
      // drivingOptions: DrivingOptions,
      // unitSystem: UnitSystem,
      avoidHighways: false,
      avoidTolls: false,
    },
    onDistanceMatrix.bind(this, shops)
  );

}

function updateClosestShopsPostcodeArea(closestShopsPostcodeArea) {
  this.closestShopsPostcodeArea = closestShopsPostcodeArea;
}

class GoogleDistances extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      queryInProgress: false,
      closestShopsGoogleDirections: []
    };
    this.closestShopsPostcodeArea = [];
    this.ee = properties.ee;
    this.updateClosestShopsPostcodeArea = updateClosestShopsPostcodeArea.bind(this);
    this.getDistanceMatrix = getDistanceMatrix.bind(this);
  }

  componentDidMount() {
    this.ee.on('closest-shops-postcode-area', this.updateClosestShopsPostcodeArea);
    this.ee.on('get-google-distances', this.getDistanceMatrix);
  }

  componentWillUnmount() {
    this.ee.removeListener('closest-shops-postcode-area', this.updateClosestShopsPostcodeArea);
    this.ee.removeListener('get-google-distances', this.getDistanceMatrix);
  }

  render() {
    if (this.state.queryInProgress) {
      return (
        <div>
          <p>Distances from Google Maps API:</p>
          <p>Querying Google Maps API...</p>
        </div>
      );
    }

    const nearestShopsComponents = this.state.closestShopsGoogleDirections.map((shop, index) => {
      return (
        <li key={index}>
          <div className="shop-name">{shop.name}</div>
          <div className="shop-postcode">{shop.postcode}</div>
          <div className="shop-google-distance">{shop.distance.text}</div>
          <div className="shop-google-duration">{shop.duration.text}</div>
        </li>
      );
    });

    return (
      <div>
        <p>Distances from Google Maps API:</p>
        <ul>{nearestShopsComponents}</ul>
      </div>
    );
  }

}

export default GoogleDistances;
