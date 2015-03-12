(function ($) {

	AjaxSolr.ScrollWidget = AjaxSolr.AbstractWidget.extend({  		

		default_picture_path: null, 

		init: function(){		
			this.default_picture_path = smkCommon.getDefaultPicture('medium');      	
		},  

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
				//* load data
				var artwork_data = null;		
				var dataHandler = new getData_Teasers.constructor(this);
				var proceeded = false;

				for (var i = 0, l = self.manager.response.response.docs.length ; i < l; i++) {
					var doc = self.manager.response.response.docs[i];	      	      	       															

					//* load data for this artwork		      
					artwork_data = dataHandler.getData(doc);	      	      

					//* merge data and template
					var html = self.template_integration_json({"artworks": artwork_data}, '#teaserArticleTemplate');     
					var $article = $(html); 

					$article.addClass('scroll_add');   
					
					//* append the current article to list
					$target.find('.matrix').append($article);	      

					//* append to masonry
					$target.find('.matrix').masonry('appended', $article);	  											
				}
				
				//* add image + link on div to all articles
				$target.find('.matrix-tile.scroll_add').each(function() { 
					
					var $tile = $(this);
										
					// add image					
					var $imgcontainer = $tile.find('.matrix-tile-image');
					
					var onLoaded = function(){						
						$target.find('.matrix').masonry('layout');
						//$tile.removeClass('scroll_add');
						$imgcontainer.removeClass('image_loading');						
						// image loaded, trigger event							
						$(self).trigger({
							type: "smk_scroll_all_images_loaded"
						});															
					};
					var img = dataHandler.getItem($imgcontainer);
					$imgcontainer.prepend( $(img) );
					
					$imgcontainer.imagesLoaded().always(onLoaded);
					
					// add click on image
					$imgcontainer.click({detail_url: $imgcontainer.find('a').attr('href'), caller: self}, 
						function (event) {dataHandler.addLink(event);}
					)

					// add click on title
					$(this).find('.artwork-title').click({detail_url: $tile.find('.artwork-title').attr('href'), caller: self}, 
						function (event) {dataHandler.addLink(event);}
					)
					
					// add copyright info on image
					$imgcontainer.find('a').mouseenter({caller: this},
						function (event) {$tile.find('span.copyright-info').css('opacity', 1);}
					)
					$imgcontainer.find('a').mouseleave({caller: this},
						function (event) {$tile.find('span.copyright-info').css('opacity', 0);}
					)
				});	                   										
			}
		}, 		

		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		}
	});

})(jQuery);