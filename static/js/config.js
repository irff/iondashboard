var api_url = "128.199.120.29:8200";

function create_url(service) {
  return "http://"+api_url+"/api/v1/"+service;
}

function set_header(){
  return "Basic "+window.btoa(unescape(encodeURIComponent(USERNAME + ':' + 'unused')));
  //return "Basic "+btoa(USERNAME+":unused");
}

// $.ajaxSetup({
//     headers:{	
//         Authorization: set_header();
//     }
// });

