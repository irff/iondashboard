var click_status;

Array.prototype.indexOfNested = function(str){
  for (var i=0;i<this.length;++i){
    if (this[i][0] === str)
      return i;
  }
  return -1;
}

// Script for date
$("datepicker").datepicker({
    isDisabled: function(date) {
        return date.valueOf() > now ? true : false;
    }
})

window.onload = dashboard_init();

function dashboard_init(){
  check_local();
  $.when(get_mediashare(),get_mediasummary(),get_keyopinion(),get_wordfrequency()).done(function(a,b,c,d){
    make_multiline(prettify_share_data(a[0].result));
    make_piechart(prettify_summary_data(b[0].result[0].media), '#medsum', 'Media Summary');
    make_piechart(prettify_summary_data(c[0].result[0].people),"#keyop", "Key Opinion Leader");
    make_barchart(prettify_frequency_data(d[0].result[0].words),get_category(b.result[0].words));
  });
}

function check_local(){
  select_multiple();
  if (localStorage.getItem("medshare_data") && localStorage.getItem("kol_data") && localStorage.getItem("medsum_data")){
    $('#result').show();
    medshare_data = localStorage.getItem("medshare_data");
    kol_data = localStorage.getItem("kol_data");
    medsum_data = localStorage.getItem("medsum_data");
    wordfreq_data = localStorage.getItem("wordfreq_data");
    list_media = localStorage.getItem("medialist");

    document.search["keyword"].value = localStorage.getItem("keyword");    
    document.search["date_start"].value = localStorage.getItem("begin");
    document.search["date_end"].value = localStorage.getItem("end");

    // set_selected_media();
  } else {
    $("#result").hide();
  }
}

function set_selected_media(){
  $(".select2-search--inline").hide();
  $(".select2-selection--multiple").attr("aria-owns","select2-medlist-results");
  var ul_list = $(".select2-selection__rendered");
  var media_list = localStorage.getItem("medialist").split(",");
  $("#medialist").val(localStorage.getItem("medialist"));
  var inserted_element = [];

  media_list.forEach(function(d){
    inserted_element.push(generate_selected_item(d));
  });

  ul_list.append(inserted_element);
}

function generate_selected_item(media_name){
  return '<li class="select2-selection__choice" title="'+media_name+'"><span class="select2-selection__choice__remove" role="presentation">×</span>'+media_name+'</li>';
}

function select_multiple(){
  get_media_list();
  $("#medlist").select2();
}

function get_media_list(){
  $.getJSON("http://128.199.120.29:8274/api/v1/listmedia",function(data){
     data = data.result;
     var options = [];
     $.each(data,function(c,d){
      options.push("<option value='"+d+"'>"+d+"</option>");
     });

     $("#medlist").append(options);
  });
}

function save_session(data){
  var keyword = document.search["keyword"].value;
  var start = document.search["date_start"].value;
  var end = document.search["date_end"].value;

  if (!keyword || !start || !end){
    return false;
  }

  localStorage.setItem("keyword",keyword);
  localStorage.setItem("begin",start);
  localStorage.setItem("end",end);

  list_media = $("#medlist").val() ? $("#medlist").val() : [];
  localStorage.setItem("medialist",list_media);

  var tmp_data = JSON.stringify({
    media:list_media,
    keyword: keyword,
    begin: start+" 01:00:00",
    end: end+" 01:00:00"
  });

  localStorage.setItem("medshare_data",tmp_data);

  tmp_data = JSON.stringify({
    media:[],
    name: ["jokowi","prabowo","samad","sby","megawati","habibie","paloh"],
    keyword: keyword,
    begin: start+" 01:00:00",
    end: end+" 01:00:00"
  });

  localStorage.setItem("kol_data",tmp_data);

  tmp_data = JSON.stringify({
    media:list_media,
    keyword: keyword,
    begin: start+" 01:00:00",
    end: end+" 01:00:00"
  });

  localStorage.setItem("medsum_data",tmp_data);

  tmp_data = JSON.stringify({
    media:list_media,
    keyword: keyword,
    limit:20,
    begin: start+" 01:00:00",
    end: end+" 01:00:00"
  });

  localStorage.setItem("wordfreq_data",tmp_data);

  window.location.reload();
  return true;
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
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    .style('font-size', '2em')
    .style('font-weight','900')
    .text('Word Frequency');
}

function make_multiline(data){
  var chart = c3.generate({
      padding: {
        top: 50
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
    .attr('y', 50)
    .attr('text-anchor', 'middle')
    .style('font-size', '2em')
    .style('font-weight','900')
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
    .attr('y', 50)
    .attr('text-anchor', 'middle')
    .style('font-size', '2em')
    .style('font-weight','900')
    .text(desc);

}
