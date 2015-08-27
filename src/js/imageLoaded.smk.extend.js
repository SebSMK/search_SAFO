$.fn.imagesLoadedReveal = function($tiles, onAllImagesLoaded, caller, onClickLink) {	  

	if (caller.reset == true)	// avoid infinite loop when a new request is send while preloading is still running 
		return this;

	$tiles.each(function() {
		var $tile = $(this);

		// if tile in the viewport, load image
		if(smkCommon.isElemIntoView($tile)){
			// add image					
			var $imgcontainer = $tile.find('.matrix-tile-image');																			
			$tile.find('a').click({detail_url: $tile.find('a').attr('href'), caller: caller}, 
					function (event) {caller.onClickLink(event);}
			);					

			if(!$imgcontainer.hasClass('matrix-tile-image-missing')){
				var dataHandler = new getData_Teasers.constructor(caller);
				var img = dataHandler.getImage($imgcontainer);				
				$imgcontainer.prepend($(img));
				$imgcontainer.find('img').addClass('image-loading');				
			}		
		}								
	});	
	
	$tiles.each(function() {
		var $tile = $(this);
		$tile.imagesLoaded().progress( function( imgLoad, image ) {
			if (caller.reset == true)	// avoid infinite loop when a new request is send while preloading is still running
				return this;

			$(image.img).removeClass('image-loading');	

			// when images are loaded, trigger callback
			if ($(caller.target).find('img.image-loading').length == 0)
				onAllImagesLoaded();												
		});		
	});		

	return this;
};