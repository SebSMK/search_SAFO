$.fn.masonryImagesReveal = function(msnry, $tiles, onComplete, caller, onClickLink, preloading) {	  

	if (caller.reset == true)	// avoid infinite loop when a new request is send while preloading is still running 
		return this;
	
	var itemSelector = msnry.options.itemSelector;
	// hide by default
	$tiles.hide();

	if(preloading == true){$tiles.each(function() {$(this).addClass('preloaded');})}	
	
	// append to container
	if(smkCommon.debugTime()) console.time(sprintf("scroll_request - masonryImagesReveal: append Tiles"));
		
	this.append( $tiles );
	if(smkCommon.debugTime()) console.timeEnd(sprintf("scroll_request - masonryImagesReveal: append Tiles"));
	
	if(smkCommon.debugTime()) console.time(sprintf("scroll_request - masonryImagesReveal: imagesLoaded"));
	if(smkCommon.debugLog()) console.log(sprintf(sprintf("scroll_request - masonryImagesReveal: scrollTop_%s", $(window).scrollTop() )));
	
	if($tiles.find('img').length == 0){
		$tiles.each(function() {
			$(this).show();		    			    			    			    					    		
			msnry.appended(this);						
		});			
		
		onComplete();
		
	}else{
		$tiles.find('img').each(function() {
			$(this).delay(10).imagesLoaded().progress( function( imgLoad, image ) {
				
				if(smkCommon.debugLog()) console.log(sprintf(sprintf("scroll_request - masonryImagesReveal - imagesLoaded: scrollTop_%s", $(window).scrollTop() )));
				
				if (caller.reset == true)	// avoid infinite loop when a new request is send while preloading is still running
					return this;
				
				$(image.img).removeClass('image-loading');
				
				// if all images are loaded, append to masonry
				if ($(msnry.element).find('img.image-loading').length == 0){	    		    									
					$tiles.each(function() {
						$(this).show();		    			    			    			    					    		
						msnry.appended(this);						
					});			
					
					onComplete();				
					
				}	    	
			});	
			
		});		
	}	
	
	
	if(smkCommon.debugTime()) console.timeEnd(sprintf("scroll_request - masonryImagesReveal: imagesLoaded"));
	
	return this;
};