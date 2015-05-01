// Script for date
$("datepicker").datepicker({
    isDisabled: function(date) {
        return date.valueOf() > now ? true : false;
    }
})

// Start media share

// Customized from http://bl.ocks.org/mbostock/3884955
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = $(window).width() - margin.left - margin.right - 100,
    height = 300 - margin.top - margin.bottom,
    parseDate = d3.time.format("%Y-%m-%d").parse;

var canvas = d3.select("#medshare");

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20();

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

var div = canvas.append("div").attr("class","tooltip");

var svg = canvas.append("svg")
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
d3.json("http://128.199.81.117:8274/api/v1/mediashare", function(error, data) {
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
  media.append("text")
    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.total) + ")"; })
    .attr("x", 3)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });


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
      .html(function(d){return "<div style='text-align:center;color:white;font-size:12px;'>"+String(d["date"]).substring(4,11)+"<br>"+d["media"][e]+"</div>";})
      .attr("x", teks.x())
      .attr("y", teks.y())
      .style("fill","white")
      .attr("width", 70)
      .attr("height", 40);
  })
})
.header("Content-Type","application/json")
.send("POST",JSON.stringify({
  media:["suara.com","merdeka.com","metrotvnews.com","viva.co.id","pikiran","okezone.com"],
  keyword: "jokowi",
  begin: "2015-01-01 01:00:00",
  end: "2015-04-04 01:00:00"
}));

// End media share


// Start media summary

var width_medsum = $(window).width()/2,
    height_medsum = 300,
    radius_medsum = Math.min(width_medsum, height_medsum) / 2.7,
    padding_medsum = 0;

//var color = d3.scale.ordinal()
//  .range(["#F44336", "#FF9800", "#4FC3F7", "#3F51B5", "#009688", "#00E676", "#FFEB3B"]);
var color_medsum = d3.scale.category20c();

var percentageFormat_medsum = d3.format("%");

var arc_medsum = d3.svg.arc()
    .outerRadius(radius_medsum)
    .innerRadius(0);

var pie_medsum = d3.layout.pie()
    .value(function(d) { return d.total; });

function sum(data){
  res = 0;
  Object.keys(data[0].media).forEach(function(d){res += data[0].media[d]});
  return res;  
}

var val = '';

var canvas_medsum = d3.select("#medsum");

d3.json("http://128.199.81.117:8274/api/v1/mediashare/summary", function(error, data) {
  data = data.result
  color_medsum.domain(d3.keys(data[0]["media"]));
  // console.log(color.domain());
  data.forEach(function(d) {
    //console.log(d);
    d.total = color_medsum.domain().map(function(name) {
      return {name: name, total: d["media"][name]};
    });
  });

  var legend = canvas_medsum.append("svg")
      .attr("class", "legend")
      .attr("width", radius_medsum * 2)
      .attr("height", radius_medsum * 2)
    .selectAll("g")
      .data(color_medsum.domain().slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(40," + (i * 25) + ")"; });

  legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color_medsum);

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("font-size","13px")
      .text(function(d) { console.log(d);return d+" ("+data[0]["media"][d]+")"; });

  var svg = canvas_medsum.selectAll(".pie")
      .data(data)
    .enter().append("svg")
      .attr("class", "pie")
      .attr("width", radius_medsum * 2)
      .attr("height", radius_medsum * 2)
    .append("g")
      .attr("transform", "translate(" + radius_medsum + "," + radius_medsum + ")");

  svg.selectAll(".arc")
      .data(function(d) { return pie_medsum(d.total); })
    .enter().append("path")
      .attr("class", "arc")
      .attr("d", arc_medsum)
      .style("fill", function(d) { return color_medsum(d.data.name); });

  svg.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle");
      // .text(function(d) { return "Media Summary"; });

  var gg = canvas_medsum.selectAll(".pie")
        .data(pie_medsum(data))
        .enter().append("g")
        .attr("class", "val");

  val = data[0].media;
  percent = color_medsum.domain();
  var i = 0;
  var tot = sum(data);
  percent.forEach(function(e){
    // console.log(e);
    svg.append("text")
      .attr("transform", function(d) {
        // console.log(d);
        // console.log((d.total)[i]);
        // console.log(pie(d.total)[i]);
        // console.log("---");
        return "translate(" + arc_medsum.centroid(pie_medsum(d.total)[i]) + ")";
      })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size","13px")
      // .text(function(d) { return Math.floor((d.media[e]/tot)*100000)/1000+"%"; })
      .style("opacity","1");
      i +=1;
  });
  // console.log(color.domain());

})
.header("Content-Type","application/json")
.send("POST",JSON.stringify({
  media:[],
  keyword: "jokowi",
  begin: "2015-01-01 01:00:00",
  end: "2015-04-04 01:00:00"
}));



