const CircleFunctions = require('./circles');
const RelatedQueriesFunctions = require('./related_queries');
const ApiUtil = require('../util/api_util');
const Data = require('./states');
const d3 = require('d3');


const objectToArray = (object) => {
  return Object.keys(object).map((key) => {
    return Object.assign(object[key], {name: key})
  });
};

var dataset = objectToArray(Data.STATES);

const height = 900;
const width = 1300;

const svg = d3.select('#svg-div')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

svg
  .append('g')
  .attr('id', 'keyword-g')
  .style('transform', `translate(${(width / 2)}px, 60px)`)
    .append('text')
    .style("text-anchor", "middle")
    .attr('id', 'keyword-text');

const prepareDataset = (results) => {
  dataset = [];

  for(const key in results){
    const stateObject = Object.assign({}, Data.STATES[key]);
    stateObject.name = key;
    stateObject.value = results[key];
    dataset.push(stateObject);
  };

  return dataset;
};




// Initial factors
const factors = {position: 'geography'};


// Initial render
CircleFunctions.createCirclesSimulation(svg, dataset, factors);




const fetchInterestByRegionAndUpdate = (keyword) => {
  return ApiUtil.fetchInterestByRegion(keyword).then((results) => {
      console.log('interest-by-region', results);
      const dataset = prepareDataset(results);
      CircleFunctions.createCirclesSimulation(svg, dataset, factors);
  });
}


const fetchRelatedQueriesAndUpdate = (keyword) => {
  return ApiUtil.fetchRelatedQueries(keyword)
    .then((results) => {
      console.log('related-queries', results);
      RelatedQueriesFunctions.renderRelatedQueries(results);
    });
};






const dimSVG = () => {
  svg.append('g')
    .attr('id', 'svg-modal-g')
      .append('rect')
      .attr('id', 'svg-modal')
};

const undimSVG = () => {
  svg.select('#svg-modal-g').remove();
};


const showRelatedQueries = () => {
  d3.select('#related-queries-div').style('display', 'block');
};

const showRelatedQueriesLoadingGif = () => {
  d3.select('#related-queries-loading-gif-container').style('display', 'block');
};

const hideRelatedQueriesLoadingGif = () => {
  d3.select('#related-queries-loading-gif-container').style('display', 'none');
};

const hideRelatedQueriesSpans = () => {
  d3.select('#related-queries-div').selectAll('span').style('display', 'none');
};

const showRelatedQueriesSpans = () => {
  d3.select('#related-queries-div').selectAll('span').style('display', 'inline-block');
};

const displayKeywordText = (keyword) => {
  d3.select('#keyword-text').style('display', 'block').html(keyword);
};



// Primary method for executing a new query

export const fetchNewDataAndUpdate = (keyword) => {

  console.log(`\nReceived keyword ${keyword}`);

  displayKeywordText(keyword);

  dimSVG();

  fetchInterestByRegionAndUpdate(keyword).then(undimSVG);

  showRelatedQueries();
  showRelatedQueriesLoadingGif();
  hideRelatedQueriesSpans();

  fetchRelatedQueriesAndUpdate(keyword).then(() => {
    hideRelatedQueriesLoadingGif();
    showRelatedQueriesSpans();
  });
};



// Event Listeners

d3.select('#query-form').on('submit', function() {
  d3.event.preventDefault();
  var keyword = this.querySelector('#keyword-input').value;
  fetchNewDataAndUpdate(keyword);
  this.querySelector('#keyword-input').value = ''; // clear input
});


d3.selectAll('.position-radio-input').on('change', function() {
  factors.position = this.value;
  CircleFunctions.createCirclesSimulation(svg, dataset, factors);
});


d3.select('#keyword-text').on('click', function (d) {
  window.open(`https://www.google.com/#q=${this.innerHTML}`);
});


// Panel functionality

function hideModal(){
  $('#modal').css('display', 'none');
}

$('#explore-visualization-div').on('click', (e) => {
  hideModal();
})

$('#modal-close-div').on('click', (e) => {
  hideModal();
})

$('#modal').on('click', (e) => {
  hideModal();
})

$('#modal-body').on('click', (e) => {
  e.stopPropagation();
})

function hideConsiderBox(){
  $('#consider-div').css('display', 'none');
}

$('.consider-span').on('click', (e) => {
  const keyword = e.target.innerText;
  fetchNewDataAndUpdate(keyword);
})

$('#consider-x').on('click', (e) =>{
  hideConsiderBox();
})
