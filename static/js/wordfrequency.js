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

  $.when(get_wordfrequency()).done(function(d){
    make_barchart(prettify_frequency_data(d[0].result[0].words),get_category(d[0].result[0].words));
  });
}

function get_wordfrequency(){
  return $.ajax({
      type: 'POST',
      url: 'http://128.199.120.29:8274/api/v1/wordfrequencymanual',
      data: localStorage.getItem("wordfreq_data")
  });   
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

function make_barchart(data,cat){
  var chart = c3.generate({
      bindto : '#result',
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