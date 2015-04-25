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

// set SVG element to the highest layer on SVG
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

// set SVG element to its normal layer on SVG
d3.selection.prototype.moveToBack = function() { 
    return this.each(function() { 
        var firstChild = this.parentNode.parentNode.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.parentNode.parentNode.insertBefore(this, firstChild); 
        } 
    }); 
};


var selected;

d3.json("../../static/js/words.json", function(error, data) {
  data = data.result[0].media;
  //console.log(data);
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

  var group = svg.selectAll(".tooltip")
    .data(d3.keys(data))
    .enter().append("g");
    
    group.append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(data[d]); })
      .attr("height", function(d) { return height - y(data[d]); })
      .on("mouseover",function(){
        selected = d3.select(this.parentNode).moveToFront()
        selected.select("g").transition().duration(100).style({opacity:'1'}).style({cursor:'pointer'})
      })
      .on("mouseout",function(){
        selected = d3.select(this.parentNode);
        selected.select("g").transition().duration(40).style({opacity:'0'});
      });

    
    var gg = group.append("g")
      .style("opacity","0");

    gg.append("rect")
      .attr("class", "tooltip")
      .style("fill","rgba(1,1,1,0.999999)")
      //.style("opacity","0")
      .attr("x", function(d){ return x(d);})
      .attr("y", function(d){ return y(data[d])-1;})
      .attr("width", 40)
      .attr("height", 24)
    
    gg.append("text")
      .style("fill","white")
      //.style("opacity","0")
      .attr("transform", function(d){ 
        return "translate("+(x(d)+5)+","+(y(data[d])+20)+")";
      })
      .attr("dy","-.35em")
      .text(function(d){return data[d];})

});

