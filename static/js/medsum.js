window.onload = init_chart();

Array.prototype.indexOfNested = function(str){
  for (var i=0;i<this.length;++i){
    if (this[i][0] === str)
      return i;
  }
  return -1;
}

function init_chart(){
  $(document)
  .ajaxStart(function () {
    $("#result").html('<img class="loader" src="/static/img/loader.gif" />');
    console.log("AJAX start calling");
  })
  .ajaxStop(function () {
    console.log("AJAX stop calling");
  });
  $.when(get_mediasummary()).done(function(b){
    make_piechart(prettify_summary_data(b.result[0].media), '#result', 'Media Summary');
  });
}

function get_mediasummary(){
  return $.ajax({
      type: 'POST',
      url: 'http://128.199.120.29:8274/api/v1/mediashare/summary',
      data: localStorage.getItem("medsum_data"),
  });
}

function prettify_summary_data(data){
  result = [];
  console.log(data);
  Object.keys(data).forEach(function(d){
    result.push([d,data[d]]);
  });

  return result;
}

function make_piechart(data, div, desc){
  var chart = c3.generate({
    bindto :div,
    size : {
      width: $(window).width(),
      height: 400
    },
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
}