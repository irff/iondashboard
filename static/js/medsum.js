var selected_dot;
var xy;

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

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2.7,
    padding = 10;

//var color = d3.scale.ordinal()
//  .range(["#F44336", "#FF9800", "#4FC3F7", "#3F51B5", "#009688", "#00E676", "#FFEB3B"]);
var color = d3.scale.category20c()

var percentageFormat = d3.format("%");

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(1);

var pie = d3.layout.pie()
    .value(function(d) { return d.total; });

function sum(data){
  res = 0;
  Object.keys(data[0].media).forEach(function(d){res += data[0].media[d]});
  return res;  
}

var val = '';

d3.json("http://128.199.81.117:8274/api/v1/mediashare/summary", function(error, data) {
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
      .attr("transform", function(d, i) { return "translate(100," + (i * 25) + ")"; });

  legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function(d) { console.log(d);return d+" ("+data[0]["media"][d]+")"; });

  var tot = sum(data);

  legend.append("text")
      .attr("x", -35)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function(d) { console.log(d);return Math.floor((data[0]["media"][d]/tot)*10000)/100; });

  var svg = d3.select("#result").selectAll(".pie")
      .data(data)
      .enter().append("svg")
      .attr("class", "pie")
      .attr("width", radius * 2)
      .attr("height", radius * 2)
      .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  

  var pp = svg.selectAll(".arc")
      .data(function(d) { return pie(d.total); })
      .enter()
      .append("g")
      .on("mouseover",function(){
        selected_dot = d3.select(this);
        selected_dot.style({opacity:'0.8'});
        selected_dot.select("g").moveToFront().transition().duration(100).style({opacity:'1'}).style({cursor:'pointer'})
      })
      .on("mouseout",function(){
        selected_dot = d3.select(this);
        selected_dot.style({opacity:'1'});
        selected_dot.select("g").transition().duration(40).style({opacity:'0'});
      });

    pp.append("path")
      .attr("class", "arc")
      .style("cursor","pointer")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.name); });

    pp.append("g")
      .style("opacity","0")
      .append("foreignObject")
      .html(function(d){return "<div style='padding:5px;text-align:center;color:white;background:black;'>"+Math.floor((d.data.total/tot)*100000)/1000+"%</div>";})
      .attr("transform", function(d) {
        console.log("----------*----------");
        xy = arc.centroid(d);
        xy[0] = xy[0] - 10;
        console.log(arc.centroid(d));
        return "translate(" + xy + ")";
      })
      .attr("dy", ".75em")
      .attr("width", 100)
      .attr("height", 50)
      .style("font-size","13px");
      // .text(function(d) { return Math.floor((d.data.total/tot)*100000)/1000+"%"; });

  // svg.append("text")
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "middle")
  //     .text(function(d) { return "Media Summary"; });

  var gg = d3.select("#result").selectAll(".pie")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "val");

  val = data[0].media;
  percent = color.domain();
  var i = 0;

  // percent.forEach(function(e){
  //   // console.log(e);
  //   svg.append("text")
  //     .attr("transform", function(d) {
  //       //console.log(arc.centroid(pie(d.total)[i]));
  //       return "translate(" + arc.centroid(pie(d.total)[i]) + ")";
  //     })
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "middle")
  //     .style("font-size","13px")
  //     .text(function(d) { return Math.floor((d.media[e]/tot)*100000)/1000+"%"; });
  //     i +=1;
  // });
  // console.log(color.domain());

})
.header("Content-Type","application/json")
.send("POST",JSON.stringify({
  media:[],
  keyword: "media",
  begin: "2014-04-01 01:00:00",
  end: "2015-04-04 01:00:00"
}));

