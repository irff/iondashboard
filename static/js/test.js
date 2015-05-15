Array.prototype.indexOfNested = function(str){
	for (var i=0;i<this.length;++i){
		if (this[i][0] === str)
			return i;
	}
	return -1;
}

create_mediasummary();

function pretttify_data(data){
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

function create_mediasummary(){
	$.ajax({
	    type: 'POST',
	    url: 'http://128.199.81.117:8274/api/v1/mediashare/summary',
	    data: localStorage.getItem("medsum_data"),
	    success: function(msg){
	    	// console.log(msg.result);
	        make_chart(pretttify_data(msg.result));
	    },
	    beforeSend : function() {
	          $("#result").append("<div></div>").html(
	            '<img style="" src="/static/img/loader.gif" />'
	          );   
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
	        make_chart(pretttify_data(msg.result));
	    },
	    beforeSend : function() {
	          $("#result").append("<div></div>").html(
	            '<img style="" src="/static/img/loader.gif" />'
	          );   
        }
	});
}

function make_chart(data){
	var chart = c3.generate({
		bindto: '#result',
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