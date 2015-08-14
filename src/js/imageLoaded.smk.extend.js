$.fn.imagesLoadedReveal = function($tiles, onComplete, caller, onClickLink, preloading) {	  

	if (caller.reset == true)	// avoid infinite loop when a new request is send while preloading is still running 
		return this;
	
//	var itemSelector = msnry.options.itemSelector;
	// hide by default
	$tiles.hide();

//	var i = 0;
//	if(preloading == true){$tiles.each(function() {
//		$(this).addClass('preloaded');
//		i++;
//	})};			
	
//	if(smkCommon.debugLog()) console.log(sprintf("scroll_request - imagesLoadedReveal: preloaded_proceeded_%s", i));
	
	// append to container
	if(smkCommon.debugTime()) console.time(sprintf("scroll_request - imagesLoadedReveal: append Tiles"));
		
	this.append( $tiles );
	if(smkCommon.debugTime()) console.timeEnd(sprintf("scroll_request - imagesLoadedReveal: append Tiles"));
	
	if(smkCommon.debugTime()) console.time(sprintf("scroll_request - imagesLoadedReveal: imagesLoaded"));
	if(smkCommon.debugLog()) console.log(sprintf(sprintf("scroll_request - imagesLoadedReveal: scrollTop_%s", $(window).scrollTop() )));
	
	if($tiles.find('img').length == 0){
		$tiles.each(function() {
			$(this).show();		    			    			    			    					    		
//			msnry.appended(this);						
		});			
		
		onComplete();
		
	}else{		
		$tiles.find('img').each(function() {
			$(this).delay(10).imagesLoaded().progress( function( imgLoad, image ) {
				
				if(smkCommon.debugLog()) console.log(sprintf(sprintf("imagesLoadedReveal - imagesLoaded: %s", $(image.img).closest('.matrix-tile').attr('id'))));
				
				if (caller.reset == true)	// avoid infinite loop when a new request is send while preloading is still running
					return this;
				
				$(image.img).removeClass('image-loading');													
				
				// when images are loaded, show them
				if ($(caller.target).find('img.image-loading').length == 0){	    		    									
					$tiles.each(function() {												
						$(this).show();		    			    			    			    					    		
						//msnry.appended(this);						
						
						if(!smkCommon.isElemIntoView($(this)))
							$(this).addClass('preloaded');
					});			
										
					if(smkCommon.debugLog()) console.log(sprintf("scroll_request - imagesLoadedReveal: preloaded_added_%s", $('.preloaded').length));
					
					onComplete();				
					
				}	    	
			});	
			
		});		
	}	
	
	
	if(smkCommon.debugTime()) console.timeEnd(sprintf("scroll_request - imagesLoadedReveal: imagesLoaded"));
	
	return this;
};