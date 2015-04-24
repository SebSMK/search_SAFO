(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var getdatadetailextended = {};
		factory(getdatadetailextended);
		if (typeof define === "function" && define.amd) {
			define(getdatadetailextended); // AMD
		} else {
			root.getData_Detail_Extended = getdatadetailextended; // <script>
		}
	}
}(this, function (getdatadetailextended) {

	getdatadetailextended.constructor = function(caller){

		this.get_data = function (doc){
			var data =  {

					info:{
						
						ident_lab: this.caller.manager.translator.getLabel('detail_ident_lab'),
						
						ident_vaerktype: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_ident_vaerktype')),  
							value: getData_Common.getIdent_vaerktype(doc)
						},
            
			            ident_dele: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_ident_dele')),  
							value: getData_Common.getIdent_dele(doc)
						},
			            
			            ident_invnummer: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_ident_invnummer')),  
							value: getData_Common.getIdent_invnummer(doc)
						},
			            
			            ident_samling: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_ident_samling')),  
							value: getData_Common.getIdent_samling(doc)
						},
			            
			            ident_andet_inv: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_ident_andet_inv')),  
							value: getData_Common.getIdent_andet_inv(doc)
						},
						
						
						producent_lab: this.caller.manager.translator.getLabel('detail_producent_lab'),
						
						producent_kunster: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_kunster')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.orig),
							show: this.getListProducers(doc, getData_Common.enumProducent.orig).length > 0 ? true : false
						},
            
						producent_tilskrevet: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_tilskrevet')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.tilsk),
							show: this.getListProducers(doc, getData_Common.enumProducent.tilsk).length > 0 ? true : false
						},
			            
						producent_tidltilskrvet: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_tidltilskrvet')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.tidl),
							show: this.getListProducers(doc, getData_Common.enumProducent.tilsk).length > 0 ? true : false
						},
			            
						producent_vaerksted: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_vaerksted')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.vaerksted),
							show: this.getListProducers(doc, getData_Common.enumProducent.vaerksted).length > 0 ? true : false
						},
			            
						producent_efterfoelger: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_efterfoelger')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.efterfoel),
							show: this.getListProducers(doc, getData_Common.enumProducent.efterfoel).length > 0 ? true : false
						},
            
						producent_inventor: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_inventor')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.inventor),
							show: this.getListProducers(doc, getData_Common.enumProducent.inventor).length > 0 ? true : false
						},
            
			            producent_skole: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_skole')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.skole),
							show: this.getListProducers(doc, getData_Common.enumProducent.skole).length > 0 ? true : false
						},
			            producent_stil: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_stil')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.stil),
							show: this.getListProducers(doc, getData_Common.enumProducent.stil).length > 0 ? true : false
						},
			            producent_kopi: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_kopi')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.kopi),
							show: this.getListProducers(doc, getData_Common.enumProducent.tilsk).kopi > 0 ? true : false
						},
			            producent_forlaeg: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_forlaeg')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.forlaeg),
							show: this.getListProducers(doc, getData_Common.enumProducent.forlaeg).length > 0 ? true : false
						},
			            producent_udgiver: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_udgiver')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.udgiver),
							show: this.getListProducers(doc, getData_Common.enumProducent.udgiver).length > 0 ? true : false
						},
			            producent_trykker: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_trykker')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.trykker),
							show: this.getListProducers(doc, getData_Common.enumProducent.trykker).length > 0 ? true : false
						},
			            producent_forfatter: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_forfatter')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.forfatter),
							show: this.getListProducers(doc, getData_Common.enumProducent.forfatter).length > 0 ? true : false
						},
			            producent_forfatter: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_forfatter')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.forfatter),
							show: this.getListProducers(doc, getData_Common.enumProducent.forfatter).length > 0 ? true : false
						},
			            producent_formeri: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_formeri')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.formeri),
							show: this.getListProducers(doc, getData_Common.enumProducent.formeri).length > 0 ? true : false
						},
			            producent_objectophavsbeskrivelse: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_objectophavsbeskrivelse')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.objectophavsbeskrivelse),
							show: this.getListProducers(doc, getData_Common.enumProducent.objectophavsbeskrivelse).length > 0 ? true : false
						},       
						
						
						title_lab: this.caller.manager.translator.getLabel('detail_title_lab'),
						
						title_museum: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_title_museum')),  
							value: getData_Common.getTitle(doc, 'museum'),
							show: getData_Common.getTitle(doc, 'museum') !== undefined ? true : false,
							key_note: (this.caller.manager.translator.getLabel('detail_title_note')),
							key_trans: (this.caller.manager.translator.getLabel('detail_title_translation')),
							key_trans_note: (this.caller.manager.translator.getLabel('detail_title_translation_note'))
						},																	
						
						title_serie: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_title_serie')),  
							value: getData_Common.getTitle(doc, 'serie'),
							show: getData_Common.getTitle(doc, 'serie') !== undefined ? true : false,
							key_note: (this.caller.manager.translator.getLabel('detail_title_note')),
							key_trans: (this.caller.manager.translator.getLabel('detail_title_translation')),
							key_trans_note: (this.caller.manager.translator.getLabel('detail_title_translation_note'))
						},
						
						title_beskrivelse: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_title_beskrivelse')),  
							value: getData_Common.getTitle(doc, 'beskrivelse'),
							show: getData_Common.getTitle(doc, 'beskrivelse') !== undefined? true : false,
							key_note: (this.caller.manager.translator.getLabel('detail_title_note')),
							key_trans: (this.caller.manager.translator.getLabel('detail_title_translation')),
							key_trans_note: (this.caller.manager.translator.getLabel('detail_title_translation_note'))								
						},
						
						datering_lab: this.caller.manager.translator.getLabel('detail_datering_lab'),
						
						datering_production_vaerkdatering: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_datering_production_vaerkdatering')),  
							value: getData_Common.getProduction_vaerkdatering(doc)											
						},
						
						datering_production_udgivet_place: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_datering_production_udgivet_place')),  
							value: getData_Common.getProduction_udgivet_place(doc)												
						},
            
						datering_production_udfoert_place: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_datering_production_udfoert_place')),  
							value: getData_Common.getProduction_udfoert_place(doc)											
						},
            
						datering_production_note: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_datering_production_note')),  
							value: getData_Common.getProduction_note(doc)												
						},
						
						technique_lab: this.caller.manager.translator.getLabel('detail_technique_lab'),
						
						technique_technique: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_technique')),  
							value: getData_Common.getTechnique_technique(doc),
							show: getData_Common.getTechnique_technique(doc) !== null? true : false,
						},						
						
						technique_dimensions: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_dimensions')),  
							value: this.getDim(doc),
							show: this.getDim(doc).length > 0 ? true : false,
						},
						
						technique_diameter: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_diameter')),  
							value: getData_Common.getTechnique_diameter(doc)
						},
						
						technique_vaegt: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_vaegt')),  
							value: getData_Common.getTechnique_vaegt(doc)
						},
						
						technique_materiale: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_materiale')),  
							value: this.getMateriale(doc),
							show: this.getMateriale(doc).length > 0 ? true : false,
						},
						
						technique_format: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_format')),  
							value: getData_Common.getTechnique_format(doc)
						},
						
						technique_watermark: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_watermark')),  
							value: getData_Common.getTechnique_watermark(doc)
						},
						
						technique_tilstand: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_tilstand')),  
							value: getData_Common.getTechnique_tilstand(doc)
						},
						
						technique_vaerkstatus: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_vaerkstatus')),  
							value: getData_Common.getTechnique_vaerkstatus(doc),
							show: getData_Common.getTechnique_vaerkstatus(doc) != null ? true : false,
						},
						
						technique_eksemplar: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_eksemplar')),  
							value: getData_Common.getTechnique_eksemplar(doc)
						},
						
						technique_bladnummer: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_bladnummer')),  
							value: getData_Common.getTechnique_bladnummer(doc)
						},
						
						technique_sidetal: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_sidetal')),  
							value: getData_Common.getTechnique_sidetal(doc)
						},
						
						technique_omslag: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_omslag')),  
							value: getData_Common.getTechnique_omslag(doc)
						},
						
						technique_stadium: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_stadium')),  
							value: getData_Common.getTechnique_stadium(doc)
						},
						
						technique_kollation: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_kollation')),  
							value: getData_Common.getTechnique_kollation(doc),
							show: getData_Common.getTechnique_kollation(doc) != null ? true : false,
						},
						
						technique_note_vaerkstatus: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_note_vaerkstatus')),  
							value: getData_Common.getTechnique_note_vaerkstatus(doc),
							show: getData_Common.getTechnique_note_vaerkstatus(doc) != null ? true : false,
						},												
						
						technique_opstilling: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_opstilling')),  
							value: getData_Common.getTechnique_opstilling(doc)
						},
						
						technique_note_elementer: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_note_elementer')),  
							value: getData_Common.getTechnique_note_elementer(doc)
						},
						
						
						inscription_signatur: getData_Common.getInscription_signatur(doc),
						inscription_paaskrift: getData_Common.getInscription_paaskrift(doc),
						inscription_trykttekst: getData_Common.getInscription_trykttekst(doc),
						inscription_samlermaerke: getData_Common.getInscription_samlermaerke(doc),
						
						erhverv_dato: getData_Common.getErhverv_dato(doc),
						erhverv_proveniens: getData_Common.getErhverv_proveniens(doc),
						
						references_vaerkfortegn: getData_Common.getReferences_vaerkfortegn(doc),
						references_gernsheim: getData_Common.getReferences_gernsheim(doc),						
						references_beckett: getData_Common.getReferences_beckett(doc),
						references_litteratur: getData_Common.getReferences_litteratur(doc),
						references_texts: getData_Common.getReferences_texts(doc),
						 
						udstilling_udstilling: getData_Common.getUdstilling_udstilling(doc),
						
						bemaerk_anden_litt: getData_Common.getBemaerk_anden_litt(doc),
						
						motiv_topografisk: getData_Common.getMotiv_topografisk(doc),
						motiv_portraet: getData_Common.getMotiv_portraet(doc),
						motiv_note: getData_Common.getMotiv_note(doc),															
					},
					
					subwidget:{
						req_original: getData_Common.getSubWidgReq_original(doc),
						req_multiwork: getData_Common.getSubWidgReq_vaerkdele(doc),
						req_relatedid: getData_Common.getSubWidgReq_relatere(doc)									
					}
			};	
						
			return data;	  

		};   
		
		this.getDim = function(doc){
			var res = [];
			
			for (var i = 0; i < getData_Common.getTechnique_dimensions(doc).length; i++) {	
			
				var tmp = {dim: getData_Common.getTechnique_dimensions(doc)[i].dim,
							type: this.caller.manager.translator.getLabel('detail_technique_dimensions_' + getData_Common.getTechnique_dimensions(doc)[i].type)
				};
				
				res.push(tmp);
				
			}
			
			return res;
			
		};
		
		this.getMateriale = function(doc){
			var res = [];
			
			for (var i = 0; i < getData_Common.getTechnique_materiale(doc).length; i++) {	
				
				var type;
				
				if(getData_Common.getTechnique_materiale(doc)[i].mat_type.indexOf('material') > 0)
					type = 'detail_technique_materiale_material';
				
				if(getData_Common.getTechnique_materiale(doc)[i].mat_type.indexOf('medium') > 0)
					type = 'detail_technique_materiale_medium';
				
				if(getData_Common.getTechnique_materiale(doc)[i].mat_type.indexOf('grundering') > 0)
					type = 'detail_technique_materiale_grundering';
				
				var tmp = {value: getData_Common.getTechnique_materiale(doc)[i].mat_val,
							type: type !== undefined ? this.caller.manager.translator.getLabel(type) : type
				};
				
				res.push(tmp);				
			}			
			return res;			
		};
		
		
		
		this.getListProducers = function(doc, type){									
			var res = new Array();
			var list = new Array();
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, type))){				
				for (var j = 0, k = getData_Common.getProducent_producent(doc, type).length; j < k ; j++) {																
					var output = this.getArtistOutput(getData_Common.getProducent_producent(doc, type)[j].artist_data);
					res.push(output);
				}													
			}
			
			return res; 
		};
		
		this.getArtistOutput = function(doc){
			var res = {};
			
			if (doc.name != undefined)
				res.name = doc.name;
						
			var dates = smkCommon.isValidDataText(doc.dates) ? sprintf(', %s', doc.dates) : "";
			var nationality = smkCommon.isValidDataText(doc.nationality) ? sprintf('%s', doc.nationality) : "";												

			res.info = sprintf('(%s%s)', nationality, dates);
			

			return res;
		};			
		
		/*
		 * variables
		 */
		this.caller = caller;

	}

}));