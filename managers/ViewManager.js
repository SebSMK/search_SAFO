(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var viewManager = {};
		factory(viewManager);
		if (typeof define === "function" && define.amd) {
			define(viewManager); // AMD
		} else {
			root.ViewManager = viewManager; // <script>
		}
	}
}(this, function (viewManager) {

	viewManager.constructor = function(options){

		this.options = options || {};
		this.template = options.template;
		this.target = options.target;
		this.allWidgetProcessed = false; 
		
		/*********
		 * PUBLIC FUNCTIONS
		 ********** */

		this.init = function () {
			var self = this;
			var $target = $(this.target);	

			$target.hide();
			
			//* merge data and template						
			var html = self.template_integration_json({}, '#generalTemplate');    	  	  
			$target.html(html);	
			
			ModelManager.setModel($.address.value(), "url");
			var model = ModelManager.getModel();	
			var tohide = model.view == 'detail' ? 'section.section--list' : 'section.section--detail';								
			$target.find(tohide).hide();									
			
			//* add version number
			$target.find('#smk_search_version').text(smkCommon.getVersion() + "-" + smkCommon.getMode());
		
			$target.show();
		};

		this.beforeRequest = function(){	 

			this.start_modal_loading(this.target);			
			//* start loading mode for some choosen widgets  
			// teasers
			
			this.add_modal_loading_to_widget('teasers');
							
			// searchfilters
//			for (var i = 0, l = Manager.searchfilterList.length; i < l; i++) {		  	
//			this.add_modal_loading_to_widget(Manager.widgets[Manager.searchfilterList[i].field]);
//			};
			// details
			this.add_modal_loading_to_widget('details');	 
			// related
//			this.add_modal_loading_to_widget(Manager.widgets['details'].related_subWidget);*/
		
		};  

		this.template_integration_json = function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		};		

		/**
		 * Call function in a given widget / subwidget of the manager
		 * @param {String} [widget] Widget name
		 * @param {String} [fn] function name
		 * @params {Json} [options]		 
		 * * * @param {String[]} [params] array of function's parameters
		 */
		this.callWidgetFn = function(widget, fn, options){	
			var options = options || {};
			var params = options.params;								
			
			if(Manager.widgets[widget] === undefined || typeof(Manager.widgets[widget][fn]) !== "function"){
				console.log(sprintf("%s - %s not defined", widget, fn));								
				return false;
			}									
			return Manager.widgets[widget][fn].apply(Manager.widgets[widget], params);	
		};

		/**
		 * Call target of a given widget / subwidget of the manager
		 * @param {String} [widget] Widget name
		 * @param {String} [subwidget] subWidget name - optional
		 */
		this.callWidgetTarget = function(widget, subwidget){												
						
			if(Manager.widgets[widget] === undefined ||
					(subwidget !== undefined && Manager.widgets[widget][subwidget] === undefined)
			){
				console.log(sprintf("target %s/%s not defined", widget, subwidget));
				return [];
			}						
			
			return subwidget === undefined ? Manager.widgets[widget].target : Manager.widgets[widget][subwidget].target;
		};

		/**
		 * image loading handlers
		 * */		
		
		//* teaser		
		this.smk_teasers_this_img_displayed = function(){
			$(this.callWidgetTarget('teasers')).find('.matrix').masonry('layout');

			//* check if there are still images not displayed in "teaser"
			if ($(this.callWidgetTarget('teasers')).find('.image_loading').length == 0 && 
					$(this.callWidgetTarget('teasers')).find('.not_displayed').length == 0){				
				
				// if all images are loaded, we stop the modal "waiting image" for this widget
				this.remove_modal_loading_from_widget(this.callWidgetTarget('teasers'));	
								
				// if all images in teaser are displayed, send event
				var $this = $(this); 
//				// we had to set a Timeout here in order to let the modal mode finish 
//				setTimeout(function() {
					$this.trigger({
						type: "smk_teasers_all_images_displayed"
					});
//				}, 100);												
			}    		  
		};

		this.smk_teasers_this_img_loaded = function(){
			$(this.callWidgetTarget('teasers')).find('.matrix').masonry('layout');

			//* check if there are still images loading in "teaser"
			if ($(this.callWidgetTarget('teasers')).find('.image_loading').length == 0){

				this.showWidget($(this.callWidgetTarget('teasers')));								
				
				// highlight search string in teasers
				this.highlightning();
				
							
			}    		  

		};

		//...efter scroll: all the new images loaded in teaser
		this.smk_scroll_all_images_displayed = function(added){		
			$(this.callWidgetTarget('teasers')).find('.matrix').masonry('layout');			
			if (added !== undefined)
				this.callWidgetFn('pager', 'refreshDisplay', {params: [added]});
		},
				
		//* related
		this.smk_related_this_img_loaded = function(){
			$(this.callWidgetTarget('details', 'related_subWidget')).find('.matrix').masonry('layout');  

			//* check if there are still images loading in "related"
			if ($(this.callWidgetTarget('details', 'related_subWidget')).find('.image_loading').length == 0){    		
				// if all images are loaded, we stop the modal "waiting image" for this widget
				this.remove_modal_loading_from_widget(this.callWidgetTarget('details', 'related_subWidget'));   	   	 	       	  	
			} 	
		};

		//* thumbs
		this.smk_thumbs_img_loaded = function(){
			//* check if there are still images loading in "teaser"
			if ($(this.callWidgetTarget('details', 'thumbnails_subWidget')).find('.image_loading').length == 0){				 
				this.callWidgetFn('details', 'verticalAlignThumbs');
			}  	  
		};

		//* detail
		this.smk_detail_this_img_loaded = function(){
			this.remove_modal_loading_from_widget(this.callWidgetTarget('details'));   
			// show "back-button" in Detail view
			$(this.callWidgetTarget('details')).find('a.back-button').css('opacity', '1');			
		};			


		this.viewChanged = function (stateChange) {        	    
			var $target = $(this.target);
			var self = this;

			if (stateChange["view"] === undefined)
				return;

			switch(stateChange["view"]){
			case "teasers":			  

				$target.find("section.section--list").show();
				$target.find("section.section--detail").hide();
				
				$(self.callWidgetTarget('details', 'thumbnails_subWidget')).empty();
				self.hideWidget($(self.callWidgetTarget('details', 'thumbnails_subWidget')));
				$(self.callWidgetTarget('details', 'related_subWidget')).empty();
				self.hideWidget($(self.callWidgetTarget('details', 'related_subWidget')));
				
				$(self.callWidgetTarget('details')).empty();
				self.hideWidget($(self.callWidgetTarget('details')));

				self.callWidgetFn('details', 'removeAllRelated');				

				self.showWidget($target.find("#pager-viser"));
				self.showWidget($(self.callWidgetTarget('currentsearch')));
				self.showWidget($(self.callWidgetTarget('category')));
				//self.showWidget($(self.callWidgetTarget('viewpicker')));
				self.showWidget($(self.callWidgetTarget('sorter')));
				self.showWidget($(self.callWidgetTarget('pager')));				
				self.showWidget($(self.callWidgetTarget('teasers')));

				self.showWidget($target.find("#search-filters"));
								
				break;

			case "detail":										 

				self.callWidgetFn('details', 'removeAllRelated');
				
				$target.find("section.section--list").hide();
								
				$target.find("section.section--detail").show();
								
				self.hideWidget($target.find("#pager-viser"));
				self.hideWidget($target.find("#search-filters"));				
				self.hideWidget($(self.callWidgetTarget('currentsearch')));																			
				self.hideWidget($(self.callWidgetTarget('category')));
				//self.hideWidget($(self.callWidgetTarget('viewpicker')));
				self.hideWidget($(self.callWidgetTarget('sorter')));
				self.hideWidget($(self.callWidgetTarget('pager')));							
				self.hideWidget($(self.callWidgetTarget('teasers')));
				self.showWidget($(self.callWidgetTarget('details')));
				self.showWidget($(self.callWidgetTarget('details', 'thumbnails_subWidget')));
				self.showWidget($(self.callWidgetTarget('details', 'related_subWidget')));				

				$(self.callWidgetTarget('details', 'related_subWidget')).find('h3.heading--l').hide(); // we don't want to see the title of "relatedwidget" now (only after "afterrequest")
				$target.find('.view  #related-artworks .search-results .matrix').masonry('layout');

				break;		  
			} 	

			this.setLanguage(smkCommon.getCurrentLanguage());
			
			return;
		};

		this.categoryChanged = function (stateChange) {        	    
			var $target = $(this.target);			
			
			if (stateChange["category"] === undefined )
				return;			

			this.callWidgetFn('teasers', 'removeAllArticles');
			
			if(smkCommon.debugTime()) console.time("categoryChanged1");
			this.showWidget($(this.callWidgetTarget('teasers')));
			if(smkCommon.debugTime()) console.timeEnd("categoryChanged1");
			
			if(smkCommon.debugTime()) console.time("categoryChanged2");
			$(this.callWidgetTarget('teasers')).find('.matrix').addClass('full-width').hide();							
			this.showWidget($target.find("#search-filters"));
			for (var i = 0, l = Manager.searchfilterList.length; i < l; i++) {				
				if (this.callWidgetFn(Manager.searchfilterList[i].field, 'getRefresh'))					
					this.callWidgetFn(Manager.searchfilterList[i].field, 'hide_drop')
			};																				 

			if($(this.callWidgetTarget('teasers')).find('.matrix .matrix-tile').length > 0)
				$(this.callWidgetTarget('teasers')).find('.matrix').masonry('layout');

			if(smkCommon.debugTime()) console.timeEnd("categoryChanged2");
			
			return;
		};

		/*********
		 * PRIVATE FUNCTIONS
		 ********** */

		/*
		 * start general modal loading screen 
		 */
		this.start_modal_loading = function(){
			$(this.target).addClass("modal_loading"); 	  
		};

		/*
		 * stop general modal loading screen 
		 */
		this.stop_modal_loading = function(){	  
			$(this.target).removeClass("modal_loading"); 
			this.allWidgetProcessed = false;	  
		};

		/*
		 * start loading mode for a given widget.
		 * - only if widget's state is "active"
		 */
		this.add_modal_loading_to_widget = function(widget){
			if(this.isThisWidgetActive(widget))				
				$(this.callWidgetTarget(widget)).addClass('modal_loading');												
		};
		
		this.isThisWidgetActive = function(widget){			
			return this.callWidgetFn(widget, 'getRefresh');			
		};

		/*
		 * stop loading mode for a given widget.
		 */
		this.remove_modal_loading_from_widget = function(target){
			$(target).removeClass("modal_loading");

			if (this.allWidgetProcessed){
				if ($(this.target).find('.modal_loading').length == 0){
					// all widgets are loaded, we remove the general loading screen
					this.stop_modal_loading();					
					this.set_focus();
				}			  
			}
		};  	

		this.set_focus = function(){
			var self = this;
			$(document).ready(function () {
				$(self.callWidgetTarget('searchbox')).find('#search-bar').focus();
			});	  	  
		};		

		this.allWidgetsProcessed = function(){
			if ($(this.target).find('.modal_loading').length != 0){
				// there are still some widgets loading
				this.allWidgetProcessed = true;	
			}	else{
				// all widgets are loaded, we remove the general loading screen
				this.stop_modal_loading();
			}	  	  
		};

		this.showWidget = function($target){
			$target.removeClass('no_refresh');
			$target.show().children().not('.modal').show();	  	  
		};		
		
		this.hideWidget = function($target){
			$target.addClass('no_refresh');
			$target.hide();	  	  
		};
		
		this.highlightning = function(){
			// highlight search string in teasers
			var vArray = [].concat(Manager.store.get('q').value);
			if (undefined !== vArray && vArray.length > 0){    			
				var words = [];

				for (var i = 0, l = vArray.length; i < l; i++) {    				
					words = words.concat(vArray[i].trim().split(" "));    				
				};

				$(this.callWidgetTarget('teasers')).find('.matrix-tile-header').highlight(words);
			}    
		};
		
		this.generalSolrError = function(e){
			$(this.target).empty().html(sprintf('%s &nbsp;&nbsp; returned:&nbsp;&nbsp; %s<br>Please contact website administrator.', Manager.solrUrl, e)); 
		};
		
		this.setLanguage = function(lang){
			var setLang;
			
			switch(lang){
				case smkCommon.enum_lang.en:
					setLang = smkCommon.enum_lang.en;
					break;
				case smkCommon.enum_lang.dk:
					setLang = smkCommon.enum_lang.dk;
					break;
					
				default:
					setLang = smkCommon.enum_lang.def;											
			}			
			
			$(this.target).find("[lang][lang='"+setLang+"']").show();
			$(this.target).find("[lang][lang!='"+setLang+"']").hide();
		};
	}
}));
