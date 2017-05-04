const latScale = d3.scaleLinear()
                    .domain([47.528912, 27.766279])
                    .range([100, 600])

const lonScale = d3.scaleLinear()
                    .domain([-150, -69.381927])
                    .range([50, 900])

const areaScale = d3.scaleLinear()
                    .domain([68.34, 268596.46])
                    .range([50, 10000])

const textSizeScale = d3.scaleLinear()
                        .domain([68.34, 268596.46])
                        .range([8, 18])






export const update = (svg, data) => {

  let selection = svg.selectAll('g')
                     .data(data)

  // EXIT
  // selection.exit()
  //   .remove();


  // UPDATE
  selection.selectAll('circle')
    .attr('r', (d) => Math.sqrt( (areaScale(d.value) / Math.PI) ));


  // ENTER
  let selectionEnter = selection.enter();

  let selectionEnterGroups = selectionEnter.append('g');

  selectionEnterGroups.append('circle')
    .style('fill', 'rgba(91, 137, 145, 1)')
    .style('stroke', 'black')
    .attr('r', (d) => {
      debugger
      return Math.sqrt( (areaScale(d.value) / Math.PI) )
    });

  selectionEnterGroups.append('text')
    .text((d) => d.name)
    .style('font-family', 'Arial')
    .style('fill', 'white')
    .attr('transform', (d) => {
      return "translate(" + [
        (-1 * textSizeScale(d.value)/1.5),
        (textSizeScale(d.value)/2.4)
      ] + ")"
    })
    .style('font-size', (d) => textSizeScale(d.value));

  return svg.selectAll('g');

}




export const createCirclesSimulation = (svg, data) => {

  const simulation = d3.forceSimulation()
    .force('x', d3.forceX((d) => lonScale(d.lon)).strength(0.30))
    .force('y', d3.forceY((d) => latScale(d.lat)).strength(0.30))
    .force('collide', d3.forceCollide((d) => Math.sqrt( (areaScale(d.value) / Math.PI) ) + 2 ));

  const circleGroups = update(svg, data);

  const ticked = () => {
    circleGroups
      .attr('transform', (d) => "translate(" + d.x + "," + d.y + ")")
  };

  simulation.nodes(data)
    .on("tick", ticked);

  return circleGroups;

};
