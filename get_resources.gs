function get_stage_name(stage_id) {
  var stage_name = "";  
  var url =  'https://api.getbase.com/v2/stages?ids='+stage_id;
  var headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer /*add your token here*/'
  };
  var options = {
    "method": "get",
    "headers": headers
   };
  Utilities.sleep(100);
  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  var data_pos = JSON.parse(json);
  
  return data_pos.items[0].data.name;
  
}

/***********GET USER NAME**************/

function get_user_name(user_id){
  if(user_id=='null')
    return ' ';
    var url1 =  'https://api.getbase.com/v2/users/'+user_id;
  var headers1 = {
    'Accept': 'application/json',
    'Authorization': 'Bearer /*add your token here*/'
  };
  var options1 = {
    "method": "get",
    "headers": headers1
   };
  Utilities.sleep(100);
  var response1 = UrlFetchApp.fetch(url1, options1);
  var json1 = response1.getContentText();
  var data_pos1 = JSON.parse(json1);
  
  return data_pos1.data.name;
  
}
