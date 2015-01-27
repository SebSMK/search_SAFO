var Manager;
var ViewManager;
var EventsManager;

(function ($) {

	$(function () {	  
		var self = this;	

		//******************************
		//** load configuration
		//****************************** 
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
		var qf_default = solr_conf.get_qf_default(current_language);
		var scroll_rows_default = solr_conf.get_scroll_rows_default();
		var rows_default = solr_conf.get_rows_default();

		//** load multi language script 
		var translator = new Language.constructor();	
		translator.load_json("language/language.json");	
		translator.setLanguage(current_language);	

		//** load searchFields
		var searchFieldsTypes = [ {field:'artist_name_ss', title:translator.getLabel('tagCloud_artist')}, {field:'artist_natio', title:translator.getLabel('tagCloud_country')}, {field:'object_production_century_earliest', title:translator.getLabel('tagCloud_period')}, {field:'object_type', title:translator.getLabel('tagCloud_art_type')} ];

		//** create state manager
		ViewManager = new ViewManager.constructor({				
			template: Mustache.getTemplate('templates/general_template.html'),
			target:'#smk_search_wrapper'
		});
    
	    //** create events manager
	    EventsManager = new EventsManager.constructor();
    
		// those functions will be passed as parameter in the manager - we've got to bind it to an environment
		var allWidgetsProcessedBound = $.proxy(ViewManager.allWidgetsProcessed, ViewManager);
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
				sort_default: sort_default 
			}),
			searchfilterList: searchFieldsTypes,
			allWidgetsProcessed: allWidgetsProcessedBound,
			generalSolrError: generalSolrErrorProcessedBound,
			translator: translator
		});

		//* set and save default request parameters                
		var params = {
				'fq': Manager.store.fq_default,	
				'fl': Manager.store.fl_options.default,	
				/*
				'facet': true,
				'facet.field': ['artist_name_ss', 'artist_natio', 'object_production_century_earliest', 'object_type'],
				'facet.limit': -1,
				'facet.mincount': 1,
				*/
				'rows':rows_default,
				'defType': 'edismax',      
				'qf': Manager.store.qf_default,
				'start': 0,
				'sort': Manager.store.sort_default,
				'json.nl': 'map'
		};
		for (var name in params) {
			Manager.store.addByValue(name, params[name]);
		}    
		// add facet category with locals params
		Manager.store.add('facet.field', new AjaxSolr.Parameter({ name:'facet.field', value: 'category', locals: { ex:'category' } }));
		
		
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
				qf_default: Manager.store.qf_default,
				sort_default: sort_default,
				scroll_rows_default: scroll_rows_default 
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
				fl_options: {"thumbs": fl_options.thumbs}
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
				fl_options: {"related": fl_options.related}
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
				fl_options: {"detail": fl_options.detail}
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

