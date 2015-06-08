(function ($) {

	AjaxSolr.DateRangeWidget = AjaxSolr.AbstractFacetWidget.extend({	  

		init: function () {

			var self = this;
			var $target = $(this.target);		  		  
			var html = self.template_integration_json({}, '#daterangeTemplate');
			$target.html(html);	  	  	  			

			// user validates a search string (lower priority than dropdown list)
			$(self.target).find('form').submit(function (e) {				
				event.preventDefault();
				$(self).trigger({
					type: "smk_search_filter_changed",
					params: {date_range: self.format_request(self)}					
				});											
			});
		},

		beforeRequest: function () {
//			$(this.target).find('label').html('<i></i>' + smkCommon.firstCapital(this.manager.translator.getLabel('checkbox_hasimage')));						
//			$(this.target).find('input').prop('checked', ModelManager.get_hasimage());
		},

		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		},
		
		format_request: function(self){			
			var res = {};
			var date_format = '%s-01-01T00:00:00.001Z';	
			var req_late_format = sprintf('%s:[%%s TO *]', self.field.late);
			var req_earl_format = sprintf('%s:[* TO %%s]', self.field.earl);
			
			var max = $(self.target).find('[name=latest]').val();
			max = smkCommon.isValidDataText(max) ? sprintf(req_earl_format, sprintf(date_format, max)) : null;						
			res[self.field.earl] = max;
		
			var min = $(self.target).find('[name=earliest]').val();
			min = smkCommon.isValidDataText(min) ? sprintf(req_late_format, sprintf(date_format, min)) : null;
			res[self.field.late] = min;
			
			return res;
		}
	});

})(jQuery);
