(function ($) {

	AjaxSolr.SearchFiltersWidget = AjaxSolr.AbstractFacetWidget.extend({

		previous_values: {},

		init: function () {
			var self = this;
			var $target = $(this.target);
			var title = self.manager.translator.getLabel("tagcloud_" + this.field);

			var json_data = {"options" : new Array({'title': title, 
				'target_drop_id': this.target.replace('#', '') + "_drop",
				'search_lab': self.manager.translator.getLabel(sprintf('search_%s_lab', this.field)), 
				'values':[{ "value": 'value', "text": ''}]})};

			var html = self.template_integration_json(json_data, '#chosenTemplate'); 	

			$target.html(html);	

			this.previous_values[this.field] = new Array(),

			//* init 'chosen' plugin			
			$target.find('select').chosen({				
				disable_search_threshold: 10,	
				no_results_text:self.manager.translator.getLabel('search_no_results'),
				width: "100%"
					,
				disable_search: !0,
				// When set to true, Chosen will not display the search field (single selects only).
				allow_single_deselect: !0

			});

		},

		beforeRequest: function(){			
			var self = this;
			var $target = $(this.target);					

			var $select = $(this.target).find('select');

			if (!self.getRefresh())				
				return;						
		
			// reset "chosen"
			$select.chosen("destroy");
			
			// set label 	
			$target.find('label').text(self.manager.translator.getLabel("tagcloud_" + this.field));						
			
			// set textbox's text
			$select.attr('data-placeholder', self.manager.translator.getLabel('search_data_loading'));	

			this.update_filters();									
			
			self.refreshChosen($select);

		},

		update_filters: function(){
			var self = this;
			var facets = ModelManager.get_facets_lab_for_search_component();

			// remove all filters
			//this.removeAllSelectedFilters();

			// add current filters to previous_values
			if (facets !== undefined){	
				for (var i = 0, l = facets.length; i < l; i++) {
					if(facets[i].id == self.field)
						self.storeSelectedFilter(facets[i]);						
				}
			}			
		},

		//* processing is started after all images are loaded (managed by the EventManager)
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

				return;
			};

			//* proceed facet values
			var maxCount = 0;
			var totalCount = 0;
			var i = 0;
			var objectedItems = [];

			switch (self.field){			

			case 'object_type_main_dk':
			case 'object_type_main_en':

				var root_categories = {};
				for (var facet in self.manager.response.facet_counts.facet_fields[self.field]) {
					if(!smkCommon.isValidDataText(facet))
						continue;
					var count = parseInt(self.manager.response.facet_counts.facet_fields[self.field][facet]);
					if (count > maxCount) {
						maxCount = count;
					};

					var arttype_hierarchi = self.manager.translator.getLabel('arttype_hierarchi');							
					var parent =  self.getParentType(arttype_hierarchi, facet.trim());
					var root_category = parent != null && parent.id !== undefined ? parent.id : facet.trim();
					// iterate the object_type tree until we find a root category
					while (parent != null && parent.id !== undefined){
						root_category = parent.id;
						parent = self.getParentType(arttype_hierarchi, parent.id.trim());
					}

					// save root category
					if (root_categories[root_category] === undefined) root_categories[root_category] = true;
				};

				// iterate root categories and create the list of facets
				$.each(root_categories, function( facet, value ) {
					var nodevalue = self.getNodeValue(arttype_hierarchi, facet.trim());
					var request = [self.formatRequest(facet, true)];
					jQuery.merge(request, self.getSubRequestFromNode({value:nodevalue}));			
					if(smkCommon.isValidDataText(facet)){
						objectedItems.push({ "value": request.join(' OR '), "text": smkCommon.firstCapital(facet).trim(), "i": i }); 
						i++;
					}
				});

				totalCount = i;

				objectedItems.sort(function (a, b) {
					if (self.manager.translator.getLanguage() == 'dk')
						return typeof (a.value === 'string') && typeof (b.value === 'string') ? (a.value.trim() < b.value.trim() ? -1 : 1) : (a.value < b.value ? -1 : 1);

						return typeof (a.text === 'string') && typeof (b.text === 'string') ? (a.text.trim() < b.text.trim() ? -1 : 1) : (a.text < b.text ? -1 : 1);
				});	  	 		  	  
				break;		

			case 'artist_auth':
				for (var facet in self.manager.response.facet_counts.facet_fields[self.field]) {
					var text = '';
					index = 0;
					if(!smkCommon.isValidDataText(facet))
						continue;
					var count = parseInt(self.manager.response.facet_counts.facet_fields[self.field][facet]);
					if (count > maxCount) {
						maxCount = count;
					};

					$.each(getData_Common.enumProducent, function(key, type) {
						if(facet == type){
							text = smkCommon.firstCapital(self.manager.translator.getLabel('detail_producent_' + key));
							return false; //break each loop
						}
						index++;
					});

					objectedItems.push({ "value": self.formatRequest(facet, true), "text": text , "count": count, "i": i, "index": index }); 
					i++;	    	  	  	      	  	      
				};
				totalCount = i;
				objectedItems.sort(function (a, b) {
					return (a.index < b.index ? -1 : 1);	  	      
				});	  	 		  	  
				break;								

			case "department":		    			  			   							  
				for (var facet in self.manager.response.facet_counts.facet_fields[self.field]) {
					if(!smkCommon.isValidDataText(facet))
						continue;
					var count = parseInt(self.manager.response.facet_counts.facet_fields[self.field][facet]);
					if (count > maxCount) {
						maxCount = count;
					};

					$.each(getData_Common.enumDepartment, function(key, type) {
						if(facet.indexOf(type) > -1){
							text = self.manager.translator.getLabel('search_'+ key +'_lab');
							return false; //break each loop
						}
					});
					if(smkCommon.isValidDataText(text))
						objectedItems.push({ "value": self.formatRequest(facet, true), "text": text , "count": count, "i": i }); 
					i++;		    	  	  	      	  	      
				};
				totalCount = i;
				objectedItems.sort(function (a, b) {
					return typeof (a.value === 'string') && typeof (b.value === 'string') ? (a.value.trim() < b.value.trim() ? -1 : 1) : (a.value < b.value ? -1 : 1);	  	      
				});	  	 		  	  
				break;	

			case "materiale":
			case "materiale_en":
				for (var facet in self.manager.response.facet_counts.facet_fields[self.field]) {
					if(!smkCommon.isValidDataText(facet))
						continue;
					var count = parseInt(self.manager.response.facet_counts.facet_fields[self.field][facet]);
					if (count > maxCount) {
						maxCount = count;
					};

					var values = facet.split(smkCommon.split_2_niv); 					 										
					text = smkCommon.isValidDataText(smkCommon.getValueFromSplit(values, 0)) ? smkCommon.firstCapital(smkCommon.getValueFromSplit(values, 0).trim()) : "";

					objectedItems.push({ "value": self.formatRequest(facet, true), "text": text, "count": count, "i": i }); 
					i++;	    	  	  	      	  	      
				};
				totalCount = i;
				objectedItems.sort(function (a, b) {
					return a.value.replace(/\W/gi, '').toLowerCase() < b.value.replace(/\W/gi, '').toLowerCase() ? -1 : 1;						  	      
				});	  	 		  	  
				break;		  

				
			case "vaerkstatus":		    			  			   							  
				for (var facet in self.manager.response.facet_counts.facet_fields[self.field]) {
					if(!smkCommon.isValidDataText(facet))
						continue;
					
					var count = parseInt(self.manager.response.facet_counts.facet_fields[self.field][facet]);
					if (count > maxCount) {
						maxCount = count;
					};
					
					var text = getData_Common.getTechnique_vaerkstatus_translate([{"value":facet}], this);
					objectedItems.push({ "value": self.formatRequest(facet, true), "text": smkCommon.firstCapital(text[0].value).trim(), "count": count, "i": i }); 
					i++;	    	  	  	      	  	      
				};
				totalCount = i;
				objectedItems.sort(function (a, b) {
					return typeof (a.value === 'string') && typeof (b.value === 'string') ? (a.text.trim() < b.text.trim() ? -1 : 1) : (a.value < b.value ? -1 : 1);	  	      
				});	  	 		  	  
				break;	
				
			default:		    			  			   							  
				for (var facet in self.manager.response.facet_counts.facet_fields[self.field]) {
					if(!smkCommon.isValidDataText(facet))
						continue;
					
					var count = parseInt(self.manager.response.facet_counts.facet_fields[self.field][facet]);
					if (count > maxCount) {
						maxCount = count;
					};
					if(smkCommon.isValidDataText(facet)){					
	  					objectedItems.push({ "value": self.formatRequest(facet, true), "text": smkCommon.firstCapital(facet).trim(), "count": count, "i": i }); 
	  					i++;	    	  	  	      	  	     
					} 
				};
				totalCount = i;
				objectedItems.sort(function (a, b) {
					return typeof (a.text === 'string') && typeof (b.text === 'string') ? (a.text.toLowerCase() < b.text.toLowerCase()  ? -1 : 1) : (a.value < b.value ? -1 : 1);								
				});	  	 		  	  
				break;	
				
			};

			//* merge facet data and template			
			var json_data = {"options" : new Array({title:title, totalCount:totalCount, values:objectedItems})};	    	    	    
			var html = self.template_integration_json(json_data, '#chosenTemplate'); 			

			if(smkCommon.debugTime()) console.timeEnd("SearchFilters - " + this.field + " - process");						
			if(smkCommon.debugTime()) console.time("SearchFilters - " + this.field + " - chosen");

//			//* save previous selected values in the target 'select' component	  	 
//			$select.find("option:selected").each(function (){
//				if(smkCommon.isValidDataText(this.value))
//					self.previous_values[self.field].push(this.value.replace(/^"|"$/g, ''));	  		
//			});

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
						objectedItems.push({ "value": facet.value, "text": smkCommon.firstCapital(facet.text), "count": '0' });					
					}	
					var json_data = {"options" : new Array({title:this.title, values:objectedItems})};	    	    	    
					var html = self.template_integration_json(json_data, '#chosenTemplate');
					$select.append($(html).find('option'));
				}

				// add previous selected values
				var previous_val = [];
				for (var i = 0, l = self.previous_values[self.field].length; i < l; i++) {
					previous_val.push(self.previous_values[self.field][i].value);					
				}
				$(this.target).find('select').val(previous_val); 	

			}			

			//* add behaviour on select change
			$target.find('select').change(self.clickHandler());

			//* set default text / enabling	
			if (objectedItems.length == 0){
				$select.attr('data-placeholder', self.manager.translator.getLabel(sprintf('search_disab_lab', this.field)));
				$select.prop('disabled', true);

			}else{
				$select.attr('data-placeholder', self.manager.translator.getLabel(sprintf('search_%s_lab', this.field)));
				$select.prop('disabled', false);
			}



			if(smkCommon.debugTime()) console.time("SearchFilters - " + this.field + " - chosen - update");
			//* update 'chosen' plugin						
			self.refreshChosen($select);
									
			if(smkCommon.debugTime()) console.timeEnd("SearchFilters - " + this.field + " - chosen - update");

			if(smkCommon.debugTime()) console.time("SearchFilters - " + this.field + " - chosen - show");			

