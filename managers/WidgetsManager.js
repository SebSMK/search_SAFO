var Manager;
var ViewManager;
var EventsManager;

(function ($) {

	$(function () {	  
		var self = this;	

		//******************************
		//** load configuration
		//****************************** 
		ModelManager.setModel($.address.value(), "url");
		var current_language = smkCommon.getCurrentLanguage();

		//** load solr conf  
		var solr_conf = new Configurator.constructor();
		solr_conf.load_json("conf/solr_conf.json");
		var server = solr_conf.get_server();
		var exposed = solr_conf.get_exposed_params();
		var fq_default = solr_conf.get_fq_default();
		var fl_options = solr_conf.get_fl_options();
		var q_default = solr_conf.get_q_default();
		var sort_default = solr_conf.get_sort_default();
		var qf_default = solr_conf.get_qf_default();
		var scroll_rows_default = solr_conf.get_scroll_rows_default();
		var rows_default = solr_conf.get_rows_default();
		var facets_default = solr_conf.get_facets();
		smkCommon.setMode(solr_conf.get_mode());
		smkCommon.setVersion(solr_conf.get_version());

		//** load multi language script 
		var translator = new Language.constructor();	
		translator.load_json("language/language.json");	
		translator.setLanguage(current_language);	

		//** load all searchFields (in all languages)
		var searchFieldsTypes = facets_default['all'];

		//** create state manager
		ViewManager = new ViewManager.constructor({				
			template: Mustache.getTemplate('templates/general_template.html'),
			target:'#smk_search_wrapper'
		});

		//** create events manager
		EventsManager = new EventsManager.constructor();

		// those functions will be passed as parameter in the manager - we've got to bind it to an environment
		var allWidgetsProcessedBound = $.proxy(EventsManager.allWidgetsProcessed, EventsManager);
		var generalSolrErrorProcessedBound = $.proxy(ViewManager.generalSolrError, ViewManager);

		//******************************
		//** init widgetManager
		//******************************    
		Manager = new AjaxSolr.smkManager({
			solrUrl: server, 
			//proxyUrl: 'http://solr.smk.dk:8080/proxySolrPHP/proxy.php',			
			store: new AjaxSolr.smkParameterStore({
				exposed: exposed,    		
				fq_default: fq_default,
				fl_options: {"list": fl_options.list, "detail": fl_options.detail, "default": fl_options.default},
				q_default: q_default,
				qf_default: qf_default,
				sort_default: sort_default,
				facets_default: facets_default,
				current_lang: current_language
			}),
			searchfilterList: searchFieldsTypes,
			allWidgetsProcessed: allWidgetsProcessedBound,
			generalSolrError: generalSolrErrorProcessedBound,
			translator: translator
		});

		//* set and save default request parameters                
		var params = {
//				'fq': Manager.store.fq_default,	
//				'fl': Manager.store.fl_options.default,					
//				'facet': true,
//				'facet.field': Manager.store.facets_default[current_language],
				'facet.limit': -1,
				'facet.mincount': 1,
//				'facet.range': 'object_production_date_earliest',
//				'f.object_production_date_earliest.facet.range.start': '0000-01-01T00:00:00.001Z',
//				'f.object_production_date_earliest.facet.range.end': 'NOW',
//				'f.object_production_date_earliest.facet.range.gap': '+100YEARS',
				'rows':rows_default,
				'defType': 'edismax',      
//				'qf': Manager.store.qf_default[current_language],
				'start': 0,
//				'sort': Manager.store.sort_default,
				'json.nl': 'map'
		};
		for (var name in params) {
			Manager.store.addByValue(name, params[name]);
		}    
		// add facet category with locals params
//		Manager.store.add('facet.field', 
//		new AjaxSolr.Parameter({ name:'facet.field', 
//		value: 'category', 
//		locals: { ex:'category' } }));


		//******************************
		//** init scrollManager
		//******************************    
		var scrollManager = new AjaxSolr.smkManager({
			solrUrl: server,
			//proxyUrl: 'http://solr.smk.dk:8080/proxySolrPHP/proxy.php',
			store: new AjaxSolr.smkParameterStore({
				exposed: exposed,
				start: 0,     		
				fq_default: fq_default,
				fl_options: {"list": fl_options.list},
				q_default: q_default,
				qf_default: Manager.store.qf_default[current_language],
				sort_default: sort_default,
				scroll_rows_default: scroll_rows_default,
				current_lang:current_language 
			}),
			allWidgetsProcessed: allWidgetsProcessedBound,
			generalSolrError: generalSolrErrorProcessedBound,
			translator: translator
		});


		//******************************
		//** init thumbnailsManager
		//******************************    
		var thumbnailsManager = new AjaxSolr.smkManager({			
			solrUrl: server, 
			//proxyUrl: 'http://solr.smk.dk:8080/proxySolrPHP/proxy.php',			
			store: new AjaxSolr.smkParameterStore({
				exposed: exposed,
				fl_options: {"thumbs": fl_options.thumbs},
				current_lang:current_language
			}),
			allWidgetsProcessed: allWidgetsProcessedBound,
			generalSolrError: generalSolrErrorProcessedBound,
			translator: translator
		});	

		//******************************
		//** init relatedManager
		//******************************    
		var relatedManager = new AjaxSolr.smkManager({
			solrUrl: server, 
			//proxyUrl: 'http://solr.smk.dk:8080/proxySolrPHP/proxy.php',			
			store: new AjaxSolr.smkParameterStore({
				exposed: exposed,
				fl_options: {"related": fl_options.related},
				current_lang:current_language
			}),
			allWidgetsProcessed: allWidgetsProcessedBound,
			generalSolrError: generalSolrErrorProcessedBound,
			translator: translator
		});	

		//******************************
		//** init getDetailManager
		//******************************    
		var getDetailManager = new AjaxSolr.smkManager({
			solrUrl: server, 
			//proxyUrl: 'http://solr.smk.dk:8080/proxySolrPHP/proxy.php',			
			store: new AjaxSolr.smkParameterStore({
				exposed: exposed,
				fl_options: {"detail": fl_options.detail},
				current_lang:current_language
			}),
			allWidgetsProcessed: allWidgetsProcessedBound,
			generalSolrError: generalSolrErrorProcessedBound,
			translator: translator
		});	

		//******************************
		//** load widgets
		//******************************

		Manager.addWidget(new AjaxSolr.SearchBoxWidget({
			id: 'searchbox',
			target: '#searchbox',			
			template: Mustache.getTemplate('templates/search_box.html')
		}));

		Manager.addWidget(new AjaxSolr.SearchInfoWidget({
			id: 'search-info',
			target: '#searchinfo',			
			template: Mustache.getTemplate('templates/search_info.html')
		}));

		/*
		Manager.addWidget(new AjaxSolr.SearchBoxAutoWidget({
			id: 'searchboxauto',
			target: '#searchboxauto',			
			template: Mustache.getTemplate('templates/search_box.html'),
			fields: params["facet.field"]
		}));
		 */
		Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
			id: 'currentsearch',
			target: '#currentsearch',
			template: Mustache.getTemplate('templates/current.html')
		})); 

		Manager.addWidget(new AjaxSolr.PagerWidget({
			id: 'pager',
			target: '#pager',
			prevLabel: '&lt;',
			nextLabel: '&gt;',
			innerWindow: 1,
			renderHeader: function (perPage, offset, total) {
				$('#pager-viser').html($('<li></li>').html( sprintf(' %s <span>%s</span> %s <span>%s</span> %s', translator.getLabel('pager_display'), Math.min(total, offset + perPage), translator.getLabel('pager_udaf'), total, translator.getLabel('pager_resultater'))));
			}
		}));

		Manager.addWidget(new AjaxSolr.LanguagePickerWidget({
			id: 'lang-picker',
			target: '#lang-picker',
			template: Mustache.getTemplate('templates/language_picker.html')
		})); 

//
		var sorterOpt = {'all': 
							[
							 	{"value": "score desc"},
						        {"value": "object_production_date_earliest asc"},
						        {"value": "object_production_date_earliest desc"},
						        {"value": "artist_first_name asc"},
						        {"value": "artist_first_name desc"},
						        {"value": "last_update desc"}
						    ]};

		var optDef = true;
		for (var i = 0, l = sorterOpt.all.length; i < l; i++) {
			if(ModelManager.getModel().sort == sorterOpt.all[i].value){
				sorterOpt.all[i].selected = true;
				optDef = false;
				break;
			}				
		};
		if(optDef)
			sorterOpt.all[0].selected = true;
		
		Manager.addWidget(new AjaxSolr.SorterWidget({
			id: 'sorter',
			target: '#sorter',
			options: sorterOpt,	
			template: Mustache.getTemplate('templates/sorter.html')
		})); 

//		Manager.addWidget(new AjaxSolr.CategoryWidget({
//			id: 'category',
//			target: '#category',
//			field: 'category',
//			multivalue:false,	    
//			categoryList: {"all":translator.getLabel('category_all'), "collections":translator.getLabel('category_artwork'), "nyheder":translator.getLabel('category_news'), "kalender":translator.getLabel('category_calendar'), "praktisk":translator.getLabel('category_info')},
//			activeCategory: "all",
//			template: Mustache.getTemplate('templates/category.html')
//		}));	

		Manager.addWidget(new AjaxSolr.TeasersWidget({
			id: 'teasers',
			target: '#smk_teasers',
			template: Mustache.getTemplate('templates/teasers.html'),
			initTemplate:'#teaserInitTemplate'
		}));
		
		//* advanced search panel
		Manager.addWidget(new AjaxSolr.AdvancedSearchWidget({
			id: 'advanced',
			target: '#advanced',
			template: Mustache.getTemplate('templates/advancedsearch.html'),
			facets_list: Manager.store.facets_default['advanced'] 
		}));
		
		//* filters
		for (var i = 0, l = searchFieldsTypes.length; i < l; i++) {
			// facets filters
			Manager.addWidget(new AjaxSolr.SearchFiltersWidget({
				id: searchFieldsTypes[i],
				target: '#' + searchFieldsTypes[i],
				field: searchFieldsTypes[i],
				template: Mustache.getTemplate('templates/chosen.html')
			}));
			
			// advanced search filters
			Manager.addWidget(new AjaxSolr.SearchFiltersWidget({
				id: 'adv_' + searchFieldsTypes[i],
				target: '#adv_' + searchFieldsTypes[i],
				field: searchFieldsTypes[i],
				template: Mustache.getTemplate('templates/chosen.html')
			}));
		};				

		//* Detail widget		
		Manager.addWidget(new AjaxSolr.DetailWidget({
			id: 'details',
			target: '#smk_detail',
			template: Mustache.getTemplate('templates/detail.html')
		}));
		
		//* Parts / Related widgets 		
		var sub_partsWidget = new AjaxSolr.TeasersWidget({
			id: 'parts',
			target: '#parts',
			template: Mustache.getTemplate('templates/teasers.html'),
			initTemplate:'#relatedInitTemplate'
		});
		
		var sub_relatedWidget = new AjaxSolr.TeasersWidget({
			id: 'related',
			target: '#related',
			template: Mustache.getTemplate('templates/teasers.html'),
			initTemplate:'#relatedInitTemplate'
		});

		var sub_originalWidget = new AjaxSolr.OriginalWidget({
			id: 'original',
			target: '#tab_original',
			template: Mustache.getTemplate('templates/detail_tabs.html')
		});

		Manager.addWidget(new AjaxSolr.DetailTabsWidget({
			id: 'details_tabs',
			target: '#smk_detail_tabs',
			template: Mustache.getTemplate('templates/detail_tabs.html'),
			partsManager: thumbnailsManager,
			parts_subWidget: sub_partsWidget,
			relatedManager: relatedManager,
			related_subWidget: sub_relatedWidget,
			originalManager: getDetailManager,
			original_subWidget: sub_originalWidget
		}));	


		//* scroll widget
		// sub widget (managed by scrollManagerWidget)
		var sub_scrollWidget = new AjaxSolr.ScrollWidget({
			id: 'sub_scroll_teasers',
			target: '#smk_teasers',
			template: Mustache.getTemplate('templates/teasers.html')
		});

		Manager.addWidget( new AjaxSolr.ScrollUpdateManagerWidget({
			id: 'scroll_update',
			scrollManager: scrollManager, 
			scroll_subWidget: sub_scrollWidget,
			start_offset:parseInt(Manager.store.get('start').val()) + parseInt(Manager.store.get('rows').val())
		}));



		//******************************
		//** add event listeners
		//******************************

		/*
		 * UI events
		 * 
		 * */		

		//* selected category changed
		$(Manager.widgets['category']).on('smk_search_category_changed', function(event){     	
			EventsManager.smk_search_category_changed(event);
		});     

		//* searchfilters changed
		for (var i = 0, l = searchFieldsTypes.length; i < l; i++) {
			$(Manager.widgets[searchFieldsTypes[i]]).on('smk_search_filter_changed', {self: Manager.widgets[searchFieldsTypes[i]]}, function(event){    		
				EventsManager.smk_search_filter_changed(event.data.self, event.params);    		    		    		    		
			});
			$(Manager.widgets["adv_" + searchFieldsTypes[i]]).on('smk_search_filter_changed', {self: Manager.widgets["adv_" + searchFieldsTypes[i]]}, function(event){    		
				EventsManager.smk_search_filter_changed(event.data.self, event.params);    		    		    		    		
			});
		};

		//* pager changed
		$(Manager.widgets['pager']).on('smk_search_pager_changed', function(event){  
			EventsManager.smk_search_pager_changed(event.start, searchFieldsTypes);
		}); 

		//* sorter changed
		$(Manager.widgets['sorter']).on('smk_search_sorter_changed', function(event){     	
			EventsManager.smk_search_sorter_changed(event.params, searchFieldsTypes);
		});         

		//* new search term input in search box
		$(Manager.widgets['searchbox']).on('smk_search_q_added', function(event){
			EventsManager.smk_search_q_added(event);	    	
		});	

		//* a search string has been removed in current search
		$(Manager.widgets['currentsearch']).on('smk_search_remove_one_search_string', function(event){     	
			EventsManager.smk_search_remove_one_search_string(event);
		});	

		//* calls to detail view
		$(Manager.widgets['teasers']).on('smk_search_call_detail', function(event){     	
			EventsManager.smk_search_call_detail(event);
		});
		
		$(Manager.widgets['details_tabs']).on('smk_search_call_detail', function(event){     	
			EventsManager.smk_search_call_detail_same(event.event);
		});

		$(Manager.widgets['scroll_update']).on('smk_search_call_detail', function(event){     	
			EventsManager.smk_search_call_detail(event);
		});

		$(Manager.widgets['details']).on('smk_search_call_detail', function(event){     	
			EventsManager.smk_search_call_detail(event.event_caller);
		});

		//* calls to teasers view
		$(Manager.widgets['details']).on('smk_search_call_teasers', function(event){  
			EventsManager.smk_search_call_teasers();
		});

		//* change language
		$(Manager.widgets['lang-picker']).on('smk_lang_changed', function(event){  
			EventsManager.smk_lang_changed(event.value);
		});


		/*
		 * Finish loading events
		 * 
		 * */

		//* no more results to show after scroll
		$(Manager.widgets['scroll_update']).on('smk_scroll_no_more_results', function(event){     	            	
			EventsManager.smk_scroll_no_more_results();
		});

		//* scroll has finished loading images
		$(Manager.widgets['scroll_update']).on('smk_scroll_all_images_displayed', function(event){     	            	
			EventsManager.smk_scroll_all_images_displayed(event.added);
		});

		//* searchfilters has finished loading
		for (var i = 0, l = searchFieldsTypes.length; i < l; i++) {
			$(Manager.widgets[searchFieldsTypes[i]]).on('smk_search_filter_loaded', function(event){
				EventsManager.smk_search_filter_loaded(event.currentTarget.target);
			});
		};	

		//* all images loaded in "teaser"
		$(Manager.widgets['teasers']).on('smk_teasers_all_images_loaded', function(event){     	            	
			EventsManager.smk_teasers_all_images_loaded(searchFieldsTypes);
		});		


		//* image has finished loading in "detail"
		$(Manager.widgets['details']).on('smk_detail_this_img_loaded', function(event){ 
			EventsManager.smk_detail_this_img_loaded();
		});           

		//******************************
		//** init all widgets / Managers
		//****************************** 
		ViewManager.init(); 
		Manager.init();  
		EventsManager.init();		

		//******************************
		//** if POSTed, add request string 
		//******************************     
		//* if a request string has been posted, add it to the manager (the request will be handled on page load by $.address.externalChange
		var postedSearchString = smkCommon.getSearchPOST();         
		if(postedSearchString !== undefined && postedSearchString != ''){

			/*
			//* people coming from a request to SMK's search form    
			if (typeof _gaq !== undefined)
				_gaq.push(['_trackEvent','Search', 'Regular search', postedSearchString, 0, true]);
			 */

			var model = {};
			model.q = postedSearchString;		 		 			
			ModelManager.update(model);    	
		}else{
			/*
			//* people coming through direct link to SMK's search               
			if (typeof _gaq !== undefined)
				_gaq.push(['_trackEvent','Search', 'Searching from ingoing link', sprintf('%s searched: %s', document.referrer,  $.address.value()), 0, true]);
			 */
		}
	});

})(jQuery);
