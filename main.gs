function Poll_Base(){
  
  
  var url = "https://api.getbase.com/v3/deals/stream?position=";          // the end point for Firehose API
  var url_org = "https://api.getbase.com/v3/deals/stream?position=";      //protocol url to add new position values
  var sheet_latest = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('/*your sheet name goes here*/'); //sheet to be updated
  var position = 'tail';  //default Position
  try{
    var lastRow = sheet_latest.getLastRow();
    position = sheet_latest.getRange("B"+lastRow).getValue();
    custom_position = sheet_latest.getRange("B"+lastRow).getValue();
    Logger.log(position);
  }
  catch(err){
    position = 'tail';
    custom_position = 'tail';
  }
  
  /********AUTHENTICATE REQUESTS***********/
 
  var headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer /*add your token*/'
  };
  var options = {
    "method": "get",
    "headers": headers
   };
  
  url = url + position;
  var onTop = false;
  var all_data = []; // THIS WILL CONTAIN ALL THE DATA WE CAPTURE
  
  /********ITERATRE THROUGH THE DATA*********/
  while(onTop == false){
    
    Utilities.sleep(30);
    
    var response = UrlFetchApp.fetch(url, options);
    var json = response.getContentText();
    var data_pos = JSON.parse(json);
    position = "";
    position = data_pos.meta.position;
    onTop = data_pos.meta.top;
    var one_data = []; // INDIVIDULA ROWS TO BE APPENDED TO all_data OBJECT
    
    /********ENTER THE LOOP TO GO THROUGH EACH SNAPSHOT*********/
    for(var item_length=0;item_length<data_pos.items.length;item_length++){ // start of snapshot loop
      
      one_data=[];
      var timestamp = "";
      var sequence = "";
      var deal_id = "";
      var deal_name = "";
      var custom_object = "";
      var meta_link_next = "";
      var owner_id = "";
      var event_type = "";
      var event_id = "";
      var last_stage_change_at = "";
      var deal_created_at= "";
      var value = "";
      var stage = "";
      var creator_id = "";
      var source_id = "";
      var loss_reason_id = "";
      var stage_change_from = "";
      var last_stage_changed_at = "";
     // var fields_changed = "";
      var last_stage_change_by = "";
      
      
      try{
        
        meta_link_next = data_pos.meta.links.next;
        //position already assigned
        //meta.top already assigned
        event_type = data_pos.items[item_length].meta.event_type;
        timestamp = data_pos.items[item_length].meta.event_time; // event time
        sequence = data_pos.items[item_length].meta.sequence;
        event_id = data_pos.items[item_length].meta.event_id;
        deal_id = data_pos.items[item_length].data.id;
        deal_name = data_pos.items[item_length].data.name;
        last_stage_change_at = data_pos.items[item_length].data.last_stage_change_at;
        deal_created_at = data_pos.items[item_length].data.created_at;
        value = data_pos.items[item_length].data.value;
        stage = data_pos.items[item_length].data.stage_id;
        owner_id = data_pos.items[item_length].data.owner_id;
        
        creator_id = data_pos.items[item_length].data.creator_id;
        source_id = data_pos.items[item_length].data.source_id;
        loss_reason_id = data_pos.items[item_length].data.loss_reason_id;
        custom_object = data_pos.items[item_length].data.custom_field_values;  // custom_object captured
        stage_change_from = "";
        last_stage_change_at = "";
        var last_stage_change_at_stage_dependent = "";
        last_stage_change_at = data_pos.items[item_length].data.last_stage_change_at;
        last_stage_change_by = data_pos.items[item_length].data.last_stage_change_by_id;
        var fields_changed = {};
        if(event_type == "updated")
          fields_changed = data_pos.items[item_length].meta.previous;
        
      }catch(err){
        Logger.log("Storing data failure!");
      }
      
      
      /*****STORE THE DEAL DATA CAPTURED ************/
      
      one_data.push(meta_link_next);
      one_data.push(position);
      one_data.push(onTop);
      one_data.push(event_type);
      one_data.push(timestamp);
      one_data.push(sequence);
      one_data.push(event_id);
      one_data.push(deal_id);
      one_data.push(deal_name);
      //if('last_stage_change_at' in fields_changed)
        one_data.push(last_stage_change_at);
//      else{
//        if(event_type == "updated")
//          one_data.push(' ');
//        else
//          one_data.push(last_stage_change_at);
//      }
        
      one_data.push(deal_created_at);
     
      var stage_name = get_stage_name(String(stage));
      one_data.push(stage_name);
      var stage_changed_by = get_user_name(String(last_stage_change_by));
      one_data.push(stage_changed_by);
       if('value' in fields_changed)
        one_data.push(value);
      else{ 
        if(event_type == "updated")
          one_data.push('');
        else
          one_data.push(value);
      }
      var owner_name = get_user_name(String(owner_id));
      if('owner_id' in fields_changed){
        
        one_data.push(owner_name);
      }
      else{
        if(event_type =="updated")
          one_data.push('');
        else
          one_data.push(owner_name);
        
      }
      
      
      var creator_name = get_user_name(String(creator_id));
      if('creator_id' in fields_changed){
        
        one_data.push(creator_name);
      }
      else{
        if(event_type =="updated")
          one_data.push('');
        else
          one_data.push(creator_name);
        
      }
      
      
      
      if('source_id' in fields_changed)
        one_data.push(source_id);
      else{
        if(event_type == "updated")
          one_data.push(' ');
        else
          one_data.push(source_id);
      }
      
      if('loss_reason_id' in fields_changed)
        one_data.push(loss_reason_id);
      else{
        if(event_type == "updated")
          one_data.push(' ');
        else
          one_data.push(loss_reason_id);
      }
      
      var prev_custom = {};
      if(event_type == "updated"){
        for(var evp in fields_changed){
          if(evp == "stage_id"){
            
            stage_change_from = get_stage_name(String(fields_changed.stage_id));
            
          }
          else if(evp == "last_stage_change_at")
            last_stage_change_at_stage_dependent = data_pos.items[item_length].data.last_stage_change_at;
          else if(evp == "custom_field_values"){
             prev_custom = data_pos.items[item_length].meta.previous.custom_field_values;
        }
        
        }
        
        
        
      }
      one_data.push(stage_change_from);
      one_data.push(last_stage_change_at_stage_dependent);
      
      
      
      
      /******************************************************************************
      *******************************************************************************
      ************************** !Map Out Custom Data Manually! **************************
      *******************************************************************************
      ******************************************************************************/
      
      
//      //Check what fields have changed for custom Data
//      var previous_data = data_pos.items[item_length].meta.previous;
//      var custom_data_that_changed = {};
//      try{
//        
//        custom_data_that_changed = previous_data.custom_field_values;
//      }catch(err){
//        
//        custom_data_that_changed = {};
//        
//      }
      if('custom_field_values' in fields_changed){
      try{  
        one_data = latest_fetch_custom(one_data, custom_object, prev_custom); //(one_data, custom_object, custom_data_that_changed);      
      }catch(err){
        Logger.log("Custom Data Mapping Failure!");  
      }
      }
      else{
         for(var i=0;i<24;i++){
           one_data.push(''); 
         }
      }
      
     
      // add row to the all_data object
      if(event_type=="updated")
        one_data.push(JSON.stringify(data_pos.items[item_length].meta.previous));
      all_data.push(one_data);
      
     
    }// end of snapshot loop
    
    url = url_org;
    url = url + position;
    
    
    
  }// END OF OnTop == false while loop
  
  for(var i =0;i<all_data.length;i++){
    //if(i%30==0)
      Utilities.sleep(30); 
     sheet_latest.appendRow(all_data[i]);
    
   }
    
  
  
  
}
