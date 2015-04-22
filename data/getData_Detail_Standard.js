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
						title: this.getDetailTitle(doc),	
						alt: getData_Common.getMedia_alt(doc),
						image: getData_Common.getMedia_image(doc, 'large', this.caller),						
						copyright: getData_Common.getMedia_copyright(doc, this.caller),
						copyright_default: !getData_Common.computeCopyright(doc) && doc.medium_image_url !== undefined,
						copyright_valid: getData_Common.computeCopyright(doc),
						img_id:doc.id
					},					
					
					info:{
						
						ident_invnummer: {
							key: this.caller.manager.translator.getLabel('detail_reference'),  
							value: getData_Common.getIdent_invnummer(doc)
						},
						
						artist: this.getListProducers(doc),																																					
						
						title_museum: this.getDetailTitle(doc),
						title_serie: this.getDetailSerieTitle(doc),																							
						
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
						
						location: this.getListLocation(doc, this.caller)
					},

					subwidget:{
						req_original: getData_Common.getSubWidgReq_original(doc),
						req_multiwork: getData_Common.getSubWidgReq_vaerkdele(doc),
						req_relatedid: getData_Common.getSubWidgReq_relatere(doc)									
					}
			};	

			return data;	  
		};
		
		this.getListLocation = function (doc, caller){
			var location = smkCommon.firstCapital(doc.location_name);
			var location_inhouse = smkCommon.isValidDataText(location) ? caller.manager.translator.getCollection(smkCommon.replace_dansk_char(location)) : ''; 
			var label = smkCommon.isValidDataText(location_inhouse) ? 
					sprintf('%s %s', caller.manager.translator.getLabel("teaser_on_display"), location) 
						: 
					caller.manager.translator.getLabel("teaser_appoint");
			
			return label;
		};
		
		this.getDetailAcq = function(doc){
			var method = smkCommon.isValidDataText(getData_Common.getErhverv_method(doc)) ? sprintf('%s', getData_Common.getErhverv_method(doc)) : "";
			var source = smkCommon.isValidDataText(getData_Common.getErhverv_source(doc)) ? sprintf(' %s', getData_Common.getErhverv_source(doc)) : "";
			var dato = smkCommon.isValidDataText(getData_Common.getErhverv_dato(doc)) ? sprintf(' %s', getData_Common.getErhverv_dato(doc)) : "";	 
			
			return smkCommon.isValidDataText(getData_Common.getErhverv_method(doc)) || smkCommon.isValidDataText(getData_Common.getErhverv_source(doc)) || smkCommon.isValidDataText(getData_Common.getErhverv_dato(doc)) ? 
					sprintf("%s%s%s", method, source, dato) : null;
			
		};
		
		this.getDetailTitle = function(doc){
			var title_mus = getData_Common.getTitle(doc, 'museum');
			var title_besk = getData_Common.getTitle(doc, 'beskriv');			
			var title_teaser = title_mus || title_besk;
			
			var title = new String();
			
			if(title_teaser != null && title_teaser.length > 0){
				switch(smkCommon.getCurrentLanguage()){
				case "dk":		 		
					title = title_teaser[0].title;
					break;
				case "en":
					title = smkCommon.isValidDataText(title_teaser[0].trans) ? title_teaser[0].trans : title_teaser[0].title; 
					break;
				}									
			}else{				
				title = doc.title_first;
			}
						
			return smkCommon.isValidDataText(title) ? title : null;
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
		
		this.getListProducers = function(doc){									
			var res = new Array();
			var list = new Array();
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.orig)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.orig));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.tilsk)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.tilsk));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.tidl)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.tidl));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.vaerksted)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.vaerksted));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.efterfoel)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.efterfoel));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.inventor)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.inventor));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.skole)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.skole));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.stil)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.stil));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.kopi)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.kopi));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.efterfor)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.efterfor));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.udgiver)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.udgiver));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.trykker)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.trykker));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.forfatter)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.forfatter));						
			
			for (var i = 0, l = list.length; i < l; i++) {
				
				for (var j = 0, k = list[i].length; j < k ; j++) {											
//					if(smkCommon.isValidDataText(list[i][j].artist_data.role))
//						list[i][j].artist_data.role = sprintf(' %s', list[i][j].artist_data.role);
//						
//					res.push(list[i][j]);
					
					var output = this.getArtistOutput(list[i][j].artist_data);
					res.push(output);
				}													
			}
			
			return res; 
		};

		this.getArtistOutput = function(doc){
			var res = {};
			
			if (doc.name != undefined)
				res.name = doc.name;
			
			var role = smkCommon.isValidDataText(doc.role) ? sprintf(', %s', doc.role) : "";
			var dates = smkCommon.isValidDataText(doc.dates) ? sprintf(', %s', doc.dates) : "";
			var nationality = smkCommon.isValidDataText(doc.nationality) ? sprintf('%s', doc.nationality) : "";												

			res.info = sprintf('(%s%s%s)', nationality, dates, role);
			

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