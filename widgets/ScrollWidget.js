(function ($) {

	AjaxSolr.ScrollWidget = AjaxSolr.AbstractWidget.extend({  

		constructor: function (attributes) {
			AjaxSolr.AbstractWidget.__super__.constructor.apply(this, arguments);
			AjaxSolr.extend(this, {
				on_picture_click_fct: null
			}, attributes);
		},	

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

					//* add a link to article
					if(self.on_picture_click_fct != null)
						self.on_picture_click_fct($article, doc);				

					//dataHandler.getImage($article, $article.find('.image_loading'));

//					//* append the current article to list
					$target.find('.search-results .matrix').append($article);	      

					//* append to masonry
					$target.find('.search-results .matrix').masonry('appended', $article);	  											
				}
        
        //* add image to all articles
        $target.find('.matrix-tile.scroll_add').each(function() {
          dataHandler.getImage($(this), $(this).find('.image_loading'));
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