$.fn.masonryImagesReveal = function(msnry, $tiles, onComplete, caller, onClickLink, preloading) {	  
	  var itemSelector = msnry.options.itemSelector;
	  // hide by default
	  $tiles.hide();
			  
	  // append to container
	  this.append( $tiles );
	  $tiles.find('img').imagesLoaded().progress( function( imgLoad, image ) {
	    // get item
	    // image is imagesLoaded class, not <img>, <img> is image.img
	    var $tile = $(image.img).parents( itemSelector );	 
		var $imgcontainer = $tile.find('.matrix-tile-image');
	   
		if(preloading == true) 
			$tile.addClass('preloaded');
		
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
	    
	    // if all images are loaded, append to masonry
	    if ($(msnry.element).find('img.image-loading').length == 0){	    		    	
		        		    	
	    	$tiles.each(function() {
	    		// show tile
	    		$(this).show();	
	    		//if(!$(this).hasClass('preloaded'))	    			    					    		
		    		msnry.appended(this);	    			    			
	    	}); 	    	
	    	msnry.on( 'layoutComplete', onComplete);
	    	msnry.layout();
	    }	    	
	  });
	  
	  return this;
};