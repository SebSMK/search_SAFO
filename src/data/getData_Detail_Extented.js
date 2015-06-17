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
							value: smkCommon.firstCapital(this.getRootArtType(doc))
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
							value: getData_Common.getIdent_samling(doc, caller)
						},

						ident_andet_inv: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_ident_andet_inv')),  
							value: getData_Common.getIdent_andet_inv(doc)
						},

						producent_lab: this.caller.manager.translator.getLabel('detail_producent_lab'),						

						producent_producents: {							  							
							value: this.getListAllProducers(doc),
							show: doc.artist_name !== undefined ? true : false
						},

						producent_formeri: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_formeri')),  
							value: getData_Common.getProducent_formeri(doc)							
						},
						
						producent_objectophavsbeskrivelse: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_producent_objectophavsbeskrivelse')),  
							value: getData_Common.getProducent_objectophavsbeskrivelse(doc),
							show: getData_Common.getProducent_objectophavsbeskrivelse(doc) !== null? true : false
						},       

						title_lab: this.caller.manager.translator.getLabel('detail_title_lab'),

						title_titles: {							  
							value: this.getAllTitles(doc),
							show: true,
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
							show: getData_Common.getTechnique_technique(doc) !== null? true : false
						},						

						technique_dimensions: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_dimensions')),  
							value: this.getDim(doc),
							show: this.getDim(doc).length > 0 ? true : false
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
							show: this.getMateriale(doc).length > 0 ? true : false
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
							show: getData_Common.getTechnique_vaerkstatus(doc) != null ? true : false
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
							show: getData_Common.getTechnique_kollation(doc) != null ? true : false
						},

						technique_note_vaerkstatus: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_note_vaerkstatus')),  
							value: getData_Common.getTechnique_note_vaerkstatus(doc),
							show: getData_Common.getTechnique_note_vaerkstatus(doc) != null ? true : false
						},												

