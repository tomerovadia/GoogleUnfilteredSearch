const CircleFunctions = require('./circles');
const ApiUtil = require('../util/api_util');
const d3 = require('d3');


let states = {
  AL: {lat: 32.806671, lon:	-86.791130, value: 52420.07},
  AK: {lat: 45, lon:	-140, value: 268596.46},
  AZ: {lat: 33.729759, lon:	-111.431221, value: 113990.3},
  AR: {lat: 34.969704, lon:	-92.373123, value: 53178.55},
  CA: {lat: 36.116203, lon:	-119.681564, value: 163694.74},
  CO: {lat: 39.059811, lon:	-105.311104, value: 104093.67},
  CT: {lat: 41.597782, lon:	-72.755371, value: 5543.41},
  DE: {lat: 39.318523, lon:	-75.507141, value: 2488.72},
  DC: {lat: 38.897438, lon:	-77.026817, value: 68.34},
  FL: {lat: 27.766279, lon:	-81.686783, value: 65757.7},
  GA: {lat: 33.040619, lon:	-83.643074, value: 59425.15},
  HI: {lat: 30, lon:	-140, value: 10931.72},
  ID: {lat: 44.240459, lon:	-114.478828, value: 83568.95},
  IL: {lat: 40.349457, lon:	-88.986137, value: 57913.55},
  IN: {lat: 39.849426, lon:	-86.258278, value: 36419.55},
  IA: {lat: 42.011539, lon:	-93.210526, value: 56272.81},
  KS: {lat: 38.526600, lon:	-96.726486, value: 82278.36},
  KY: {lat: 37.668140, lon:	-84.670067, value: 40407.8},
  LA: {lat: 31.169546, lon:	-91.867805, value: 52378.13},
  ME: {lat: 44.693947, lon: -69.381927, value: 35379.74},
  MD: {lat: 39.063946, lon: -76.802101, value: 12405.93},
  MA: {lat: 42.230171, lon: -71.530106, value: 10554.39},
  MI: {lat: 43.326618, lon: -84.536095, value: 96713.51},
  MN: {lat: 45.694454, lon: -93.900192, value: 86935.83},
  MS: {lat: 32.741646, lon: -89.678696, value: 48431.78},
  MO: {lat: 38.456085, lon: -92.288368, value: 69706.99},
  MT: {lat: 46.921925, lon: -110.454353, value: 147039.71},
  NE: {lat: 41.125370, lon: -98.268082, value: 77347.81},
  NV: {lat: 38.313515, lon: -117.055374, value: 110571.82},
  NH: {lat: 43.452492, lon: -71.563896, value: 9349.16},
  NJ: {lat: 40.298904, lon: -74.521011, value: 8722.58},
  NM: {lat: 34.840515, lon: -106.248482, value: 121590.3},
  NY: {lat: 42.165726, lon: -74.948051, value: 54554.98},
  NC: {lat: 35.630066, lon: -79.806419, value: 53819.16},
  ND: {lat: 47.528912, lon: -99.784012, value: 70698.32},
  OH: {lat: 40.388783, lon: -82.764915, value: 44825.58},
  OK: {lat: 35.565342, lon: -96.928917, value: 69898.87},
  OR: {lat: 44.572021, lon: -122.070938, value: 98378.54},
  PA: {lat: 40.590752, lon: -77.209755, value: 46054.35},
  RI: {lat: 41.680893, lon: -71.511780, value: 1544.89},
  SC: {lat: 33.856892, lon: -80.945007, value: 32020.49},
  SD: {lat: 44.299782, lon: -99.438828, value: 77115.68},
  TN: {lat: 35.747845, lon: -86.692345, value: 42144.25},
  TX: {lat: 31.054487, lon: -97.563461, value: 268596.46},
  UT: {lat: 40.150032, lon: -111.862434, value: 84896.88},
  VT: {lat: 44.045876, lon: -72.710686, value: 9616.36},
  VA: {lat: 37.769337, lon: -78.169968, value: 42774.93},
  WA: {lat: 47.400902, lon: -121.490494, value: 71297.95},
  WV: {lat: 38.491226, lon: -80.954453, value: 24230.04},
  WI: {lat: 44.268543, lon: -89.616508, value: 65496.38},
  WY: {lat: 42.755966, lon:	-107.302490, value: 97813.01},
}

const height = 800;
const width = 1000;

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);


const sampleResults = {
  DC: 100,
  MD: 74,
  NJ: 67,
  NC: 66,
  GA: 65,
  NY: 65,
  FL: 64,
  AL: 64,
  PA: 64,
  IL: 64,
  MA: 63,
  MO: 63,
  OH: 63,
  CT: 63,
  CO: 62,
  MS: 62,
  LA: 62,
  NH: 61,
  DE: 61,
  AZ: 61,
  WA: 60,
  MI: 60,
  TN: 60,
  IN: 60,
  SC: 59,
  VA: 59,
  KY: 59,
  RI: 59,
  NV: 59,
  NM: 58,
  ME: 58,
  WI: 58,
  VT: 58,
  OK: 57,
  CA: 57,
  AR: 57,
  AK: 57,
  IA: 57,
  WY: 57,
  WV: 56,
  MT: 56,
  TX: 56,
  MN: 55,
  HI: 54,
  ID: 54,
  NE: 53,
  SD: 52,
  UT: 52,
  ND: 51,
  KS: 50,
  OR: 40
}


const updateDataset = (results) => {
  for (const key in results){
    console.log(key);
    states[key].value = results[key];
  };
};




const objectToArray = (object) => {
  return Object.keys(object).map((key) => {
    return Object.assign(object[key], {name: key})
  });
};



window.createCirclesSimulation = CircleFunctions.createCirclesSimulation;
window.svg = svg;
window.states = states;
window.update = CircleFunctions.update;

CircleFunctions.createCirclesSimulation(svg, objectToArray(states));



// ApiUtil.fetchInterestByRegion('technology').then((results) => updateDataset(results))


updateDataset(sampleResults);
setTimeout(() => CircleFunctions.createCirclesSimulation(svg, objectToArray(states)), 3000);
