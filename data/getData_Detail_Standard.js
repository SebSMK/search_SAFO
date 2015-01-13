(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var getdatadetailstandard = {};
		factory(getdatadetailstandard);
		if (typeof define === "function" && define.amd) {
			define(getdatadetailstandard); // AMD
		} else {
			root.getData_Detail_Basis = getdatadetailstandard; // <script>
		}
	}
}(this, function (getdatadetailstandard) {

	getdatadetailstandard.constructor = function(caller){

		this.get_data = function (doc){
			var data =  {

					media:{
						title: getData_Common.getTitle(doc, 'museum'),	
						alt: getData_Common.getMedia_alt(doc),
						image: getData_Common.getMedia_image(doc, this.caller),						
						copyright: getData_Common.getMedia_copyright(doc, this.caller),
						copyright_default: !smkCommon.computeCopyright(doc) && doc.medium_image_url !== undefined,
						copyright_valid: smkCommon.computeCopyright(doc),
						img_id:doc.id
					},
					
					info:{
						
						ident_invnummer: getData_Common.getIdent_invnummer(doc),						
						
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
						
						title_museum: getData_Common.getTitle(doc, 'museum'),
						title_serie: getData_Common.getTitle(doc, 'serie'),						
						
						datering_production_vaerkdatering: getData_Common.getProduction_vaerkdatering(doc),		
												
						technique_technique: getData_Common.getTechnique_technique(doc),
						technique_dimensions: getData_Common.getTechnique_dimensions(doc), 						
														
					},

					subwidget:{
						req_original: getData_Common.getSubWidgReq_original(doc),
						req_multiwork: getData_Common.getSubWidgReq_vaerkdele(doc),
						req_relatedid: getData_Common.getSubWidgReq_relatere(doc)									
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
		
		this.getImage = function ($target){

			var self = this.caller;

			if ($target === undefined || $target.length == 0){
				$(self).trigger({
					type: "smk_teasers_this_img_loaded"
				});  	
				return;
			}

			var img_id = $target.attr("img_id");
			var path = $target.attr("src");
			var alt = $target.attr("alt");
			var title = $target.attr("alt");
			var img = new Image();

			// wrap our new image in jQuery, then:
			$(img)
			// once the image has loaded, execute this code
			.load(function () {
				// set the image hidden by default    
				$target.hide();

				//* if not default picture
				if ($(this).attr("src") != self.default_picture_path){
					// with the holding div #loader, apply:
					$target
					// remove the loading class (so the ViewManager can remove background spinner), 
					.removeClass('image_loading')
					.find('a')
					// then insert our image
					.append(this);

					// add fancybox
					$target.find('a').addClass('fancybox');
					$(this).fancybox({
						afterClose: function(){
							$target.find('img').show();
						}
					});
				}
				//* default picture
				else{

					$target
					// remove the loading class (so the ViewManager can remove background spinner), 
					.removeClass('image_loading')
					// remove link
					.remove('a')
					// then insert our image
					.append(this);
				};	          

				// fade our image in to create a nice effect
				$target.show();

				// trig "this image is loaded" event	      
				$(self).trigger({
					type: "smk_detail_this_img_loaded"
				}); 

			})

			// if there was an error loading the image, react accordingly
			.error(function () {
				$target
				// remove the loading class (so no background spinner), 
				.removeClass('image_loading')
				.remove('a')
				.append(sprintf('<img src="%s" />', self.default_picture_path));

				$target.fadeIn();

				// trig "this image is loaded" event	      
				$(self).trigger({
					type: "smk_detail_this_img_loaded"
				});
			})		

			.attr('alt', alt)
			.attr('title', title)

			// *finally*, set the src attribute of the new image to our image
			.attr('src', path);	  	   
		};		  
	}
}));