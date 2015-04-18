var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2.8,
    padding = 10;

var color = d3.scale.ordinal()
  .range(["#F44336", "#FF9800", "#4FC3F7", "#3F51B5", "#009688", "#00E676", "#FFEB3B"]);

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - 55);

var pie = d3.layout.pie()
    .value(function(d) { return d.total; });

d3.json("../../static/js/medsum.json", function(error, data) {
  data = data.result
  color.domain(d3.keys(data[0]["media"]));
  console.log(color.domain());
  data.forEach(function(d) {
    //console.log(d);
    d.total = color.domain().map(function(name) {
      return {name: name, total: d["media"][name]};
    });
  });

  var legend = d3.select("#result").append("svg")
      .attr("class", "legend")
      .attr("width", radius * 2)
      .attr("height", radius * 2)
    .selectAll("g")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(200," + i * 25 + ")"; });

  legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

  var svg = d3.select("#result").selectAll(".pie")
      .data(data)
    .enter().append("svg")
      .attr("class", "pie")
      .attr("width", radius * 2)
      .attr("height", radius * 2)
    .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  svg.selectAll(".arc")
      .data(function(d) { return pie(d.total); })
    .enter().append("path")
      .attr("class", "arc")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.name); });

  svg.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return "insert keyword here"; });

});