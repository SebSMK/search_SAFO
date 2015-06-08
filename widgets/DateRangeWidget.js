(function ($) {

	AjaxSolr.DateRangeWidget = AjaxSolr.AbstractFacetWidget.extend({	  

		beforeRequest: function () {

			var self = this;
			var $target = $(this.target);		  		  
			var html = self.template_integration_json({label: this.manager.translator.getLabel('daterange_label') ,
														from: smkCommon.firstCapital(this.manager.translator.getLabel('daterange_from')),
														to: smkCommon.firstCapital(this.manager.translator.getLabel('daterange_to')),
														show: smkCommon.firstCapital(this.manager.translator.getLabel('daterange_show'))}, '#daterangeTemplate');
			$target.html(html);	  	  	  			

			$(self.target).find('form').submit(function (e) {				
				event.preventDefault();
				$(self).trigger({
					type: "smk_search_filter_changed",
					params: {date_range: self.format_request(self)}					
				});											
			});
			
			this.update_filters();
		},
		
		update_filters: function(){
			var self = this;
			var facets = ModelManager.get_facets_lab_for_search_component();

			// add current filters 
			if (facets !== undefined){	
				for (var i = 0, l = facets.length; i < l; i++) {					
					$.each(self.field, function( key, value ){
						if(facets[i].id == key){
							var date = facets[i].text.match(/\[(.*)-01-01T00:00:00.001Z TO/);
							if(smkCommon.isValidDataText(date))
								$(self.target).find('[name='+ key +']').val(date[1]);
							
							date = facets[i].text.match(/TO (.*)-01-01T00:00:00.001Z\]/);
							if(smkCommon.isValidDataText(date))
								$(self.target).find('[name='+ key +']').val(date[1]);
						}
					});											
				}
			}			
		},

		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		},
		
		format_request: function(self){			
			var res = {};
			var date_format = '%s-01-01T00:00:00.001Z';	
			var sup = sprintf('%s:[%%s TO *]', self.field.acq_date_earliest);
			var inf = sprintf('%s:[* TO %%s]', self.field.acq_date_latest);
			
			var max = $(self.target).find('[name=acq_date_latest]').val();
			max = smkCommon.isValidDataText(max) ? sprintf(sup, sprintf(date_format, max)) : null;						
			res[self.field.acq_date_earliest] = max;
		
			var min = $(self.target).find('[name=acq_date_earliest]').val();
			min = smkCommon.isValidDataText(min) ? sprintf(inf, sprintf(date_format, min)) : null;
			res[self.field.acq_date_latest] = min;
			
			return res;
		}
	});

})(jQuery);
