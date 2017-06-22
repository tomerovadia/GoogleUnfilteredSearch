# Google Unfiltered.Search

[Live Link](http://www.unfilteredsearch.site/)

![wireframe](docs/unfiltered_search_gif.gif)

## Overview

__Google Unfiltered.Search__ is an interactive interface for exploring what's on the mind of others in the United States.

This project is inspired by [Jigsaw's Unfiltered.News](https://unfiltered.news).

## Technology

This application utilizes a [Google Trends API](https://www.npmjs.com/package/google-trends-api) made available as an npm package. (Note: Google does not provide an official Google Trends API -- this is a publicly available alternative).

The npm package provides four methods. The two methods used by this app are `interestByRegion()` and `relatedQueries()`.

The app uses JavaScript to format the data and the D3 data visualization library to render it. It uses D3's enter/exit/update pattern to handle changes to circles and related queries (see my simple demo [here](https://github.com/tomerovadia/D3EnterExitUpdateDemo)).

Because the API only runs in node, the app includes an Express Node.js server which receives requests from the app and routes them to the API.

## Server

The app's Node server makes two API endpoints available to the app:

* `GET /interest-by-region, and`
* `GET /related-queries`

These paths correspond to the Google Trends API methods with the same names, which they call to retrieve data.

In the below example, this function is called when a request matches the `get` request and `/interest-by-region` path. The function is passed a request object (which contains the keyword) and a response object (onto which the results, or errors, are loaded).

The Google Trends API accepts `geo` and `resolution` parameters that can provide highly customized data. But for the purposes of this app, the call is always made with `geo` of "US" and `resolution` of "State".

``` JavaScript
// server.js
...
app.get('/interest-by-region', (req, res) => {
  ...

  googleTrends.interestByRegion({
   geo: 'US',
   resolution: 'State',
   keyword: req.query.keyword,
   startTime: yesterday,
  }).then(
      (results) => res.send(formatInterestByRegionResults(results)),
      (errors) => res.send(errors)
  )
});
...
```

Ajax is then used by the app to access the Node server API endpoints.

```javascript
// api_util.js
...
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
...
```

## Single Responsibility Principle and Promises

``` JavaScript
// main.js
...
export const fetchNewDataAndUpdate = (keyword) => {

  console.log(`\nReceived keyword ${keyword}`);

  displayKeywordText(keyword);

  dimSVG();

  fetchInterestByRegionAndUpdate(keyword).then(undimSVG);

  RelatedQueriesFunctions.showRelatedQueries();
  RelatedQueriesFunctions.showRelatedQueriesLoadingGif();
  RelatedQueriesFunctions.hideRelatedQueriesSpans();

  fetchRelatedQueriesAndUpdate(keyword).then(() => {
    RelatedQueriesFunctions.hideRelatedQueriesLoadingGif();
    RelatedQueriesFunctions.showRelatedQueriesSpans();
  });
};
...
```

The app demonstrates programming's **single responsibility principle**, with each function fulfilling one purpose.

The above function is the main function that executes all logic for updating the visualization. The two primary functions used are `fetchInterestByRegionAndUpdate(keyword)` and `fetchRelatedQueriesAndUpdate(keyword)`, reflecting the two primary changes that are made to the visualization and the two API calls made (i.e. circles and related queries).

The function also demonstrates proper use of promises. For example, the SVG on which the circles are painted is dimmed (to demonstrate to the user that an update is in progress) and only undimmed after the asynchronous update to the circles is completed.

 ``` javascript
 fetchInterestByRegionAndUpdate(keyword).then(undimSVG);
 ```

 Promises are similarly used to wait for the related queries to update before showing them and hiding the loading gif.

## DRY Code

The app avoids repetition and adheres to DRY principles by re-using code.

For example, the app uses many D3 scales to position and size the visualization (e.g. latitude/longitude scales, areaScale, textSizeScale). Because these scales are similar, all scales are created using the same `createScale()` method.

```JavaScript
// circles.js
...
const createScale = (data, factor, range) => {
  return d3.scaleLinear()
          .domain(getMinMax(data, factor))
          .range(range)
}
...

```

Where relevant, the scales are grouped together in an object.

```JavaScript
// circles.js
...
const scales = {
  areaScale: createScale(data, 'value', bubbleAreaRange),
  textSizeScale: createScale(data, 'value', textSizeRange),
};
...
```

## Circles

Each circle is a `g` D3 group object, with a `circle` and a `text` (state abbreviation) appended onto it.

### Enter/Exit/Update Pattern

The app uses D3's enter/exit/update pattern to handle changes to circles. While many D3 developers only use `.enter()`, this app leverages the full power of the library's ability to allow circles to disappear, re-appear and transition slowly to new sizes.

In particular, the D3 `.data()` method embeds data into the HTML elements of a D3 selection. It takes an optional argument that matches data to elements through a common value -- in this case, this value is the `name` of the state. This ensures, for example, that new data associated with California is applied to the California circle.

```JavaScript
// circles.js
...
let selection = svg.selectAll('.circle-g')
                   .data(data, (d) => d.name)
...
```

Following the `.data()` function, D3 makes available `.exit()` and `.enter()` functions. These functions further filter the selection to circles without corresponding data (circles that should *exit*) and data that doesn't already have a corresponding circle (circles that should *enter*).

The update selection (those circles *with* corresponding data, which may need updating if the data is new) is selected by default, without a method like `.exit()` or `.update()`.

The app has separate helper methods for handling each of these sub-selections.

```JavaScript
// circles.js
...
const renderCircles = (svg, data, factors) => {

  ...

  let selection = svg.selectAll('.circle-g')
                     .data(data, (d) => d.name)

 // Enter helper
 const enterCircles = () => {
   let selectionEnterGroup = selection.enter()
                                      .append('g')
                                      .attr('class','circle-g');

   selectionEnterGroup.append('circle')
     // ... attributes of newly entered circles

   selectionEnterGroup.append('text')
     // ... attributes of text overlaid on circles
 };


 // Update helper
  const updateCircles = () => {

    svg.selectAll('.circle-g').selectAll('circle')
      // ... attributes of circles that may need to change with new data

    svg.selectAll('.circle-g').selectAll('text')
      // ... attributes of circle text that may need to change with new data
  };


  // Exit helper
  const exitCircles = () => {
    selection.exit().transition().remove();
  };


  exitCircles();
  updateCircles();
  enterCircles();

};
...
```

### Simulation

The app creates a D3 Simulation object that determines how circles move and interact with each other. Specifically, it applies these attributes/forces:

Keeps circles from overlapping:

```javascript
d3.forceCollide((d) => Math.sqrt( areaScale(d.value) / Math.PI ) + 2 )
```

Moves circle `g` groups whenever their position is disrupted by a force, using `ticked()` callback:

```javascript
simulation.nodes(data).on("tick", ticked);
```

Slows circle movement to prevent spazzing effect:

```javascript
simulation.velocityDecay(0.4);
```

Determines the x and y coordinates (position) of circles:

```javascript
.force('x', d3.forceX((d) => xScale(d[xFactor])).strength(0.4))
.force('y', d3.forceY((d) => yScale(d[yFactor])).strength(0.4))
```

### Starting Sizes/Positions

Circles are initially sized based on geographic area and positioned based on geographic location. This data is stored in the file `states.js.`

This dataset also includes data on the 2016 election outcome, which, like geographic location and area, are also constants.

```javascript
// states.js
exports.STATES = {
  AL: {lat: 32.806671, lon:	-86.791130, value: 52420.07, president2016: 2},
  AK: {lat: 45, lon:	-140, value: 268596.46, president2016: 2},
  AZ: {lat: 33.729759, lon:	-111.431221, value: 113990.3, president2016: 2},
  AR: {lat: 34.969704, lon:	-92.373123, value: 53178.55, president2016: 2},
  CA: {lat: 36.116203, lon:	-119.681564, value: 163694.74, president2016: 0},
  ...
}
```

### Size

Because the Google Trends API returns arbitrary ranges of values reflecting how much a state searches a keyword, the app needs to adjust to any range it is given.

This is accomplished through a helper method that takes a dataset as an argument and returns the minimum and maximum values of that dataset.

```javascript
// circles.js
...
const getMinMax = (data, factor) => {
  const values = Object.keys(data).map((key) => data[key][factor]);
  const min = Math.min.apply(null, values);
  const max = Math.max.apply(null, values);

  return [min, max];
}
...
```

This result is then used in creating a D3 scale that adjusts any domain of values to a constant, built-in range of circle areas (i.e. `const bubbleAreaRange = [150, 10000]`).

```javascript
// circles.js
...
const createScale = (data, factor, range) => {
  return d3.scaleLinear()
          .domain(getMinMax(data, factor))
          .range(range)
}
...
```

### Positioning

The positions of the circles are determined by either Geography or 2016 Election Outcome -- in either case, these are constants manually included in the app in `states.js`.

The app applies the x and y forces on the simulation (see above) based on the position factor passed when updating the circles.

```javascript
// circles.js
...
switch(factors.position){
  case 'geography':
    applyXYForces(simulation, lonScale, latScale, 'lon', 'lat');
    break;
  case 'president2016':
    const groupScale = createScale(data, 'president2016', horizontalRange);
    applyXYForces(simulation, groupScale, latScale, 'president2016', 'lat');
    break;
};
...
```

### Color

Circles are colored using D3's `.style` property and a helper function `calculateCircleColor()`.

```javascript
// circle.js
...
.style('fill', (d) => calculateCircleColor(d, factors))
...
```

The helper function determines the color of a circle based on the position factor selected by the user (i.g. if Geography, then all circles are green, if 2016 Election Outcome, then circles are colored by party).

```javascript
// circles.js
...
const calculateCircleColor = (d, factors) => {
  if(factors.position === 'president2016'){

    switch(d.president2016){
      case 0:
        return 'blue';
      case 2:
        return 'red';
      default:
        return 'rgb(251, 188, 5)';
    }

  } else {

    return 'rgb(57, 168, 83)';

  }
};
...
```
