import React, { Component } from 'react';
import { ntShops } from './nt-shops';
import { postcodeAreaLocations } from './postcode-area-locations';

// Google Maps API limitation
const MAX_DIMENSION_ALLOWED = 25;

function distanceBetweenPostcodeAreas(origin, destination) {
  const originArea = origin.toLowerCase().match(/^([a-z]+)\d?/)[1];
  const destinationArea = destination.toLowerCase().match(/^([a-z]+)\d?/)[1];

  // There are 7 Northern Ireland shop locations, but the free OS data has no NI locations
  if (!(destinationArea in postcodeAreaLocations)) {
    console.warn(`destination area ${destinationArea} not found`);
    return 10000000;
  }

  if (!(originArea in postcodeAreaLocations)) {
    return 10000000;
  }

  const {easting: originEasting, northing: originNorthing} = postcodeAreaLocations[originArea];
  const {easting: destinationEasting, northing: destinationNorthing} = postcodeAreaLocations[destinationArea];

  return Math.sqrt(Math.pow(originEasting - destinationEasting, 2) + Math.pow(originNorthing - destinationNorthing, 2));
}

function closestShopsRoughly(origin, numberOfShops) {
  ntShops.forEach(shop => {
    shop.distance = distanceBetweenPostcodeAreas(origin, shop.postcode);
  });

  ntShops.sort((a, b) => a.distance - b.distance);

  return ntShops.slice(0, numberOfShops);
}

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
    let nearestShopsComponents;
    if (/^[A-Za-z]+(\d+)?/.test(this.state.postcode)) {
      const nearestShops = closestShopsRoughly(this.state.postcode, MAX_DIMENSION_ALLOWED);
      nearestShopsComponents = nearestShops.map((shop, index) => {
        return (
          <li key={index}>
            {shop.name}, {shop.postcode}, {shop.distance}
          </li>
        );
      });
    } else {
      nearestShopsComponents = [(
        <li key={0}>
          EMPTY
        </li>
      )];
    }

    return (
      <div>
        <p>Rough guess of closest 25 shops based on distance between postcode areas:</p>
        <ol>{nearestShopsComponents}</ol>
      </div>
    );
  }
}

export default RoughDistances;