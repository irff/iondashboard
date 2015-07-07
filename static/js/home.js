Array.prototype.indexOfNested = function(str){
  for (var i=0;i<this.length;++i){
    if (this[i][0] === str)
      return i;
  }
  return -1;
}

window.onload = dashboard_init();

function dashboard_init(){
    //console.log("AJAX start calling");

  if (localStorage.getItem("medshare_data") && localStorage.getItem("kol_data") && localStorage.getItem("medsum_data") && localStorage.getItem("wordfreq_data")){
  	$("#medshare").html('<img class="loader" src="/static/img/loader.gif" />');
	$("#medsum").html('<img class="loader" src="/static/img/loader.gif" />');
	$("#keyop").html('<img class="loader" src="/static/img/loader.gif" />');
	$("#word").html('<img class="loader" src="/static/img/loader.gif" />');

    $.when(get_mediashare()).done(function(a){
      make_multiline(prettify_share_data(a.result));
    });
    $.when(get_mediasummary()).done(function(b){
      make_piechart(prettify_summary_data(b.result[0].media), '#medsum', 'Media Summary');
    });
    $.when(get_keyopinion()).done(function(c){
      console.log("keyol started");
      make_piechart(prettify_summary_data(c.result[0].people),"#keyop", "Key Opinion Leader");
    });
    $.when(get_wordfrequency()).done(function(d){
      make_barchart(prettify_frequency_data(d.result[0].words),get_category(d.result[0].words));
    });
  } else {
  	$("#result").html("Please specify your search attributes first!");
  	$("#result").attr("style","padding-top: 0px!important;color: #9e9e9e;font-family: 'Roboto', sans-serif;padding-top:10px!important;font-size: 30px;text-align:center;");
  	$("#footer").attr("style","position:absolute;");
  }
}

function prettify_share_data(data){
  result = [["date"]];
  medias = localStorage.getItem("medialist").split(",");

  data.forEach(function(d){
    tmp = [];
    //push date to the "date" index on result
    result[0].push(d.date);
    medias.forEach(function(e){

      //check if the name of media is on the result
      if (result.indexOfNested(e) === -1) {
        //push the name to result
        result.push([e]);
      }
      // add articles share to its media index
      idx = result.indexOfNested(e);
      result[idx].push(d.media[e]);
    });
  });
  return result;
}

function prettify_summary_data(data){
  result = [];
  Object.keys(data).forEach(function(d){
    result.push([d,data[d]]);
  });

  return result;
}

function prettify_frequency_data(data){
  result = ["Word Frequency"];
  Object.keys(data).forEach(function(d){
    result.push(data[d]);
  });
  return result;
}

function get_category(data){
  result = [];
  Object.keys(data).forEach(function(d){
    result.push(d);
  });
  return result;
}

function get_mediasummary(){
  return $.ajax({
      type: 'POST',
      url: create_url("mediashare/summary"),
      data: localStorage.getItem("medsum_data"),
      crossDomain: true,
      headers: {
        "Authorization":set_header()
      },
  });
}

function get_keyopinion(){
  return $.ajax({
      type: 'POST',
      url: create_url("keyopinionleader"),
      data: localStorage.getItem("kol_data"),
      crossDomain: true,
      headers: {
        "Authorization":set_header()
      }
  }); 
}

function get_wordfrequency(){
  return $.ajax({
      type: 'POST',
      url: create_url("wordfrequencymanual"),
      data: localStorage.getItem("wordfreq_data"),
      crossDomain: true,
      headers: {
        "Authorization":set_header()
      }
  });   
}

function get_mediashare(){
  return $.ajax({
      type: 'POST',
      url: create_url("mediashare"),
      data: localStorage.getItem("medshare_data"),
      crossDomain: true,
      headers: {
        "Authorization":set_header()
      }
  });
}

function make_barchart(data,cat){
  var chart = c3.generate({
      bindto : '#word',
      padding: {
        top: 50
      },
      data: {
          columns: [
              data,
          ],
          type: 'bar'
      },
      bar: {
          width: {
              ratio: 0.5
          }
      },
      axis : {
        x : {
          type: 'category',
          categories : cat,
          label: {
            text: "10 kata terbanyak",
          }
        },
        y : {
          label: {
            text: "Jumlah kata"
          }
        }
      }
  });
  d3.select('#word svg').append('text')
    .attr('x', d3.select('#word svg').node().getBoundingClientRect().width / 2)
    .attr('y', 50)
    .attr('text-anchor', 'middle')
    .style('font-size', '2em')
    .style('font-family',"Roboto', sans-serif")
    .text('Word Frequency');
}

function make_multiline(data){
  var chart = c3.generate({
      padding: {
        top: 50
      },
      size:{
        height:400,
        width: $(window).width()*0.9
      },
      bindto: '#medshare',
      data: {
          x: 'date',
          columns: data
      },
      color: {
        pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
      },
      axis: {
        x:{
          type:'timeseries',
          tick: {
                  format: '%Y-%m-%d'
          },
          label: {
            text : "Tanggal Publish",
            position: 'outer-center'
          }
        },
        y:{
          label: {
            text: "Jumlah Artikel",
            position: "outer-middle"
          }
        }
      },
      tooltip:{
        format:{
          title: function (date,xx,yy){
            return make_date_interval(date);
          }
        }
      },
      zoom: {
          enabled: true
      },
      point: {
        show: false
      }
  });
  d3.select('#medshare svg').append('text')
    .attr('x', d3.select('#medshare svg').node().getBoundingClientRect().width / 2)
    .attr('y', 25)
    .attr('text-anchor', 'middle')
    .style('font-size', '2em')
    .style('font-family',"Roboto', sans-serif")
    .text('Media Share');
}

function make_date_interval(date){
  var interlude = 0;
  var user_interlude = localStorage.getItem("interlude");
  if (user_interlude == "W") {
    interlude = 6;
  } else if (user_interlude == "M"){
    interlude = 29;
  } else if (user_interlude == "Q"){
    interlude = 89;
  }
  var begin_date = moment(date).format("DD-MM-YYYY");
  var end_date = moment(date).add(interlude,"days").format("DD-MM-YYYY");
  var user_date_end = moment(localStorage.getItem("end")).format("DD-MM-YYYY");
  // console.log(end_date + " "+ user_date_end);
  // if (end_date > user_date_end) {
  //   end_date = user_date_end;
  // }
  if (user_interlude != "D") {
    return begin_date+" to "+end_date;
  } else return begin_date;
}

function make_piechart(data, div, desc){
  var chart = c3.generate({
    bindto :div,
    padding: {
      top: 50
    },
    color: {
        pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
    },
    data : {
      columns : data,
      type : 'donut'
    },
    donut: {
        title: desc,
        label: {
          show : false
        }
    },
    tooltip: {
      format: {
        value: function (value, ratio, id) {
            return value + " ("+Math.floor(ratio*10000)/100+"%)";
        }
      }
    },
    legend: {
      show:false
    }
  });
  d3.select(div+' svg').append('text')
    .attr('x', d3.select(div+' svg').node().getBoundingClientRect().width / 2)
    .attr('y', 25)
    .attr('text-anchor', 'middle')
    .style('font-size', '2em')
    .style('font-family',"Roboto', sans-serif")
    .text(desc);

}
