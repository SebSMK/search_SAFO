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
							key: this.caller.manager.translator.getLabel('detail_ident_vaerktype'),  
							value: getData_Common.getIdent_vaerktype(doc)
						},
            
			            ident_dele: {
							key: this.caller.manager.translator.getLabel('detail_ident_dele'),  
							value: getData_Common.getIdent_dele(doc)
						},
			            
			            ident_invnummer: {
							key: this.caller.manager.translator.getLabel('detail_ident_invnummer'),  
							value: getData_Common.getIdent_invnummer(doc)
						},
			            
			            ident_samling: {
							key: this.caller.manager.translator.getLabel('detail_ident_samling'),  
							value: getData_Common.getIdent_samling(doc)
						},
			            
			            ident_andet_inv: {
							key: this.caller.manager.translator.getLabel('detail_ident_andet_inv'),  
							value: getData_Common.getIdent_andet_inv(doc)
						},
						
						
						producent_lab: this.caller.manager.translator.getLabel('detail_producent_lab'),
						
						producent_kunster: {
							key: this.caller.manager.translator.getLabel('detail_producent_kunster'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.orig),
							show: this.getListProducers(doc, getData_Common.enumProducent.orig).length > 0 ? true : false
						},
            
						producent_tilskrevet: {
							key: this.caller.manager.translator.getLabel('detail_producent_tilskrevet'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.tilsk),
							show: this.getListProducers(doc, getData_Common.enumProducent.tilsk).length > 0 ? true : false
						},
			            
						producent_tidltilskrvet: {
							key: this.caller.manager.translator.getLabel('detail_producent_tidltilskrvet'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.tidl),
							show: this.getListProducers(doc, getData_Common.enumProducent.tilsk).length > 0 ? true : false
						},
			            
						producent_vaerksted: {
							key: this.caller.manager.translator.getLabel('detail_producent_vaerksted'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.vaerksted),
							show: this.getListProducers(doc, getData_Common.enumProducent.vaerksted).length > 0 ? true : false
						},
			            
						producent_efterfoelger: {
							key: this.caller.manager.translator.getLabel('detail_producent_efterfoelger'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.efterfoel),
							show: this.getListProducers(doc, getData_Common.enumProducent.efterfoel).length > 0 ? true : false
						},
            
						producent_inventor: {
							key: this.caller.manager.translator.getLabel('detail_producent_inventor'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.inventor),
							show: this.getListProducers(doc, getData_Common.enumProducent.inventor).length > 0 ? true : false
						},
            
			            producent_skole: {
							key: this.caller.manager.translator.getLabel('detail_producent_skole'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.skole),
							show: this.getListProducers(doc, getData_Common.enumProducent.skole).length > 0 ? true : false
						},
			            producent_stil: {
							key: this.caller.manager.translator.getLabel('detail_producent_stil'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.stil),
							show: this.getListProducers(doc, getData_Common.enumProducent.stil).length > 0 ? true : false
						},
			            producent_kopi: {
							key: this.caller.manager.translator.getLabel('detail_producent_kopi'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.kopi),
							show: this.getListProducers(doc, getData_Common.enumProducent.tilsk).kopi > 0 ? true : false
						},
			            producent_forlaeg: {
							key: this.caller.manager.translator.getLabel('detail_producent_forlaeg'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.forlaeg),
							show: this.getListProducers(doc, getData_Common.enumProducent.forlaeg).length > 0 ? true : false
						},
			            producent_udgiver: {
							key: this.caller.manager.translator.getLabel('detail_producent_udgiver'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.udgiver),
							show: this.getListProducers(doc, getData_Common.enumProducent.udgiver).length > 0 ? true : false
						},
			            producent_trykker: {
							key: this.caller.manager.translator.getLabel('detail_producent_trykker'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.trykker),
							show: this.getListProducers(doc, getData_Common.enumProducent.trykker).length > 0 ? true : false
						},
			            producent_forfatter: {
							key: this.caller.manager.translator.getLabel('detail_producent_forfatter'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.forfatter),
							show: this.getListProducers(doc, getData_Common.enumProducent.forfatter).length > 0 ? true : false
						},
			            producent_forfatter: {
							key: this.caller.manager.translator.getLabel('detail_producent_forfatter'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.forfatter),
							show: this.getListProducers(doc, getData_Common.enumProducent.forfatter).length > 0 ? true : false
						},
			            producent_formeri: {
							key: this.caller.manager.translator.getLabel('detail_producent_formeri'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.formeri),
							show: this.getListProducers(doc, getData_Common.enumProducent.formeri).length > 0 ? true : false
						},
			            producent_objectophavsbeskrivelse: {
							key: this.caller.manager.translator.getLabel('detail_producent_objectophavsbeskrivelse'),  
							value: this.getListProducers(doc, getData_Common.enumProducent.objectophavsbeskrivelse),
							show: this.getListProducers(doc, getData_Common.enumProducent.objectophavsbeskrivelse).length > 0 ? true : false
						},                        			            																											
						
						title_museum: getData_Common.getTitle(doc, 'museum'),
						title_serie: getData_Common.getTitle(doc, 'serie'),
						title_beskrivelse: getData_Common.getTitle(doc, 'beskriv'),
						
						datering_production_vaerkdatering: getData_Common.getProduction_vaerkdatering(doc),		
						datering_production_udgivet_place: getData_Common.getProduction_udgivet_place(doc),						
						datering_production_udfoert_place: getData_Common.getProduction_udfoert_place(doc),
						datering_production_note: getData_Common.getProduction_note(doc),
						
						technique_technique: getData_Common.getTechnique_technique(doc),
						technique_dimensions: getData_Common.getTechnique_dimensions(doc), 
						technique_diameter: getData_Common.getTechnique_diameter(doc), 
						technique_vaegt: getData_Common.getTechnique_vaegt(doc), 
						technique_materiale: getData_Common.getTechnique_materiale(doc),
						technique_format: getData_Common.getTechnique_format(doc), 
						technique_watermark: getData_Common.getTechnique_watermark(doc), 
						technique_tilstand: getData_Common.getTechnique_tilstand(doc), 
						technique_vaerkstatus: getData_Common.getTechnique_vaerkstatus(doc), 
						technique_eksemplar: getData_Common.getTechnique_eksemplar(doc), 
						technique_bladnummer: getData_Common.getTechnique_bladnummer(doc), 
						technique_sidetal: getData_Common.getTechnique_sidetal(doc), 
						technique_omslag: getData_Common.getTechnique_omslag(doc), 
						technique_stadium: getData_Common.getTechnique_stadium(doc), 
						technique_kollation: getData_Common.getTechnique_kollation(doc), 
						technique_note_vaerkstatus: getData_Common.getTechnique_note_vaerkstatus(doc), 
						technique_opstilling: getData_Common.getTechnique_opstilling(doc), 
						technique_note_elementer: getData_Common.getTechnique_note_elementer(doc), 
						
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