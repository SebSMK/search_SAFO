(function ($) {

	AjaxSolr.TeasersWidget = AjaxSolr.AbstractWidget.extend({  

		constructor: function (attributes) {
			AjaxSolr.AbstractWidget.__super__.constructor.apply(this, arguments);
			AjaxSolr.extend(this, {
				initTemplate:null
			}, attributes);
		},

		start: 0,				
		
		scrollUpdateWidget: null,

		sub_scrollWidget: null,

		init: function(){

			var self = this;
			var $target = $(this.target);	

			//* load empty template
			var html = self.template;     
			$target.html($(html).find(this.initTemplate).html());

			//* init masonry*/	
			var $matrix = $target.find('.matrix');
			$matrix.masonry( {
				itemSelector: '.matrix-tile',
				columnWidth: '.matrix-tile-size'
			});			

			//* init sub widget (managed by scrollUpdateWidget)
			self.sub_scrollWidget = new AjaxSolr.ScrollWidget({
				id: 'sub_scroll_teasers',
				target: self.target,
				template: self.template
			});
			
			var offset = parseInt(self.manager.store.get('start').val()) + parseInt(self.manager.store.get('rows').val());
			//* init scrollUpdateWidget
			self.scrollUpdateWidget = new AjaxSolr.ScrollUpdateManagerWidget({
				id: 'scroll_update',
				scrollManager: self.scrollManager, 
				scroll_subWidget: self.sub_scrollWidget,
				start_offset: offset,
				mainManager: this.manager
			});

			//* events management	
			$(self.scrollUpdateWidget).on('smk_search_call_detail', function(event){     	
				$(self).trigger({
					type: "smk_search_call_detail",
					detail_url: event.detail_url 
				});
			});						

			// scroll has finished loading images
			$(self.scrollUpdateWidget).on('smk_scroll_all_images_displayed', function(event){     	            					
				self.refreshLayout();

				// once images are loaded, start preloading request
				// (but preloading will start only under a given thresold of remaining number of preloaded images)
				self.scrollUpdateWidget.start_scroll_preload_request(true);
			});

			self.scrollUpdateWidget.init();

			$(document).ready(function() {
				$(window).scroll(function(event){
					if (self.getRefresh() && $(self.target).offset().top > 0)
						self.scrollUpdateWidget.scrollStart(event);
				});								
			});	  	
		},  

		afterRequest: function () {  
			var self = this;
			var $target = $(this.target);
			var $matrix = $target.find('.matrix');

			if (!self.getRefresh()){
				self.setRefresh(true);
				return;
			}	 		  						

			if(smkCommon.debugTime()) console.time("Teasers");									

			if (this.manager.response.response.docs.length == 0){
				// trig "is loaded" event	      
				$(self).trigger({
					type: "smk_teasers_all_images_loaded"
				});				
				return;		
			}
			else{																														
				var $tiles = this.getTiles();					
				var container = document.querySelector($matrix.selector);
				var msnry = Masonry.data(container);
				$(msnry.element).masonryImagesReveal(msnry, $tiles,  $.proxy(this.onComplete, self), self, this.onClickLink);				
			}	   
		}, 	

		beforeRequest: function(){
			this.scrollUpdateWidget.beforeRequest();						
		},

		removeAllArticles: function(){
			var self = this;
			var $target = $(this.target); 
			var $all_articles = $target.find('.matrix .matrix-tile');

			if($all_articles.length > 0 ){
				$target.find('.matrix').masonry('remove', $all_articles);
				//$target.find('.matrix').masonry('destroy');
				self.refreshLayout();
			};

			// in case of some articles were in the matrix but not yet in masonry, remove it "manually"
			//$target.empty();

			$all_articles.remove();
		},			

		refreshLayout: function(){
			$(this.target).find('.matrix').masonry('layout');
			this.highlightning();
		},

		/*
		 * EVENTS
		 * **/
		// all images are loaded in teaser
		onComplete: function onComplete() {	
			var $tiles = $(this.target).find('.matrix-tile');
			var self = this;

			//* add click on image / title + hover on copyright
			$tiles.each(function() {
				var $tile = $(this);

				// image
				$tile.find('a').click({detail_url: $tile.find('a').attr('href'), caller: self}, 
						function (event) {self.onClickLink(event);}
				);

				// title
				$tile.find('.artwork-title').click({detail_url: $tile.find('.artwork-title').attr('href'), caller: self}, 
						function (event) {self.onClickLink(event);}
				);								 					  						

				// copyright
				var $imgcontainer = $tile.find('.matrix-tile-image').not('.matrix-tile-image-missing');
				if($imgcontainer.length > 0){
					$imgcontainer.find('a').mouseenter(function (event) {$tile.find('span.copyright-info').css('opacity', 1);});
					$imgcontainer.find('a').mouseleave(function (event) {$tile.find('span.copyright-info').css('opacity', 0);});
				}				
			});						

			self.refreshLayout();						

			$(this).trigger({
				type: "smk_teasers_all_images_loaded"
			});	

			//* once images are loaded in teaser, start preloading request			
			self.scrollUpdateWidget.start_scroll_preload_request(true);

			return true;
		},

		onClickLink: function (event) {
			event.preventDefault();
			$(event.data.caller).trigger({
				type: "smk_search_call_detail",
				detail_url: event.data.detail_url 
			});

			return;
		},		

		/*
		 * PRIVATE FUNCTIONS
		 * **/
		getTiles: function(){			
			var artwork_data = null;		
			var dataHandler = new getData_Teasers.constructor(this);				
			var tiles = new String();													

			for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
				var doc = this.manager.response.response.docs[i];	      	      	      

				//* load data for this artwork		      
				artwork_data = dataHandler.getData(doc);	      	      

				//* merge data and template
				var $tile = $(this.template_integration_json({"artworks": artwork_data}, '#teaserArticleTemplate'));

				// add image					
				var $imgcontainer = $tile.find('.matrix-tile-image');												
				if(!$imgcontainer.hasClass('matrix-tile-image-missing')){
					var img = dataHandler.getImage($imgcontainer);				
					$imgcontainer.prepend($(img));
					$imgcontainer.find('img').addClass('image-loading');
				}				

				tiles += $tile[0].outerHTML;										
			}									

			return $(tiles);

		},				

		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		},

		highlightning: function(){
			// highlight search string
			var vArray = [].concat(Manager.store.get('q').value);
			if (undefined !== vArray && vArray.length > 0){    			
				var words = [];

				for (var i = 0, l = vArray.length; i < l; i++) {    				
					words = words.concat(vArray[i].trim().replace('*', "").split(" "));    				
				};

				$(this.target).find('.matrix-tile-header').highlight(words);
				$(this.target).find('.matrix-tile-meta').highlight(words);
			}    
		}
	});

})(jQuery);