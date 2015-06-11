(function ($) {

	AjaxSolr.ScrollUpdateManagerWidget = AjaxSolr.AbstractWidget.extend({  

		constructor: function (attributes) {
			AjaxSolr.AbstractWidget.__super__.constructor.apply(this, arguments);
			AjaxSolr.extend(this, {
				mainManager:null,				
				scroll_subWidget:null,
				start_offset:0
			}, attributes);
		},			

		/*
		 * PUBLIC FUNCTIONS
		 * **/				
		init: function(){     
			var self = this;						

			//* init scroll request manager	
			this.scrollManager = new AjaxSolr.smkManager({
				solrUrl: self.mainManager.solrUrl,
				proxyUrl: self.mainManager.proxyUrl,
				store: new AjaxSolr.smkParameterStore({
					exposed: self.mainManager.exposed,
					start: 0,     		
					fq_default: self.mainManager.store.fq_default,
					q_default: self.mainManager.store.q_default,
					qf_default: self.mainManager.store.qf_default != null ? self.mainManager.store.qf_default[self.mainManager.store.current_lang] : null,
					sort_default: self.mainManager.store.sort_default,
					scroll_rows_default: self.mainManager.store.scroll_rows_default,
					current_lang: self.mainManager.store.current_lang 
				}),
				allWidgetsProcessed: self.mainManager.allWidgetsProcessedBound,
				generalSolrError: self.mainManager.generalSolrErrorProcessedBound,
				translator: self.mainManager.translator,
				id: 'scrollManager_' + self.target
			});
			

			// set and save default request parameters 
			var scrollParams = {
					'q': this.scrollManager.store.q_default,						
					'fq': this.scrollManager.store.fq_default,							
					'defType': 'edismax',      					
					'start': self.start_offset - self.scrollManager.store.scroll_rows_default + 1,
					'json.nl': 'map'
			};

			for (var name in scrollParams) {
				self.scrollManager.store.addByValue(name, scrollParams[name]);
			}    

			// save 'default request' parameters
			self.scrollManager.store.save(true);
			
			
			//* add sub widget (will add pictures)
			self.scrollManager.addWidget(this.scroll_subWidget); 		

			//* set event - all images displayed in "scroll teaser"
			$(self.scroll_subWidget).on('smk_scroll_all_images_loaded', function(event){     	            					
				if(smkCommon.debugLog()) console.log(sprintf("end_scroll_request - smk_scroll_all_images_loaded: isRequestRunning_%s - isPreloading_%s", self.isRequestRunning, self.isPreloading));
				self.all_img_displayed();
			});	 

			//* set event - all images preloaded in "scroll teaser"
			$(self.scroll_subWidget).on('smk_scroll_all_images_preloaded', function(event){     	            					
				if(smkCommon.debugLog()) console.log(sprintf("end_preload_request - smk_scroll_all_images_preloaded: isRequestRunning_%s - isPreloading_%s", self.isRequestRunning, self.isPreloading));
				self.all_img_preloaded();
			});	 

			$(self.scroll_subWidget).on('smk_scroll_no_more_results', function(event){     	            	
				//Manager.widgets['state_manager'].smk_scroll_no_more_results();
				self.show_infinite_scroll_spin('end');
				self.isRequestRunning = false;  
				self.noMoreResults = true;     
				$(self).trigger({
					type: "smk_scroll_no_more_results"
				}); 
			});	

			$(self.scroll_subWidget).on('smk_search_call_detail', function(event){     					
				$(self).trigger({
					type: "smk_search_call_detail",
					detail_url: event.detail_url					
				});
			});

			this.scrollSpin = new Spinner(this.scrollSpinopts);								

		},
		
		beforeRequest: function(){
			
			// reset scroll manager				
			this.reset();

//			// add current fq to scroll manager
//			//var fq = ModelManager.get_fq();			
//			this.set_sub_manager_fq();			
		},		

		start_scroll_preload_request: function(spin){
			var params = {};
			var nber_rows_to_preload = this.scrollManager.store.scroll_rows_default * 30;

			// preloading starts only under a given thresold of remaining number of preloaded images
			if($(this.scroll_subWidget.target).find('.preloaded').length < (nber_rows_to_preload / 1.2)
					&& !this.isRequestRunning 
					&& !this.noMoreResults ){								

				params.q = this.mainManager.store.values('q');
				params.fl = this.mainManager.store.values('fl');
				params.start = $(this.scroll_subWidget.target).find('.matrix-tile').length;			
				params.sort = smkCommon.isValidDataText(this.mainManager.store.values('sort')) ? this.mainManager.store.values('sort') : this.scrollManager.store.sort_default;				
				params.rows = nber_rows_to_preload; // - $(this.scroll_subWidget.target).find('.preloaded').length;				
				params.qf = this.mainManager.store.values('qf');
				
				//this.scrollManager.store.addByValue('q', params.q !== undefined && params.q.length > 0  ? params.q : this.scrollManager.store.q_default);
				this.scrollManager.store.addByValue('q', params.q);
				this.scrollManager.store.addByValue('fl', params.fl);
				this.scrollManager.store.addByValue('start', params.start);
				this.scrollManager.store.addByValue('sort', params.sort);
				this.scrollManager.store.addByValue('rows', params.rows);
				this.scrollManager.store.addByValue('qf', params.qf);
				
				// add current fq to scroll manager					
				this.set_sub_manager_fq();			

				this.isRequestRunning = true;
				this.isPreloading = true;
				this.scroll_subWidget.isPreloading(true);
				
				if(smkCommon.debugLog()) console.log(sprintf("start_scroll_preload_request - doRequest: preloaded back_%s, start_%s, rows_%s, isRequestRunning_%s - isPreloading_%s",$('.preloaded').length, params.start, params.rows, this.isRequestRunning, this.isPreloading));	

				this.scrollManager.doRequest();	
				
				if(spin)
					this.show_infinite_scroll_spin('true');
			}        
		},		
		
		reset: function(){			
			var start = this.start_offset - this.scrollManager.store.scroll_rows_default + 1;
			this.scrollManager.store.addByValue('start', start); 
			this.scrollManager.store.remove('fq');
			this.scrollManager.store.addByValue('fq', this.scrollManager.store.fq_default); 			
			this.isRequestRunning = false;  
			this.noMoreResults = false;  
			this.isPreloading = false;
			this.scroll_subWidget.isPreloading(false);
			this.scroll_subWidget.setReset(true);
		},

		/*
		 * EVENTS
		 * **/

		all_img_displayed: function(){
			if ($(this.scroll_subWidget.target).find('.image_loading').length == 0){

				$(this.scroll_subWidget.target).find('.matrix-tile.scroll_add').removeClass('scroll_add');
				this.show_infinite_scroll_spin('false');	
				this.isRequestRunning = false;
				this.onFinishLoaded(this.scrollManager.store.scroll_rows_default);				
			}			 		  			
		},

		all_img_preloaded: function(){
			if ($(this.scroll_subWidget.target).find('.image_loading').length == 0){

				$(this.scroll_subWidget.target).find('.matrix-tile.scroll_add').removeClass('scroll_add');
				this.show_infinite_scroll_spin('false');	
				this.isRequestRunning = false;
				this.isPreloading = false;
				this.scroll_subWidget.isPreloading(false);			}			 		  			
		},
				
		/*
		 * EVENTS
		 * **/
		onFinishLoaded: function(num) {	
			$(this).trigger({
				type: "smk_scroll_all_images_displayed",
				added: num // number of added images
			});
			return true;
		},						
		
		/*
		 * PRIVATE FUNCTIONS
		 * **/				

		/* page scrolled */			        		           
		scrollStart: function(event) {		        															

			var st = $(window).scrollTop();
			
			if ($('.generalspinner').length == 0				
				&& st > this.lastScrollTop
				&& !$(event.target).hasClass('active-result') // user is not scrolling a facet-list				
			){
				//* start scroll request
				this.start_scroll_request();	        																	        		    								
			}
			
			this.lastScrollTop = st;
		},
		
		start_scroll_request: function(){
			var self = this;						
			var newImg = 0;													

			// show preloaded images
			if ($(self.scroll_subWidget.target).find('.preloaded').length > 0){									

				$(self.scroll_subWidget.target).find('.preloaded').each(function(){
					if(smkCommon.isElemIntoView(this)){
						$(this).removeClass('preloaded').show();
						if(smkCommon.debugLog()) console.log(sprintf("start_scroll_request - remove preloaded: %s", $(this).attr("id")));	
						newImg++;
					}										
				});
				if (newImg > 0)
					self.onFinishLoaded(newImg);				
			}
			// ...or, if there are no more preloaded images, start scroll request
			else{		
				if(!this.isRequestRunning && !this.noMoreResults && this.trigger_req()){
					var params = {};					
					var nber_rows_to_load = this.scrollManager.store.scroll_rows_default * 5;
					
					params.q = this.mainManager.store.values('q');	
					params.fl = this.mainManager.store.values('fl');
					params.start = $(this.scroll_subWidget.target).find('.matrix-tile').length;	//parseInt(this.scrollManager.store.get('start').val()) + 1;
					params.sort = smkCommon.isValidDataText(this.mainManager.store.values('sort')) ? this.mainManager.store.values('sort') : this.scrollManager.store.sort_default;				
					params.rows = nber_rows_to_load; 
					params.qf = this.mainManager.store.values('qf');
					
					//this.scrollManager.store.addByValue('q', params.q !== undefined && params.q.length > 0  ? params.q : this.scrollManager.store.q_default);
					this.scrollManager.store.addByValue('q', params.q);
					this.scrollManager.store.addByValue('fl', params.fl);
					this.scrollManager.store.addByValue('start', params.start);
					this.scrollManager.store.addByValue('sort', params.sort);
					this.scrollManager.store.addByValue('rows', params.rows);
					this.scrollManager.store.addByValue('qf', params.qf);
					// add current fq to scroll manager								
					this.set_sub_manager_fq();			
										
					this.isRequestRunning = true;
					this.isPreloading = false;
					this.scroll_subWidget.isPreloading(false);

					if(smkCommon.debugLog()) console.log(sprintf("start_scroll_request - doRequest: start_%s, rows_%s, isRequestRunning_%s - isPreloading_%s", params.start, params.rows, this.isRequestRunning, this.isPreloading));	

					this.scrollManager.doRequest();
					this.show_infinite_scroll_spin('true');
				}        				
			}
		},		

		trigger_req: function(){
			var win = ($(window).height() + $(window).scrollTop()) + 200;
			var matrix = $(".matrix").height();

			return matrix <= win ;
		},

		show_infinite_scroll_spin: function(state){		

			switch(state){
			case "true":												
				var spintarget = document.getElementById(this.scroll_subWidget.target.replace('#', ''));				
				this.scrollSpin.spin(spintarget);
				$(this.scroll_subWidget.target).find('.scrollspinner').css('position', 'fixed');
				break;			

			default:				
				this.scrollSpin.stop();				
			}									
		},

		set_sub_manager_fq: function(){
			var model = ModelManager.getModel();
			if(this.scrollManager != null && model.fq !== undefined && AjaxSolr.isArray(model.fq)){
				for (var i = 0, l = model.fq.length; i < l; i++) {						
					this.scrollManager.store.addByValue('fq', model.fq[i].value, model.fq[i].locals);
				};											
			};
			if(this.scrollManager != null && model.auto !== undefined && AjaxSolr.isArray(model.auto)){
				for (var i = 0, l = model.auto.length; i < l; i++) {						
					this.scrollManager.store.addByValue('fq', model.auto[i].value, model.auto[i].locals);
				};											
			};
		},
		
		/*
		 * PRIVATE VARIABLES
		 * **/	
		
		scrollManager:null,

		isRequestRunning: false,

		noMoreResults: false,				

		scrollSpin: null, 

		isPreloading: false,
		
		lastScrollTop: 0,

		scrollSpinopts: {
			lines: 11, // The number of lines to draw
			length: 9, // The length of each line
			width: 3, // The line thickness
			radius: 10, // The radius of the inner circle
			corners: 1, // Corner roundness (0..1)
			rotate: 0, // The rotation offset
			direction: 1, // 1: clockwise, -1: counterclockwise
			color: '#000', // #rgb or #rrggbb or array of colors
			speed: 0.8, // Rounds per second
			trail: 68, // Afterglow percentage
			shadow: false, // Whether to render a shadow
			hwaccel: false, // Whether to use hardware acceleration
			className: 'scrollspinner', // The CSS class to assign to the spinner
			zIndex: 2e9, // The z-index (defaults to 2000000000)
			top: '95%', // Top position relative to parent
			left: '57%' // Left position relative to parent
		}			

	});
})(jQuery);