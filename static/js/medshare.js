window.onload = init_chart();

Array.prototype.indexOfNested = function(str){
  for (var i=0;i<this.length;++i){
    // console.log(this[i][0] + " " + str);
    if (this[i][0] === str)
      return i;
  }
  return -1;
}

function init_chart(){
  if (localStorage.getItem("medshare_data")) {
    $("#result").html('<img class="loader" src="/static/img/loader.gif" />');
  }
  $.when(get_mediashare()).done(function(a){
    make_multiline(prettify_share_data(a.result));
  });
}

function get_mediashare(){
  return $.ajax({
      type: 'POST',
      url: create_url("mediashare"),
      data: localStorage.getItem("medshare_data"),
      headers: {
        "Authorization":set_header()
      }
  });
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

function make_multiline(data){
  var chart = c3.generate({
      padding: {
        top: 10
      },
      size : {
        height: 400,
        width: $(window).width()*0.9
      },
      bindto: '#result',
      data: {
          x: 'date',
          columns: data,
          onclick: function(e){
            console.log(e);
          },
          onmouseover: function(e){
            console.log("hover "+e);
          }
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
      point: {
        show: false
      },
      tooltip: {
        contents: function(d,title,value,color){
          console.log(d);
        }
      }
  });
}
