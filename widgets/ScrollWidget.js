(function ($) {

	AjaxSolr.ScrollWidget = AjaxSolr.AbstractWidget.extend({  				

		/*
		 * PUBLIC FUNCTIONS
		 * **/					
		
		afterRequest: function () {  
			var self = this;
			var $target = $(this.target);

			if (!self.getRefresh()){
				self.setRefresh(true);
				return;
			}	 		  

			if (this.manager.response.response.docs.length == 0){ 
				$target.find('.image_loading').removeClass('image_loading').hide();

				$(self).trigger({
					type: "smk_scroll_no_more_results"
				});
				return;		
			}
			else{
				if(smkCommon.debugLog()) console.log(sprintf("scroll_request - afterRequest: isPreloading_%s", this.preloading));
				//* load data				
				var $matrix = $target.find('.matrix');
				var container = document.querySelector($matrix.selector);
				var msnry = Masonry.data(container);			
				
				if(smkCommon.debugLog()) console.log(sprintf(sprintf("scroll_request - afterRequest: scrollTop_%s", $(window).scrollTop() )));
				var $tiles = this.getTiles();
				if(smkCommon.debugLog()) console.log(sprintf("scroll_request - afterRequest: getTiles"));
				this.setReset(false);
				$(msnry.element).masonryImagesReveal(msnry, $tiles,  $.proxy(this.onAllImagesLoaded, self), self, this.onClickLink, this.preloading);
				if(smkCommon.debugLog()) console.log(sprintf("scroll_request - afterRequest: masonryImagesReveal"));
			}
		}, 
				
		isPreloading: function(bool){
			this.preloading = bool == true ? true : false; 			
		},
		
		setReset: function(bool){
			this.reset = bool == true ? true : false;
		},

		/*
		 * EVENTS
		 * **/
		
		onAllImagesLoaded: function onComplete() {	
			var $tiles = $(this.target).find('.matrix-tile.scroll_add');
			var self = this;

			//* add click on image + title + hover on copyright
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
			
			if(smkCommon.debugLog()) console.log(sprintf("scroll_request - onComplete: isPreloading_%s", this.preloading));
			$(this).trigger({
				type: this.preloading == true ? "smk_scroll_all_images_preloaded" :  "smk_scroll_all_images_loaded"
			});	
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
		
		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		}, 	
		
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
				$tile.addClass('scroll_add');
				
				// add image					
				var $imgcontainer = $tile.find('.matrix-tile-image');												
				if(!$imgcontainer.hasClass('matrix-tile-image-missing')){
					var img = dataHandler.getImage($imgcontainer);				
					$imgcontainer.prepend( $(img) );
					$imgcontainer.find('img').addClass('image-loading');
				}
								
				tiles += $tile[0].outerHTML;										
			}									
			
			return $(tiles);
			
		},						
		
		/*
		 * PRIVATE VARIABLES
		 * **/		
		
		preloading: false,
		
		reset: false,
	});

})(jQuery);