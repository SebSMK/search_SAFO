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

		scrollSpin: null, 
		
		isPreloading: false,		

		init: function(){     
			var self = this;
			//* set and save default request parameters  
			var scrollParams = {
					'fq': Manager.store.fq_default,	
					'fl': Manager.store.fl_options.list,	
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

			//* set event - all images displayed in "scroll teaser"
			$(self.scroll_subWidget).on('smk_scroll_all_images_loaded', function(event){     	            					
				self.new_img_displayed();
			});	 
			
			//* set event - all images preloaded in "scroll teaser"
			$(self.scroll_subWidget).on('smk_scroll_all_images_preloaded', function(event){     	            					
				self.new_img_preloaded();
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

			//* spinner
			var scrollSpinopts = {
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
			};			

			this.scrollSpin = new Spinner(scrollSpinopts);			

			self.scrollManager.init(); 
						
		},

		isScrolledIntoView: function(elem){
		    var $elem = $(elem);
		    var $window = $(window);

		    var docViewTop = $window.scrollTop();
		    var docViewBottom = docViewTop + $window.height();

		    var elemTop = $elem.offset().top;
		    var elemBottom = elemTop + $elem.height();

		    return ((elemBottom <= docViewBottom + 100) && (elemTop >= docViewTop));
		},
		
		msnrAppend: function(elem){
			var $matrix = $(this.target).find('.matrix');
			var container = document.querySelector($matrix.selector);
			var msnry = Masonry.data(container);			
			msnry.appended(elem);
		},
		
		onFinishLoaded: function(num) {	
			$(this).trigger({
				type: "smk_scroll_all_images_displayed",
				added: num // number of added images
			});
			return true;
		},				
		
		trigger_req: function(){
			var win = ($(window).height() + $(window).scrollTop()) + 200;
			var matrix = $(".matrix").height();
			
			return matrix <= win ;
		},
		
		start_scroll_request: function(){
			var self = this;						
			var newImg = 0;
			if ($(self.scroll_subWidget.target).find('.preloaded').length > 0){
				$(self.scroll_subWidget.target).find('.preloaded').each(function(){
					if(self.isScrolledIntoView(this)){
						$(this).removeClass('preloaded').show();
						newImg++;
						//self.msnrAppend(this);
					}
//					var $matrix = $(self.target).find('.matrix');
//					var container = document.querySelector($matrix.selector);
//					var msnry = Masonry.data(container);
//					msnry.on( 'layoutComplete', self.onComplete);
//			    	msnry.layout();
					
					
				});
				if (newImg > 0)
					self.onFinishLoaded(newImg);				
			}
			else{
				if(!this.isRequestRunning && !this.noMoreResults && this.trigger_req()){
					var params = {};

					params.q = ModelManager.get_q();				
					params.start = parseInt(this.scrollManager.store.get('start').val()) + parseInt(this.scrollManager.store.scroll_rows_default);			
					params.sort = smkCommon.isValidDataText(ModelManager.get_sort()) ? ModelManager.get_sort() : this.scrollManager.store.sort_default;				
									
					this.scrollManager.store.addByValue('q', params.q !== undefined && params.q.length > 0  ? params.q : this.scrollManager.store.q_default);
					this.scrollManager.store.addByValue('start', params.start);
					this.scrollManager.store.addByValue('sort', params.sort);

					this.isRequestRunning = true;
					this.scrollManager.doRequest();
					this.show_infinite_scroll_spin('true');
				}        				
			}
		},
		
		start_preload_request: function(){

			if(!this.isRequestRunning && !this.noMoreResults){
				var params = {};

				params.q = ModelManager.get_q();				
				params.start = $(this.scroll_subWidget.target).find('.matrix-tile').length + 1;			
				params.sort = smkCommon.isValidDataText(ModelManager.get_sort()) ? ModelManager.get_sort() : this.scrollManager.store.sort_default;				
				params.rows = this.scrollManager.store.scroll_rows_default * 3 - $(this.scroll_subWidget.target).find('.preloaded').length;				
				
				this.scrollManager.store.addByValue('q', params.q !== undefined && params.q.length > 0  ? params.q : this.scrollManager.store.q_default);
				this.scrollManager.store.addByValue('start', params.start);
				this.scrollManager.store.addByValue('sort', params.sort);
				this.scrollManager.store.addByValue('rows', params.rows);

				this.isRequestRunning = true;
				this.isPreloading = true;
				this.scroll_subWidget.isPreloading(true);
				this.scrollManager.doRequest();
				//this.show_infinite_scroll_spin('true');				
			}        
		},

		new_img_displayed: function(){
			if ($(this.scroll_subWidget.target).find('.image_loading').length == 0 && 
					$(this.scroll_subWidget.target).find('.not_displayed').length == 0){

				$(this.scroll_subWidget.target).find('.matrix-tile.scroll_add').removeClass('scroll_add');
				this.show_infinite_scroll_spin('false');	
				this.isRequestRunning = false;
				this.onFinishLoaded(this.scrollManager.store.scroll_rows_default);				
			}			 		  			
		},
		
		new_img_preloaded: function(){
			if ($(this.scroll_subWidget.target).find('.image_loading').length == 0 && 
					$(this.scroll_subWidget.target).find('.not_displayed').length == 0){

				$(this.scroll_subWidget.target).find('.matrix-tile.scroll_add').removeClass('scroll_add');
				//this.show_infinite_scroll_spin('false');	
				this.isRequestRunning = false;
				this.isPreloading = false;
				this.scroll_subWidget.isPreloading(false);			}			 		  			
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

		reset: function(){
			var start = this.start_offset - this.scrollManager.store.scroll_rows_default + 1;
			this.scrollManager.store.addByValue('start', start);   
			this.isRequestRunning = false;  
			this.noMoreResults = false;   
		}

	});
})(jQuery);