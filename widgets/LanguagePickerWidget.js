(function ($) {

AjaxSolr.LanguagePickerWidget = AjaxSolr.AbstractWidget.extend({	  
  
 	init: function () {
    
	  var self = this;
	  var $target = $(this.target);		  		  
	  var html = self.template_integration_json({}, '#langpickerTemplate');
	  $target.html(html);	  	  	  
	  
	  $target.find('li.lang').click(function(e) {					
					if (!$(this).hasClass('active')){
						e.preventDefault();
						$(self.target).find('.active').removeClass('active');
						$(this).addClass('active');
						var lang = $(this).find('a').text();
						$(self).trigger({
							type: "lang_picker",
							value: lang
						 });
					}
							
					return false;
				});
	  
	  
//	  $target.mouseout(function() {
//		$target.find('label').removeAttr( 'data-tip' );
//	  });

  },
  
  template_integration_json: function (json_data, templ_id){	  
		var template = this.template; 	
		var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
		return html;
  },
  
});

})(jQuery);
