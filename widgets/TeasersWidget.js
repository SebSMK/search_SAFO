(function ($) {

	AjaxSolr.TeasersWidget = AjaxSolr.AbstractWidget.extend({  

		constructor: function (attributes) {
			AjaxSolr.AbstractWidget.__super__.constructor.apply(this, arguments);
			AjaxSolr.extend(this, {
				initTemplate:null
			}, attributes);
		},
		
		
		start: 0,		   	

		init: function(){

			var self = this;
			var $target = $(this.target);	
			
			//* load empty template
			var html = self.template;     
			$target.html($(html).find(this.initTemplate).html());																				      	

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
				//* init masonry*/	
				//var $matrix = $target.find('.matrix');
				$matrix.masonry( {
					itemSelector: '.matrix-tile',
					columnWidth: '.matrix-tile-size'
				});
				var container = document.querySelector($matrix.selector);
				var msnry = Masonry.data(container);
				$(msnry.element).masonryImagesReveal(msnry, $tiles,  $.proxy(this.onComplete, self), self, this.onClickLink);				
			}	   
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
			
			$(this).trigger({
				type: "smk_teasers_all_images_loaded"
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
				
		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		},

		removeAllArticles: function(){
			
			var $target = $(this.target); 
			var $all_articles = $target.find('.matrix .matrix-tile');
			
			if($all_articles.length > 0 ){
				$target.find('.matrix').masonry('remove', $all_articles);
				$target.find('.matrix').masonry('destroy');
			};
			
			// in case of some articles were in the matrix but not yet in masonry, remove it "manually"
			//$target.empty();
			
			$all_articles.remove();
		}

	});

})(jQuery);
