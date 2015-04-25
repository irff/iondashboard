var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2.8,
    padding = 10;

var color = d3.scale.ordinal()
  .range(["#F44336", "#FF9800", "#4FC3F7", "#3F51B5", "#009688", "#00E676", "#FFEB3B"]);

var percentageFormat = d3.format("%");

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - 75);

var pie = d3.layout.pie()
    .value(function(d) { return d.total; });

function sum(data){
  res = 0;
  Object.keys(data[0].media).forEach(function(d){res += data[0].media[d]});
  return res;  
}

var val = '';

d3.json("../../static/js/medsum.json", function(error, data) {
  data = data.result
  color.domain(d3.keys(data[0]["media"]));
  // console.log(color.domain());
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
      .text(function(d) { console.log(d);return d+" ("+data[0]["media"][d]+")"; });

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
      .text(function(d) { return "Media Summary"; });

  var gg = d3.select("#result").selectAll(".pie")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "val");

  val = data[0].media;
  percent = color.domain();
  var i = 0;
  var tot = sum(data);
  percent.forEach(function(e){
    // console.log(e);
    svg.append("text")
      .attr("transform", function(d) {
        //console.log(arc.centroid(pie(d.total)[i]));
        return "translate(" + arc.centroid(pie(d.total)[i]) + ")";
      })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size","13px")
      .text(function(d) { return Math.floor((d.media[e]/tot)*100000)/1000+"%"; });
      i +=1;
  });
  // console.log(color.domain());

});

