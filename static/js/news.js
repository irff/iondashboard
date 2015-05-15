var template = $("#related-news ul");

update_pagination();

function update_pagination(){
	$('#pagination').pagination({
		pages: 20,
		cssStyle: 'compact-theme'
	});
}

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
	result = result +"<span class='title'>"+ data.title +"</span><br>";
	result = result +"<span class='author'>by : "+ data.author +"</span><br>";
	result = result +"<span class='provider'>site: "+ data.provider +"</span><br>";
	result = result +"<span class='url'><a href='"+ data.url +"'>[article's link]</a></span><br>";

	formatted = moment(data.publish);
	formatted = String(formatted._d).substring(0,25);
	result = result +"<span class='time'>time: "+ formatted +"WIB</span><br>";
	result = result +"<span class='loc'>location:"+ data.location +"</span><br>";
	result = result +"<span class='crawled'>crawled time: "+ String(moment(data.date_crawl)._d).substring(0,25) +"WIB</span><br>";
	return result;
}

get_news(0,10);

function get_news(from,size){
	$.ajax({
	    type: 'POST',
	    // make sure you respect the same origin policy with this url:
	    // http://en.wikipedia.org/wiki/Same_origin_policy
	    url: 'http://128.199.120.29:8274/api/v1/news',
	    data: '{"media":'+localStorage.getItem("medlist")+',"keyword":"'+localStorage.getItem("keyword")+'","begin":"'+localStorage.getItem("begin")+' 01:00:00","end":"'+localStorage.getItem("end")+' 01:00:00","from_page":'+from+',"page_size":'+size+'}',
	    success: function(msg){
	        response = msg.result[0].news;
			generate_result(response);
	    },
	    beforeSend : function() {
	          template.html(
	            '<img style="margin-left:50%;left:-48px;" src="/static/img/loader.gif" />'
	          );   
        }
	});
}
  