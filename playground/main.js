const canvas = document.getElementById('canvas');


const dataset = [10, 15, 20, 30, 17]


d3.select('body').selectAll('div')
  .data(dataset)
  .enter()
  .append('div')
  .attr('class', 'bar')
  .style('height', (d) => d + 'px')


const height = 300;
const width = 300;



const svg = d3.select('body')
              .append('svg')
              .attr('width', width)
              .attr('height', height);

svg.selectAll('circle')
   .data(dataset)
   .enter()
   .append('circle')
   .attr('cx', (d, i) => i * 50 + 20)
   .attr('cy', (d, i) => 40)
   .attr('r', (d) => d);



if (canvas.getContext){
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'red';
  ctx.fillRect(10, 10, 50, 50);

  ctx.fillStyle = 'lightblue';
  ctx.fillRect(15, 15, 50, 50);

  ctx.beginPath();
  ctx.moveTo(75, 50);
  ctx.lineTo(100, 75);
  ctx.lineTo(100, 25);
  ctx.fillStyle ='orange';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(20, 100, 15, 0, Math.PI * 2);
  ctx.fillStyle = 'green';
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fill();

} else {

}
