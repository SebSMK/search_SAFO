(function ($) {

	AjaxSolr.SearchBoxAutoManagerWidget.js = AjaxSolr.AbstractWidget.extend({  

		constructor: function (attributes) {
			AjaxSolr.AbstractWidget.__super__.constructor.apply(this, arguments);
			AjaxSolr.extend(this, {				
				autoCompManager: null, 
				sub_autoCompWidget: null
			}, attributes);
		},			

		/*
		 * PUBLIC FUNCTIONS
		 * **/

		init: function(){     
			var self = this;
			//* set and save default request parameters  
			var autoCompParams = {
					'fq': Manager.store.fq_default,							
					'q': self.autoCompManager.store.q_default,	
					'rows': self.autoCompManager.store.scroll_rows_default,
					'defType': 'edismax',      										
					'json.nl': 'map'
			};

			for (var name in autoCompParams) {
				self.autoCompManager.store.addByValue(name, autoCompParams[name]);
			}    

			//* save 'default request' parameters
			self.autoCompManager.store.save(true);

			//* add sub widget
			self.autoCompManager.addWidget(this.sub_autoCompWidget); 		

//			//* set event - all images displayed in "scroll teaser"
//			$(self.sub_autoCompWidget).on('smk_scroll_all_images_loaded', function(event){     	            					
//				if(smkCommon.debugLog()) console.log(sprintf("end_scroll_request - smk_scroll_all_images_loaded: isRequestRunning_%s - isPreloading_%s", self.isRequestRunning, self.isPreloading));
//				self.all_img_displayed();
//			});	 
//
//			//* set event - all images preloaded in "scroll teaser"
//			$(self.sub_autoCompWidget).on('smk_scroll_all_images_preloaded', function(event){     	            					
//				if(smkCommon.debugLog()) console.log(sprintf("end_preload_request - smk_scroll_all_images_preloaded: isRequestRunning_%s - isPreloading_%s", self.isRequestRunning, self.isPreloading));
//				self.all_img_preloaded();
//			});	 
//
//			$(self.sub_autoCompWidget).on('smk_scroll_no_more_results', function(event){     	            	
//				//Manager.widgets['state_manager'].smk_scroll_no_more_results();
//				self.show_infinite_scroll_spin('end');
//				self.isRequestRunning = false;  
//				self.noMoreResults = true;     
//				$(self).trigger({
//					type: "smk_scroll_no_more_results"
//				}); 
//			});	
//
//			$(self.sub_autoCompWidget).on('smk_search_call_detail', function(event){     					
//				$(self).trigger({
//					type: "smk_search_call_detail",
//					detail_url: event.detail_url					
//				});
//			});

			this.scrollSpin = new Spinner(this.scrollSpinopts);			

			self.autoCompManager.init(); 

		},
		
		beforeRequest: function(){
			
			// reset scroll manager				
			this.reset();

			// add current fq to scroll manager
			var fq = ModelManager.get_fq();			
			this.set_sub_manager_fq(fq);			
		},

		start_scroll_request: function(){
			var self = this;						
			var newImg = 0;													

			// show preloaded images
			if ($(self.sub_autoCompWidget.target).find('.preloaded').length > 0){									

				$(self.sub_autoCompWidget.target).find('.preloaded').each(function(){
					if(self.isScrolledIntoView(this)){
						$(this).removeClass('preloaded').show();
						if(smkCommon.debugLog()) console.log(sprintf("start_scroll_request - show preloaded: %s", $(this).attr("id")));	
						newImg++;
					}										
				});
				if (newImg > 0)
					self.onFinishLoaded(newImg);				
			}
			// ...or start scroll request
			else{		
				if(!this.isRequestRunning && !this.noMoreResults && this.trigger_req()){
					var params = {};

					params.q = ModelManager.get_q();				
					params.start = parseInt(this.autoCompManager.store.get('start').val()) + parseInt(this.autoCompManager.store.scroll_rows_default);			
					params.sort = smkCommon.isValidDataText(ModelManager.get_sort()) ? ModelManager.get_sort() : this.autoCompManager.store.sort_default;				
					params.rows = this.autoCompManager.store.scroll_rows_default; 
					
					
					this.autoCompManager.store.addByValue('q', params.q !== undefined && params.q.length > 0  ? params.q : this.autoCompManager.store.q_default);
					this.autoCompManager.store.addByValue('start', params.start);
					this.autoCompManager.store.addByValue('sort', params.sort);
					this.autoCompManager.store.addByValue('rows', params.rows);

					this.isRequestRunning = true;
					this.isPreloading = false;
					this.sub_autoCompWidget.isPreloading(false);

					if(smkCommon.debugLog()) console.log(sprintf("start_scroll_request - doRequest: start_%s, rows_%s, isRequestRunning_%s - isPreloading_%s", params.start, params.rows, this.isRequestRunning, this.isPreloading));	

					this.autoCompManager.doRequest();
					this.show_infinite_scroll_spin('true');
				}        				
			}
		}

		set_sub_manager_fq: function(fq){			
			if(this.autoCompManager != null && fq !== undefined && AjaxSolr.isArray(fq)){
				for (var i = 0, l = fq.length; i < l; i++) {						
					this.autoCompManager.store.addByValue('fq', fq[i].value, fq[i].locals);
				};											
			};	
		},
		
		reset: function(){			
			var start = this.start_offset - this.autoCompManager.store.scroll_rows_default + 1;
			this.autoCompManager.store.addByValue('start', start); 
			this.autoCompManager.store.remove('fq');
			this.autoCompManager.store.addByValue('fq', Manager.store.fq_default); 			
			this.isRequestRunning = false;  
			this.noMoreResults = false;  
			this.isPreloading = false;
			this.sub_autoCompWidget.isPreloading(false);
			this.sub_autoCompWidget.setReset(true);
		},

		/*
		 * EVENTS
		 * **/

		all_img_displayed: function(){
			if ($(this.sub_autoCompWidget.target).find('.image_loading').length == 0){

				$(this.sub_autoCompWidget.target).find('.matrix-tile.scroll_add').removeClass('scroll_add');
				this.show_infinite_scroll_spin('false');	
				this.isRequestRunning = false;
				this.onFinishLoaded(this.autoCompManager.store.scroll_rows_default);				
			}			 		  			
		},

		all_img_preloaded: function(){
			if ($(this.sub_autoCompWidget.target).find('.image_loading').length == 0){

				$(this.sub_autoCompWidget.target).find('.matrix-tile.scroll_add').removeClass('scroll_add');
				this.show_infinite_scroll_spin('false');	
				this.isRequestRunning = false;
				this.isPreloading = false;
				this.sub_autoCompWidget.isPreloading(false);			}			 		  			
		},

		/*
		 * PRIVATE FUNCTIONS
		 * **/						

		onFinishLoaded: function(num) {	
			$(this).trigger({
				type: "smk_scroll_all_images_displayed",
				added: num // number of added images
			});
			return true;
		},				

		show_infinite_scroll_spin: function(state){		

			switch(state){
			case "true":												
				var spintarget = document.getElementById(this.sub_autoCompWidget.target.replace('#', ''));				
				this.scrollSpin.spin(spintarget);
				$(this.sub_autoCompWidget.target).find('.scrollspinner').css('position', 'fixed');
				break;			

			default:				
				this.scrollSpin.stop();				
			}									
		},

		/*
		 * PRIVATE VARIABLES
		 * **/	

		isRequestRunning: false,

		noMoreResults: false,				

		scrollSpin: null, 

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