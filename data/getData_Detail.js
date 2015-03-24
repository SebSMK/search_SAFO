(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var getdatadetail = {};
		factory(getdatadetail);
		if (typeof define === "function" && define.amd) {
			define(getdatadetail); // AMD
		} else {
			root.getData_Detail = getdatadetail; // <script>
		}
	}
}(this, function (getdatadetail) {

	getdatadetail.constructor = function(caller){

		this.get_data = function (doc){
			var data =  {
					media:{
						title: this.getTitle(doc),	
						alt: this.getAlt(doc),		  						
						image: getData_Common.getMedia_image(doc, 'large', this.caller),
						copyright: getData_Common.getMedia_copyright(doc, this.caller),
						copyright_default: !getData_Common.computeCopyright(doc) && doc.medium_image_url !== undefined,
						copyright_valid: getData_Common.computeCopyright(doc),
						img_id:doc.id
					},

					info:{

						title: this.getTitle(doc),	
						artist: doc.artist_name === undefined ? '' : this.getArtist(doc),
						artwork_date: this.getObjectProdDate(doc),
						description: this.getDescriptionNote(doc),
						technique: {
							key: this.caller.manager.translator.getLabel('detail_technique'),  
							value: smkCommon.firstCapital(this.getTechnique(doc)) 
						},
						meta: {
							key: this.caller.manager.translator.getLabel('detail_reference'),
							value: doc.id
						},	

						image: getData_Common.getMedia_image(doc, 'large', this.caller),
						acq: false,
						dim: false,
						location:false,
						proveniens:false
					},
					
					subwidget:{
						req_multiwork: this.getReq_multiwork(doc),
						req_relatedid: this.getReq_relatedid(doc)
						
					}
			};	

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


			return data;	  

		};   

		this.getReq_multiwork = function(doc){
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
		
		this.getReq_relatedid = function(doc){
			if(doc.related_id === undefined )
				return null;
				
			var related_works = doc.related_id.split(';-;');						
			var allrelatedRequest = [];
			
			for ( var i = 0, l = related_works.length; i<l; ++i ) {
				var work = related_works[i].split(';--;');
				if(work.length > 0)
					allrelatedRequest.push(sprintf('id:"%s"', work[1]));	
			}

			return allrelatedRequest.length == 0 ? null : allrelatedRequest.join(' OR ');
		};
		
		this.getObjectProdDate = function (doc){
			var date;
			var default_value = "";

			switch(this.caller.manager.translator.getLanguage()){
			case "dk":		 			  			  			  
				date = doc.object_production_date_text_dk !== undefined ? doc.object_production_date_text_dk : default_value;					  			  			  
				break;
			case "en":
				date = doc.object_production_date_text_en !== undefined ? doc.object_production_date_text_en : default_value;
				break;
			default:	
				date = default_value;
			break;		  
			}

			return date != default_value ? sprintf(',&nbsp;%s', date) : date;

		};

		this.getProvenance = function(doc){
			return this.caller.manager.translator.getLanguage() == "dk" && doc.proveniens !== undefined ? true : false 
		};


		this.getAlt = function (doc){	  
			var artist = this.getArtistName(doc) == '' ? '' : this.getArtistName(doc) + ' - ';
			var title = this.getTitle(doc);
			var copyright = getData_Common.computeCopyright(doc); 

			return  copyright == false ? sprintf('%s%s', artist, title) : sprintf('%s - %s', copyright, title); 	  
		};

		this.get_OG_description = function (doc){	  
			var artist = this.getArtistName(doc) == '' ? '' : this.getArtistName(doc);	
			var copyright = getData_Common.computeCopyright(doc); 

			return  copyright == false ? sprintf('%s', artist) : sprintf('%s', copyright); 	  
		};

		this.get_OG_title = function (doc){	  

			var title = this.getTitle(doc).replace(/"/g, '');
			var date = this.getObjectProdDate(doc) != '' ? sprintf(', %s', this.getObjectProdDate(doc)) : '';	   

			return  sprintf('%s%s', title, date ) 	  
		};


		this.getTechnique = function (doc){
			var technique;
			var default_value = "-";

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

			return technique;

		};

		this.getDescriptionNote = function (doc){
			var note;
			var default_value = "";

			switch(this.caller.manager.translator.getLanguage()){
			case "dk":		 			  			  			  
				note = doc.description_note_dk !== undefined ? doc.description_note_dk : default_value;					  			  			  
				break;
			case "en":
				note = doc.description_note_en !== undefined ? doc.description_note_en : default_value;
				break;
			default:		
				technique = default_value;
			break;		  
			}

			return note;

		};


		this.getArtist = function(doc){
			var artistLabel = new Array();
			var docBirth;
			var docDeath;
			var docNatio;

			switch(this.caller.manager.translator.getLanguage()){
			case "dk":		 			  			  			  
				docBirth = doc.artist_birth_dk;
				docDeath = doc.artist_death_dk;	
				docNatio = doc.artist_natio_dk;
				break;
			case "en":
				docBirth = doc.artist_birth_en;
				docDeath = doc.artist_death_en;
				docNatio = doc.artist_natio_en;
				break;
			}


			if (doc.artist_name !== undefined){
				// check if all arrays containing artist's data have the same size
				if((doc.artist_name.length != doc.artist_auth.length) && (doc.artist_name.length != doc.artist_natio_dk.length)  && (doc.artist_name.length != docBirth.length) && (doc.artist_name.length != docDeath.length))
					return doc.artist_name;

				for (var i = 0, l = doc.artist_name.length; i < l; i++) {
					var name = doc.artist_name[i];
					var role = doc.artist_auth[i] != 'original' && doc.artist_auth[i] != '' ? sprintf('(%s)', doc.artist_auth[i].toLowerCase()) : "";
					var nationality = docNatio[i] != '(?)' && docNatio[i].trim() != '' ? sprintf('%s', docNatio[i]) : '';
					var birth = docBirth[i];
					var death = docDeath[i] != '(?)' ? docDeath[i] : (docDeath[i] < 1800) ? docDeath[i] : "";
					var dates = docBirth[i].trim() != '' || docDeath[i].trim() != '' ? sprintf(', %s - %s', birth, death) : '';
					
					var padding = "";

					var label = sprintf('%s%s&nbsp;<span>%s</span> <br><span>%s%s</span>', padding, name, role, nationality, dates);
					artistLabel.push({'artist_data' : label});		  		  
				}		  		  
			}	  

			return artistLabel;
		};		  

		this.getArtistName = function(doc){	  	  	  
			// we take only the first name
			if (doc.artist_name === undefined)
				return '';

			for (var i = 0, l = doc.artist_name.length; i < l; i++) {
				return doc.artist_name[i];		  		  		  
			}
		};

		this.getTitle = function(doc){

			var title;

			switch(this.caller.manager.translator.getLanguage()){
			case "dk":		 			  			  			  
				title = doc.title_dk !== undefined ? doc.title_dk : doc.title_first;					  			  			  
				break;
			case "en":
				title = doc.title_eng !== undefined ? doc.title_eng : (doc.title_dk !== undefined ? doc.title_dk : doc.title_first);
				break;
			default:		    			  			   							  
				title = doc.title_first		  	 		  	  
				break;		  
			}

			return title;
		};

		this.getlocation = function (location){

			if(location !== undefined && this.caller.manager.translator.getCollection(smkCommon.replace_dansk_char(location)) != '')
				return true;

			return false;	  				  
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