//		Manager.addWidget(new AjaxSolr.ViewPickerWidget({
//			id: 'viewpicker',
//			target: '#viewpicker',
//			template: Mustache.getTemplate('templates/view_picker.html')
//		})); 

		Manager.addWidget(new AjaxSolr.SorterWidget({
			id: 'sorter',
			target: '#sorter',
			options: {
				'all': [{"value": "score desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_relevans")), "selected": false},
				        {"value": "object_production_date_earliest asc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_dato_asc")), "selected": false},
                        {"value": "object_production_date_earliest desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_dato_desc")), "selected": false},
                        {"value": "artist_first_name asc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_name_asc")), "selected": false},
                        {"value": "artist_first_name desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_name_desc")), "selected": false},
				        {"value": "last_update desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_last_updated")), "selected": false}],

		        'praktisk': [{"value": "score desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_relevans")), "selected": false},
		                     {"value": "last_update desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_last_updated")), "selected": false}],

                 'collections': [{"value": "score desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_relevans")), "selected": true},
                                 {"value": "object_production_date_earliest asc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_dato_asc")), "selected": false},
                                 {"value": "object_production_date_earliest desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_dato_desc")), "selected": false},
                                 {"value": "last_update desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_last_updated")), "selected": false}],

                 'kalender': [{"value": "score desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_relevans")), "selected": false},
                              {"value": "page_eventStartDate_dateS asc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_dato_asc")), "selected": false},
                              {"value": "page_eventStartDate_dateS desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_dato_desc")), "selected": false}],

                  'nyheder': [{"value": "score desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_relevans")), "selected": false},
                              {"value": "created asc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_dato_asc")), "selected": false},
                              {"value": "created desc", "text" : smkCommon.firstCapital(Manager.translator.getLabel("sorter_dato_desc")), "selected": false}]
			},	
			template: Mustache.getTemplate('templates/sorter.html')
		})); 

		Manager.addWidget(new AjaxSolr.CategoryWidget({
			id: 'category',
			target: '#category',
			field: 'category',
			multivalue:false,	    
			categoryList: {"all":translator.getLabel('category_all'), "collections":translator.getLabel('category_artwork'), "nyheder":translator.getLabel('category_news'), "kalender":translator.getLabel('category_calendar'), "praktisk":translator.getLabel('category_info')},
			activeCategory: "all",
			template: Mustache.getTemplate('templates/category.html')
		}));	

		Manager.addWidget(new AjaxSolr.TeasersWidget({
			id: 'teasers',
			target: '#smk_teasers',
			template: Mustache.getTemplate('templates/teasers.html')
		}));

		for (var i = 0, l = searchFieldsTypes.length; i < l; i++) {
			Manager.addWidget(new AjaxSolr.SearchFiltersWidget({
				id: searchFieldsTypes[i].field,
				title: searchFieldsTypes[i].title,
				target: '#' + searchFieldsTypes[i].field,
				field: searchFieldsTypes[i].field,
				template: Mustache.getTemplate('templates/chosen.html')
			}));
		};				

		//* Detail / Thumbs / Related widgets 
		var sub_thumbsWidget = new AjaxSolr.ThumbsWidget({
			id: 'thumbs',
			target: '#thumbnails',
			template: Mustache.getTemplate('templates/thumb.html')
		});
		
		var sub_relatedWidget = new AjaxSolr.RelatedWidget({
			id: 'related',
			target: '#related-artworks',
			template: Mustache.getTemplate('templates/related.html')
		});
		
		var sub_originalWidget = new AjaxSolr.OriginalWidget({
			id: 'original',
			target: '#original',
			template: Mustache.getTemplate('templates/original.html')
		});
		
		Manager.addWidget(new AjaxSolr.DetailTabsWidget({
			id: 'details_tabs',
			target: '#smk_detail_tabs',
			template: Mustache.getTemplate('templates/detail_tabs.html'),
			thumbnailsManager: thumbnailsManager,
			thumbnails_subWidget: sub_thumbsWidget,
			relatedManager: relatedManager,
			related_subWidget: sub_relatedWidget,
			originalManager: getDetailManager,
			original_subWidget: sub_originalWidget
		}));	
		
		Manager.addWidget(new AjaxSolr.DetailWidget({
			id: 'details',
			target: '#smk_detail',
			template: Mustache.getTemplate('templates/detail.html'),
			thumbnailsManager: thumbnailsManager,
			thumbnails_subWidget: sub_thumbsWidget,
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
		
		///* switch grid/list in teasers view
//		$(Manager.widgets['viewpicker']).on('view_picker', function(event){ 
//			EventsManager.switch_list_grid(event.value);
//		}); 

//		$(ViewManager).on('current_view_mode', function(event){ 
//			EventsManager.switch_list_grid(event.value);
//		});

		//* selected category changed
		$(Manager.widgets['category']).on('smk_search_category_changed', function(event){     	
			EventsManager.smk_search_category_changed(event);
		});     

		//* searchfilters changed
		for (var i = 0, l = searchFieldsTypes.length; i < l; i++) {
			$(Manager.widgets[searchFieldsTypes[i].field]).on('smk_search_filter_changed', {self: Manager.widgets[searchFieldsTypes[i].field]}, function(event){    		
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
			$(Manager.widgets[searchFieldsTypes[i].field]).on('smk_search_filter_loaded', function(event){
				EventsManager.remove_modal_loading_from_widget(event.currentTarget.target);
			});
		};	
		
		//* a new image has been displayed in "teaser"
		$(Manager.widgets['teasers']).on('smk_teasers_this_img_displayed', function(event){     	            	
			EventsManager.smk_teasers_this_img_displayed();
		});	
		
		//* a new image has finished loading in "teaser"
		$(Manager.widgets['teasers']).on('smk_teasers_this_img_loaded', function(event){     	            	
			EventsManager.smk_teasers_this_img_loaded();
		});				

		//* all images displayed in "teaser"
		$(ViewManager).on('smk_teasers_all_images_displayed', function(event){ 			
			for (var i = 0, l = searchFieldsTypes.length; i < l; i++) {
				EventsManager.after_afterRequest(searchFieldsTypes[i].field);				
			};				
		});	
		
		//* a new image has finished loading in "related"
		$(Manager.widgets['details']).on('smk_related_this_img_loaded', function(event){   
			EventsManager.smk_related_this_img_loaded();
		}); 
		
		//* a new image has finished loading in "thumbs"
		$(Manager.widgets['details']).on('smk_thumbs_img_loaded', function(event){
			EventsManager.smk_thumbs_img_loaded();  		  	    
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
