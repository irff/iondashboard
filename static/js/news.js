var template = $("#related-news ul");
var total_article = 0;

get_news();

function generate_result(data){	
	var list = "";
	data.forEach(function(d){
		list += generate_item(d);
	});
	template.html(list);
}

function generate_item(data){
	// console.log(data);
	// console.log(data.privider);
	result = "<li>";
	result = result +"<div class='title'><a target='_blank' href='http://128.199.120.29:3000/?url="+data.url+"'>"+ data.title +"</a></div>";
	result = result +"<div class='author'>by : "+ data.author +"</div>";
	result = result +"<div class='provider'>site: "+ data.provider +"</div>";
	result = result +"<div class='url'><a href='"+ data.url +"' target='_blank'>[article's link]</a>&nbsp;&nbsp;&nbsp;<a target='_blank' href='http://128.199.120.29:3000/?url="+data.url+"'>[Download snapshot]</a></div>";

	formatted = moment(data.publish);
	formatted = String(formatted._d).substring(0,25);
	result = result +"<div class='time'>time: "+ formatted +"WIB</div>";
	result = result +"<div class='loc'>location:"+ data.location +"</div>";
	result = result +"<div class='crawled' style='text-align:right;color:#212121;'>crawled on "+ String(moment(data.date_crawl)._d).substring(0,25) +"WIB</div>";
	return result;
}

function get_news(){
	var from = $("#list-news").data("from");
	var size = $("#list-news").data("size");
	var data_media = localStorage.getItem("medialist").split(",").join('",').split(",").join(',"');
	var post_data = "";
	if (data_media) {
		post_data = '{"media":["'+ data_media+'"],"keyword":"'+localStorage.getItem("keyword")+'","begin":"'+localStorage.getItem("begin")+' 01:00:00","end":"'+localStorage.getItem("end")+' 01:00:00","from_page":'+from+',"page_size":'+size+'}';
	} else {
		post_data = '{"keyword":"'+localStorage.getItem("keyword")+'","begin":"'+localStorage.getItem("begin")+' 01:00:00","end":"'+localStorage.getItem("end")+' 01:00:00","from_page":'+from+',"page_size":'+size+'}';
	}
	$.ajax({
	    type: 'POST',
	    // make sure you respect the same origin policy with this url:
	    // http://en.wikipedia.org/wiki/Same_origin_policy
	    url: 'http://128.199.120.29:8274/api/v1/news',
	    data: post_data,
	    success: function(msg){
	        response = msg.result[0].news;
	        total_article = msg.total;
			generate_result(response);
			$("#total-articles").html("There are "+total_article+" related articles");
			console.log(from/size);
			$('#pagination').pagination({
				pages: Math.floor(total_article/size),
				currentPage: (from/size) == 0 ? 1 : from/size,
				cssStyle: 'light-theme'
			});
	    },
	    beforeSend : function() {
	          template.html(
	            '<img style="" src="/static/img/loader.gif" />'
	          );   
        }
	});
}
  