const d3 = require('d3');



exports.renderRelatedQueries = (data) => {
  const relatedQueriesDiv = d3.select('#related-queries-div');

  const selection = relatedQueriesDiv.selectAll('span').data(data);

  selection
    .html((d) => d[0])

  selection.enter()
    .append('span')
      .html((d) => d[0])

  selection.exit()
    .remove();
};
