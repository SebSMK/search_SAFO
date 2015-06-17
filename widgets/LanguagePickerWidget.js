(function ($) {

	AjaxSolr.LanguagePickerWidget = AjaxSolr.AbstractWidget.extend({	  

		init: function () {

			var self = this;
			var $target = $(this.target);		
			var html = self.template_integration_json({}, '#langpickerTemplate');
			$target.html(html);	  	  	  

			this.set_language();

			$target.find('li.lang').click(function(e) {					
				if (!$(this).hasClass('active')){
					e.preventDefault();

					$(self.target).find('.active').removeClass('active');
					$(this).addClass('active');
					var lang = $(this).attr('lang_radio');

					$(self).trigger({
						type: "smk_lang_changed",
						value: lang
					});
				}

				return false;
			});
		},

		beforeRequest: function () {
			this.set_language();			
		},

		set_language: function(){
			$(this.target).find('li.lang[lang_radio!=' + ModelManager.get_lang() + ']')
			.removeClass('active');
			$(this.target).find('li.lang[lang_radio=' + ModelManager.get_lang() + ']')
			.addClass('active');						
		},

		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		}

	});

})(jQuery);
