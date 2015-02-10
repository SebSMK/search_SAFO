(function ($) {
	AjaxSolr.SearchBoxWidget = AjaxSolr.AbstractTextWidget.extend({

		hightlight : true,

		init: function () {						
			var self = this;
			var $target = $(this.target);		  
			var json_data = {"default_text" : this.manager.translator.getLabel("search_box_default"), 'search': this.manager.translator.getLabel("search_box_button")};	 
			var html = self.template_integration_json(json_data, '#searchboxTemplate');		  		  
			$target.append(html);		
		},	


		afterRequest : function() {

			var self = this;

			if (!self.getRefresh()){
				self.setRefresh(true);
				return;
			}	 		  
				  
			var json_data = {"default_text" : this.manager.translator.getLabel("search_box_default"), 'search': this.manager.translator.getLabel("search_box_button")};	 
			var html = self.template_integration_json(json_data, '#searchboxTemplate');		  		  
			$(this.target).html(html);	

			$(this.target).find('input#search-bar').val('');

			$(this.target).find('form').bind(
					'submit',
					{
						mmgr : self.manager,
						$input : $(this.target).find('input#search-bar'),
						caller : self
					},
					function(e) {
						e.preventDefault();
						e.stopImmediatePropagation(); 

						var val = e.data.$input.val();
						var caller = e.data.caller;

						$(caller).trigger({
							type: "smk_search_q_added",
							val: val
						});		

					}); // end binded action.

		},  

		template_integration_json: function (json_data, templ_id){	  
			var template = this.template; 	
			var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
			return html;
		}

	});

})(jQuery);