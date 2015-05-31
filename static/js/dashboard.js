var click_status;

// Script for date
$("datepicker").datepicker({
    isDisabled: function(date) {
        return date.valueOf() > now ? true : false;
    }
});

window.onload = check_local();

 // Check whether the localStorage is empty or not 
function check_local(){
  select_multiple();
  if (localStorage.getItem("medshare_data") && localStorage.getItem("kol_data") && localStorage.getItem("medsum_data")){
    medshare_data = localStorage.getItem("medshare_data");
    kol_data = localStorage.getItem("kol_data");
    medsum_data = localStorage.getItem("medsum_data");
    wordfreq_data = localStorage.getItem("wordfreq_data");
    list_media = localStorage.getItem("medialist");

    document.search["keyword"].value = localStorage.getItem("keyword");    
    document.search["date_start"].value = localStorage.getItem("begin");
    document.search["date_end"].value = localStorage.getItem("end");

    return true;
  } 
  return false;
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
    media:list_media,
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
}

