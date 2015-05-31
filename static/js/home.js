Array.prototype.indexOfNested = function(str){
  for (var i=0;i<this.length;++i){
    if (this[i][0] === str)
      return i;
  }
  return -1;
}

window.onload = dashboard_init();

function dashboard_init(){
  
  $(document)
  .ajaxStart(function () {
    $("#medshare").html('<img class="loader" src="/static/img/loader.gif" />');
    $("#medsum").html('<img class="loader" src="/static/img/loader.gif" />');
    $("#keyop").html('<img class="loader" src="/static/img/loader.gif" />');
    $("#word").html('<img class="loader" src="/static/img/loader.gif" />');
    console.log("AJAX start calling");
  })
  .ajaxStop(function () {
    console.log("AJAX stop calling");
  });

  if (check_local()) {
    $.when(get_mediashare(),get_mediasummary(),get_keyopinion(),get_wordfrequency()).done(function(a,b,c,d){
      make_multiline(prettify_share_data(a[0].result));
      make_piechart(prettify_summary_data(b[0].result[0].media), '#medsum', 'Media Summary');
      make_piechart(prettify_summary_data(c[0].result[0].people),"#keyop", "Key Opinion Leader");
      make_barchart(prettify_frequency_data(d[0].result[0].words),get_category(d[0].result[0].words));
    });
  }
}
function prettify_share_data(data){
  result = [["date"]];
  medias = localStorage.getItem("medialist").split(",");

  data.forEach(function(d){
    tmp = [];
    result[0].push(d.date);
    medias.forEach(function(e){
      idx = result.indexOfNested(e)
      if (idx === -1) {
        result.push([e]);
      } else {
        result[idx].push(d.media[e]);
      }
    });
  });

  return result;
}

function prettify_summary_data(data){
  result = [];
  console.log(data);
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
      url: 'http://128.199.120.29:8274/api/v1/mediashare/summary',
      data: localStorage.getItem("medsum_data"),
  });
}

function get_keyopinion(){
  return $.ajax({
      type: 'POST',
      url: 'http://128.199.120.29:8274/api/v1/keyopinionleader',
      data: localStorage.getItem("kol_data")
  }); 
}

function get_wordfrequency(){
  return $.ajax({
      type: 'POST',
      url: 'http://128.199.120.29:8274/api/v1/wordfrequencymanual',
      data: localStorage.getItem("wordfreq_data")
  });   
}

function get_mediashare(){
  return $.ajax({
      type: 'POST',
      url: 'http://128.199.120.29:8274/api/v1/mediashare',
      data: localStorage.getItem("medshare_data")
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
            text: "20 kata terbanyak",
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
      zoom: {
          enabled: true
      },
      subchart: {
          show: true
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

function make_piechart(data, div, desc){
  console.log(data);
  var chart = c3.generate({
    bindto :div,
    padding: {
      top: 50
    },
    data : {
      columns : data,
      type : 'donut'
    },
      donut: {
          title: desc
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
