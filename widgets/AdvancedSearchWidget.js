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
			
			$(self.target).find(".advanced-search-panel-show-hide a").click(function(a) {
		            a.preventDefault();
		            // Set height on advanced panel, so that we can animate it.
		            var b = $(".advanced-search-panel").height();
		            $(".advanced-search-panel").height(b + "px"), // Store the height for when the panel will be opened again
		            $(".advanced-search-panel").hasClass("advanced-search-panel-hidden") || $(".advanced-search-panel").attr("data-height", b), 
		            $(".advanced-search-panel").hasClass("advanced-search-panel-hidden") ? ($(".advanced-search-panel").height($(".advanced-search-panel").attr("data-height")), 
		            $(".advanced-search-panel-show-hide a").text($(".advanced-search-panel-show-hide a").attr("data-label-close")), 
		            setTimeout(function() {
		                $(".advanced-search-panel").height("auto");
		            }, 200)) : ($(".advanced-search-panel").height("6px"), $(".advanced-search-panel-show-hide a").text($(".advanced-search-panel-show-hide a").attr("data-label-open"))), 
		            // Toggle class to show/hide
		            $(".advanced-search-panel").toggleClass("advanced-search-panel-hidden");
		        });
		},

		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 		
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		}

	});

})(jQuery);
