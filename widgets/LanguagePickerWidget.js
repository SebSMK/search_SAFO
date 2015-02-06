(function ($) {

AjaxSolr.LanguagePickerWidget = AjaxSolr.AbstractWidget.extend({	  
  
 	init: function () {
    
	  var self = this;
	  var $target = $(this.target);		
	  var lg_en = ModelManager.get_lang() == smkCommon.enum_lang.en;
	  var lg_dk = ModelManager.get_lang() == smkCommon.enum_lang.dk;
	  var html = self.template_integration_json({lg_en:lg_en, lg_dk:lg_dk}, '#langpickerTemplate');
	  $target.html(html);	  	  	  
	  
	  $target.find('li.lang').click(function(e) {					
					if (!$(this).hasClass('active')){
						e.preventDefault();
						
						$(self.target).find('.active').removeClass('active');
						$(this).addClass('active');
						var lang = $(this).attr('lang');
						
						$(self).trigger({
							type: "smk_lang_changed",
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
