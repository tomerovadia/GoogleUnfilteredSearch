

exports.fetchInterestByRegion = (keyword) => {

  return $.ajax({
    method: 'get',
    url: `/interest-by-region?keyword=${keyword}`,
  });

};

exports.fetchRelatedQueries = (keyword) => {

  return $.ajax({
    method: 'get',
    url: `/related-queries?keyword=${keyword}`,
  });

};
