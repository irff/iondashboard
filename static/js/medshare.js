var data_murah;

// Start media share
// Customized from http://bl.ocks.org/mbostock/3884955
load_media_share();

// Start media share
// Customized from http://bl.ocks.org/mbostock/3884955
function load_media_share(){
  // console.log(localStorage.getItem("medshare_data"));
  var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    parseDate = d3.time.format("%Y-%m-%d").parse;

  var canvas = d3.select("#result");
  canvas.style("background-image","url(/static/img/loader.gif)");
  canvas.style("background-repeat","no-repeat");
  canvas.style("background-position","center center");

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
      .x(function(d) { return x(d["date"]); })
      .y(function(d) { return y(d["total"]); });


  var svg = canvas.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Change the path to url for production use
  d3.json("http://128.199.120.29:8274/api/v1/mediashare", function(error, data) {
    //console.log(data.result)
    //data = d3.nest().key(function(d){return String(d.date).substr(0,7)}).entries(data.result);
    canvas.attr("style","");
    data = data.result;
    data_murah = data
    // console.log(data);
    // data = d3.nest().key(function(d){return d.substring(0,7);}).rollup(function(d){
    //   return d3.sum(d,function(d){

    //   });
    // });
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

    var med_num = color.domain().slice().reverse();

    function get_distance(d, padding){
      console.log(d+" "+padding);
      padding += 20;
      var dist = 50;
      var stop = med_num.indexOf(d);
      for (var i=0;i<stop;++i){
        dist += (med_num[i].split(".")[0].length*6);
        dist += padding;
      }
      console.log(dist);
      return dist;
    }

    var legend = canvas.append("svg")
    // .attr("style","transform: translate(100px,-10px)")
    .attr("class", "legend")
    .attr("width", "100%")
    .attr("height", 50)
    .selectAll("g")
    .style("text-align","center")
    .style("cursor","pointer")
    .data(med_num)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate("+get_distance(d,20)+",20)"; })
    .on("click",function(d){
      var clicked = d3.select(this);

      new_d = d.split(".").join("").split("/").join("");
      //get element status from its attribute
      click_status = d3.select("#"+new_d).attr("clicked");

      //set active status
      var active = click_status == "true" ? false : true;

      //set display value according to element status
      this_opacity_val = active ? 0 : 1;
      other_opacity_val = active ? 1 : 0;

      //update dipslay according to element status
      d3.select("#"+new_d).style("opacity",this_opacity_val);
      d3.selectAll("."+new_d+"-dots").style("opacity",this_opacity_val);
      d3.selectAll("."+new_d+"-tips").style("display",function(){return active ? "none":"inline";});
      d.active = active;
      d3.select("#"+new_d).attr("clicked",active);

    });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("font-size","13px")
        .text(function(d) { return d.split(".")[0]; });

    var media = svg.selectAll(".media")
        .data(medias)
        .enter().append("g")
        .attr("class", "media")
        .attr("clicked","false")
        .attr("id",function(d){return d.name.split(".").join("").split("/").join("");});

    media.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); })

    // Add legend on the last line of chart      
    // media.append("text")
    //   .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    //   .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.total) + ")"; })
    //   .attr("x", 3)
    //   .attr("dy", ".35em")
    //   .text(function(d) { return d.name; });


    med_list.forEach(function(e){
      var dots = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) { return x(d["date"]); })
        .y(function(d) { return y(d["media"][e]); });

      var tip = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) { return x(d["date"]) - 30; })
        .y(function(d) { return y(d["media"][e]) - 20; });

      var teks = d3.svg.line()
        .interpolate("cardinal")
        .x(function(d) { return x(d["date"])-35; })
        .y(function(d) { return y(d["media"][e]) - 15; });

      cls = ".dot"+e.split(".").join("").split("/").join("")
      svg.selectAll(cls)
        .data(data)
        .enter().append("circle")
        .style("fill",color(e))
        .attr("date",function(d){return d["date"];})
        .attr("total",function(d){return d["media"][e];})
        .attr("cx", dots.x())
        .attr("cy", dots.y())
        .attr("class",function(d){return e.split(".").join("").split("/").join("")+"-dots";})
        .attr("r", 4)

      var node = svg.selectAll(cls)
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) { return "scale(1,1)"; })
        .attr("class",e.split(".").join("").split("/").join("")+"-tips g-tips")
        .style("opacity","0")
        .on("mouseover",function(){
          var selected_dot = d3.select(this);
          selected_dot.transition().duration(100).style({opacity:'1'}).style({cursor:'pointer'})
        })
        .on("mouseout",function(){
          var selected_dot = d3.select(this);
          selected_dot.transition().duration(40).style({opacity:'0'});
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
  .send("POST",localStorage.getItem("medshare_data"));
}