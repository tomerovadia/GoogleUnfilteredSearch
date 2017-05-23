# Google Unfiltered.News

[Live Link](http://google-unfiltered-search.herokuapp.com/)

## Background

__Google Unfiltered.News__ is an interactive interface for exploring what's on the mind of others in the country.

This project is inspired by [Alphabet's Unfiltered.News](https://unfiltered.news).

## Technology

This application utilizes a [Google Trends API](https://www.npmjs.com/package/google-trends-api) made available as an npm package. It provides four methods:

* interestOverTime
* interestByRegion
* relatedQueries
* relatedTopics

The app uses JavaScript to format the data and the D3 data visualization library to render it.

Because the API only runs in node, the app utilizes an Express Node.js server to handle API requests.

![wireframe](docs/unfiltered_search_gif.gif)
