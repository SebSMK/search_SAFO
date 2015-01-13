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

						ident_vaerktype: getData_Common.getIdent_vaerktype(doc),
						ident_dele: getData_Common.getIdent_dele(doc),
						ident_invnummer: getData_Common.getIdent_invnummer(doc),
						ident_samling: getData_Common.getIdent_samling(doc),
						ident_andet_inv: getData_Common.getIdent_andet_inv(doc),
						
						producent_kunster: getData_Common.getProducent_producent(doc, 'original'),
						producent_tilskrevet: getData_Common.getProducent_producent(doc, 'tilskrevet'),
						producent_tidltilskrvet: getData_Common.getProducent_producent(doc, 'tidl'),
						producent_vaerksted: getData_Common.getProducent_producent(doc, 'værksted'),
						producent_efterfoelger: getData_Common.getProducent_producent(doc, 'efterf'),
						producent_inventor: getData_Common.getProducent_producent(doc, 'inventor'),						
						producent_skole: getData_Common.getProducent_producent(doc, 'skole'),
						producent_stil: getData_Common.getProducent_producent(doc, 'stil'),
						producent_kopi: getData_Common.getProducent_producent(doc, 'kopi'),
						producent_forlaeg: getData_Common.getProducent_producent(doc, 'forlæg'),
						producent_udgiver: getData_Common.getProducent_producent(doc, 'udgiver'),
						producent_trykker: getData_Common.getProducent_producent(doc, 'trykker'),
						producent_forfatter: getData_Common.getProducent_producent(doc, 'forfatter'),						
						producent_formeri: getData_Common.getProducent_formeri(doc),
						producent_objectophavsbeskrivelse: getData_Common.getProducent_objectophavsbeskrivelse(doc),											
						
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
						 
						udstilling_udstilling: getData_Common.getUdstilling_udstilling(doc),
						
						bemaerk_anden_litt: getData_Common.getBemaerk_anden_litt(doc),
						
						motiv_topografisk: getData_Common.getMotiv_topografisk(doc),
						motiv_portraet: getData_Common.getMotiv_portraet(doc),
						motiv_note: getData_Common.getMotiv_note(doc),															
					}
			};	

			
			/*
			//* add acquisition data
			if (doc.acq_date !== undefined || doc.acq_method !== undefined){
				data.info.acq = {
						key: this.caller.manager.translator.getLabel('detail_acquisition'),  
						date: doc.acq_date,
						method: doc.acq_method !== undefined ? sprintf('%s, ', smkCommon.firstCapital(doc.acq_method)) : null,
								source: doc.acq_source !== undefined ? sprintf('%s - ', doc.acq_source) : null
				};

			};


			//* add dimension data
			if (doc.dimension_brutto !== undefined || 
					doc.dimension_netto !== undefined || 
					doc.dimension_billedmaal !== undefined || 
					doc.dimension_bladmaal !== undefined){

				data.info.dim = {
						key: this.caller.manager.translator.getLabel('detail_dimension'),			    	
						dim : doc.dimension_brutto !== undefined? doc.dimension_brutto : 
							doc.dimension_netto !== undefined? doc.dimension_netto :
								doc.dimension_billedmaal !== undefined? doc.dimension_billedmaal : doc.dimension_bladmaal  
				};

			};

			//* add location	 
			if (this.getlocation(doc.location_name))
				data.info.location = {
					key: this.caller.manager.translator.getLabel('detail_location'),
					value:doc.location_name
			};	  	  


			//* add provenance	 
			if (this.getProvenance(doc))	  
				data.info.proveniens = {
					key: this.caller.manager.translator.getLabel('detail_provenance'),
					value: doc.proveniens
			};	  	  

*/
			return data;	  

		};   

	}

}));