//						technique_opstilling: {
//							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_opstilling')),  
//							value: getData_Common.getTechnique_opstilling(doc)
//						},
//
//						technique_note_elementer: {
//							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_technique_note_elementer')),  
//							value: getData_Common.getTechnique_note_elementer(doc)
//						},


						inscription_lab: this.caller.manager.translator.getLabel('detail_inscription_lab'),

						inscription_signatur: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_inscription_signatur')),  
							value: this.getInscription_transl(getData_Common.getInscription_signatur(doc)),
							show: getData_Common.getInscription_signatur(doc) != null ? true : false
						},


						inscription_tryktsignatur: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_inscription_tryktsignatur')),  
							value: this.getInscription_transl(getData_Common.getInscription_tryktsignatur(doc)),
							show: getData_Common.getInscription_tryktsignatur(doc) != null ? true : false
						},

						inscription_paaskrift: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_inscription_paaskrift')),  
							value: this.getInscription_transl(getData_Common.getInscription_paaskrift(doc)),
							show: getData_Common.getInscription_paaskrift(doc) != null ? true : false
						},

						inscription_trykttekst: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_inscription_trykttekst')),  
							value: this.getInscription_transl(getData_Common.getInscription_trykttekst(doc)),
							show: getData_Common.getInscription_trykttekst(doc) != null ? true : false
						},

						inscription_samlermaerke: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_inscription_samlermaerke')),  
							value: getData_Common.getInscription_samlermaerke(doc),
							show: getData_Common.getInscription_samlermaerke(doc) != null ? true : false
						},

						erhverv_lab: this.caller.manager.translator.getLabel('detail_erhverv_lab'),

						erhverv_erhverv: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_erhverv_erhverv')),  
							value: this.getDetailAcq(doc)
						},

						erhverv_proveniens: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_erhverv_proveniens')),  
							value: getData_Common.getErhverv_proveniens(doc),
							show: getData_Common.getErhverv_proveniens(doc) != null ? true : false
						},																						

						references_lab: this.caller.manager.translator.getLabel('detail_references_lab'),

						references_vaerkfortegn: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_references_vaerkfortegn')),  
							value: getData_Common.getReferences_vaerkfortegn(doc)
						},

						references_gernsheim: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_references_gernsheim')),  
							value: getData_Common.getReferences_gernsheim(doc)
						},

						references_beckett: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_references_beckett')),  
							value: getData_Common.getReferences_beckett(doc)
						},

						references_litteratur: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_references_litteratur')),  
							value: getData_Common.getReferences_litteratur(doc),
							show: getData_Common.getReferences_litteratur(doc) != null ? true : false
						},

						references_texts: {  
							value: getData_Common.getReferences_texts(doc),
							show: getData_Common.getReferences_texts(doc) != null ? true : false
						},

						udstilling_lab: this.caller.manager.translator.getLabel('detail_udstilling_lab'),

						udstilling_udstilling: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_udstilling_udstilling')),  
							value: getData_Common.getUdstilling_udstilling(doc),
							show: getData_Common.getUdstilling_udstilling(doc) != null ? true : false
						},	

						bemaerk_lab: this.caller.manager.translator.getLabel('detail_bemaerk_lab'),

						bemaerk_anden_litt: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_bemaerk_anden_litt')),  
							value: getData_Common.getBemaerk_anden_litt(doc),
							show: getData_Common.getBemaerk_anden_litt(doc) != null ? true : false
						},	

						motiv_lab: this.caller.manager.translator.getLabel('detail_motiv_lab'),

						motiv_topografisk: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_motiv_topografisk')),  
							value: getData_Common.getMotiv_topografisk(doc),
							show: getData_Common.getMotiv_topografisk(doc) != null ? true : false
						},	

						motiv_portraet: {
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_motiv_portraet')),  
							value: getData_Common.getMotiv_portraet(doc),
							show: getData_Common.getMotiv_portraet(doc) != null ? true : false
						},

						motiv_note: { 
							key: smkCommon.firstCapital(this.caller.manager.translator.getLabel('detail_motiv_note')),  
							value: getData_Common.getMotiv_note(doc),
							show: getData_Common.getMotiv_note(doc) != null ? true : false
						}																									
					},

					subwidget:{
						req_original: getData_Common.getSubWidgReq_original(doc),
						req_multiwork: getData_Common.getSubWidgReq_vaerkdele(doc),
						req_relatedid: getData_Common.getSubWidgReq_relatere(doc)									
					}
			};	

			return data;	  

		}; 

		this.getInscription_transl = function(inscription_arr){
			var res = inscription_arr;
			if(smkCommon.getCurrentLanguage() == "en" && inscription_arr != null){

				for (var i = 0; i < inscription_arr.length; i++) {
					var inscription = inscription_arr[i];
					var values = inscription.value.split(":"); 					 										
					var place = smkCommon.getValueFromSplit(values, 0) != null ? smkCommon.getValueFromSplit(values, 0) : "";						
					var trans = new String();
					var place_sw = smkCommon.replace_non_alpha_char(smkCommon.replace_dansk_char(place));

					switch(place_sw){
					case "f_n_":
					case "f_n_m_f_":
					case "f_n_t_h_":
					case "f_n_t_h_f_m_":
					case "f_n_t_v_":
					case "f_n_t_v_f_m_":
					case "f_o_":
					case "f_o_m_f_":
					case "f_o_t_h_":
					case "f_o_t_v_":
					case "i_bunden_":
					case "m_f_":
					case "n_":
					case "n_t_h_":
					case "n_t_v_":
					case "o_m_":
					case "t_h_":
					case "t_h_f_m_":
					case "t_h_m_f_":
					case "t_v_":
					case "t_v_f_m_":
					case "t_v_m_f_":
					case "u_m_":
					case "oe_":
					case "oe_t_h_":
					case "oe_t_v_":
						trans = this.caller.manager.translator.getLabel('inscription_' + place_sw);			
					}

					if(smkCommon.isValidDataText(trans))
						res[i].value = inscription.value.replace(place, trans);											
				}										
			}

			return res;			
		};


		this.getDetailAcq = function(doc){
//			var method = smkCommon.isValidDataText(getData_Common.getErhverv_method(doc)) ? sprintf('%s', getData_Common.getErhverv_method(doc)) : "";
//			var source = smkCommon.isValidDataText(getData_Common.getErhverv_source(doc)) ? sprintf(' %s', getData_Common.getErhverv_source(doc)) : "";
//			var dato = smkCommon.isValidDataText(getData_Common.getErhverv_dato(doc)) ? sprintf(' %s', getData_Common.getErhverv_dato(doc)) : "";	 
//
//			return smkCommon.isValidDataText(getData_Common.getErhverv_method(doc)) || smkCommon.isValidDataText(getData_Common.getErhverv_source(doc)) || smkCommon.isValidDataText(getData_Common.getErhverv_dato(doc)) ? 
//					sprintf("%s%s%s", method, source, dato) : null;

			var dato = smkCommon.isValidDataText(getData_Common.getErhverv_dato(doc)) ? sprintf(' %s', getData_Common.getErhverv_dato(doc)) : "";
			
			return dato;
			

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

		this.getListAllProducers = function(doc){
			var self = this;
			var all_prod_datas = getData_Common.getProducent_all_producers(doc);
			var res = [];
			
			$.each(all_prod_datas, function(index, data) {
				var output = self.getArtistOutput(data);
				output.type = smkCommon.firstCapital(self.caller.manager.translator.getLabel('detail_producent_' + data.type));
				res.push(output);					
			});								

			return res; 			
		};

		this.getArtistOutput = function(doc){
			var res = {};

			if (doc.name != undefined)
				res.name = doc.name;

			var dates = smkCommon.isValidDataText(doc.dates) ? sprintf(', %s', doc.dates) : "";
			var nationality = smkCommon.isValidDataText(doc.nationality) ? sprintf('%s', doc.nationality) : "";												

			res.info = dates || nationality ? sprintf('(%s%s)', nationality, dates) : "";			

			return res;
		};

		this.getAllTitles = function(doc){
			var self = this;
			var alltitles = getData_Common.getTitle(doc, 'all');

			$.each(alltitles, function( index, value ) {
				$.each(getData_Common.enumTitleTypes, function(key, val) {
					if(smkCommon.isValidDataText(value.type) && value.type.indexOf(key) > -1){
						value.type = smkCommon.firstCapital(self.caller.manager.translator.getLabel('title_' + val));
						return false;//--> break from jQuery.each
					}						
				});			

			});

			return alltitles;
		};
		
		this.getRootArtType = function(doc){
			var arttype = getData_Common.getIdent_vaerktype(doc);						
			var arttype_hierarchi = this.caller.manager.translator.getLabel('arttype_hierarchi');							
			var parent =  this.getParentType(arttype_hierarchi, arttype.trim());
			var root_category = parent != null && parent.id !== undefined ? parent.id : arttype.trim();
			// iterate the object_type tree until we find a root category
			while (parent != null && parent.id !== undefined){
				root_category = parent.id;
				parent = this.getParentType(arttype_hierarchi, parent.id.trim());
			}

			return root_category;
		};
		
		this.getParentType = function (tree, childNode){
			var i, res;
			if (!tree || !tree.value) {
				return null;
			}
			if( Object.prototype.toString.call(tree.value) === '[object Array]' ) {
				for (i in tree.value) {
					if (tree.value[i].id === childNode) {
						return tree;
					}
					res = this.getParentType(tree.value[i], childNode);
					if (res) {
						return res;
					}
				}
				return null;
			} else {
				if (tree.value.id === childNode) {
					return tree;
				}
				return this.getParentType(tree.value, childNode);
			}
		};

		/*
		 * variables
		 */
		this.caller = caller;

	}

}));