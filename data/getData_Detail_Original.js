(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var getdataoriginal = {};
		factory(getdataoriginal);
		if (typeof define === "function" && define.amd) {
			define(getdataoriginal); // AMD
		} else {
			root.getData_Original = getdataoriginal; // <script>
		}
	}
}(this, function (getdataoriginal) {

	getdataoriginal.constructor = function(caller){

		this.get_data = function (doc){
			var data =  {

					info:{
							
						original_placering_lab: this.caller.manager.translator.getLabel('detail_original_placering_lab'),
						
						original_placering: {  
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_placering')),  
							value: this.getEjer(doc)							
						},
						
						original_invnummer: {  
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_invnummer')),  
							value: getData_Common.getIdent_invnummer(doc)							
						},
						
						original_proveniens: {  
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_proveniens')),  
							value: getData_Common.getErhverv_proveniens(doc),
							show: getData_Common.getErhverv_proveniens(doc) !== null? true : false,
						},												
						
						
						original_producent_kunster: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_kunster')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.orig),
							show: this.getListProducers(doc, getData_Common.enumProducent.orig).length > 0 ? true : false
						},
            
						original_producent_tilskrevet: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_tilskrevet')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.tilsk),
							show: this.getListProducers(doc, getData_Common.enumProducent.tilsk).length > 0 ? true : false
						},
			            
						original_producent_tidltilskrvet: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_tidltilskrvet')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.tidl),
							show: this.getListProducers(doc, getData_Common.enumProducent.tilsk).length > 0 ? true : false
						},
			            
						original_producent_vaerksted: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_vaerksted')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.vaerksted),
							show: this.getListProducers(doc, getData_Common.enumProducent.vaerksted).length > 0 ? true : false
						},
			            
						original_producent_efterfoelger: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_efterfoelger')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.efterfoel),
							show: this.getListProducers(doc, getData_Common.enumProducent.efterfoel).length > 0 ? true : false
						},
            
						original_producent_inventor: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_inventor')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.inventor),
							show: this.getListProducers(doc, getData_Common.enumProducent.inventor).length > 0 ? true : false
						},
            
			            original_producent_skole: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_skole')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.skole),
							show: this.getListProducers(doc, getData_Common.enumProducent.skole).length > 0 ? true : false
						},
			            original_producent_stil: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_stil')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.stil),
							show: this.getListProducers(doc, getData_Common.enumProducent.stil).length > 0 ? true : false
						},
			            original_producent_kopi: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_kopi')),  
							value: this.getListProducers(doc, getData_Common.enumProducent.kopi),
							show: this.getListProducers(doc, getData_Common.enumProducent.tilsk).kopi > 0 ? true : false
						},
						
						original_autenticitet: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_autenticitet')),  
							value: getData_Common.getProducent_objectophavsbeskrivelse(doc),
							show: getData_Common.getProducent_objectophavsbeskrivelse(doc) !== null? true : false,
						},
												
						original_tilstand: {  
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_tilstand')),  
							value: getData_Common.getTechnique_tilstand(doc)							
						},
						
						original_indskrift: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_indskrift')),  
							value: getData_Common.getTechnique_kollation(doc),
							show: getData_Common.getTechnique_kollation(doc) !== null? true : false,
						},
												
						original_vaerkdatering: {  
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_vaerkdatering')),  
							value: getData_Common.getProduction_vaerkdatering(doc)							
						},
											
						original_technique: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_technique')),  
							value: getData_Common.getTechnique_technique(doc),
							show: getData_Common.getTechnique_technique(doc) !== null? true : false,
						},
						
						original_bemaerk: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_bemaerk')),  
							value: getData_Common.getBemaerk_anden_litt(doc),
							show: getData_Common.getBemaerk_anden_litt(doc) !== null? true : false,
						}																								
					}
			};	
						
			return data;	  
		};   


		/**
		 * 
		 * EXTRACT AND FORMAT DATA FROM JSON
		 * 
		 * */		
		
		this.getEjer = function(doc){			
			return doc.ejer === undefined ? null : doc.ejer;
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
		
		this.caller = caller;
	}

}));