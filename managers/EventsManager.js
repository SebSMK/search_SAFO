(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var eventsManager = {};
		factory(eventsManager);
		if (typeof define === "function" && define.amd) {
			define(eventsManager); // AMD
		} else {
			root.EventsManager = eventsManager; // <script>
		}
	}
}(this, function (eventsManager) {

	eventsManager.constructor = function(){

		this.init = function(){
			/*
			 * Management of changes in address bar
			 * n.b.: externalChange is triggered also on document load
			 * */
			var self = this;
			
			// set windows to top
			$(window).scrollTop(0);
			
			$.address.strict(false);
			$( document ).ready(function() {				  
				$.address.externalChange(function(e){self.addressChange(e)});
				$(window).mousewheel(function(e){self.scrollStart(e)});
			});	  	  
		};

		/********
		 * EVENTS
		 * *******/
		
		/*
		 * page scrolled 
		 * */			        		           
		this.scrollStart = function(event) {		        								
				ModelManager.setModel($.address.value(), "url");
				var model = ModelManager.getModel();	
				if (model.view != 'detail')									
					if (($(".search-results").height() <= ($(window).height() + $(window).scrollTop()) + 200))						
						//* start scroll request
						ViewManager.callWidgetFn('scroll_update', 'start_scroll_request');	        																	        		    
		};							
		
		/*
		 * change in address bar
		 * */
		this.addressChange = function(e){	 
			
			if(smkCommon.debugTime()) console.time("adresschanged");	
	
			
			if(smkCommon.debugTime()) console.time("process view1");
			//* set windows to top
			$(window).scrollTop(0);	
			
			//* get the view's model
			ModelManager.setModel(e.value, "url");
			var model = ModelManager.getModel();	
			if(smkCommon.debugTime()) console.timeEnd("process view1");
			
			if(smkCommon.debugTime()) console.time("process view2");
			//* process view
			if(model.view !== undefined){
				ViewManager.viewChanged({'view': model.view});				    				    				    					    					    	
			}else{
				ViewManager.viewChanged({'view': "teasers"});
			}			    
			if(smkCommon.debugTime()) console.timeEnd("process view2");
			
			if(smkCommon.debugTime()) console.time("ViewManager.beforeRequest");
			ViewManager.beforeRequest();				    			    
			if(smkCommon.debugTime()) console.timeEnd("ViewManager.beforeRequest");
			
			if(smkCommon.debugTime()) console.time("process view_lang");
			//* process language
			Manager.translator.setLanguage(model.lang);		
			Manager.store.set_current_lang(model.lang);	
			if(smkCommon.debugTime()) console.timeEnd("process view_lang");
			
			
			if(smkCommon.debugTime()) console.time("process view_cate");
			//* process category
			if(model.category !== undefined){
				if (model.view != 'detail'){			    		
					ViewManager.categoryChanged({'category': model.category});
				}else{
					ViewManager.callWidgetFn('details', 'setCurrentThumb_selec', {params:[null]});						
				}
			}else if(model.category == undefined && model.view != 'detail'){
				ViewManager.categoryChanged({'category': "all"});
			}
			if(smkCommon.debugTime()) console.timeEnd("process view_cate");
			
			
			//****** process Solr request *******

			if(smkCommon.debugTime()) console.time("process_q");
			
			// reset exposed parameters
			Manager.store.exposedReset();

			// q param
			var q = [];
			if (model.view != 'detail'){									
				if(model.q !== undefined){
					q = q.concat(model.q);
				}else{
					q = Manager.store.q_default;
				}					
			}else{
				if(model.q !== undefined)
					q = sprintf('id:%s', model.q);			    	
			};

			Manager.store.addByValue('q', q);
			
			// facets
			Manager.store.remove('facet');
			Manager.store.remove('facet.field');
			if (model.view != 'detail'){
				Manager.store.addByValue('facet', true);
				Manager.store.addByValue('facet.field', Manager.store.facets_default[model.lang]['facets']);
				
				if (Manager.store.facets_default[model.lang]['ranges'] !== undefined){
					var range = Manager.store.facets_default[model.lang]['ranges']['range'];
					var opt = sprintf('f.%s.facet.range.', range);

					Manager.store.addByValue('facet.range', range);				 
					Manager.store.addByValue(opt + 'start', Manager.store.facets_default[model.lang]['ranges']['start']);
					Manager.store.addByValue(opt + 'end', Manager.store.facets_default[model.lang]['ranges']['end']);
					Manager.store.addByValue(opt + 'gap', Manager.store.facets_default[model.lang]['ranges']['gap']);
					if(Manager.store.facets_default[model.lang]['ranges']['other'] !== undefined)
						Manager.store.addByValue(opt + 'other', Manager.store.facets_default[model.lang]['ranges']['other']);					
				}												
				
//				Manager.store.add('facet.field', 
//						new AjaxSolr.Parameter({ name:'facet.field', 
//												value: 'category', 
//												locals: { ex:'category' } }));
				
			}																				

			// fq param						
			if (model.view != 'detail')				
				Manager.store.addByValue('fq', Manager.store.fq_default);			
			
			if(model.fq !== undefined && AjaxSolr.isArray(model.fq)){
				for (var i = 0, l = model.fq.length; i < l; i++) {						
					Manager.store.addByValue('fq', model.fq[i].value, model.fq[i].locals);
				};											
			};	
														
			// qf param
			if(model.view != "detail")
				Manager.store.addByValue('qf', Manager.store.get_qf_string());					    		

			// sort param
			if(model.sort !== undefined){
				Manager.store.addByValue('sort', model.sort);
			}else{
				Manager.store.addByValue('sort', Manager.store.sort_default);
			};

			// start param
			if(model.start !== undefined){
				Manager.store.addByValue('start', model.start);
			}else{
				Manager.store.addByValue('start', 0);
			};
			
			// fl param
			if (model.view == 'detail'){									
				Manager.store.addByValue('fl', Manager.store.fl_options.detail);			
			}else{
				Manager.store.addByValue('fl', Manager.store.fl_options.list);		    	
			};									
			
			if(smkCommon.debugTime()) console.timeEnd("process_q");
			
			//* process widgets
			if(smkCommon.debugTime()) console.time("process_widgets");
			// remove all previous search filters - only if search filters is set to "getRefresh"					
			for (var i = 0, l = Manager.searchfilterList.length; i < l; i++) {				
				if(ViewManager.callWidgetFn(Manager.searchfilterList[i].field, 'getRefresh'))
					ViewManager.callWidgetFn(Manager.searchfilterList[i].field, 'removeAllSelectedFilters', {params:[false]});	

			};
			if (model.category == 'collections' && model.fq !== undefined){
				// add selected filters in searchFiltersWidget
				for (var i = 0, l = model.fq.length; i < l; i++) {
					if(model.fq[i].value !== undefined){
						var field = model.fq[i].value.split(':')[0]; 
						ViewManager.callWidgetFn(field, 'addSelectedFilter', {params: [model.fq[i].value.split(':')[1]]});
					}															
				}			    			
			}

			// reinit thumbs current selected
			ViewManager.callWidgetFn('details', 'setCurrentThumb_selec');	
			
			// copy "q" values in Currentsearch widget (without q default)	
			ViewManager.callWidgetFn('currentsearch', 'removeAllCurrentSearch');			
			var q_wout_q_def = ModelManager.get_q();									
			for (var i = 0, l = q_wout_q_def.length; i < l; i++) {				
				ViewManager.callWidgetFn('currentsearch', 'add_q', {params: [q_wout_q_def[i], q_wout_q_def[i]]} );
			};	

			// select "sort" option in sorterWidget
			ViewManager.callWidgetFn('sorter', 'setOption', {params: [Manager.store.get('sort').val()]});

			// reset scroll manager				
			ViewManager.callWidgetFn('scroll_update', 'reset');
			if(smkCommon.debugTime()) console.timeEnd("process_widgets");
			
			//**> start Solr request 
			Manager.doRequest();
				
			if(smkCommon.debugTime()) console.timeEnd("adresschanged");
			if(smkCommon.debugTime()) console.timeEnd("smk_search_q_added");
			
		};


		/**
		 * UI events
		 * 
		 * */

		/*
		 * current page changed
		 * @result:  model update
		 * */
		this.smk_search_pager_changed = function(start, searchFieldsTypes){			
			ViewManager.callWidgetFn('currentsearch', 'setRefresh', {params: [false]});
			ViewManager.callWidgetFn('category', 'setRefresh', {params: [false]});
			for (var i = 0, l = searchFieldsTypes.length; i < l; i++) {				
				ViewManager.callWidgetFn(searchFieldsTypes[i], 'setRefresh', {params: [false]});
			};			

			var model = {};
			model.q = ModelManager.current_value_joker;
			model.fq = ModelManager.current_value_joker;
			model.start = start;
			model.sort = ModelManager.current_value_joker;
			model.category = ModelManager.current_value_joker;
			model.lang = ModelManager.current_value_joker;

			ModelManager.update(model);
		};

		/*
		 * Category changed
		 * @result:  model update 
		 * */
		this.smk_search_category_changed = function(event){

			var category = event.category;
			var view = event.view;  	  	  

			if (ViewManager.callWidgetFn('category', 'set', {params: [category]})){   				
				ViewManager.callWidgetFn('category', 'setActiveTab', {params: [category]});

				ViewManager.callWidgetFn('currentsearch', 'setRefresh', {params: [false]});

				var model = {};
				model.q = ModelManager.current_value_joker;
				model.category = category;
				model.lang = ModelManager.current_value_joker;

				ModelManager.update(model); 
			};
		};

		/*
		 * call to teaser view
		 * @result:  model update 
		 * */
		this.smk_search_call_teasers = function(){
			
			//restore previous search params
			var model = ModelManager.loadStoredModel();

			ModelManager.update(model); 			
		};	

		/*
		 * call to detail view
		 * @result:  open detail in a new window
		 * */  
		this.smk_search_call_detail = function(event){						 		  
			var detail_url = event.detail_url + '&fl=detail';
			window.open(event.detail_url);			
		};	

		/*
		 * a search string has been added in SearchBox
		 * @result:  model update 
		 * */
		this.smk_search_q_added = function(event){
			if(smkCommon.debugTime()) console.time("smk_search_q_added");
			var search_string = jQuery.trim(event.val);			
			var q = new Array()
			if (search_string != '') {																																									
				var default_teaser_view = ModelManager.getModel().view == 'detail';
				
				if (!default_teaser_view)
					q = AjaxSolr.isArray(ModelManager.get_q()) ?  
							ModelManager.get_q() 
						: 
							ModelManager.get_q() === undefined ? new Array() : new Array(ModelManager.get_q());				
				
				q.push(search_string); 			
				
				/*
				if (typeof _gaq !== undefined)
					_gaq.push(['_trackEvent','Search', 'Regular search', search_string, 0, true]);
				*/
				
				var model = {};										
				model.q = q;					
				model.sort = ModelManager.current_value_joker;
				model.view = default_teaser_view ? "teasers" : ModelManager.current_value_joker;
				model.category = default_teaser_view ? "all" : ModelManager.current_value_joker;
				model.lang = ModelManager.current_value_joker;

				if (!default_teaser_view)
					model.fq = ModelManager.current_value_joker;

				ModelManager.update(model);					
			};
		};

		/*
		 * search string removed in Currentsearch
		 * @result:  model update 
		 * */
		this.smk_search_remove_one_search_string = function(event){
			var facet = event.facet;			

			Manager.store.removeElementFrom_q(facet);   			

			var qvalue = Manager.store.get('q').value;
			var model = {};
			model.q = qvalue;
			model.fq = ModelManager.current_value_joker;
			model.sort = ModelManager.current_value_joker;
			model.view = ModelManager.current_value_joker;
			model.category = ModelManager.current_value_joker;
			model.lang = ModelManager.current_value_joker;

			ModelManager.update(model); 
		};  

		/*
		 * search filter added / removed (only in "collection" tab/category)
		 * @result:  model update 
		 * */
		this.smk_search_filter_changed = function (caller, params){

			var trigg_req = false;

			if (params.selected !== undefined){
				if (caller.add(params.selected)) //!! -> change fq param in Manager.store
					trigg_req = true;
			}else if (params.deselected !== undefined){    		
				if (caller.remove(params.deselected)) //!! -> change fq param in Manager.store
					trigg_req = true;
			};    	    	

			if (trigg_req){				
				ViewManager.callWidgetFn('currentsearch', 'setRefresh', {params: [false]});

				var fqvalue = Manager.store.get('fq');				
				var model = {};				
				model.fq = fqvalue;
				model.q = ModelManager.current_value_joker;
				model.sort = ModelManager.current_value_joker;
				model.view = ModelManager.current_value_joker;
				model.category = ModelManager.current_value_joker;
				model.lang = ModelManager.current_value_joker;

				ModelManager.update(model);
			}
		};

		/*
		 * sorting changed
		 * @result:  model update  
		 * */
		this.smk_search_sorter_changed = function(params, searchFieldsTypes){			
			if (params.selected == undefined)																					
				return;	  
			
			ViewManager.callWidgetFn('currentsearch', 'setRefresh', {params: [false]});
			ViewManager.callWidgetFn('category', 'setRefresh', {params: [false]});			
			for (var i = 0, l = searchFieldsTypes.length; i < l; i++) {				
				ViewManager.callWidgetFn(searchFieldsTypes[i], 'setRefresh', {params: [false]});
			};	

			var sortvalue = params.selected;
			var model = {};
			model.sort = sortvalue;
			model.q = ModelManager.current_value_joker;
			model.fq = ModelManager.current_value_joker;	
			model.view = ModelManager.current_value_joker;
			model.category = ModelManager.current_value_joker;
			model.lang = ModelManager.current_value_joker;

			ModelManager.update(model);	
		};		

//		/* 
//		 * switch grid/list in teasers view	
//		 * @result:  view changes  	 
//		 */
//		this.switch_list_grid = function(value){ 			
//			ViewManager.callWidgetFn('teasers', 'switch_list_grid', {params: [value]});
//		};	


		/* 
		 * switch language
		 * @result:  view changes  	 
		 */
		this.smk_lang_changed = function(lang){ 
			
			var model = {};
			model.lang = lang;
			model.sort = ModelManager.current_value_joker;
			model.q = ModelManager.current_value_joker;
			model.fq = ModelManager.current_value_joker;	
			model.view = ModelManager.current_value_joker;
			model.category = ModelManager.current_value_joker;

			ModelManager.update(model);		
			
		};	

		/**
		 * Finish loading events
		 * 
		 * */

		//* scroll - no more result to show		 
		this.smk_scroll_no_more_results = function() {},
									
		//* scroll - all new pictures has been added in teaser		
		this.smk_scroll_all_images_displayed = function(added){
			ViewManager.highlightning(); // highlight search words
			ViewManager.smk_scroll_all_images_displayed(added);							
		},
		
		//* searchfilters has finished loading	
		this.smk_search_filter_loaded = function(value){			
			ViewManager.remove_modal_loading_from_widget(value);
			
		};

		//* a new image has been displayed in "teaser"
		this.smk_teasers_this_img_displayed = function(){
			ViewManager.smk_teasers_this_img_displayed();
		};		

		//* a new image has finished loading in "teaser"
		this.smk_teasers_this_img_loaded = function(){
			ViewManager.smk_teasers_this_img_loaded();
		};			

		//* all images displayed in "teaser"
		this.after_afterRequest = function(field){			
			ViewManager.callWidgetFn(field, 'after_afterRequest');
		};

		//* a new image has finished loading in "related"
		this.smk_related_this_img_loaded = function(){
			ViewManager.smk_related_this_img_loaded();
		};

		//* a new image has finished loading in "thumbs"
		this.smk_thumbs_img_loaded = function(){
			ViewManager.smk_thumbs_img_loaded();
		};

		//* image has finished loading in "detail"
		this.smk_detail_this_img_loaded = function(){
			ViewManager.smk_detail_this_img_loaded();
		};          
	}
}));