(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var getdatateasers = {};
		factory(getdatateasers);
		if (typeof define === "function" && define.amd) {
			define(getdatateasers); // AMD
		} else {
			root.getData_Teasers = getdatateasers; // <script>
		}
	}
}(this, function (getdatateasers) {

	getdatateasers.constructor = function(caller){

		this.getData = function (doc){
			var data;

			var data =  {

					url: this.getDetailUrl(doc.id), 
					
					media:{
						title: getData_Common.getTitle(doc, 'museum'),	
						alt: getData_Common.getMedia_alt(doc),
						image: getData_Common.getMedia_image(doc, this.caller),						
						copyright: getData_Common.getMedia_copyright(doc, this.caller),
						copyright_default: !smkCommon.computeCopyright(doc) && doc.medium_image_url !== undefined,
						copyright_valid: smkCommon.computeCopyright(doc),
						img_id:doc.id
					},
					
					info:{
						producent_kunster: getData_Common.getProducent_producent(doc, 'original'),																																
						title_museum: getData_Common.getTitle(doc, 'museum'),															
						datering_production_vaerkdatering: getData_Common.getProduction_vaerkdatering(doc),		
						ident_invnummer: getData_Common.getIdent_invnummer(doc),	
						location_location: getData_Common.getLocation_location(doc, this.caller),
						
						title_pad: smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, 'original')) ? false : true,
														
					}
			};	


			return data;

		};  				
		
		this.getDetailUrl = function(id){									
			var model = {};
			model.q = id;
			model.view = 'detail';

			return ModelManager.buildURLFromModel(model); 
		};
		
		this.getImage = function ($container, $target){

			var self = this.caller;

			if ($target === undefined || $target.length == 0){
				$(self).trigger({
					type: "smk_teasers_this_img_loaded"
				});  	
				return;
			}

			var img_id = $target.attr("img_id");
			var path = $target.attr("src");
			var alt = $target.attr("alt");
			var title = $target.attr("alt");

			//
			var img = new Image();

			// wrap our new image in jQuery, then:
			$(img)
			// once the image has loaded, execute this code
			.load(function () {
				// set the image hidden by default    
				$(this).hide();

				// with the holding div #loader, apply:
				$target
				// remove the loading class (so no background spinner), 
				.removeClass('image_loading')
				// then insert our image
				.find('a')
				// call detailed view on click on image
				.click(function (event) {
					event.preventDefault();	
					// ... then ---> bubbles op to "click on title"	    		
				})	
				.append(this);

				$(this).addClass('not_displayed');				

				// fade our image in to create a nice effect
				var duration = 400;
				$(this).fadeIn({
					duration: duration, 
					complete: function(){
						$(this).removeClass('not_displayed');
						// trig "this image is loaded" event	      
						$(self).trigger({
							type: "smk_teasers_this_img_displayed"
						}); 						
					}
				}
				);

				// trig "this image is loaded" event	      
				$(self).trigger({
					type: "smk_teasers_this_img_loaded"
				});  	    	  

			})

			// if there was an error loading the image, react accordingly
			.error(function () {
				$target
				// remove the loading class (so no background spinner), 
				.removeClass('image_loading')
				.find('a')	    	
				.append(sprintf('<img src="%s" />', self.default_picture_path));
				// call detailed view on click on image
				$target.find('a').click(function (event) {
					event.preventDefault();
					// ... then ---> bubbles op to "click on title"		    	
				});
				$target.fadeIn();

				// trig "this image is loaded" event	    	
				$(self).trigger({
					type: "smk_teasers_this_img_loaded"
				});  	    	  	     
			})	    	

			.attr('alt', alt)
			.attr('title', title)

			// *finally*, set the src attribute of the new image to our image
			.attr('src', path); 
		};

		/*
		 * variables
		 */
		this.caller = caller;
	}

}));