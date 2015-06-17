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
							show: getData_Common.getErhverv_proveniens(doc) !== null? true : false
						},																														
						
						original_autenticitet: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_autenticitet')),  
							value: getData_Common.getProducent_objectophavsbeskrivelse(doc),
							show: getData_Common.getProducent_objectophavsbeskrivelse(doc) !== null? true : false
						},
												
						original_tilstand: {  
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_tilstand')),  
							value: getData_Common.getTechnique_tilstand(doc)							
						},
						
						original_indskrift: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_indskrift')),  
							value: getData_Common.getTechnique_kollation(doc),
							show: getData_Common.getTechnique_kollation(doc) !== null? true : false
						},
												
						original_vaerkdatering: {  
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_vaerkdatering')),  
							value: getData_Common.getProduction_vaerkdatering(doc)							
						},
											
						original_technique: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_technique')),  
							value: getData_Common.getTechnique_technique(doc),
							show: getData_Common.getTechnique_technique(doc) !== null? true : false
						},
						
						original_bemaerk: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_original_bemaerk')),  
							value: getData_Common.getBemaerk_anden_litt(doc),
							show: getData_Common.getBemaerk_anden_litt(doc) !== null? true : false
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
		
		this.caller = caller;
	}

}));