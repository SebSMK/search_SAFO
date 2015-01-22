(function ($) {

	AjaxSolr.ScrollUpdateManagerWidget = AjaxSolr.AbstractWidget.extend({  

		constructor: function (attributes) {
			AjaxSolr.AbstractWidget.__super__.constructor.apply(this, arguments);
			AjaxSolr.extend(this, {
				scrollManager:null,
				scroll_subWidget:null,
				start_offset:0
			}, attributes);
		},	

		isRequestRunning: false,

		noMoreResults: false,

		init: function(){     
			var self = this;
			//* set and save default request parameters  
			var scrollParams = {
					'q': self.scrollManager.store.q_default,	
					'rows': self.scrollManager.store.scroll_rows_default,
					'defType': 'edismax',      
					'qf': Manager.store.get_qf_string(),
					'sort': self.scrollManager.store.sort_default,
					'start': self.start_offset - self.scrollManager.store.scroll_rows_default + 1,
					'json.nl': 'map'
			};

			for (var name in scrollParams) {
				self.scrollManager.store.addByValue(name, scrollParams[name]);
			}    

			//* save 'default request' parameters
			self.scrollManager.store.save(true);

			//* add sub widget (will add pictures)
			self.scrollManager.addWidget(this.scroll_subWidget); 		

			//* a new image has been displayed in "scroll teaser"
			$(self.scroll_subWidget).on('smk_teasers_this_img_displayed', function(event){     	            	
				//Manager.widgets['state_manager'].smk_teasers_this_img_displayed();
				self.new_img_displayed();
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

			self.scrollManager.init(); 
		},

		start_scroll_request: function(){

			if(!this.isRequestRunning && !this.noMoreResults){
				var params = {};

				params.q = ModelManager.get_q();
				params.start = parseInt(this.scrollManager.store.get('start').val()) + parseInt(this.scrollManager.store.scroll_rows_default);			

				this.scrollManager.store.addByValue('q', params.q !== undefined && params.q.length > 0  ? params.q : this.scrollManager.store.q_default);
				this.scrollManager.store.addByValue('start', params.start);

				this.isRequestRunning = true;
				this.scrollManager.doRequest();
				this.show_infinite_scroll_spin('true');
			}        
		},

		new_img_displayed: function(){

			$(this.scroll_subWidget.target).find('.search-results .matrix').masonry('layout');
			
			if ($(this.scroll_subWidget.target).find('.image_loading').length == 0 && 
					$(this.scroll_subWidget.target).find('.not_displayed').length == 0){				

				//* all pictures loaded and displayed
				var opacity_pic = '0.5';
				$(this.scroll_subWidget.target).find('.matrix-tile.scroll_add').css('opacity', opacity_pic);				
				$(this.scroll_subWidget.target).find('.matrix-tile.scroll_add').css('opacity', 1);
				$(this.scroll_subWidget.target).find('.matrix-tile.scroll_add').removeClass('scroll_add');
				this.show_infinite_scroll_spin('false');	
				this.isRequestRunning = false;
				$(this).trigger({
					type: "smk_scroll_all_images_displayed"
				});		
			}    		  			
		},

		show_infinite_scroll_spin: function(state){		

			switch(state){
			case "true":								
				$(this.scroll_subWidget.target).find(".scroll-spinning").show();
				break;

			case "false":								
				$(this.scroll_subWidget.target).find(".scroll-spinning").hide();
				break;

			case "end":								
				$(this.scroll_subWidget.target).find(".scroll-spinning").hide();
				break;

			default:				
				$(this.scroll_subWidget.target).find(".scroll-spinning").hide();				
			}									
		},

		reset: function(){
			var start = this.start_offset - this.scrollManager.store.scroll_rows_default + 1;
			this.scrollManager.store.addByValue('start', start);   
			this.isRequestRunning = false;  
			this.noMoreResults = false;   
		}

	});
})(jQuery);