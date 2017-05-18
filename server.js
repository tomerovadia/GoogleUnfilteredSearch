require('use-strict');
require('strict-mode');
"use-strict"

var googleTrends = require('google-trends-api');
var express = require('express');
var jbuilder = require('jbuilder');
var app = express();



// Fomatting results

const formatInterestByRegionResults = (rawResults) => {
  const formattedResults = {};
  const parsedResults = JSON.parse(rawResults).default.geoMapData;

  for(let i=0; i < parsedResults.length; i++){
    const rawStateResult = parsedResults[i];
    const state = rawStateResult.geoCode.slice(-2);
    formattedResults[state] = rawStateResult.value[0];
  }

  console.log('formattedResults', formattedResults);
  return formattedResults;
}


const formatRelatedKeywordsResults = (rawResults) => {
  console.log(JSON.parse(rawResults).default.rankedList[1].rankedKeyword.map((result) => [result.query, result.value]));
  return JSON.parse(rawResults).default.rankedList[1].rankedKeyword.map((result) => [result.query, result.value]);
};



// Routes and controller actions

app.get('/interest-by-region', (req, res) => {
  keyword = req.query.keyword;

  console.log(`Received interest-by-region request for keyword "${keyword}"`);

  if(keyword === ''){

    res.send({});

  } else {

    const date = new Date(); // set date to today
    date.setDate(date.getDate() - 1); // change date to yesterday

    googleTrends.interestByRegion({
     geo: 'US',
     resolution: 'State',
     keyword: keyword,
     startTime: date,
    }).then(
        (results) => res.send(formatInterestByRegionResults(results)),
        (errors) => res.send(errors)
    );

  }

});


app.get('/related-queries', (req, res) => {

  const keyword = req.query.keyword;

  console.log(`Received related-queries request for keyword "${keyword}"`);

  if(keyword === ''){
    res.send([]);
  } else {

    // Set yesterday variable to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    googleTrends.relatedQueries({
     geo: 'US',
     keyword: keyword,
     startTime: yesterday,
    }).then(
        (results) => res.send(formatRelatedKeywordsResults(results)),
        (errors) => res.send(errors)
    );

  }
});




// Server

// Make the public folder accessible
app.use(express.static('public'));

// Route for the root (pun intended)
app.get('/index.html', function (req, res) {
  console.log('Serving index.html');
  res.sendFile( __dirname + "/" + "index.html" );
});


// Set up server
var server = app.listen(process.env.PORT || 8081, () => {

  //  var host = server.address().address
  //  var port = server.address().port

   console.log("Google Trends Explorer App API listening at 8081");
});
