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

		after_afterRequest: function () {
			var self = this;
			var $target = $(this.target);
			var $select = $(this.target).find('select');
			var title = self.manager.translator.getLabel("tagcloud_" + this.field);

			if (!self.getRefresh()){
				self.setRefresh(true);
				return;
			};	 		  	  			  		

			
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
				if (self.manager.response.facet_counts.facet_ranges[self.field].before !== undefined){
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

			/*
			$target.html(html);

			//** refresh view

			if (document.querySelector(this.target + ".filter-multiple")) {
				var a = document.querySelectorAll(this.target + ".filter-multiple"), b = "filter-multiple-open", c = 46;
				//px
				Array.prototype.forEach.call(a, function(a) {
					// Move checked options to a visible area (so you don't need to open the 
					// .filter-multiple to see the selected options)
					var d = a.querySelectorAll(".filter-options input[checked]");
					Array.prototype.forEach.call(d, function(a) {
						var b = a.parentNode.parentNode.parentNode;
						b.querySelector(".filter-options-checked").appendChild(a.parentNode);
					}), a.querySelector(".filter-toggle").addEventListener("click", function(d) {
						d.preventDefault(), d.stopImmediatePropagation(), a.classList.contains(b) ? (a.classList.remove(b), 
								a.style.height = a.querySelector(".filter-options-checked") ? c + a.querySelector(".filter-options-checked").clientHeight + "px" : c + "px") : (a.classList.add(b), 
										a.style.height = a.querySelector(".filter-options").clientHeight + a.querySelector(".filter-options-checked").clientHeight + c + "px");
					}, !0), // Open if the .filter-multiple has the 'open' class
					a.classList.contains(b) ? a.style.height = a.querySelector(".filter-options").clientHeight + a.querySelector(".filter-options-checked").clientHeight + c + "px" : // If options list has checked items, adjust the height of the containing
						// element, so that we can se the checked items.
						a.querySelector(".filter-options-checked") && (a.style.height = c + a.querySelector(".filter-options-checked").clientHeight + "px"), 
						// Hide the down-arrow on the filter toggle if there is only 1 option.
						// aka. nothing more to show.
						0 == a.querySelectorAll(".filter-options li").length && (a.querySelector(".filter-toggle i").style.display = "none"), 
						a.querySelectorAll(".filter-options-checked li").length > 0 && a.classList.add("active");
				});
			}
*/
						
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

			//* update 'chosen' plugin		
			$target.find('select').trigger("chosen:updated");		
			self.open_multiple_select();		

			//* show component
			$target.show();
			$target.find('chosen-choices').blur();

			//* .. but hide the list if a filter is already selected
			if (self.previous_values[self.field].length > 0){
				this.hide_drop();
			}else{
				$(this.target).find('.chosen-drop').show("1000");
			}			

			self.previous_values[self.field] = new Array();		
			 
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

		init_chosen: function() {
			/*
	   § Chosen
	  \*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
			var $target = $(this.target); 		

			$target.find('.chosen select').chosen();

			// Multiple select
			$target.find('.chosen--multiple select').chosen({
				width: "198px"
			});

			//this.open_multiple_select();

		},

		open_multiple_select: function(){

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
				var selectOptions = [];

				// Put all select options in an array
				$(this).find('select option').each( function() {
					selectOptions.push( $(this).text() );
				});

				// For each item in the array, append a <li> to .chosen-results
				$.each(selectOptions, function(i, val) {
					if(this != "") {
						chosenResults.append('<li class="active-result" data-option-array-index="' + i + '">' + this + '</li>');
					}
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
