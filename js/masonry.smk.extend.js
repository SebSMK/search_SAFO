$.fn.masonryImagesReveal = function(msnry, $tiles, onComplete, caller, onClickLink, preloading) {	  

	if (caller.reset == true)	// avoid infinite loop when a new request is send while preloading is still running 
		return this;
	
	var itemSelector = msnry.options.itemSelector;
	// hide by default
	$tiles.hide();

	if(preloading == true){$tiles.each(function() {$(this).addClass('preloaded');})}	
	
	// append to container
	if(smkCommon.debugLog()) console.log(sprintf("scroll_request - masonryImagesReveal: append Tiles"));
	this.append( $tiles );
	
	$tiles.find('img').imagesLoaded().progress( function( imgLoad, image ) {
		
		if (caller.reset == true)	// avoid infinite loop when a new request is send while preloading is still running
			return this;
		
		// get item
		// image is imagesLoaded class, not <img>, <img> is image.img
		var $tile = $(image.img).parents( itemSelector );	 
		var $imgcontainer = $tile.find('.matrix-tile-image');	  		

		// add click on image
		$imgcontainer.click({detail_url: $imgcontainer.find('a').attr('href'), caller: caller}, 
				function (event) {onClickLink(event);}
		)

		// add click on title
		$tile.find('.artwork-title').click({detail_url: $tile.find('.artwork-title').attr('href'), caller: caller}, 
				function (event) {onClickLink(event);}
		)

		// add copyright info on image
		$imgcontainer.find('a').mouseenter(function (event) {$tile.find('span.copyright-info').css('opacity', 1);});
		$imgcontainer.find('a').mouseleave(function (event) {$tile.find('span.copyright-info').css('opacity', 0);});

		$(image.img).removeClass('image-loading');

		if(smkCommon.debugLog()) console.log(sprintf("scroll_request - masonryImagesReveal: removeClass('image-loading') - %s", $tile.attr("id")));
		
		// if all images are loaded, append to masonry
		if ($(msnry.element).find('img.image-loading').length == 0){	    		    	

			$tiles.each(function() {

				$(this).show();		    			    			    			    					    		
				msnry.appended(this);	
				//if(preloading != true)
				if(smkCommon.debugLog()) console.log(sprintf("scroll_request - masonryImagesReveal: %s", $(this).attr("id")));
			});			
			
//			msnry.on( 'layoutComplete', onComplete);
			msnry.layout();
			
			onComplete();
			
		}	    	
	});

	return this;
};