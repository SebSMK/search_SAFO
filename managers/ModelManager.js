
var	ModelManager = {



		/******************************
		 * PUBLIC FUNCTIONS
		 * * ****************************/				

		/**
		 * Set model
		 * @param {String|Json} [values] Values passed to the model.
		 * @param {String} [type] values' format.		
		 * */
		setModel: function(values, type){

			switch(type){
			case 'json':
				this.setModelFromJson(values);
				break;
			case 'url':
				this.setModelFromURL(values);
				break;	

			default:this.setModelFromJson(values);
			}			
		},

		/**
		 * Get model
		 * @returns {Json} model.
		 * */
		getModel: function(){

			var model = {};

			if (smkCommon.isValidDataText(this.view))
				model.view = this.view;

			if (smkCommon.isValidDataText(this.category))
				model.category = this.category;

			if (smkCommon.isValidDataText(this.q))
				model.q = this.q;

			if (smkCommon.isValidDataText(this.fq))
				model.fq = this.fq;
			
			if (smkCommon.isValidDataText(this.fl))
				model.fl = this.fl;

			if (smkCommon.isValidDataText(this.qf))
				model.qf = this.qf;

			if (smkCommon.isValidDataText(this.start))
				model.start = this.start;

			if (smkCommon.isValidDataText(this.sort))
				model.sort = this.sort;
			
			model.lang = smkCommon.isValidDataText(eval("smkCommon.enum_lang." + this.lang)) ? this.lang : smkCommon.enum_lang.def;

			return model;
		},	


		/**
		 * Save current model 		
		 * */
		storeCurrentModel: function(){			
			this._stored_model = this.getModel();						
		},

		/**
		 * Get stored model 		
		 * */
		loadStoredModel: function(){			
			return this._stored_model;
		},

		/**
		 * @param {Json} [model] params to sorl request
		 * @returns {String} params in solr-url format 
		 * **/
		buildURLFromModel: function(model){	    	  

			var uniqueURL = "";		      

			if(model.view == 'detail'){
				var lang = smkCommon.isValidDataText(eval("smkCommon.enum_lang." + model.lang)) && smkCommon.enum_lang.def != model.lang ? sprintf('%1$s%2$s', this._cat_separator, model.lang) : '';
				uniqueURL = sprintf('%s%s%s%s%s',lang, this._cat_separator, model.view, this._cat_separator, encodeURIComponent(this.encode_q(model.q)) );				  				  
			}else{

				var cat = model.category != undefined && model.category != '' && model.category != 'all' ? sprintf('%1$scategory%1$s%2$s%1$s', this._cat_separator, model.category) : '';
				var q =  model.q != undefined &&  this.encode_q(model.q) != '' ? sprintf('%sq=%s', this._separator, encodeURIComponent(this.encode_q(model.q))) : '';
				var fq =  model.fq != undefined && this.encode_fq(model.fq) != '' ? sprintf('%sfq=%s', this._separator, encodeURIComponent(this.encode_fq(model.fq))) : '';
				var start =  model.start != undefined && model.start != 0 ? sprintf('%sstart=%s', this._separator, encodeURIComponent(model.start)) : '';
				var sort =  model.sort != undefined && model.sort != "score desc" ? sprintf('%ssort=%s', this._separator, encodeURIComponent(model.sort)) : '';				
				var lang = smkCommon.isValidDataText(eval("smkCommon.enum_lang." + model.lang)) && smkCommon.enum_lang.def != model.lang ? sprintf('%1$s%2$s%1$s', this._cat_separator, model.lang) : '';

				uniqueURL = sprintf('%s%s%s%s%s%s', lang, cat, q, fq, start, sort);

			}; 	  

			return sprintf('%s#%s', window.location.href.split('#')[0], uniqueURL.replace(this._separator, ''));

		},

		update: function(model){
			this.setModel(model);			
			window.location.href = this.buildURLFromModel(this.getModel());
		},
		
		update_url: function(url){						
			window.location.href = url;
		},
				
		get_q: function(){
			return smkCommon.isValidDataText(this.q) ? this.q : [];			
		},
		
		get_fq: function(){			 
			return smkCommon.isValidDataText(this.fq) ? this.fq : [];			
		},
		
		get_fq_OR: function(){			
			var fq = !smkCommon.isValidDataText(this.fq) ? [] : this.fq.slice();
			var fq_OR = {};
			for (var i = 0, l = fq.length; i < l; i++) {	
				if(fq[i].value !== undefined){					
					var split = fq[i].value.split(/:(.+)?/);
					var key = split[0];
					var value = split[1];
					fq_OR[key] = fq_OR[key] === undefined ? sprintf('%s:%s', key, value) : sprintf('%s OR %s:%s', fq_OR[key], key, value);  
				} 								
			}
			
			return fq_OR;			
		},
		
		get_facets: function(){						
			var self = this;
			var facets =  !smkCommon.isValidDataText(this.fq) ? [] : this.fq.slice();
			var index = -1;
			// we remove 'has image' request from facets
			for (var i = 0, l = facets.length; i < l; i++) {				
				if(facets[i].value !== undefined && facets[i].value == this._has_image_req){
					index = i;
					break;
				} 								
			}
			
			if(index > -1)
				facets.splice(index, 1);
			
			return facets;
		},
		
		get_facets_lab_for_search_component: function(){			
			var facets = this.get_facets();
			var facets_text = {};
			var facets_req = {};
			var facets_data = [];
			for (var i = 0, l = facets.length; i < l; i++) {	
				if(facets[i].value !== undefined){					
					var split = facets[i].value.split(/:(.+)?/);
					var key = split[0];					
					var text = split[1].split(' OR ')[0].replace(/^"|"$/g, ''); // trim '"'					
					//facets_req[key] = facets_req[key] === undefined ? facets[i].value : facets_req[key];
					facets[i]['text'] = facets[i]['text']  === undefined ? text : facets[i]['text'] ;
					facets[i]['id'] = facets[i]['id']  === undefined ? key : facets[i]['id'] ;
				} 								
			}
			
			return facets;			
		},
		
		get_hasimage: function(){
			var fq =  !smkCommon.isValidDataText(this.fq) ? [] : this.fq;
			var check = false;
			for (var i = 0, l = fq.length; i < l; i++) {				
				if(fq[i].value !== undefined && fq[i].value == this._has_image_req){
					check = true;
					break;
				} 								
			}
			
			return check;					
		},
		
		get_sort: function(){
			return smkCommon.isValidDataText(this.sort) ? this.sort : "";			
		},
		
		get_lang: function(){
			return smkCommon.isValidDataText(eval("smkCommon.enum_lang." + this.lang)) ? this.lang : smkCommon.enum_lang.def;			
		},
		
		get_view: function(){
			return this.view;			
		},

		/******************************
		 * PRIVATE FUNCTIONS
		 * * ****************************/				

		/**
		 * Set model
		 * @param {Json} [model] The model to set.		 
		 * */
		setModelFromJson: function(model){
			this.view = this.getModelValue(model, "view");
			this.category = this.getModelValue(model, "category");
			this.q = this.getModelValue(model, "q");
			this.fq = this.getModelValue(model, "fq");
			this.qf = this.getModelValue(model, "qf");
			this.start = this.getModelValue(model, "start");
			this.fl = this.getModelValue(model, "fl");
			this.sort = this.getModelValue(model, "sort");	
			this.lang = this.getModelValue(model, "lang");	
		},

		getModelValue: function(model, type){
			var value = model !== undefined && model != null ? eval("model." + type) : null;
			return smkCommon.isValidDataText(value) ? (value == this.current_value_joker ? eval("this." + type) : value) : null;
		},

		/**
		 * Set model
		 * @param {String} [url] The model to set.		 
		 * */
		setModelFromURL: function(url){
			var model = {};

			var cats = url.replace(this._cat_separator, '').split(this._cat_separator);
			
			var i = 0;
			
			while (i < cats.length){
				
				switch(cats[i]){
				case smkCommon.enum_lang.en:
				case smkCommon.enum_lang.dk:
				case smkCommon.enum_lang.def:
					model.lang = cats[i];
					i++;
					break;
									
				case "detail":
					model.q = sprintf('%s', decodeURIComponent(cats[i + 1]));
					model.view = cats[i];
					this.setModelFromJson(model);
					return;

				case "category":												
					model.category = cats[i];	
					model.fq = [{	'value': sprintf('%s:%s', cats[i], cats[i+ 1]),
						'locals': {'tag': cats[i]}  
					}];
					this.extract_params(cats[i + 2].split(this._separator), model);						
					this.setModelFromJson(model);
					return;
					
				default:
					this.extract_params(cats[i].split(this._separator), model);
					this.setModelFromJson(model);
					return;
				}					
			}		
		},


		/**
		 * extract model-related values from solr parameters
		 * @param {Array(String)} [params] Params to be extracted
		 * @param {Json} [model] Model !-> will be modified in this function 		 
		 * */
		extract_params: function(params, model){			

			for (var i = 0, l = params.length; i < l; i++) {

				var param = params[i].split('=');
				var value = '';

				if(param !== undefined && param.length > 1){														

					switch(param[0]){

					case "q":
						value = params[i].replace('q=', '');
						value = decodeURIComponent(value);
						model.q = value.split(this._q_separator);
						break;

					case "start":
						value = params[i].replace('start=', '');
						model.start = decodeURIComponent(value);						   	 
						break;	
						
					case "fl":
						value = params[i].replace('fl=', '');
						model.fl = decodeURIComponent(value);						   	 
						break;

					case "sort":
						value = params[i].replace('sort=', '');
						model.sort = decodeURIComponent(value);						   	 
						break;	

					case "fq":						  						  
						value = params[i].replace('fq=', '');

						var fq = decodeURIComponent(value).split(this._fq_separator);

						for (var j = 0, k = fq.length; j < k; j++) {
							var fqval= this.decode_fq(fq[j]);
							if (AjaxSolr.isArray(model.fq)){
								model.fq = model.fq.concat(fqval);
							}else{
								model.fq = [fqval]; 
							}
						}					   	 

						break;	
					}
				}						
			};	
		},		

		decode_fq: function(fq){
			var res = {};
			var elements = fq.split(this._fq_locals_separator);

			for (var i = 0, l = elements.length; i < l; i++) {
				var element = elements[i].split(':');

				if(element !== undefined && element.length > 1)																			
					res.value = decodeURIComponent(elements[i]);						   	 																												
			};

			if(res.locals !== undefined && res.locals.tag !== undefined && res.value !== undefined)
				res.locals.tag = res.value.split(':')[0];		

			return res;
		},

		encode_fq: function(getfq){
			var res = '';
			var fq = getfq == null ? [] : getfq.slice();	  

			for (var i = 0, l = fq.length; i < l; i++) {
				if(fq[i].value != null && fq[i].value != '' && fq[i].value.split(':')[0] != 'category')
					res = sprintf('%s%s%s', res, this._fq_separator, fq[i].value);
			};	

			return res.replace(this._fq_separator, ''); 		  			
		},


		encode_q: function(getq){	  
			var res = '';

			if (AjaxSolr.isArray(getq)){
				for (var i = 0, l = getq.length; i < l; i++) {
					res = res + this._q_separator + getq[i];
				};  				  
			}else{
				res = getq;
			}			  	

			return res.replace(this._q_separator, ''); 		  
		},				

		/*
		 * fields for the model
		 * **/
		view: null, 
		category: null,
		q: null,
		fq: null,
		qf: null,
		start: null,
		fl: null,
		sort: null,
		lang: null,

		current_value_joker: '*',

		_separator: '&',		
		_cat_separator: '/',		
		_q_separator: ',',		
		_fq_locals_separator: ';',
		_fq_separator: ',',		
		_default_category: 'all',		
		_default_view: 'teasers',
		_stored_model: null,
		_has_image_req: 'medium_image_url:[* TO *]'

};
