(function ($) {

	AjaxSolr.DetailTabsWidget = AjaxSolr.AbstractWidget.extend({

		constructor: function (attributes) {
			AjaxSolr.DetailTabsWidget.__super__.constructor.apply(this, arguments);
			AjaxSolr.extend(this, {
				thumbnailsManager:null,
				thumbnails_subWidget:null,
				relatedManager: null,
				related_subWidget: null,
				originalManager: null,
				original_subWidget: null
			}, attributes);
		},	

		start: 0,

		current_language: null,

		default_picture_path: null, 

		init: function(){	  	    
			var self = this;
			
			self.default_picture_path = smkCommon.getDefaultPicture('large');
			self.current_language = self.manager.translator.getLanguage();
			
			//* related              
			var params = 
			
			{
					"related": {					
								'rows':500,					
								'start': 0,
								'fl': self.relatedManager.store.fl_options.related,
								'json.nl': 'map'
								},
					
					"thumbs": {					
								'rows':500,					
								'start': 0,
								'fl': self.thumbnailsManager.store.fl_options.thumbs,
								'json.nl': 'map'
								},
						
					"detail": {					
								'rows':500,					
								'start': 0,
								'fl': self.originalManager.store.fl_options.detail,
								'json.nl': 'map'
								},
					
			};
			
			for (var name in params.related) {				
				self.relatedManager.store.addByValue(name, params.related[name]);				
			}   						
			
			for (var name in params.thumbs) {
				self.thumbnailsManager.store.addByValue(name, params.thumbs[name]);			
			}   
			
			for (var name in params.detail) {				
				self.originalManager.store.addByValue(name, params.detail[name]);
			}   
			
			//***
			//* original sub widget
			//***
			//* sub widget coupling
			self.originalManager.addWidget(self.original_subWidget); 

			//***
			//* related sub widget
			//***
			//* sub widget coupling
			self.relatedManager.addWidget(self.related_subWidget); 				

			//* a new image has been displayed in "scroll teaser"
			$(self.related_subWidget).on('smk_related_this_img_loaded', function(event){     	            								
				$(self).trigger({
					type: "smk_related_this_img_loaded"
				});
			});	
			
			// click on a related artwork
			$(self.related_subWidget).on('smk_search_call_detail', function(event){ 								
				$(self).trigger({
					type: "smk_search_call_detail",
					event_caller: event
				});
			});

			//***
			//* thumbnail sub widget
			//***
			//* sub widget coupling
			self.thumbnailsManager.addWidget(self.thumbnails_subWidget); 				

			// a new image has been displayed in "scroll teaser"
			$(self.thumbnails_subWidget).on('smk_thumbs_img_loaded', function(event){     	            								
				$(self).trigger({
					type: "smk_thumbs_img_loaded"
				});
			});	
			
			// click on a thumb
			$(self.thumbnails_subWidget).on('smk_search_call_detail', function(event){ 
				
				self.setCurrentThumb_selec(event.detail_id);  
				
				$(self).trigger({
					type: "smk_search_call_detail",
					event_caller: event
				});
			});

			self.thumbnailsManager.init();
		}, 

		afterRequest: function () {	  

			var self = this;		
			var $target = $(this.target);

			if (!self.getRefresh()){
				self.setRefresh(true);
				return;
			}	

			$target.empty();

			// in case there are no results
			if (this.manager.response.response.docs.length == 0){
				$target
				// remove the loading class (so the ViewManager can remove background spinner), 
				.removeClass('image_loading')
				.html(this.manager.translator.getLabel("no_results"))	
				// trig "this image is loaded" event	      
				$(self).trigger({
					type: "smk_detail_tabs_loaded"
				});
				return;		
			}			
			
			var tab_requests = null;
			var dataHandler = new getData_Detail_Tabs.constructor(this);
			var multi_work_ref_req = null;
			var related_id_req = null;
			var original_id_req = null;

			for (var i = 0, l = this.manager.response.response.docs.length; i < l ; i++) {
				var doc = this.manager.response.response.docs[i]; 
				
				//øøøøøøøøøøøø//
				var dataHandler_test = new getData_Detail_Extended.constructor(this);
				var artwork_data_test = dataHandler_test.get_data(doc); 
																
				//øøøøøøøøøøøø//
				
				tab_requests = dataHandler.get_data(doc);  
				//* process thumbnails
				multi_work_ref_req = tab_requests.subwidget.req_multiwork;
	
				//* process related
				related_id_req = tab_requests.subwidget.req_relatedid;	
				
				

			}
			
			//* merge data and template
			var html = self.template_integration_json({"detail": tab_requests}, '#detailTemplate');    
			$target.html(html);    

			//* add main image
			$target.find('.gallery__main.image_loading').each(function() {    	    	
				dataHandler.getImage($(this));
			});      	

			//* add link to back button	  
			//$target.find('a.back-button').css('opacity', '1');
			$target.find('a.back-button').click(
					function (event) {
						event.preventDefault();
						// send call to teaser view restoring (but without sending a request to Solr)
						$(self).trigger({
							type: "smk_search_call_teasers"
						});  		    		    		    			
						return;  		    		            
					}
			);
			
			if(multi_work_ref_req != null){				
				//* start thumbnail sub request
				var param = new AjaxSolr.Parameter({name: "q", value: multi_work_ref_req });					  					
				this.thumbnailsManager.store.add(param.name, param);	 			
				this.thumbnailsManager.doRequest();				
			}	
			
			if(related_id_req != null){				
				//* start thumbnail sub request
				var param = new AjaxSolr.Parameter({name: "q", value: related_id_req });					  					
				this.relatedManager.store.add(param.name, param);	 			
				this.relatedManager.doRequest();
			}
			
			if(original_id_req != null){	
				//* start original  sub request
				var param = new AjaxSolr.Parameter({name: "q", value: original_id_req });					  					
				this.originalManager.store.add(param.name, param);	 			
				this.originalManager.doRequest();
			}						

		},  

		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		},
		
		setCurrentThumb_selec: function(selec){
			this.thumbnails_subWidget.setCurrent_selec(selec);
		},
		
		getCurrentThumb_selec: function(){
			return this.thumbnails_subWidget.getCurrent_selec();
		},
		
		verticalAlignThumbs: function(){
			this.thumbnails_subWidget.verticalAlign();
		},
		
		removeAllRelated: function(){
			this.related_subWidget.removeAllArticles();
		}

	});

})(jQuery);