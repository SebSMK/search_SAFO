(function ($) {

	AjaxSolr.SearchBoxAutoWidget = AjaxSolr.AbstractTextWidget.extend({

	init: function () {						
		var self = this;
		var $target = $(this.target);		  
		var json_data = {"default_text" : this.manager.translator.getLabel("search_box_default"), 'search': this.manager.translator.getLabel("search_box_button")};	 
		var html = self.template_integration_json(json_data, '#searchboxTemplate');		  
		$target.html(html);		
	},		

    template_integration_json: function (json_data, templ_id){	  
		var template = this.template; 	
		var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
		return html;
	},

	afterRequest: function () {
		$(this.target).find('input').unbind().removeData('events').val('');

		var self = this;

		var callback = function (response) {
			var list = [];
			for (var i = 0; i < self.fields.length; i++) {
				var field = self.fields[i];
				for (var facet in response.facet_counts.facet_fields[field]) {
					list.push({
						field: field,
						value: facet,
						label: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ') - ' + field
					});
				}
			}

			self.requestSent = false;
			$(self.target).find('input').autocomplete('destroy').autocomplete({
				source: list,
				select: function(event, ui) {
				if (ui.item) {
					self.requestSent = true;
					//if (self.manager.store.addByValue('fq', ui.item.field + ':' + AjaxSolr.Parameter.escapeValue(ui.item.value))) {
						//self.doRequest();
						
						$(self).trigger({
							type: "smk_search_filter_changed",
							params: {selected: ui.item.field + ':' + AjaxSolr.Parameter.escapeValue(ui.item.value)}
						});   
					//}
				}
			}
			});

			// This has lower priority so that requestSent is set.
			$(self.target).find('input').bind('keydown', function(e) {
				if (self.requestSent === false && e.which == 13) {
					var value = $(this).val();
					if (value && self.set(value)) {
						//self.doRequest();
						
						$(self).trigger({
							type: "smk_search_q_added",
							val: value
						});		

						
					}
				}
			});
		} // end callback

		var params = [ 'rows=0&facet=true&facet.limit=-1&facet.mincount=1&json.nl=map' ];
		for (var i = 0; i < this.fields.length; i++) {
			params.push('facet.field=' + this.fields[i]);
		}
		var values = this.manager.store.values('fq');
		for (var i = 0; i < values.length; i++) {
			params.push('fq=' + encodeURIComponent(values[i]));
		}
		params.push('q=' + this.manager.store.get('q').val());
		$.getJSON(this.manager.solrUrl + 'select?' + params.join('&') + '&wt=json&json.wrf=?', {}, callback);
	}
	});

})(jQuery);
