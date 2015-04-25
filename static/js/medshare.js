// Customized from http://bl.ocks.org/mbostock/3884955
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    parseDate = d3.time.format("%Y-%m-%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return x(d["date"]); })
    .y(function(d) { return y(d["total"]); });

var div = d3.select('#result').append("div").attr("class","tooltip");

var svg = d3.select("#result").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// set SVG element to the highest layer on SVG
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

// set SVG element to its normal layer on SVG
d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    }); 
};

//Change the path to url for production use
d3.json("../../static/js/medshare.json", function(error, data) {
  //console.log(data.result)
  data = data.result
  color.domain(d3.keys(data[0]["media"]));
  med_list = color.domain();
  //console.log(med_list)
  data.forEach(function(d) {
    d.date = parseDate(d["date"]);
  });

  var medias = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d["date"], total: d["media"][name]};
      })
    };
  });

  //console.log(medias)

  x.domain(d3.extent(data, function(d) { return d["date"]; }));

  y.domain([
    d3.min(medias, function(c) { return d3.min(c.values, function(v) { return v.total; }); }),
    d3.max(medias, function(c) { return d3.max(c.values, function(v) { return v.total; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Total Articles");

  var media = svg.selectAll(".media")
      .data(medias)
      .enter().append("g")
      .attr("class", "media");

  media.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); })

// Add legend on the last line of chart      
// media.append("text")
//     .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
//     .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.total) + ")"; })
//     .attr("x", 3)
//     .attr("dy", ".35em")
//     .text(function(d) { return d.name; });

  var legend = d3.select("#result").append("svg")
    .attr("style","transform: translate(-870px,-380px)")
    .attr("class", "legend")
    .attr("width", 100)
    .attr("height", 100)
    .selectAll("g")
    .data(color.domain().slice().reverse())
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(10," + i * 25 + ")"; });

  legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

  med_list.forEach(function(e){
    console.log(data);
    var dots = d3.svg.line()
      .interpolate("cardinal")
      .x(function(d) { return x(d["date"]); })
      .y(function(d) { return y(d["media"][e]); });

    var tip = d3.svg.line()
      .interpolate("cardinal")
      .x(function(d) { return x(d["date"]) - 30; })
      .y(function(d) { return y(d["media"][e]) - 10; });

    var teks = d3.svg.line()
      .interpolate("cardinal")
      .x(function(d) { return x(d["date"])-35; })
      .y(function(d) { return y(d["media"][e]) - 5; });

    cls = ".dot"+e
    console.log(cls)
    svg.selectAll(cls)
      .data(data)
      .enter().append("circle")
      .style("fill",color(e))
      .attr("date",function(d){return d["date"];})
      .attr("total",function(d){return d["media"][e];})
      .attr("cx", dots.x())
      .attr("cy", dots.y())
      .attr("r", 4)

    var node = svg.selectAll(cls)
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "scale(1,1)"; })
      .style("opacity","0")
      .on("mouseover",function(){
        var selected_dot = d3.select(this);
        selected_dot.moveToFront().transition().duration(100).style({opacity:'1'}).style({cursor:'pointer'})
      })
      .on("mouseout",function(){
        var selected_dot = d3.select(this);
        selected_dot.moveToBack().transition().duration(40).style({opacity:'0'});
      })

    node.append("rect")
      .attr("class", "tooltip")
      .style("fill","rgba(1,1,1,1)")
      .attr("date",function(d){return d["date"];})
      .attr("total",function(d){return d["media"][e];})
      .attr("x", tip.x())
      .attr("y", tip.y())
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("width", 60)
      .attr("height", 34)

    node.append("foreignObject")
      .html(function(d){return "<div style='text-align:center;color:white;'>"+String(d["date"]).substring(4,11)+"<br>"+d["media"][e]+"</div>";})
      .attr("x", teks.x())
      .attr("y", teks.y())
      .style("fill","white")
      .attr("width", 70)
      .attr("height", 40);
  })
});