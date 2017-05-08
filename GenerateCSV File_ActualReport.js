/**
 * 
 * Script comments    :  This script will merge two saved searches and display results as CSV file.
 */
function lastWeekInvoiceReports(type) {
	var soIDs = new Array();
	var facility =new Array();
	var custName =new Array();
	var amount =new Array();
	var shipDate =new Array();
	var itemType =new Array();
	
	var soIDS_Search2 = new Array();
	var cogsAmount_Search2 = new Array();
	
	var lastWeekSalesSearch = nlapiLoadSearch(null, 'customsearch262');
	var salesSearchResults  = lastWeekSalesSearch.runSearch();
	var index = 0; 
	var resultStep = 1000; 
	var resultSet;
	do { 
		// Logic for reading more than 4000 results
		resultSet = salesSearchResults.getResults(index, index + resultStep);
		index = index + resultStep;
		for(var saleElement =0; resultSet!=null && saleElement<resultSet.length; saleElement++) { 

			//start of rescheduling logic.............

			if(nlapiGetContext().getRemainingUsage() <= 1000) { 
				var stateMain = nlapiYieldScript();
				if( stateMain.status == 'FAILURE') { 
					nlapiLogExecution("debug","Failed to yield script, exiting: Reason = "+ stateMain.reason + " / Size = "+ stateMain.size);
					throw "Failed to yield script";
				}
				else if(stateMain.status == 'RESUME') { 
					nlapiLogExecution("debug", "Resuming script because of " + stateMain.reason+". Size = "+ stateMain.size);
				}
			}

			//End Of rescheduling Logic............


			var results = resultSet[saleElement];
			var sCols = results.getAllColumns();
			facility[facility.length]=results.getValue(sCols[0]);
			custName[custName.length]=results.getValue(sCols[1]);
			amount[amount.length]=results.getValue(sCols[2]);
			shipDate[shipDate.length]=results.getValue(sCols[3]);
			itemType[itemType.length]=results.getValue(sCols[4]);
			
			
			soIDs[soIDs.length]=results.getValue(sCols[6]);
		}
	}while (resultSet.length >= 1000);
	
	

			//Saved search to get the Rev Rec Plan ID'S
			var cogssearch = nlapiLoadSearch(null, 'customsearch264');
			var cogsFilters = new Array();
			cogsFilters[0] = new nlobjSearchFilter('internalid', 'createdfrom', 'anyof',soIDs);
			cogssearch.addFilters(cogsFilters);
			var cogsSearchResults  = cogssearch.runSearch();
			var index1 = 0; 
			var resultStep1 = 1000; 
			var resultSet1;
			do { 
				// Logic for reading more than 4000 results
				resultSet1 = cogsSearchResults.getResults(index1, index1 + resultStep1);
				index1 = index1 + resultStep1;
				for(var len =0; resultSet1!=null && len<resultSet1.length; len++) { 

					//start of rescheduling logic.............

					if(nlapiGetContext().getRemainingUsage() <= 1000) { 
						var stateMain = nlapiYieldScript();
						if( stateMain.status == 'FAILURE') { 
							nlapiLogExecution("debug","Failed to yield script, exiting: Reason = "+ stateMain.reason + " / Size = "+ stateMain.size);
							throw "Failed to yield script";
						}
						else if(stateMain.status == 'RESUME') { 
							nlapiLogExecution("debug", "Resuming script because of " + stateMain.reason+". Size = "+ stateMain.size);
						}
					}

					//End Of rescheduling Logic............


					var results1 = resultSet1[len];
					var sCols = results1.getAllColumns();
					soIDS_Search2[soIDS_Search2.length]=results1.getValue(sCols[0]);
					cogsAmount_Search2[cogsAmount_Search2.length]=results1.getValue(sCols[1]);
					
				}
			}while (resultSet1.length >= 1000);
		
			nlapiLogExecution('debug', 'facility', facility);
			nlapiLogExecution('debug', 'custName', custName);
			nlapiLogExecution('debug', 'amount', amount);
			nlapiLogExecution('debug', 'shipDate', shipDate);
			nlapiLogExecution('debug', 'itemType', itemType);
			nlapiLogExecution('debug', 'soIDs', soIDs);
			//nlapiLogExecution('debug', 'cogsAmount', cogsAmount);
			
			
			var fileContent = '';
			
			for (var data = 0; data < facility.length; data++) {
				
				var soID_Index = soIDS_Search2.indexOf(soIDs[data]);
				var COGSAmount = cogsAmount_Search2[soID_Index];
				
				fileContent +='\n';
				fileContent +='"'+facility[data]+'",';
				fileContent +='"'+custName[data]+'",';
				fileContent +='"'+amount[data]+'",';
				fileContent +='"'+shipDate[data]+'",';
				fileContent +='"'+COGSAmount+'",';
				fileContent +='"'+itemType[data]+'"';
			}
			
			
			var CSVFILE_Data = '"FACILITY","SO_GLOBAL_CUST_NAME","USD_SO_QTY_VALUE","SHIP DATE","USD_STD_COST_VALUE","ITEM TYPE"';
			CSVFILE_Data +=fileContent;

			try{
				var sysdate= sysDate();
				// Creating a csv file and passing the contents string variable. 
				var file = nlapiCreateFile('LIVING_AMERICAS_'+sysdate+'.csv', 'CSV', CSVFILE_Data);
				file.setFolder(11070);//folder name = last week invoice REPORT
				var fileid=nlapiSubmitFile(file);
				var fileObj=nlapiLoadFile(fileid);

				var recipients = []; 
				var sender = 36;
				var subject = 'Sales Consolidation Report';
				var body = 'Please find the sales consolidation Report';
				nlapiSendEmail(sender,recipients,subject,body,null,null,null,fileObj);
				
			}catch(e){
				nlapiLogExecution('debug', 'error', e);
			}
			
			
}

function sysDate() 
{
var date = new Date();
var tdate = date.getDate();
var month = date.getMonth() + 1; // jan = 0
if(month<10){
	month='0'+month.toString();
}
var year = date.getFullYear();
var hours = date.getHours();
if(hours<10){
	hours='0'+hours.toString();
}
var minutes = date.getMinutes();
var seconds = date.getSeconds();
var currentDate = year.toString()+ month.toString()+tdate.toString() + hours.toString() + minutes.toString() + seconds.toString() ;
nlapiLogExecution('debug', 'currentDate', currentDate);
nlapiLogExecution('debug', 'year', year);

return currentDate;
}

	
