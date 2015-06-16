(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var getdatadetailstandard = {};
		factory(getdatadetailstandard);
		if (typeof define === "function" && define.amd) {
			define(getdatadetailstandard); // AMD
		} else {
			root.getData_Detail_Standard= getdatadetailstandard; // <script>
		}
	}
}(this, function (getdatadetailstandard) {

	getdatadetailstandard.constructor = function(caller){
		
		this.get_data = function (doc){
			var data =  {

					media:{
						title: getData_Common.getFirstTitle(doc),	
						alt: getData_Common.getMedia_alt(doc),
						image: getData_Common.getMedia_image(doc, 'large'),						
						image_full_path: doc.medium_image_url,
						no_image: doc.medium_image_url === undefined ? true : false,
						no_image_text: this.caller.manager.translator.getLabel('detail_no_photo'),
						copyright: getData_Common.getMedia_copyright(doc, this.caller),
						copyright_text_cc0: this.caller.manager.translator.getLabel('detail_copyright_def'),
						img_id:doc.id,
						fullsizeText: this.caller.manager.translator.getLabel('detail_fullsize_lab') 
					},					
					
					info:{
						
						ident_invnummer: {
							key: this.caller.manager.translator.getLabel('detail_reference'),  
							value: getData_Common.getIdent_invnummer(doc)
						},
						
						artist: this.getListAllProducers(doc),																																					
						
						title_museum: getData_Common.getFirstTitle(doc),
						title_serie: this.getDetailSerieTitle(doc),	
						title_serie_label: this.caller.manager.translator.getLabel('detail_title_serie'),
						
						datering: {
							key: this.caller.manager.translator.getLabel('detail_date'),  
							value: getData_Common.getProduction_vaerkdatering(doc)
						},
						
						technique: {
							key: this.caller.manager.translator.getLabel('detail_technique'),  
							value: getData_Common.getTechnique_technique(doc)
						},
						
						dim: {
								key: this.caller.manager.translator.getLabel('detail_dimension'),			    	
								dim : getData_Common.getTechnique_dimensions(doc).length > 0 ? getData_Common.getTechnique_dimensions(doc)[0].dim : null  
						},
						
						acq: {
							key: this.caller.manager.translator.getLabel('detail_acquisition'),			    	
							value: this.getDetailAcq(doc)														
						},
						
						location: smkCommon.firstCapital(getData_Common.getLocation_location(doc, this.caller))
					}
//					,
//
//					subwidget:{
//						req_original: getData_Common.getSubWidgReq_original(doc),
//						req_multiwork: getData_Common.getSubWidgReq_vaerkdele(doc),
//						req_relatedid: getData_Common.getSubWidgReq_relatere(doc)									
//					}
			};	

			return data;	  
		};
		
//		this.getListLocation = function (doc, caller){
//			var location = smkCommon.firstCapital(doc.location_name);
//			var location_inhouse = smkCommon.isValidDataText(location) ? caller.manager.translator.getCollection(smkCommon.replace_dansk_char(location)) : ''; 
//			var label = smkCommon.isValidDataText(location_inhouse) ? 
//					sprintf('%s %s', caller.manager.translator.getLabel("teaser_on_display"), location) 
//						: 
//					caller.manager.translator.getLabel("teaser_appoint");
//			
//			return label;
//		};
		
		this.getDetailAcq = function(doc){
			var method = smkCommon.isValidDataText(getData_Common.getErhverv_method(doc)) ? sprintf('%s', getData_Common.getErhverv_method(doc)) : "";
			var source = smkCommon.isValidDataText(getData_Common.getErhverv_source(doc)) ? sprintf(' %s', getData_Common.getErhverv_source(doc)) : "";
			var dato = smkCommon.isValidDataText(getData_Common.getErhverv_dato(doc)) ? sprintf(' %s', getData_Common.getErhverv_dato(doc)) : "";	 
			
			return smkCommon.isValidDataText(getData_Common.getErhverv_method(doc)) || smkCommon.isValidDataText(getData_Common.getErhverv_source(doc)) || smkCommon.isValidDataText(getData_Common.getErhverv_dato(doc)) ? 
					sprintf("%s%s%s", method, source, dato) : null;
			
		};				

		this.getDetailSerieTitle = function(doc){
			var title_serie = getData_Common.getTitle(doc, 'serie');		
			
			var title = new String();			
			
			if(title_serie != null && title_serie.length > 0){
				switch(smkCommon.getCurrentLanguage()){
				case "dk":		 		
					title = title_serie[0].title;
					break;
				case "en":
					title = smkCommon.isValidDataText(title_serie[0].trans) ? title_serie[0].trans : title_serie[0].title; 
					break;
				}									
			}
						
			return smkCommon.isValidDataText(title) ? title : null;
		};		
		
		this.getListAllProducers = function(doc){
			var self = this;
			var all_prod_datas = getData_Common.getProducent_all_producers(doc);
			var res = [];
			
			$.each(all_prod_datas, function(index, data) {					
				data.type = (data.type != 'orig') ? self.caller.manager.translator.getLabel('detail_producent_' + data.type) : null;
				var output = self.getArtistOutput(data);				
				res.push(output);					
			});	
			
			res.show = res.length > 0 ? true : false;

			return res; 			
		};				

		this.getArtistOutput = function(doc){
			var res = {};
			
			if (doc.name != undefined)
				res.name = doc.name;
			
			var role = smkCommon.isValidDataText(doc.type) ? sprintf(', %s', doc.type) : "";
			var dates = smkCommon.isValidDataText(doc.dates) ? sprintf(', %s', doc.dates) : "";
			var nationality = smkCommon.isValidDataText(doc.nationality) ? sprintf('%s', doc.nationality) : "";												
			
			res.info = nationality || dates ? sprintf('(%s%s)', nationality, dates) : "";			
			res.info = sprintf('%s%s', res.info, role);
			
			return res;
		};					
		
		this.getImage = function ($src){			

			if ($src === undefined || $src.length == 0)				
				return;			
			
			var path = $src.attr("src");
			var alt = $src.attr("alt");
			var title = $src.attr("alt");
			
			return '<img src="' + path + '" />'; 
		};				  

		/*
		 * variables
		 */
		this.caller = caller;
	}
}));