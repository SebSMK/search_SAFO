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

			$target.find('.search-results .matrix .matrix-tile').hide();

			//* init masonry
			$target.find('.search-results .matrix').masonry( {
				transitionDuration: 0
			});

			this.default_picture_path = smkCommon.getDefaultPicture('medium');      
			this.teaser_article_class = $target.find('.search-results .matrix .matrix-tile').attr('class');	

		},  

		afterRequest: function () {  
			var self = this;
			var $target = $(this.target);

			if (!self.getRefresh()){
				self.setRefresh(true);
				return;
			}	 		  

			//* remove all articles
			self.removeAllArticles();		

			//* in case there are no results, we create an empty-invisible article - but with the correct visualization class
			//* ...and send "teaser loaded" event
			if (this.manager.response.response.docs.length == 0){
				var html = self.template_integration_json({"artworks": {}}, '#teaserArticleTemplate');     
				var $article = $(html);	      
				//* load current article visualization classes
				$article.removeClass().addClass(self.teaser_article_class);	      
				$target.find('.search-results .matrix').append($article);	      	        
				$target.find('.search-results .matrix').masonry('appended', $article);	 
				$target.find('.image_loading').removeClass('image_loading').hide();

				// trig "this image is loaded" event	      
				$(self).trigger({
					type: "smk_teasers_this_img_loaded"
				});
				$(self).trigger({
					type: "smk_teasers_this_img_displayed"
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

					//* if the current article is an artwork, add a link to detail on click on title
					$article.find('.article_artwork')
					.click({detail_id: artwork_data.media.img_id, caller:this}, 
							function (event) {
						event.preventDefault();
						$(event.data.caller).trigger({
							type: "smk_search_call_detail",
							detail_id: event.data.detail_id,
							save_current_request: true
						});

						return;
					})						

					//* append the current article to list
					$target.find('.search-results .matrix').append($article);	      

					//* refresh masonry
					$target.find('.search-results .matrix').masonry('appended', $article);	      
				}						

				//* add image + link to detail on click on image to all articles
				$target.find('.matrix-tile').each(function() {    	    	
					dataHandler.getImage($(this), $(this).find('.image_loading'));
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
			var $all_articles = $target.find('.search-results .matrix .matrix-tile');

			if($all_articles.length > 0 ){
				//* save current visualization class
				this.teaser_article_class = $target.find('.search-results .matrix .matrix-tile').attr('class');
				$target.find('.search-results .matrix').masonry('remove', $all_articles);		
			};		  
		}
	});

})(jQuery);