var googleTrends = require('google-trends-api');
var express = require('express');
var jbuilder = require('jbuilder');
var app = express();


// Turn raw API response for A SINGLE state into the object format needed
// const formatStateResult = (rawStateResult) => {
//
//
//   return {[state]: };
// };


// Turn raw API response for ALL states into the object format needed
const formatStateResults = (rawStateResults) => {
  const formattedResults = {};
  const parsedStateResults = JSON.parse(rawStateResults).default.geoMapData;

  for(let i=0; i < parsedStateResults.length; i++){
    const rawStateResult = parsedStateResults[i];
    const state = rawStateResult.geoCode.slice(-2);
    formattedResults[state] = rawStateResult.value[0];
  }

  return formattedResults;
}




app.get('/interest-by-region', (req, res) => {
  console.log(`Received interest-by-region request for keyword "${req.query.keyword}"`);

   googleTrends.interestByRegion({
     geo: 'US',
     resolution: 'state',
     keyword: req.query.keyword,
   }).then(
        (results) => res.send(formatStateResults(results)),
        (errors) => res.send(errors)
   )
})



// Make the public folder accessible
app.use(express.static('public'));

// Route for the root (pun intended)
app.get('/index.html', function (req, res) {
  console.log('Serving index.html');
  res.sendFile( __dirname + "/" + "index.html" );
})


// Set up server
var server = app.listen(8081, () => {

   var host = server.address().address
   var port = server.address().port

   console.log("Google Trends Explorer App API listening at http://%s:%s", host, port)
})
