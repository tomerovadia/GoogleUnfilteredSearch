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






export const createCirclesSimulation = (svg, data) => {

  const simulation = d3.forceSimulation()
    .force('x', d3.forceX((d) => lonScale(d.lon)).strength(0.30))
    .force('y', d3.forceY((d) => latScale(d.lat)).strength(0.30))
    .force('collide', d3.forceCollide((d) => Math.sqrt( (areaScale(d.area) / Math.PI) ) + 2 ))

  const circleGroups = generateCircles(svg, data);

  const ticked = () => {
    circleGroups
    .attr('transform', (d) => "translate(" + d.x + "," + d.y + ")")
  }

  simulation.nodes(data)
    .on("tick", ticked);

  return circleGroups;

}





const generateCircles = (svg, data) => {

  const circleGroups = svg.selectAll('g')
  .data(data)
  .enter().append('g')

  circleGroups.append('circle')
  .attr('r', (d) => Math.sqrt( (areaScale(d.area) / Math.PI) ))
  .style('fill', 'rgba(91, 137, 145, 1)')
  .style('stroke', 'black')

  circleGroups.append('text')
  .text((d) => d.name)
  .style('font-family', 'Arial')
  .style('fill', 'white')
  .attr('transform', (d) => {
    return "translate(" + [
      (-1 * textSizeScale(d.area)/1.5),
      (textSizeScale(d.area)/2.4)
    ] + ")"
  })
  .style('font-size', (d) => textSizeScale(d.area));

  return circleGroups;

}