// End media summary

// Start key opinion leader
var width_kop = $(window).width()/2 -100,
    height_kop = 300,
    radius_kop = Math.min(width_kop, height_kop) / 2.8,
    padding_kop = 10;

// var color = d3.scale.ordinal()
  // .range(["#F44336", "#FF9800", "#4FC3F7", "#3F51B5", "#009688", "#00E676", "#FFEB3B","#FF5722","#76FF03","#F50057"]);

var percentageFormat_kop = d3.format("%");

var arc_kop = d3.svg.arc()
    .outerRadius(radius_kop)
    .innerRadius(0);

var pie_kop = d3.layout.pie()
    .value(function(d) { return d.total; });


var val = '';

d3.json("http://128.199.81.117:8274/api/v1/keyopinionleader", function(error, data) {

  function sum(d){
    res = 0;
    console.log(d);
    Object.keys(d[0].people).forEach(function(e){res += d[0].people[e]});
    return res;  
  }

  data = data.result
  //console.log(data);
  color.domain(d3.keys(data[0]["people"]));
  // console.log(color.domain());
  data.forEach(function(d) {
    //console.log(d);
    d.total = color.domain().map(function(name) {
      return {name: name, total: d["people"][name]};
    });
  });

  var canvas3 = d3.select("#keyop");

  var legend = canvas3.append("svg")
      .attr("class", "legend")
      .attr("width", radius_kop * 2 )
      .attr("height", radius_kop * 2)
      .selectAll("g")
      .data(color.domain().slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 25 + ")"; });

  legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("font-size","13px")
      .text(function(d) { console.log(d);return d+" ("+data[0]["people"][d]+")"; });

  var svg = canvas3.selectAll(".pie")
      .data(data)
    .enter().append("svg")
      .attr("class", "pie")
      .attr("width", radius_kop * 2)
      .attr("height", radius_kop * 2)
    .append("g")
      .attr("transform", "translate(" + radius_kop + "," + radius_kop + ")");

  svg.selectAll(".arc")
      .data(function(d) { return pie_kop(d.total); })
    .enter().append("path")
      .attr("class", "arc")
      .attr("d", arc_kop)
      .style("fill", function(d) { return color(d.data.name); });

  var gg = canvas3.selectAll(".pie")
        .data(pie_kop(data))
        .enter().append("g")
        .attr("class", "val");

  val = data[0].people;
  percent = color.domain();
  var i = 0;
  var tot = sum(data);
  console.log(tot);
  percent.forEach(function(e){
    // console.log(e);
    svg.append("text")
      .attr("transform", function(d) {
        //console.log(arc.centroid(pie(d.total)[i]));
        return "translate(" + arc_kop.centroid(pie_kop(d.total)[i]) + ")";
      })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size","13px")
      .style("opacity","0")
      .text(function(d) { return Math.floor((d.people[e]/tot)*100000)/1000+"%"; });
      i +=1;
  });
  // console.log(color.domain());

})
.header("Content-Type","application/json")
.send("POST",JSON.stringify({
  media:[],
  name: ["jokowi","prabowo","samad","sby","megawati","habibie","paloh"],
  keyword: "presiden",
  begin: "2014-04-01 01:00:00",
  end: "2015-04-04 01:00:00"
}));


// End key opinion leader