//			var doQueueShow = function(target){				
//			var doShow= function() {
//			$(target).find('.chosen-drop').show();
//			};
//			$.taskQueue.add(doShow, this, 10);	
//			};

//			doQueueShow(self.target);								

			if(smkCommon.debugTime()) console.timeEnd("SearchFilters - " + this.field + " - chosen - show");				

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
				number++;
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

		storeSelectedFilter: function (filter){	 
			filter.text.replace(/^"|"$/g, '');
			this.previous_values[filter.id].push(filter);
		},

		removeAllSelectedFilters: function(){
			var self = this;
			var $select = $(self.target).find('select');

			$select.find("option:selected").each(function (){
				$(this).removeAttr("selected");
//				if(removeFromStore == true)
//				self.manager.store.removeByValue('fq', self.fq(this.value));
			});	

			//* update 'chosen' plugin					
			self.refreshChosen($select);

			this.previous_values[this.field] = new Array();
		},
		
		refreshChosen: function($target){
//			// fix what is apparently a bug in Chosen component?!			
//			$(this.target).find('.chosen-with-drop').removeClass('chosen-with-drop');
//			$(this.target).find('.chosen-container-active').removeClass('chosen-container-active');
			
			$target.chosen({				
				disable_search_threshold: 10,	
				no_results_text:this.manager.translator.getLabel('search_no_results'),
				width: "100%"
					,
				disable_search: !0,
				// When set to true, Chosen will not display the search field (single selects only).
				allow_single_deselect: !0

			});
			
			$target.trigger("chosen:updated");
			

//			// fix what is apparently a bug in Chosen component?!			
//			$(this.target).find('.chosen-with-drop').removeClass('chosen-with-drop');
//			$(this.target).find('.chosen-container-active').removeClass('chosen-container-active');
			
		},

		getParentType: function (tree, childNode)
		{
			var i, res;
			if (!tree || !tree.value) {
				return null;
			}
			if( Object.prototype.toString.call(tree.value) === '[object Array]' ) {
				for (i in tree.value) {
					if (tree.value[i].id === childNode) {
						return tree;
					}
					res = this.getParentType(tree.value[i], childNode);
					if (res) {
						return res;
					}
				}
				return null;
			} else {
				if (tree.value.id === childNode) {
					return tree;
				}
				return this.getParentType(tree.value, childNode);
			}
		},

		getNodeValue: function(treeRoot, nodeId){
			var i, res;
			if (!treeRoot || !treeRoot.value) {
				return false;
			}

			for (i in treeRoot.value) {
				var tree = treeRoot.value[i];
				if(tree.id == nodeId){				
					return tree.value;
				}else{
					if(tree.value !== undefined && jQuery.isArray(tree.value)){
						res = this.getNodeValue({'value' : tree.value}, nodeId);
						if(res)
							return res;
					}													
				}
			}

			return false;
		},


		getSubRequestFromNode: function(treeRoot){
			var i;
			var res = [];
			if (!treeRoot || !treeRoot.value) {
				return false;
			}

			for (i in treeRoot.value) {
				var tree = treeRoot.value[i];

				if(tree.value === undefined){				
					res.push(this.formatRequest(tree.id, true));
				}else{
					var subres = this.getSubRequestFromNode({'value' : tree.value});
					if(subres)
						jQuery.merge(res, subres);
				}
			}

			return res;
		},

		formatRequest: function(facet, marks){	
			if(marks && facet.indexOf(' ') > -1)
				facet = sprintf('"%s"', facet);
			return sprintf('%s:%s', this.field, facet);						
		}

	});

})(jQuery);
