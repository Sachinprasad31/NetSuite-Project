

function SHPonLoad(type, form)
{
	
	if(type!= 'delete')
	{

		var i_context = nlapiGetContext();
		var s_context_type = i_context.getExecutionContext();
		
		if(s_context_type == 'userinterface')
			{

				var d_todays_date = new Date();
				d_todays_date.setUTCHours(d_todays_date.getUTCHours()+8);
				d_todays_date = nlapiDateToString(d_todays_date);

				var record = nlapiGetNewRecord();
				nlapiLogExecution('DEBUG', 'afterSubmit_PO',' record -->' + record);

				if(type == 'view'){
			
					//add a sublist to the form. Specify an internal ID for the sublist, 
			        //a sublist type, sublist UI label, and the tab the sublist will appear on
			        try{

			        		//Add a new tab to the form
  							var sampleTab = form.addTab('custpage_sample_tab', 'Contact Info Tab');

						    //Add a field to the new tab
						    var newFieldEmail = form.addField('custpage_field_email', 'email', 'Alt Email', null, 
						      'custpage_sample_tab');   
						    //Add a second field to the new tab
						    var newFieldText = form.addField('custpage_field_text', 'textarea', 'Details', null,
						      'custpage_sample_tab');
						    //Add a subtab to the first tab
							var sampleSubTab = form.addSubTab('custpage_sample_subtab', 'Contact Info',
							      'custpage_sample_tab');

				       		var contacts = form.addSubList('custpage_contacts', 'inlineeditor', 'Contact Info Tab', 'custpage_sample_subtab');

					        //add fields to the sublist
					        contacts.addField('entityid', 'text', 'Name');
					        contacts.addField('phone', 'phone', 'Phone');
					        contacts.addField('email', 'email', 'Email');

				         	// perform a Contact record search. Set search filters and return columns for
				        
				       		// the Contact search
				        	var contactdata = nlapiSearchRecord('contact', null, new
				                          nlobjSearchFilter('company', null, 'anyOf', nlapiGetFieldValue('entity')),
			                           	 [new nlobjSearchColumn('entityid'), new nlobjSearchColumn('phone'), 
			                              new nlobjSearchColumn('email')])

						
				        	// display the search results on the Custom Contact sublist
				        	contacts.setLineItemValues(contactdata)
			        	}catch(E){

			        	nlapiLogExecution('DEBUG', 'afterSubmit_PO',' Exception -->' +E.message);

			       		}
			       

				}
			}
	}
}