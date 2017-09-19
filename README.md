# BASE-CRM-POLLING
Track changes made on the BASE CRM and store the incoming data to generate monthly KPIS

About BASE CRM:
`
Base is revolutionizing the way that leading businesses manage, measure and maximize sales growth. Unlike legacy cloud CRM and sales force automation systems, Base offers an all-in-one solution that improves adoption rates, productivity, data capture and insights.
`
Problem:
Log all the events triggered in BASE CRM on a spreadsheet.  
Extension: Generate a report from the captured data. 

Solution:
Setup Polling on BASE's FIREHOSE API to capture all the events as and when triggered on BASE Software UI.  
Extension: Use this data to generate a KPI report using it.   

Requirements:
Use GAS to setup polling and automate it to trigger every 10 minutes or so. 
Hit the Firehose API from the last logged Snapshot Address.  

Implementation Notes:
To do:
Maintain the links to all Sanpshots address that we hit. 
Start with the last snapshot that we saw to poll fresh data. 
//Update the external library in order to hit end points with multiple authorization headers. -- library no longer needed
Manually set template for Custom Field data items and update the sheet using GAS

Generate Compnay reports through the meta data of captured Events!!
