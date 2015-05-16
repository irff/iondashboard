Array.prototype.indexOfNested = function(str){
	for (var i=0;i<this.length;++i){
		if (this[i][0] === str)
			return i;
	}
	return -1;
}

create_wordfrequency();
create_mediasummary();
create_keyopinion();
create_mediashare();


function prettify_share_data(data){
	result = [["date"]];
	medias = localStorage.getItem("medialist").split(",");

	data.forEach(function(d){
		tmp = [];
		result[0].push(d.date);
		console.log(d.date);
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
	console.log(result);
	return result;
}

function create_mediasummary(){
	$.ajax({
	    type: 'POST',
	    url: 'http://128.199.120.29:8274/api/v1/mediashare/summary',
	    data: localStorage.getItem("medsum_data"),
	    success: function(msg){
	        make_piechart(prettify_summary_data(msg.result[0].media), '#medsum', 'Media Summary');
	    },
	    // beforeSend : function() {
	    //       $("#medsum").append("<div></div>").html(
	    //         '<img style="" src="/static/img/loader.gif" />'
	    //       );   
     //    }
	});
}

function create_keyopinion(){
	$.ajax({
	    type: 'POST',
	    url: 'http://128.199.120.29:8274/api/v1/keyopinionleader',
	    data: localStorage.getItem("kol_data"),
	    success: function(msg){
	        make_piechart(prettify_summary_data(msg.result[0].people),"#keyop", "Key Opinion Leader");
	    },
	    beforeSend : function() {
	          // $("#keyop").append("<div></div>").html(
	          //   '<img style="" src="/static/img/loader.gif" />'
	          // );   
        }
	});	
}

function create_wordfrequency(){
	$.ajax({
	    type: 'POST',
	    url: 'http://128.199.120.29:8274/api/v1/wordfrequencymanual',
	    data: localStorage.getItem("wordfreq_data"),
	    success: function(msg){
	    	console.log(msg.result[0].words);
	        make_barchart(prettify_frequency_data(msg.result[0].words),get_category(msg.result[0].words));
	    },
	    beforeSend : function() {
	          // $("#word").append("<div></div>").html(
	          //   '<img style="" src="/static/img/loader.gif" />'
	          // );   
        }
	});		
}

function create_mediashare(){
	$.ajax({
	    type: 'POST',
	    url: 'http://128.199.120.29:8274/api/v1/mediashare',
	    data: localStorage.getItem("medshare_data"),
	    success: function(msg){
	    	// console.log(msg.result);
	        make_multiline(prettify_share_data(msg.result));
	    },
	    beforeSend : function() {
	          // $("#result").append("<div></div>").html(
	          //   '<img style="" src="/static/img/loader.gif" />'
	          // );   
        }
	});
}

function make_barchart(data,cat){
	var chart = c3.generate({
	    bindto : '#word',
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
	    		categories : cat
	    	}
	    }
	});
}

function make_multiline(data){
	var chart = c3.generate({
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
}

function make_piechart(data, div, desc){
	console.log(data);
	var chart = c3.generate({
		bindto :div,
		data : {
			columns : data,
			type : 'donut'
		},
	    donut: {
	        title: desc
	    }
	});

}