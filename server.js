var googleTrends = require('google-trends-api');
var express = require('express');
var app = express();

app.get('/', (req, res) => {
   console.log("Got a GET request for the homepage");
   googleTrends.interestByRegion({
     geo: 'US',
     resolution: 'state',
     keyword: req.query.keyword,
   }).then(
     (results) => res.send(results),
     (errors) => res.send(errors) )
})


var server = app.listen(8081, () => {

   var host = server.address().address
   var port = server.address().port

   console.log("Google Trends Explorer App API listening at http://%s:%s", host, port)
})
