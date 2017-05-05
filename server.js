var googleTrends = require('google-trends-api');
var express = require('express');
var jbuilder = require('jbuilder');
var app = express();


// Turn raw API response for a single state into the object format needed
const formatStateResult = (rawStateResult) => {
  const state = rawStateResult.geoCode.slice(-2);

  return {
    'value': rawStateResult.value[0],
    'name': state,
  };
};




app.get('/interest-by-region', (req, res) => {
  console.log(`Received interest-by-region request for keyword "${req.query.keyword}"`);

   googleTrends.interestByRegion({
     geo: 'US',
     resolution: 'state',
     keyword: req.query.keyword,
   }).then(

     (results) => {
       const formattedResults = JSON.parse(results).default.geoMapData.map( (rawStateResult) => {
         return formatStateResult(rawStateResult);
       });

       res.send(formattedResults);
     },

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
