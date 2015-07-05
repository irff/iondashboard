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

/*
* Prettify data to meet the c3.js format
* For further information, see at
* http://c3js.org/reference.html#data-columns
*/
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
            var keyword = localStorage.getItem("keyword");
            var media = e.id;
            var start_date = moment(e.x).format("YYYY-MM-DD");
            var interlude = localStorage.getItem("interlude");
            var end_date = start_date;
            if (interlude !== "D") {
              end_date = make_date_interval(start_date).split(" to ")[1];
              end_date = moment(end_date,"DD-MM-YYYY").format("YYYY-MM-DD");
            }
            localStorage.setItem("shr-media",media);
            localStorage.setItem("shr-start",start_date);
            localStorage.setItem("shr-end",end_date);
            get_news(keyword, media,start_date,end_date);
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
          enabled: false
      },
      point: {
        show: true
      },
      tooltip: {
        contents: function(d, defaultTitleFormat, defaultValueFormat, color){
           var $$ = this, config = $$.config,
              titleFormat = config.tooltip_format_title || defaultTitleFormat,
              nameFormat = config.tooltip_format_name || function (name) { return name; },
              valueFormat = config.tooltip_format_value || defaultValueFormat,
              text, i, title, value, name, bgcolor;
          for (i = 0; i < d.length; i++) {
              if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

              if (! text) {
                  title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                  text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + make_date_interval(title) + "</th></tr>" : "");
              }

              name = nameFormat(d[i].name);
              value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
              bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
              if (value > 0) {
                text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
                text += "<td class='value'>" + value + "</td>";
                text += "</tr>";
              }
          }
          return text + "</table>";
        },
        grouped:false
      }
  });
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
  // console.log(begin_date+" to "+end_date);
  if (user_interlude != "D") {
    return begin_date+" to "+end_date;
  } else return date;
}

function reset_search(){
  localStorage.removeItem("shr-media");
  localStorage.removeItem("shr-start");
  localStorage.removeItem("shr-end");
  window.location.reload();
}
