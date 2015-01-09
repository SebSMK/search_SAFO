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

						ident_vaerktype: this.getIdent_vaerktype(doc),
						ident_dele: this.getIdent_dele(doc),
						ident_invnummer: this.getIdent_invnummer(doc),
						ident_samling: this.getIdent_samling(doc),
						ident_andet_inv: this.getIdent_andet_inv(doc),
						
						producent_kunster: this.getProducent_producent(doc, 'original'),
						producent_tilskrevet: this.getProducent_producent(doc, 'tilskrevet'),
						producent_tidltilskrvet: this.getProducent_producent(doc, 'tidl'),
						producent_vaerksted: this.getProducent_producent(doc, 'værksted'),
						producent_efterfoelger: this.getProducent_producent(doc, 'efterf'),
						producent_inventor: this.getProducent_producent(doc, 'inventor'),						
						producent_skole: this.getProducent_producent(doc, 'skole'),
						producent_stil: this.getProducent_producent(doc, 'stil'),
						producent_kopi: this.getProducent_producent(doc, 'kopi'),
						producent_forlaeg: this.getProducent_producent(doc, 'forlæg'),
						producent_udgiver: this.getProducent_producent(doc, 'udgiver'),
						producent_trykker: this.getProducent_producent(doc, 'trykker'),
						producent_forfatter: this.getProducent_producent(doc, 'forfatter'),
						
						producent_formeri: this.getProducent_formeri(doc),
						producent_objectophavsbeskrivelse: this.getProducent_objectophavsbeskrivelse(doc),	
						
						title_museum: this.getTitle(doc, 'museum'),
						title_serie: this.getTitle(doc, 'serie'),
						title_beskrivelse: this.getTitle(doc, 'beskriv'),
						
						technique_dimensions: this.getTechnique_dimensions(doc), 
						technique_diameter: this.getTechnique_diameter(doc), 
						technique_vaegt: this.getTechnique_vaegt(doc), 
						technique_materiale: this.getTechnique_materiale(doc),
						technique_format: this.getTechnique_format(doc), 
						technique_watermark: this.getTechnique_watermark(doc), 
						technique_tilstand: this.getTechnique_tilstand(doc), 
						technique_vaerkstatus: this.getTechnique_vaerkstatus(doc), 
						technique_eksemplar: this.getTechnique_eksemplar(doc), 
						technique_bladnummer: this.getTechnique_bladnummer(doc), 
						technique_sidetal: this.getTechnique_sidetal(doc), 
						technique_omslag: this.getTechnique_omslag(doc), 
						technique_stadium: this.getTechnique_stadium(doc), 
						technique_kollation: this.getTechnique_kollation(doc), 
						technique_note_vaerkstatus: this.getTechnique_note_vaerkstatus(doc), 
						technique_opstilling: this.getTechnique_opstilling(doc), 
						technique_note_elementer: this.getTechnique_note_elementer(doc), 
						
						inscription_signatur: this.getInscription_signatur(doc),
						inscription_paaskrift: this.getInscription_paaskrift(doc),
						inscription_trykttekst: this.getInscription_trykttekst(doc),
						inscription_samlermaerke: this.getInscription_samlermaerke(doc),
						
						erhverv_dato: this.getErhverv_dato(doc),
						erhverv_proveniens: this.getErhverv_proveniens(doc),
						
						references_vaerkfortegn: this.getReferences_vaerkfortegn(doc),
						references_gernsheim: this.getReferences_gernsheim(doc),						
						references_beckett: this.getReferences_beckett(doc),
						references_litteratur: this.getReferences_litteratur(doc),
						 
						udstilling_udstilling: this.getUdstilling_udstilling(doc),
						
						bemaerk_anden_litt: this.getBemaerk_anden_litt(doc),
						
						motiv_topografisk: this.getMotiv_topografisk(doc),
						motiv_portraet: this.getMotiv_portraet(doc),
						motiv_note: this.getMotiv_note(doc),
						
						subWidgReq_original: this.getSubWidgReq_original(doc),
						subWidgReq_vaerkdele: this.getSubWidgReq_vaerkdele(doc),
						subWidgReq_relatere: this.getSubWidgReq_relatere(doc)						
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


		/**
		 * 
		 * EXTRACT AND FORMAT DATA FROM JSON
		 * 
		 * */		

		/**
		 * Identification
		 * */
		this.getIdent_vaerktype = function(doc){			
			return doc.object_type === undefined ? null : doc.object_type;
		};		

		this.getIdent_dele = function(doc){			
			return doc.numberofobjects === undefined ? null : doc.numberofobjects;
		};

		this.getIdent_invnummer = function(doc){			
			return doc.id === undefined ? null : doc.id;
		};

		this.getIdent_samling = function(doc){			
			return doc.collection === undefined ? null : doc.collection;
		};

		this.getIdent_andet_inv = function(doc){			
			return doc.other_numbers_andet_inventar === undefined ? null : doc.other_numbers_andet_inventar;
		};


		/**
		 * Producent
		 * */
		this.getProducent_producent = function(doc, role){
			var artistData = new Array();
			var docBirth;
			var docDeath;
			var docNatio;

			switch(this.caller.manager.translator.getLanguage()){
			case "dk":		 			  			  			  
				docBirth = doc.artist_birth_dk;
				docDeath = doc.artist_death_dk;	
				docNatio = doc.artist_natio;
				break;
			case "en":
				docBirth = doc.artist_birth_en;
				docDeath = doc.artist_death_en;
				docNatio = doc.artist_natio_en;
				break;
			}

			if (doc.artist_name !== undefined){
				// check if all arrays containing artist's data have the same size
				if((doc.artist_name.length != doc.artist_auth.length) && (doc.artist_name.length != doc.artist_natio.length)  && (doc.artist_name.length != docBirth.length) && (doc.artist_name.length != docDeath.length))
					return doc.artist_name;

				for (var i = 0, l = doc.artist_name.length; i < l; i++) {
					if(doc.artist_auth[i].indexOf(role) > -1){
						var name = doc.artist_name[i];						
						var nationality = smkCommon.isValidDataText(docNatio[i], 'natio') ? sprintf('%s, ', docNatio[i]) : '';
						var birth = docBirth[i];
						var death = smkCommon.isValidDataText(docDeath[i], 'date') ? docDeath[i] : (docBirth[i] < 1800) ? '(?)' : '';
						var dates = smkCommon.isValidDataText(docDeath[i], 'date') || smkCommon.isValidDataText(docBirth[i], 'date') ? sprintf('%s - %s', birth, death) : '';

						artistData.push({'artist_data' : 
						{'name' : name,
							'nationality' : nationality,
							'dates' : dates}
						});		  		  
					}
				}		  		  
			}	  

			return artistData;
		};	

		this.getProducent_formeri = function(doc){			
			return doc.formeri === undefined ? null : doc.formeri;
		};

		this.getProducent_objectophavsbeskrivelse= function(doc){
			if (doc.objectophavsbeskrivelse === undefined) 
				return null;

			var res = [];
			var split = doc.objectophavsbeskrivelse.split(smkCommon.split_1_niv);							
			var arrayLength = split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(split[i]);					
			}				

			return res.length > 0 ? res : null;		
		};				

		/**
		 * Titles
		 * */
		this.getTitle = function(doc, type){
			if (doc.title_all === undefined) 
				return null;

			var titles_split = doc.title_all.split(smkCommon.split_1_niv);
			var titles_data = [];			
			var arrayLength = titles_split.length;

			for (var i = 0; i < arrayLength; i++) {					
				var values = titles_split[i].split(smkCommon.split_2_niv);
				if(smkCommon.getValueFromSplit(values, 4) != null && smkCommon.getValueFromSplit(values, 4).indexOf(type) > -1){
					var title = smkCommon.getValueFromSplit(values, 0);
					var title_note = smkCommon.getValueFromSplit(values, 1);
					var title_lang = smkCommon.getValueFromSplit(values, 2);
					var title_transl = smkCommon.getValueFromSplit(values, 3);
					var title_type = smkCommon.getValueFromSplit(values, 4);					
					var tmp;
					var translation = new String();

					// we take only the first translation
					if(smkCommon.isValidDataText(title_transl)){
						var split_trans = title_transl.split(smkCommon.split_3_niv); 	           
						if (split_trans.length > 0)	
							translation= split_trans[0].split(smkCommon.split_4_niv)[0];            					           		         	            				                       
					}        	  		  

					tmp = {'title' : title};

					if(smkCommon.isValidDataText(title_note))
						tmp.note = title_note;

					if(smkCommon.isValidDataText(translation))
						tmp.trans = translation;

					titles_data.push(tmp);					
				}				
			};

			return titles_data;			
		}

		/**
		 * Production date
		 * */
		this.getProduction_vaerkdatering = function(doc){

			var vaerkdatering;

			switch(this.caller.manager.translator.getLanguage()){
			case "dk":		 			  			  			  
				vaerkdatering = doc.object_production_date_text_dk;
				break;
			case "en":
				vaerkdatering = doc.object_production_date_text_en;
				break;
			}

			return vaerkdatering === undefined ? null : vaerkdatering;
		};			

		this.getProduction_udgivet_place = function(doc){	
			if (doc.object_production_place_udgivet === undefined) 
				return null;

			var res = [];
			var split = doc.object_production_place_udgivet.split(smkCommon.split_1_niv);							
			var arrayLength = split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(split[i]);					
			}				

			return res.length > 0 ? res : null;						
		};

		this.getProduction_udfoert_place = function(doc){
			if (doc.object_production_place_udfoert === undefined) 
				return null;

			var res = [];
			var split = doc.object_production_place_udfoert.split(smkCommon.split_1_niv);							
			var arrayLength = split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(split[i]);					
			}							
		};

		this.getProduction_note = function(doc){			
			return doc.object_production_note === undefined ? null : doc.object_production_note;
		};

		/**
		 * Technique
		 * */
		this.getTechnique_technique = function (doc){			
			if (doc.prod_technique_dk === undefined && doc.prod_technique_en === undefined) 
				return null;

			var technique;
			var technique_all = [];
			var default_value = null;						

			switch(this.caller.manager.translator.getLanguage()){
			case "dk":		 			  			  			  
				technique = doc.prod_technique_dk !== undefined ? doc.prod_technique_dk : default_value;					  			  			  
				break;
			case "en":
				technique = doc.prod_technique_en !== undefined ? doc.prod_technique_en : default_value;
				break;
			default:	
				technique = default_value;
			break;		  
			}

			if(smkCommon.isValidDataText(technique)){
				var tech_split = technique.split(smkCommon.split_1_niv);							
				var arrayLength = tech_split.length;

				for (var i = 0; i < arrayLength; i++) {	
					technique_all.push(tech_split[i]);					
				}				
			}

			return technique_all;

		};

		this.getTechnique_dimensions = function (doc){

			var dimensions = new Array();			

			if (doc.dimension_bladmaal !== undefined)
				dimensions.push( 
						{
							'type' : 'bladmål',
							'dim' : doc.dimension_bladmaal
						}
				);			

			if (doc.dimension_plademaal!== undefined)
				dimensions.push( 
						{
							'type' : 'plademål',
							'dim' : doc.dimension_plademaal
						}
				);
			
			return dimensions;
		};				

		this.getTechnique_diameter = function(doc){			
			return doc.dimension_diameter === undefined ? null : doc.dimension_diameter;
		};

		this.getTechnique_vaegt = function(doc){			
			return doc.dimension_weight === undefined ? null : doc.dimension_weight;
		};

		this.getTechnique_materiale = function(doc){
			if (doc.materiale === undefined && doc.materiale_en === undefined) 
				return null;

			var mat;
			var mat_all = [];
			var default_value = null;						

			switch(this.caller.manager.translator.getLanguage()){
			case "dk":		 			  			  			  
				mat = doc.materiale !== undefined ? doc.materiale : default_value;					  			  			  
				break;
			case "en":
				mat = doc.materiale_en !== undefined ? doc.materiale_en : default_value;
				break;
			default:	
				mat = default_value;
			break;		  
			}

			if(smkCommon.isValidDataText(mat)){
				var mat_split = mat.split(smkCommon.split_1_niv);							
				var arrayLength = mat_split.length;

				for (var i = 0; i < arrayLength; i++) {	
					var values = mat_split[i].split(smkCommon.split_2_niv); 					 										
					var mat_val = smkCommon.getValueFromSplit(values, 0) != null ? smkCommon.getValueFromSplit(values, 0) : "";
					var mat_type = smkCommon.getValueFromSplit(values, 1) != null ? sprintf("(%s)", smkCommon.getValueFromSplit(values, 1)) : "";					
					var res = sprintf("%s%s", mat_val, mat_type);

					mat_all.push(res);					
				}				
			}

			return mat_all;
		};

		this.getTechnique_format = function(doc){			
			return doc.form === undefined ? null : doc.form;
		};

		this.getTechnique_watermark = function(doc){			
			return doc.watermark === undefined ? null : doc.watermark;
		};

		this.getTechnique_tilstand = function(doc){			
			return doc.physicaldescription === undefined ? null : doc.physicaldescription;
		};

		this.getTechnique_vaerkstatus = function(doc){			
			if (doc.vaerkstatus === undefined) 
				return null;

			var res = [];
			var split = doc.vaerkstatus.split(smkCommon.split_1_niv);							
			var arrayLength = split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(split[i]);					
			}				

			return res.length > 0 ? res : null;
		};

		this.getTechnique_eksemplar = function(doc){			
			return doc.oplag === undefined ? null : doc.oplag;
		};

		this.getTechnique_bladnummer = function(doc){			
			return doc.other_numbers_bladnummer === undefined ? null : doc.other_numbers_bladnummer;
		};

		this.getTechnique_sidetal = function(doc){			
			return doc.other_numbers_sidetal === undefined ? null : doc.other_numbers_sidetal;
		};

		this.getTechnique_omslag = function(doc){			
			return doc.omslag === undefined ? null : doc.omslag;
		};

		this.getTechnique_stadium = function(doc){			
			return doc.stadium === undefined ? null : doc.stadium;
		};

		this.getTechnique_kollation = function(doc){			
			return doc.object_briefdescriptions === undefined ? null : doc.object_briefdescriptions;
		};

		this.getTechnique_note_vaerkstatus = function (doc){			
			if (doc.description_note_dk === undefined && doc.description_note_en === undefined) 
				return null;

			var status;
			var status_all = [];
			var default_value = null;						

			switch(this.caller.manager.translator.getLanguage()){
			case "dk":		 			  			  			  
				status = doc.description_note_dk !== undefined ? doc.description_note_dk : default_value;					  			  			  
				break;
			case "en":
				status = doc.description_note_en !== undefined ? doc.description_note_en : default_value;
				break;
			default:	
				status = default_value;
			break;		  
			}

			if(smkCommon.isValidDataText(status)){
				var status_split = status.split(smkCommon.split_1_niv);							
				var arrayLength = status_split.length;

				for (var i = 0; i < arrayLength; i++) {	
					status_all.push(status_split[i]);					
				}				
			}

			return status_all;

		};

		this.getTechnique_opstilling = function(doc){			
			return doc.opstilling === undefined ? null : doc.opstilling;
		};

		this.getTechnique_note_elementer = function(doc){			
			return doc.note_elementer === undefined ? null : doc.note_elementer;
		};		

		/**
		 * Inscription
		 * */
		this.getInscription_signatur = function(doc){
			if (doc.inscription_signatur === undefined) 
				return null;

			var res = [];
			var inscr_split = doc.inscription_signatur.split(smkCommon.split_1_niv);							
			var arrayLength = inscr_split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(inscr_split[i]);					
			}				

			return res.length > 0 ? res : null;
		};

		this.getInscription_tryktsignatur = function(doc){	
			if (doc.inscription_tryktsignatur === undefined) 
				return null;

			var res = [];
			var inscr_split = doc.inscription_tryktsignatur.split(smkCommon.split_1_niv);							
			var arrayLength = inscr_split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(inscr_split[i]);					
			}				

			return res.length > 0 ? res : null;
		};

		this.getInscription_paaskrift = function(doc){
			if (doc.inscription_paaskrift === undefined) 
				return null;

			var res = [];
			var inscr_split = doc.inscription_paaskrift.split(smkCommon.split_1_niv);							
			var arrayLength = inscr_split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(inscr_split[i]);					
			}				

			return res.length > 0 ? res : null;
		};

		this.getInscription_trykttekst = function(doc){
			if (doc.inscription_trykttekst === undefined) 
				return null;

			var res = [];
			var inscr_split = doc.inscription_trykttekst.split(smkCommon.split_1_niv);							
			var arrayLength = inscr_split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(inscr_split[i]);					
			}				

			return res.length > 0 ? res : null;
		};

		this.getInscription_samlermaerke = function(doc){
			if (doc.inscription_samlermaerke === undefined) 
				return null;

			var res = [];
			var inscr_split = doc.inscription_samlermaerke.split(smkCommon.split_1_niv);							
			var arrayLength = inscr_split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(inscr_split[i]);					
			}				

			return res.length > 0 ? res : null;
		};				

		/**
		 * Acquisition
		 * */
		this.getErhverv_dato = function(doc){						
			var date;
			var default_value = null;

			switch(this.caller.manager.translator.getLanguage()){
			case "dk":		 			  			  			  
				date = doc.acq_date !== undefined ? doc.acq_date : default_value;					  			  			  
				break;
			case "en":
				date = doc.acq_date_en !== undefined ? doc.acq_date_en : default_value;
				break;
			default:	
				date = default_value;
			break;		  
			}

			return date;

		};

		this.getErhverv_proveniens = function(doc){	
			if (doc.proveniens === undefined) 
				return null;

			var res = [];
			var split = doc.proveniens.split(smkCommon.split_1_niv);							
			var arrayLength = split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(split[i]);					
			}				

			return res.length > 0 ? res : null;								
		};

		/**
		 * References
		 * */
		this.getReferences_vaerkfortegn = function(doc){			
			return doc.other_numbers_vaerkfortegn === undefined ? null : doc.other_numbers_vaerkfortegn;
		};

		this.getReferences_gernsheim = function(doc){			
			return doc.other_numbers_gernsheim === undefined ? null : doc.other_numbers_gernsheim;
		};

		this.getReferences_beckett = function(doc){			
			return doc.other_numbers_beckett === undefined ? null : doc.other_numbers_beckett;
		};		

		this.getReferences_litteratur = function(doc){			
			if (doc.citations === undefined) 
				return null;

			var citations_split = doc.citations.split(smkCommon.split_1_niv);
			var citations_data = [];			
			var arrayLength = citations_split.length;

			for (var i = 0; i < arrayLength; i++) {	
				var values = citations_split[i].split(smkCommon.split_2_niv);
				
				if (smkCommon.isValidDataText(smkCommon.getValueFromSplit(values, 1))){					
					var agent = smkCommon.getValueFromSplit(values, 0);
					var title = smkCommon.getValueFromSplit(values, 1);
					var place = smkCommon.getValueFromSplit(values, 2);
					var date = smkCommon.getValueFromSplit(values, 3);
					var refnote = smkCommon.getValueFromSplit(values, 4);  
					var tmp;

					tmp = sprintf('%s%s%s%s%s' , 
							smkCommon.isValidDataText(agent, 'agent') ? sprintf('%s : ', agent ) : '',
									smkCommon.isValidDataText(title) ? sprintf('%s : ', title ) : '',						
											smkCommon.isValidDataText(place) ? sprintf('%s ', place ) : '',
													smkCommon.isValidDataText(date) ? sprintf('%s :', date ) : ' :',
															smkCommon.isValidDataText(refnote) ? sprintf('%s', refnote ) : '');

					citations_data.push(tmp);
				}
			};

			return citations_data;
		};

		/**
		 * Exhibitions
		 * */
		this.getUdstilling_udstilling = function(doc){
			if (doc.exhibitionvenues === undefined) 
				return null;

			var exhibitionvenues_split = doc.exhibitionvenues.split(smkCommon.split_1_niv);			
			var exhibitions_data = [];			
			var arrayLength = exhibitionvenues_split.length;

			for (var i = 0; i < arrayLength; i++) {
				var values = exhibitionvenues_split[i].split(smkCommon.split_2_niv);
				
				if (smkCommon.isValidDataText(smkCommon.getValueFromSplit(values, 1))){
					
					var title = smkCommon.getValueFromSplit(values, 0);
					var place = smkCommon.getValueFromSplit(values, 1);
					var date_start = smkCommon.getValueFromSplit(values, 2);
					var date_end = smkCommon.getValueFromSplit(values, 3);   
					var tmp;

					tmp = sprintf('%s : %s : %s %s' , 							
							title, 
							place, 
							date_start, 
							date_end);

					if (smkCommon.isValidDataText(title))
						exhibitions_data.push(tmp);	      			
				}	      			      
			};

			return exhibitions_data;
		}

		/**
		 * Remarks
		 * */
		this.getBemaerk_anden_litt = function(doc){	
			if (doc.comments === undefined) 
				return null;

			var res = [];
			var split = doc.comments.split(smkCommon.split_1_niv);							
			var arrayLength = split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(split[i]);					
			}				

			return res.length > 0 ? res : null;		
		};

		/**
		 * Motiv
		 * */
		this.getMotiv_topografisk = function(doc){	
			if (doc.topografisk_motiv === undefined) 
				return null;

			var res = [];
			var split = doc.topografisk_motiv.split(smkCommon.split_1_niv);							
			var arrayLength = split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(split[i]);					
			}				

			return res.length > 0 ? res : null;		
		};

		this.getMotiv_portraet = function(doc){
			if (doc.portrait_person === undefined) 
				return null;

			var res = [];
			var split = doc.portrait_person.split(smkCommon.split_1_niv);							
			var arrayLength = split.length;

			for (var i = 0; i < arrayLength; i++) {	
				res.push(split[i]);					
			}				

			return res.length > 0 ? res : null;	
		};

		this.getMotiv_note = function(doc){			
			return doc.content_notes === undefined ? null : doc.content_notes;
		};

		/**
		 * Subwidgets
		 * */

		/* Request for Original work */
		this.getSubWidgReq_original = function(doc){
			return doc.related_works_orig_number === undefined ? null : sprintf('id:"%s"', doc.related_works_orig_number.split('/')[0]);													
		};

		/* Request for Multipart work */
		this.getSubWidgReq_vaerkdele = function(doc){
			if(doc.multi_work_ref === undefined )
				return null;

			var multi_works = doc.multi_work_ref.split(';-;');						
			var allworksRequest = null;

			if(multi_works.length > 0){
				var work = multi_works[0].split(';--;');
				if(work.length > 2){
					allworksRequest = sprintf('id:"%s"', work[1].split('/')[0]);	
				}					
			}

			return allworksRequest;
		};

		/* Request for Related works */
		this.getSubWidgReq_relatere= function(doc){
			if(doc.related_id === undefined )
				return null;

			var related_works = doc.related_id.split(';-;');						
			var allrelatedRequest = [];

			for ( var i = 0, l = related_works.length; i<l; ++i ) {
				var work = related_works[i].split(';--;');
				if(work.length > 0)
					allrelatedRequest.push(sprintf('id_s:"%s"', work[1]));	
			}

			return allrelatedRequest.length == 0 ? null : allrelatedRequest.join(' OR ');
		};

		/**
		 * Variables
		 * */
		this.caller = caller;
	}

}));