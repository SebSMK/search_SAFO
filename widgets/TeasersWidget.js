(function ($) {

	AjaxSolr.TeasersWidget = AjaxSolr.AbstractWidget.extend({  

		start: 0,		  

		default_picture_path: null, 

		teaser_article_class: null, // current article visualization classes	

		init: function(){

			var self = this;
			var $target = $(this.target);		

			//* load empty template
			var html = self.template;     
			$target.html($(html).find('#teaserInitTemplate').html());		

			//$target.find('.matrix .matrix-tile').hide();

			//* init masonry
			$target.find('.matrix').masonry( {
				itemSelector: '.matrix-tile',
				transitionDuration: 0
			});

			this.default_picture_path = smkCommon.getDefaultPicture('medium');      
			this.teaser_article_class = $target.find('.matrix .matrix-tile').attr('class');	

		},  

		afterRequest: function () {  
			var self = this;
			var $target = $(this.target);

			if (!self.getRefresh()){
				self.setRefresh(true);
				return;
			}	 		  

			if(smkCommon.debugTime()) console.time("Teasers");
			
			//* remove all articles
			self.removeAllArticles();		

			//* in case there are no results, we create an empty-invisible article - but with the correct visualization class
			//* ...and send "teaser loaded" event
			if (this.manager.response.response.docs.length == 0){
				var html = self.template_integration_json({"artworks": {}}, '#teaserArticleTemplate');     
				var $article = $(html);	      
				//* load current article visualization classes
				$article.removeClass().addClass(self.teaser_article_class);	      
				$target.find('.matrix').append($article);	      	        
				$target.find('.matrix').masonry('appended', $article);	 
				$target.find('.image_loading').removeClass('image_loading').hide();

				// trig "this image is loaded" event	      
				$(self).trigger({
					type: "smk_teasers_all_images_loaded"
				});				

				return;		
			}
			else{
				//* load data
				var artwork_data = null;		
				var dataHandler = new getData_Teasers.constructor(this);

				for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
					var doc = this.manager.response.response.docs[i];	      	      	      

					//* load data for this artwork		      
					artwork_data = dataHandler.getData(doc);	      	      

					//* merge data and template
					var html = self.template_integration_json({"artworks": artwork_data}, '#teaserArticleTemplate');     
					var $article = $(html);

					//* load current article visualization classes
					$article.removeClass().addClass(self.teaser_article_class);		      				

					//* append the current article to list
					$target.find('.matrix').append($article);	      

					//* refresh masonry
					$target.find('.matrix').masonry('appended', $article);																				
				}						

				//* add image + link on div to all articles
				$target.find('.matrix-tile').each(function() { 
					
					var $tile = $(this);
										
					// add image					
					var $imgcontainer = $tile.find('.matrix-tile-image');
					
					var onLoaded = function(){						
						$target.find('.matrix').masonry('layout');
						$imgcontainer.removeClass('image_loading');
						// are there still images loading in Teaser?
						if($target.find('.image_loading').length == 0){
							// all images loaded, trigger event							
							$(self).trigger({
								type: "smk_teasers_all_images_loaded"
							});															
						}						
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
		},

		removeAllArticles: function(){
			var $target = $(this.target); 
			var $all_articles = $target.find('.matrix .matrix-tile');

			if($all_articles.length > 0 ){
				//* save current visualization class
				this.teaser_article_class = $target.find('.matrix .matrix-tile').attr('class');
				$target.find('.matrix').masonry('remove', $all_articles);		
			};		  
		}
	});

})(jQuery);