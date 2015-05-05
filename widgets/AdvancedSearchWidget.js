(function ($) {

	AjaxSolr.AdvancedSearchWidget = AjaxSolr.AbstractFacetWidget.extend({		 

		constructor: function (attributes) {
			AjaxSolr.AbstractWidget.__super__.constructor.apply(this, arguments);
			AjaxSolr.extend(this, {
				facets_list:null
			}, attributes);
		},

		init: function () { 

			var self = this;							 
			var dataHandler = new getData_Advanced.constructor(this);
			var panel_data = dataHandler.getData(this.facets_list);
			
			var html = self.template_integration_json({list:panel_data}, '#advancedSearchTemplate');
			$(self.target).html(html);
		},

		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 		
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		}

	});

})(jQuery);
