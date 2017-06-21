const d3 = require('d3');
const MainFunctions = require('./main.js');

const createScale = (data, range) => {
  return d3.scaleLinear()
          .domain(getMinMax(data, factor))
          .range(range)
}

exports.renderRelatedQueries = (data) => {
  const spanOpacityRange = [0.5, 1];
  const relatednessValues = data.map((result) => result[1]);
  const spanOpacityDomain = [Math.min(...relatednessValues), Math.max(...relatednessValues)]
  const spanOpacityScale = d3.scaleLinear().domain(spanOpacityDomain).range(spanOpacityRange);

  const relatedQueriesDiv = d3.select('#related-queries-div')

  const selection = relatedQueriesDiv.selectAll('span').data(data);

  // Update
  selection
    .html((d) => `${d[0]} &#9679; ${d[1]}`)
    .style('background-color', (d) => `rgba(0, 0, 244, ${spanOpacityScale(d[1])})`);

  // Enter
  selection.enter()
    .append('span')
      .attr('class', 'related-queries-span')
      .html((d) => `${d[0]} &#9679; ${d[1]}`)
      .style('color', 'white')
      .style('background-color', (d) => `rgba(0, 0, 244, ${spanOpacityScale(d[1])})`);

  // Exit
  selection.exit()
    .remove();


  const relatedQueriesSpans = d3.selectAll('.related-queries-span');

  relatedQueriesSpans.on('click', function(d) {
    MainFunctions.fetchNewDataAndUpdate(d[0])
  });

  if(data.length === 0){
    d3.select('#no-related-queries-text').style('display','block')
  } else {
    d3.select('#no-related-queries-text').style('display','none')
  }

};
