var click_status;

function on_logout(){
  localStorage.clear();
}


// Script for date
$("datepicker").datepicker({
    isDisabled: function(date) {
        return date.valueOf() > now ? true : false;
    }
});


$(document).ready(check_local);

function set_selected_media(){
  if (localStorage.getItem("medialist")) {
    var media_list = localStorage.getItem("medialist").split(",");
    $("#medlist").val(media_list).change();
  }
}

function set_selected_keyop(){
  if (localStorage.getItem("keyop_data")) {
    var kol_list = localStorage.getItem("keyop_data").split(",");
    $("#kol").val(kol_list).change();
  }
}

/*
* Set the submitted value from user
*/
function check_local(){
  select_multiple();  
  if (localStorage.getItem("medshare_data") && localStorage.getItem("kol_data") && localStorage.getItem("medsum_data") && localStorage.getItem("wordfreq_data") && localStorage.getItem("interlude") && localStorage.getItem("keyop_data")){
    medshare_data = localStorage.getItem("medshare_data");
    kol_data = localStorage.getItem("kol_data");
    medsum_data = localStorage.getItem("medsum_data");
    wordfreq_data = localStorage.getItem("wordfreq_data");
    interlude = localStorage.getItem("interlude");
    keyop_data = localStorage.getItem("keyop_data")

    document.search["keyword"].value = localStorage.getItem("keyword");    
    document.search["date_start"].value = localStorage.getItem("begin");
    document.search["date_end"].value = localStorage.getItem("end");
    document.media["interlude"].value = localStorage.getItem("interlude");

    set_selected_media();
    set_selected_keyop();
  } 
}

function select_multiple(){
  $.when(get_media_list()).done(function(data){
    data = data.result;
    var options = [];
    $.each(data,function(c,d){
      options.push("<option value='"+d+"'>"+d+"</option>");
    });
    $("#medlist").append(options); 
  });
  $("#medlist").select2();

/*  if(localStorage.getItem("keyop_data")) {
	  var keyop_list = localStorage.getItem("keyop_data").split();
	  var options = [];
	  $.each(keyop_list,function(id,data){
	  	options.push("<option value='"+data+"'>"+data+"</option>");
	  });
	  $("#kol").append(options);
  }*/

  $("#kol").select2({
    tags:true,
    tokenSeparators: [',']
  });
}

function get_media_list(){
  return $.ajax({
    dataType: "json",
    type: "GET",
    url: create_url("listmedia"),
    crossDomain: true,
    headers:{
      "Authorization":""+set_header()
    }
  });
}

function get_all_media_name(){
  var arr = [];
  $("option").each(function(d){
    arr.push($(this).val());
  });
  return arr;
}

/*
* "Select all media" handler
* First click to set, second click to unset
*/
function select_all(){
  var clicked = $("input[type='checkbox']").data("clicked");
  if (clicked) {
    clicked = false;
    $("#medlist").val(null).change();
  } else {
    clicked = true;
    $("#medlist").val(get_all_media_name()).change();
  }
  $("input[type='checkbox']").data("clicked",clicked);
}

/*
* If user submit data, do:
* 1. Save data to localStorage
* 2. Reload page for begin the search
*/
function save_session(data){
  var keyword = document.search["keyword"].value;
  var start = document.search["date_start"].value;
  var end = document.search["date_end"].value;
  var interlude = document.media["interlude"].value;
  var keyop_data = $("#kol").val() ? $("#kol").val() : [];

  if (!keyword || !start || !end){
    return false;
  }

  localStorage.setItem("keyword",keyword);
  localStorage.setItem("begin",start);
  localStorage.setItem("end",end);
  localStorage.setItem("interlude",interlude);
  localStorage.setItem("keyop_data",keyop_data);

  list_media = $("#medlist").val() ? $("#medlist").val() : [];
  localStorage.setItem("medialist",list_media);

  var tmp_data = JSON.stringify({
    media:list_media,
    keyword: keyword,
    begin: start+" 01:00:00",
    end: end+" 01:00:00",
    interlude: interlude
  });

  localStorage.setItem("medshare_data",tmp_data);

  tmp_data = JSON.stringify({
    media:list_media,
    name: keyop_data,
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
    limit:10,
    begin: start+" 01:00:00",
    end: end+" 01:00:00"
  });

  localStorage.setItem("wordfreq_data",tmp_data);

  window.location.reload();
}
