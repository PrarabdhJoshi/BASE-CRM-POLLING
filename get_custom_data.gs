function latest_fetch_custom(cur_data, custom, prev_custom) {
  
  for(var i=0;i<24;i++){
   cur_data.push(''); 
  }
  Logger.log("We are now in fetch_custom function\n\n");
  Logger.log(typeof(custom));
  try{
  custom = JSON.parse(custom);
  }
  catch(err){
    Logger.log("\n\nProblem parsing string \n\n")
  }
  
  try{
  
  for(var key in custom){
    
    var col = custom[key].custom_field.data.name;
    
    var value = custom[key].value.name;
    
    if(value == undefined)
      value = custom[key].value;
    
    
  
    
    Logger.log("COLUMN VALUES");
    Logger.log(col);
    Logger.log(value);
    
    switch(col){
        
      case /*List all your custom cases and add them to the cur_data object, mapping with the google cloud sheet*/
      default:
        break;   
        
        
    } // end of switch
    
    
  }// end of for
  
  }// end of try
  catch(err){
    
    Logger.log("no values were added\n\n");
    Logger.log(custom);
  } // end of catch
  
  return cur_data;
  
} // end of function
