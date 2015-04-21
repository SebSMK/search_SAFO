(function ($) {

	AjaxSolr.DetailTabsWidget = AjaxSolr.AbstractWidget.extend({

		constructor: function (attributes) {
			AjaxSolr.DetailTabsWidget.__super__.constructor.apply(this, arguments);
			AjaxSolr.extend(this, {
				partsManager:null,
				parts_subWidget:null,
				relatedManager: null,
				related_subWidget: null,
				originalManager: null,
				original_subWidget: null
			}, attributes);
		},	

		start: 0,

		current_language: null,

		default_picture_path: null, 
		
		related_id_req: null,
		
		multi_work_ref_req: null,

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
								'sort': "id asc",
								'fl': self.partsManager.store.fl_options.thumbs,
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
				self.partsManager.store.addByValue(name, params.thumbs[name]);			
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

			// click on a related artwork
			$(self.related_subWidget).on('smk_search_call_detail', function(event){ 								
				$(self).trigger({
					type: "smk_search_call_detail",
					event: event
				});
			});
			
			//***
			//* part sub widget
			//***
			//* sub widget coupling
			self.partsManager.addWidget(self.parts_subWidget); 							
			
			// click on a part of the artwork
			$(self.parts_subWidget).on('smk_search_call_detail', function(event){ 								
				$(self).trigger({
					type: "smk_search_call_detail",
					event: event
				});
			});
			
			//* merge data and template
			var html = self.template_integration_json({}, '#detailTemplate');    
			$(self.target).html(html);    
		}, 

		afterRequest: function () {	  

			var self = this;		
			var $target = $(this.target);

			if (!self.getRefresh()){
				self.setRefresh(true);
				return;
			}	

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
			this.multi_work_ref_req = null;
			this.related_id_req = null;
			var original_id_req = null;

			for (var i = 0, l = this.manager.response.response.docs.length; i < l ; i++) {
				var doc = this.manager.response.response.docs[i]; 
				
				//øøøøøøøøøøøø//
				var dataHandler_test = new getData_Detail_Tabs.constructor(this);
				var artwork_data_test = dataHandler_test.get_data(doc); 
																
				//øøøøøøøøøøøø//
				
				tab_requests = dataHandler.get_data(doc);  
				//* get parts request
				this.multi_work_ref_req = tab_requests.subwidget.req_multiwork;
	
				//* get related request
				this.related_id_req = tab_requests.subwidget.req_relatedid;									
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
				
		verticalAlignThumbs: function(){
			this.parts_subWidget.verticalAlign();
		},
		
		removeAllParts: function(){
			this.parts_subWidget.removeAllArticles();
		},
		
		removeAllRelated: function(){
			this.related_subWidget.removeAllArticles();
		},
		
		process_related: function(){
			if(this.related_id_req != null){				
				//* start related sub request
				var param = new AjaxSolr.Parameter({name: "q", value: this.related_id_req });					  					
				this.relatedManager.store.add(param.name, param);	 			
				this.relatedManager.doRequest();
			}
		},	
		
		process_parts: function(){
			if(this.multi_work_ref_req != null){				
				//* start part sub request
				var param = new AjaxSolr.Parameter({name: "q", value: this.multi_work_ref_req });					  					
				this.partsManager.store.add(param.name, param);	 			
				this.partsManager.doRequest();				
			}		
		}	
	});

})(jQuery);