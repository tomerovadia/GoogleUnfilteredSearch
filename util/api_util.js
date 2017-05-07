const request = require("tinyreq");




exports.fetchInterestByRegion = (keyword) => {

  return $.ajax({
    method: 'get',
    url: `/interest-by-region?keyword=${keyword}`
  });

};




exports.fetchTopQueriesByState = () => {
  request("http://ionicabizau.net/", function (err, body) {
    console.log(err || body); // Print out the HTML
  });
}
