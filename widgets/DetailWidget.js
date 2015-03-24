(function ($) {

	AjaxSolr.DetailWidget = AjaxSolr.AbstractWidget.extend({

		constructor: function (attributes) {
			AjaxSolr.DetailWidget.__super__.constructor.apply(this, arguments);
			AjaxSolr.extend(this, {
				thumbnailsManager:null,
				thumbnails_subWidget:null,
				relatedManager: null,
				related_subWidget: null,
				originalManager: null,
				original_subWidget: null
			}, attributes);
		},	

		start: 0,

		current_language: null,

		default_picture_path: null, 

		init: function(){	  	    
			var self = this;

			self.default_picture_path = smkCommon.getDefaultPicture('large');
			self.current_language = self.manager.translator.getLanguage();

		}, 

		afterRequest: function () {	  

			var self = this;		
			var $target = $(this.target);

			if (!self.getRefresh()){
				self.setRefresh(true);
				return;
			}	

			$target.empty();

			// in case there are no results
			if (this.manager.response.response.docs.length == 0){
				$target
				// remove the loading class (so the ViewManager can remove background spinner), 
				.removeClass('image_loading')
				.html(this.manager.translator.getLabel("no_results"))	
				// trig "this image is loaded" event	      
				$(self).trigger({
					type: "smk_detail_this_img_loaded"
				});
				return;		
			}			

			var artwork_data = null;
			var dataHandler = new getData_Detail.constructor(this);			

			for (var i = 0, l = this.manager.response.response.docs.length; i < l ; i++) {
				var doc = this.manager.response.response.docs[i]; 												
				artwork_data = dataHandler.get_data(doc);  
			}

			//* merge data and template
			var html = self.template_integration_json({"detail": artwork_data}, '#detailTemplate'); 
			var $html = $(html);
			
			// add image					
			var $imgcontainer = $html.find('.gallery__main');												
			var img = dataHandler.getImage($imgcontainer);				
			$imgcontainer.prepend($(img));
			$imgcontainer.find('img').addClass('image-loading');			

			$imgcontainer.find('img').imagesLoaded().progress( function( imgLoad, image ) {
  						
				// add copyright info on image
				$(image.img).mouseenter(function (event) {
					$html.find('span.copyright-info').css('opacity', 1);}
				);
				$(image.img).mouseleave(function (event) {$html.find('span.copyright-info').css('opacity', 0);});

				$(image.img).removeClass('image-loading');					
				
				//* add data to template
				$target.prepend($html); 				

				//* send loaded event
				$(self).trigger({
					type: "smk_detail_this_img_loaded"
				});
			});	    	
		},  

		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		},		
	});

})(jQuery);