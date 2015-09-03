$.fn.imagesLoadedReveal = function($tiles, onAllImagesLoaded, caller, onClickLink) {	  

	if (caller.reset == true)	// avoid infinite loop when a new request is send while preloading is still running 
		return this;
	
	if($tiles.find('img').length == 0){
	// there are no images to load on the given tiles
		onAllImagesLoaded();
	}else{
		$tiles.each(function() {
			var $tile = $(this);
			$tile.imagesLoaded().progress( function( imgLoad, image ) {
				if (caller.reset == true)	// avoid infinite loop when a new request is send while preloading is still running
					return this;

				$(image.img).closest('.image-loading').removeClass('image-loading');
				
				if (image.isLoaded) // check if link is broken or not
					$(image.img).css('opacity', 1);

				// when images are loaded, trigger callback
				if ($(caller.target).find('.image-loading').length == 0)
					onAllImagesLoaded();												
			});		
		});		

	}
	
	return this;
};