import { createCirclesSimulation, update } from './circles'

const states = [
  {name: "AL", lat: 32.806671, lon:	-86.791130, area: 52420.07},
  {name: "AK", lat: 45, lon:	-140, area: 665384.04},
  {name: "AZ", lat: 33.729759, lon:	-111.431221, area: 113990.3},
  {name: "AR", lat: 34.969704, lon:	-92.373123, area: 53178.55},
  {name: "CA", lat: 36.116203, lon:	-119.681564, area: 163694.74},
  {name: "CO", lat: 39.059811, lon:	-105.311104, area: 104093.67},
  {name: "CT", lat: 41.597782, lon:	-72.755371, area: 5543.41},
  {name: "DE", lat: 39.318523, lon:	-75.507141, area: 2488.72},
  {name: "DC", lat: 38.897438, lon:	-77.026817, area: 68.34},
  {name: "FL", lat: 27.766279, lon:	-81.686783, area: 65757.7},
  {name: "GA", lat: 33.040619, lon:	-83.643074, area: 59425.15},
  {name: "HI", lat: 30, lon:	-140, area: 10931.72},
  {name: "ID", lat: 44.240459, lon:	-114.478828, area: 83568.95},
  {name: "IL", lat: 40.349457, lon:	-88.986137, area: 57913.55},
  {name: "IN", lat: 39.849426, lon:	-86.258278, area: 36419.55},
  {name: "IA", lat: 42.011539, lon:	-93.210526, area: 56272.81},
  {name: "KS", lat: 38.526600, lon:	-96.726486, area: 82278.36},
  {name: "KE", lat: 37.668140, lon:	-84.670067, area: 40407.8},
  {name: "LA", lat: 31.169546, lon:	-91.867805, area: 52378.13},
  {name: "ME", lat: 44.693947, lon: -69.381927, area: 35379.74},
  {name: "MD", lat: 39.063946, lon: -76.802101, area: 12405.93},
  {name: "MA", lat: 42.230171, lon: -71.530106, area: 10554.39},
  {name: "MI", lat: 43.326618, lon: -84.536095, area: 96713.51},
  {name: "MN", lat: 45.694454, lon: -93.900192, area: 86935.83},
  {name: "MS", lat: 32.741646, lon: -89.678696, area: 48431.78},
  {name: "MO", lat: 38.456085, lon: -92.288368, area: 69706.99},
  {name: "MT", lat: 46.921925, lon: -110.454353, area: 147039.71},
  {name: "NB", lat: 41.125370, lon: -98.268082, area: 77347.81},
  {name: "NV", lat: 38.313515, lon: -117.055374, area: 110571.82},
  {name: "NH", lat: 43.452492, lon: -71.563896, area: 9349.16},
  {name: "NJ", lat: 40.298904, lon: -74.521011, area: 8722.58},
  {name: "NM", lat: 34.840515, lon: -106.248482, area: 121590.3},
  {name: "NY", lat: 42.165726, lon: -74.948051, area: 54554.98},
  {name: "NC", lat: 35.630066, lon: -79.806419, area: 53819.16},
  {name: "ND", lat: 47.528912, lon: -99.784012, area: 70698.32},
  {name: "OH", lat: 40.388783, lon: -82.764915, area: 44825.58},
  {name: "OK", lat: 35.565342, lon: -96.928917, area: 69898.87},
  {name: "OR", lat: 44.572021, lon: -122.070938, area: 98378.54},
  {name: "PA", lat: 40.590752, lon: -77.209755, area: 46054.35},
  {name: "RI", lat: 41.680893, lon: -71.511780, area: 1544.89},
  {name: "SC", lat: 33.856892, lon: -80.945007, area: 32020.49},
  {name: "SD", lat: 44.299782, lon: -99.438828, area: 77115.68},
  {name: "TN", lat: 35.747845, lon: -86.692345, area: 42144.25},
  {name: "TX", lat: 31.054487, lon: -97.563461, area: 268596.46},
  {name: "UT", lat: 40.150032, lon: -111.862434, area: 84896.88},
  {name: "VT", lat: 44.045876, lon: -72.710686, area: 9616.36},
  {name: "VA", lat: 37.769337, lon: -78.169968, area: 42774.93},
  {name: "WA", lat: 47.400902, lon: -121.490494, area: 71297.95},
  {name: "WV", lat: 38.491226, lon: -80.954453, area: 24230.04},
  {name: "WI", lat: 44.268543, lon: -89.616508, area: 65496.38},
  {name: "WY", lat: 42.755966, lon:	-107.302490, area: 97813.01}
]

const height = 800;
const width = 1000;

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);


const updateDatasetArea = (data, newArea) => {
  return states.map( (data) => {
    return Object.assign(data, {area: newArea})
  });
};

window.createCirclesSimulation = createCirclesSimulation;
window.updateDatasetArea = updateDatasetArea;
window.svg = svg;
window.states = states;
window.update = update;

createCirclesSimulation(svg, states);
