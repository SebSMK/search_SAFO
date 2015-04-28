(function ($) {

	AjaxSolr.OriginalWidget = AjaxSolr.AbstractWidget.extend({

		afterRequest: function () {

			var self = this;		
			var $target = $(this.target);

			if (!self.getRefresh()){
				self.setRefresh(true);
				return;
			}	 		  

			$target.empty();

			var thumbnails = [];
			var artwork_data;
			var dataHandler = new getData_Original.constructor(this);
			for (var i = 0, l = this.manager.response.response.docs.length; i < l ; i++) {
				var doc = this.manager.response.response.docs[i];  				
				artwork_data = dataHandler.get_data(doc);				 
			}

			//* merge data and template						    			
			var html = self.template_integration_json(artwork_data.info, '#detailOriginalTemplate');    
			$target.html(html);  
		},  	  

		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		}		

	});

})(jQuery);