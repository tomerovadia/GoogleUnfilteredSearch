

exports.fetchInterestByRegion = (keyword) => {

  return $.ajax({
    method: 'get',
    url: `/interest-by-region?keyword=${keyword}`
  });

};
