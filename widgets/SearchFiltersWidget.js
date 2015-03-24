(function ($) {

	AjaxSolr.SearchFiltersWidget = AjaxSolr.AbstractFacetWidget.extend({

		previous_values: {},

		init: function () {
			var self = this;
			var $target = $(this.target);
			var title = self.manager.translator.getLabel("tagcloud_" + this.field);

			var json_data = {"options" : new Array({title:title, search_lab:self.manager.translator.getLabel(sprintf('search_%s_lab', this.id)), values:[{ "value": 'value', "text": ''}]})};	 
			var html = self.template_integration_json(json_data, '#chosenTemplate'); 	

			$target.html(html);	

			$('#search-filters h2.heading--widgets').html(self.manager.translator.getLabel('search_filter'));

			this.previous_values[this.field] = new Array(),

			//* init 'chosen' plugin
			self.init_chosen();

			this.hide_drop();	  
		},

		beforeRequest: function(){			
			var self = this;
			var $target = $(this.target);

//			if (!self.getRefresh())				
//				return;	
//			
//			$target.find('.number-of-matches').text(self.manager.translator.getLabel('search_data_loading'));			
			
			
			var $select = $(this.target).find('select');

			if (!self.getRefresh())				
				return;			

			$select.attr('data-placeholder', self.manager.translator.getLabel('search_data_loading'));
			$target.find('select').trigger("chosen:updated");	

		},

		process_filter: function () {
			var self = this;
			var $target = $(this.target);
			var $select = $(this.target).find('select');
			var title = self.manager.translator.getLabel("tagcloud_" + this.field);

			if (!self.getRefresh()){
				self.setRefresh(true);
				return;
			};	 		  	  			  		

			if(smkCommon.debugTime()) console.time("SearchFilters - " + this.field);	
			
			if(smkCommon.debugTime()) console.time("SearchFilters - " + this.field + " - process");
						
			if (self.manager.response.facet_counts.facet_fields[self.field] === undefined &&
				self.manager.response.facet_counts.facet_ranges[self.field] === undefined) {
//				var template = Mustache.getTemplate(templ_path);			
//				var html = Mustache.to_html($(template).find('#chosenTemplate').html(), json_data);
//				$target.html(html);
//				$('.chosen--multiple').chosen({no_results_text: "No results found."});
				return;
			};

			//* proceed facet values
			var maxCount = 0;
			var totalCount = 0;
			var i = 0;
			var objectedItems = [];

			switch (self.field){
			case 'object_production_date_earliest':		 			  			  			  
				//for (var facet in self.manager.response.facet_counts.facet_fields[self.field]) {
				for (var facet in self.manager.response.facet_counts.facet_ranges[self.field].counts) {
					var count = parseInt(self.manager.response.facet_counts.facet_ranges[self.field].counts[facet]);
					if (count > maxCount) {
						maxCount = count;
					};	

					var daterange = new Date(facet);
					
					objectedItems.push({ "value": facet, "text": this.getCentury(daterange.getFullYear()), "count": count, "i": i });
					i++;
				};
				if (self.manager.response.numFound > 0 && self.manager.response.facet_counts.facet_ranges[self.field].before !== undefined){
					var count = self.manager.response.facet_counts.facet_ranges[self.field].before;				
					var last_facet = objectedItems[0].value;
					var daterange = new Date(last_facet);
					var text = sprintf("%s %s",  self.manager.translator.getLabel("search_filter_before"), this.getCentury(daterange.getFullYear()));
					
					objectedItems.push({ "value": "< " + last_facet, "text": text, "count": count, "i": i });
					i++;
				}
				
				totalCount = i;
				objectedItems.sort(function (a, b) {
					return parseInt(b.value)-parseInt(a.value);	  	      
				});				  			  			  
				break;	

			case 'artist_natio_en':
			case 'artist_natio_dk':
			case 'object_type_dk':
			case 'object_type_en':
			case 'prod_technique_dk':
			case 'prod_technique_en':
				for (var facet in self.manager.response.facet_counts.facet_fields[self.field]) {
					var count = parseInt(self.manager.response.facet_counts.facet_fields[self.field][facet]);
					if (count > maxCount) {
						maxCount = count;
					};

					if(smkCommon.isValidDataText(facet)){
						objectedItems.push({ "value": facet, "text": smkCommon.firstCapital(facet).trim(), "count": count, "i": i }); 
						i++;
					}

				};
				totalCount = i;
				objectedItems.sort(function (a, b) {
					if (self.manager.translator.getLanguage() == 'dk')
						return typeof (a.value === 'string') && typeof (b.value === 'string') ? (a.value.trim() < b.value.trim() ? -1 : 1) : (a.value < b.value ? -1 : 1);

						return typeof (a.text === 'string') && typeof (b.text === 'string') ? (a.text.trim() < b.text.trim() ? -1 : 1) : (a.text < b.text ? -1 : 1);
				});	  	 		  	  
				break;					  

			default:		    			  			   							  
				for (var facet in self.manager.response.facet_counts.facet_fields[self.field]) {
					var count = parseInt(self.manager.response.facet_counts.facet_fields[self.field][facet]);
					if (count > maxCount) {
						maxCount = count;
					};

					objectedItems.push({ "value": facet, "text": smkCommon.firstCapital(facet).trim(), "count": count, "i": i }); 
					i++;	    	  	  	      	  	      
				};
				totalCount = i;
				objectedItems.sort(function (a, b) {
					return typeof (a.value === 'string') && typeof (b.value === 'string') ? (a.value.trim() < b.value.trim() ? -1 : 1) : (a.value < b.value ? -1 : 1);	  	      
				});	  	 		  	  
				break;		  
			};

			//* merge facet data and template			
			var json_data = {"options" : new Array({title:title, totalCount:totalCount, values:objectedItems})};	    	    	    
			var html = self.template_integration_json(json_data, '#chosenTemplate'); 			
			
			if(smkCommon.debugTime()) console.timeEnd("SearchFilters - " + this.field + " - process");						
			if(smkCommon.debugTime()) console.time("SearchFilters - " + this.field + " - chosen");
			
			//* save previous selected values in the target 'select' component	  	 
			$select.find("option:selected").each(function (){
				self.previous_values[self.field].push(this.value.replace(/^"|"$/g, ''));	  		
			});

			//$target.hide(); // hide until all styling is ready

			//* remove all options in 'select'...
			$select.empty();	  	
			//*... and copy the new option list
			
			$select.append($(html).find('option'));	  		  	
			

			//* add previous selected values in the target 'select' component
			if (self.previous_values[self.field].length > 0){

				// if there were no result after the request, we add 'manually' the previous selected values in the "select" component
				if (objectedItems.length == 0){
					for (var i = 0, l = self.previous_values[self.field].length; i < l; i++) {
						var facet = self.previous_values[self.field][i];
						objectedItems.push({ "value": facet, "text": smkCommon.firstCapital(facet), "count": '0' });					
					}	
					var json_data = {"options" : new Array({title:this.title, values:objectedItems})};	    	    	    
					var html = self.template_integration_json(json_data, '#chosenTemplate');
					$select.append($(html).find('option'));
				}

				// add previous selected values 
				$(this.target).find('select').val(self.previous_values[self.field]); 	

			}			

			//* add behaviour on select change
			$target.find('select').change(self.clickHandler());

			//* change default text			
			$select.attr('data-placeholder', self.manager.translator.getLabel(sprintf('search_%s_lab', this.id)));

			
			if(smkCommon.debugTime()) console.time("SearchFilters - " + this.field + " - chosen - update");
			//* update 'chosen' plugin		
			$target.find('select').trigger("chosen:updated");		
			if(smkCommon.debugTime()) console.timeEnd("SearchFilters - " + this.field + " - chosen - update");
			
			//* in the lines below, we're queuing process_multiple_select and showing of dropdown list,
			//* so that they execute in a row with a 10ms interval
			if(smkCommon.debugTime()) console.time("SearchFilters - " + this.field + " - chosen - open");	
			$.taskQueue.add(self.process_multiple_select, this, 0);	
			if(smkCommon.debugTime()) console.timeEnd("SearchFilters - " + this.field + " - chosen - open");

			
			//* show component
//			$target.show();
//			$target.find('chosen-choices').blur();

			//* show dropdownlist excepted if a filter is already selected
			if (self.previous_values[self.field].length > 0){
				this.hide_drop();
			}else{
				if(smkCommon.debugTime()) console.time("SearchFilters - " + this.field + " - chosen - show");			

				var doQueueShow = function(target){				
					var doShow= function() {
						$(target).find('.chosen-drop').show();
					};
					$.taskQueue.add(doShow, this, 10);	
				};
											
				doQueueShow(self.target);								

				if(smkCommon.debugTime()) console.timeEnd("SearchFilters - " + this.field + " - chosen - show");				
			}			
			

			self.previous_values[self.field] = new Array();					
			
			if(smkCommon.debugTime()) console.timeEnd("SearchFilters - " + this.field + " - chosen");
			if(smkCommon.debugTime()) console.timeEnd("SearchFilters - " + this.field);	
			
			//* send "loaded" event
			$(this).trigger({
				type: "smk_search_filter_loaded"
			});
		},


		getCentury: function(facet){

			var number = parseInt(facet);
			var ordinal = "";
			var century = this.manager.translator.getLabel("search_filter_cent");

			switch (this.manager.translator.getLanguage()){
			case "dk":
				//number = (number -1) * 100; 
				ordinal = "-";					  			  			  
				break;
			case "en":		 
				while(number > 21){
					number = number / 10;
				}
				ordinal = smkCommon.ordinal_suffix(number);					  			  			  
				break;		  
			};

			return sprintf('%s%s%s', number, ordinal, century); 

		},

		/**
		 * @param {String} value The value.
		 * @returns {Function} Sends a request to Solr if it successfully adds a
		 *   filter query with the given value.
		 */
		clickHandler: function () {
			var self = this, meth = this.multivalue ? 'add' : 'set';
			return function (event, params) {
				event.stopImmediatePropagation();     	    	
				self.hide_drop();

				$(self).trigger({
					type: "smk_search_filter_changed",
					params: params
				});    	    	

				return false;
			}
		},  

		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		},
		/*
		   § Chosen
		  \*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		init_chosen: function() {
			
			var $target = $(this.target); 		

			$target.find('.chosen select').chosen();

			// Multiple select
			$target.find('.chosen--multiple select').chosen({
				width: "198px"
			});

		},

		process_multiple_select: function(){

			var $target = $(this.target); 
			// Multiple select (always open).
			$target.find('.chosen--multiple.chosen--open').each( function() {

				// This 'fix' allows the user to see the select options before he has
				// interacted with the select box.
				// 
				// Chosen do not show the contents of the select boxes by default, so we
				// have to show them ourselves. In the code below we loop through the options
				// in the select boxes, adds these to an array, and append each array item
				// to the <ul> called .chosen-results. Chosen uses .chosen-results to show
				// the options.

				var chosenResults = $(this).find('.chosen-results');

				// For each item in the array, append a <li> to .chosen-results
				var i = 0;
				var doQueueProcess = function(i, text){
					setTimeout(function () {
						chosenResults.append('<li class="active-result" data-option-array-index="' + i + '">' + text + '</li>');
					}, 10);
					
				};
				$(this).find('select option').each( function() {
					doQueueProcess(i, $(this).text());
					i++;
				});
			
			});    	  	  
		},

		hide_drop: function(){	  	
			$(this.target).find('.chosen-drop').hide();	  
		},

		/**
		 * @param {String}
		 * */
		addSelectedFilter: function (value){	 
			this.previous_values[this.field].push(value.replace(/^"|"$/g, ''));
		},

		removeAllSelectedFilters: function(removeFromStore){
			var self = this;
			var $select = $(self.target).find('select');

			$select.find("option:selected").each(function (){
				$(this).removeAttr("selected");
				if(removeFromStore == true)
					self.manager.store.removeByValue('fq', self.fq(this.value));
			});	

			//* update 'chosen' plugin		
			$select.trigger("chosen:updated");

			this.previous_values[this.field] = new Array();
		}
	});

})(jQuery);
