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

						original_placering: this.getEjer(doc),						
						original_invnummer: getData_Common.getIdent_invnummer(doc),
						original_proveniens: getData_Common.getErhverv_proveniens(doc),						
						original_kunster: getData_Common.getProducent_producent(doc, 'original'),
						original_autenticitet: getData_Common.getProducent_objectophavsbeskrivelse(doc),	
						original_tilstand: getData_Common.getTechnique_tilstand(doc),
						original_indskrift: getData_Common.getTechnique_kollation(doc), 
						
						original_vaerkdatering: getData_Common.getProduction_vaerkdatering(doc),		
						original_technique: getData_Common.getTechnique_technique(doc),
												
						original_bemaerk: getData_Common.getBemaerk_anden_litt(doc)						
																					
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
	}

}));