const d3 = require('d3');

const horizontalRange = [150, 1100];
const verticalRange = [200, 800];
const bubbleAreaRange = [150, 10000];
const textSizeRange = [8, 18];



const latScale = d3.scaleLinear()
                    .domain([47.528912, 27.766279])
                    .range(verticalRange)


const lonScale = d3.scaleLinear()
                    .domain([-150, -69.381927])
                    .range(horizontalRange)



const getMinMax = (data, factor) => {

  const values = Object.keys(data).map((key) => data[key][factor]);

  const min = Math.min.apply(null, values);
  const max = Math.max.apply(null, values);

  return [min, max];
}


const createScale = (data, factor, range) => {
  return d3.scaleLinear()
          .domain(getMinMax(data, factor))
          .range(range)
}

const calculateCircleColor = (d, factors) => {
  if(factors.position === 'president2016'){

    if(d.president2016 === 0){
      return 'blue';
    } else if(d.president2016 === 2){
      return 'red';
    } else {
      return 'gray';
    }

  } else {

    return 'gray';

  }
};









const renderCircles = (svg, data, factors) => {

  const scales = {
    areaScale: createScale(data, 'value', bubbleAreaRange),
    textSizeScale: createScale(data, 'value', textSizeRange),
  };

  let selection = svg.selectAll('g')
                     .data(data, (d) => d.name)

 const enterCircles = () => {
   let selectionEnterGroups = selection.enter().append('g');

   selectionEnterGroups.append('circle')
     .transition()
     .style('fill', (d) => calculateCircleColor(d, factors))
     .style('stroke', 'black')
     .attr('r', (d) => Math.sqrt( (scales.areaScale(d.value) / Math.PI) ));

   selectionEnterGroups.append('text')
     .text((d) => d.name)
     .style('font-family', 'Arial')
     .style('fill', 'white')
     .attr('x', (d) => (-1 * scales.textSizeScale(d.value)/1.5))
     .attr('y', (d) => (scales.textSizeScale(d.value)/2.4))
     .style('font-size', (d) => scales.textSizeScale(d.value));
 };

  const updateCircles = () => {

    svg.selectAll('g').selectAll('circle')
      .data(data, d => d.name)
      .transition()
      .attr('r', (d) => Math.sqrt( (scales.areaScale(d.value) / Math.PI) ))
      .style('fill', (d) => calculateCircleColor(d, factors));

    svg.selectAll('g').selectAll('text')
      .data(data, d => d.name)
      .attr('x', (d) => (-1 * scales.textSizeScale(d.value)/1.5))
      .attr('y', (d) => (scales.textSizeScale(d.value)/2.4))
      .style('font-size', (d) => scales.textSizeScale(d.value));
  };

  const exitCircles = () => {
    selection.exit().transition().remove();
  };



  exitCircles(selection.exit(), scales);
  updateCircles();
  enterCircles(selection.enter(), scales);

  return svg.selectAll('g');

};



const applyXYForces = (simulation, xScale, yScale, xFactor, yFactor) => {
  simulation
    .force('x', d3.forceX((d) => xScale(d[xFactor])).strength(0.4))
    .force('y', d3.forceY((d) => yScale(d[yFactor])).strength(0.4))
};



exports.createCirclesSimulation = (svg, data, factors) => {


  const areaScale = createScale(data, 'value', bubbleAreaRange);

  const simulation = simulation || d3.forceSimulation();
  simulation.velocityDecay(0.4); // Prevent circles from spazing
  simulation.restart();

  // Determine position of the circles
  if(factors.position == 'geography'){
    applyXYForces(simulation, lonScale, latScale, 'lon', 'lat');
  } else if(factors.position == 'president2016') {
    const groupScale = createScale(data, 'president2016', horizontalRange);
    applyXYForces(simulation, groupScale, latScale, 'president2016', 'lat');
  }

  // Prevent circles from overlapping
  simulation
    .force('collide', d3.forceCollide((d) => Math.sqrt( areaScale(d.value) / Math.PI ) + 2 ) );

  const circleGroups = renderCircles(svg, data, factors);

  const ticked = () => {
    circleGroups
      .attr('transform', (d) => "translate(" + d.x + "," + d.y + ")")
  };

  simulation.nodes(data)
    .on("tick", ticked);


  return circleGroups;

};
