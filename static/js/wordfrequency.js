var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var svg = d3.select("#result").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("../../static/js/words.json", function(error, data) {
  data = data.result[0].media;

  x.domain(d3.keys(data).map(function(d) { return d; }));
  y.domain([0, d3.max(d3.keys(data), function(d) { return data[d]; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
        .style("text-anchor","start")
        .style("transform","rotate(45deg)");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("dy", ".41em")
      .style("text-anchor", "end")
      .text("Total");

  svg.selectAll(".bar")
      .data(d3.keys(data))
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(data[d]); })
      .attr("height", function(d) { return height - y(data[d]); });

  svg.selectAll(".tips")
      .data(d3.keys(data))
    .enter().append("text")
      .attr("class", "tips")
      .attr("x", function(d) { return x(d); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(data[d]); })
      .attr("height", function(d) { return height - y(data[d]); });    
  
  svg.selectAll(".bar")
      .data(d3.keys(data))
    .enter().append()

});

