(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var config = {};
		factory(config);
		if (typeof define === "function" && define.amd) {
			define(config); // AMD
		} else {
			root.Configurator = config; // <script>
		}
	}
}(this, function (config) {

	config.constructor = function(){

		/*
		 * 
		 */
		this.load_json = function(path){
			var rootsite = smkCommon.getCurrentPluginDir(); 
			var url = rootsite.concat(path);

			$.ajax({
				dataType: "json",
				url: url,
				async:false,		   
				success: $.proxy(function(json) {
					var array = [];
					for (var key in json) {
						var item = json[key];

						switch(key){
						case "qf_default":		 			  			  			  							
							this.qf_default = item; 		        		        														  			  			  
							break;

						case "fq_default":		 			  			  			  
							this.fq_default = item;			  			  			  
							break;

						case "fl_options":		 			  			  			  
							this.fl_options = item;			  			  			  
							break;

						case "q_default":		 			  			  			  
							this.q_default = item;			  			  			  
							break;

						case "sort_default":		 			  			  			  
							this.sort_default = item;			  			  			  
							break;

						case "exposed":
							this.exposed_params = item;				  			  			  
							break;

						case "facets":		 			  			  			  									  				    										    								
							this.facets = item;							
							break;

						case "server":		 			  			  			  									  				    		
							this.server = item;				  			  			  
							break;

						case "server_proxy":		 			  			  			  									  				    		
							this.server_proxy = item;				  			  			  
							break;

						case "scroll_rows_default":		 			  			  			  
							this.scroll_rows_default = item;			  			  			  
							break;

						case "rows_default":		 			  			  			  
							this.rows_default = item;			  			  			  
							break;

						case "mode":
							this.mode = item;				  			  			  
							break;

						case "version":
							this.version = item;				  			  			  
							break;
						}
					};					  					  
				}, this),

				error: $.proxy(function( jqXHR, textStatus, errorThrown ) {
					var array = [];				  					  
				}, this)
			});  
		};

		this.get_qf_default = function(){
			return this.qf_default;		
		};

		/*
		 *
		 */
		this.get_exposed_params = function(){
			return this.exposed_params;
		};

		/*
		 *
		 */
		this.get_filter_facets = function(){
			return this.facets["advanced"];					
		};

		/*
		 *
		 */
		this.get_autocomplete_facets = function(){
			return this.facets["autocomplete"]; 			
		};

		/*
		 *
		 */
		this.get_all_facets = function(){
			return this.extract_facets(); // this.facets["all"]; 			
		};

		/*
		 *
		 */
		this.get_fq_default = function(){
			return this.fq_default;
		};

		/*
		 *
		 */
		this.get_fl_options = function(){
			return this.fl_options;
		};

		/*
		 *
		 */
		this.get_q_default = function(){
			return this.q_default;
		};

		/*
		 *
		 */
		this.get_sort_default = function(){
			return this.sort_default;
		};

		/*
		 *
		 */
		this.get_server = function(){
			return this.server;
		};

		/*
		 *
		 */
		this.get_server_proxy = function(){
			return this.server_proxy;
		};

		/*
		 *
		 */
		this.get_scroll_rows_default = function(){
			return this.scroll_rows_default;
		};	

		/*
		 *
		 */
		this.get_rows_default = function(){
			return this.rows_default;
		};	


		this.get_mode = function(){
			return this.mode;
		};

		this.get_version = function(){
			return this.version;
		};

		this.get_all_standard_filters = function(){			
			if(this.facets != null)
				return this.facets.all.filters										
		};

		this.get_all_advanced_filters = function(){			
			if(this.facets != null)
				return this.facets.all.advanced
		};


		/*
		 * variables
		 */
		this.default_lang = 'dk';
		this.qf_default = null; // qf default
		this.fq_default = null; // fq default
		this.fl_options = null; // fl default
		this.q_default = null; // q default
		this.sort_default = null; // sort default
		this.exposed_params = null; // exposed parameters
		this.facets = null; // facets
		this.server = null;
		this.server_proxy = null;
		this.scroll_rows_default = null;
		this.rows_default = null;
		this.mode = "normal";
		this.version = null;

		/*
		 * private functions		
		 * */

		this.extract_facets = function(){
			var adv_data = this.facets["advanced"];
			var facets = [];
			$.each(adv_data, function( index, adv_facets ){											
				$.each(adv_facets['values'], function( index1, value){					
					facets.push(value['id']);
				});
			});
			
			return facets;
		}
	}

}));