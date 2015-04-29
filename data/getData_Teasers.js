(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var getdatateasers = {};
		factory(getdatateasers);
		if (typeof define === "function" && define.amd) {
			define(getdatateasers); // AMD
		} else {
			root.getData_Teasers = getdatateasers; // <script>
		}
	}
}(this, function (getdatateasers) {

	getdatateasers.constructor = function(caller){

		this.getData = function (doc){
			var data;

			var data =  {
					url: this.getDetailUrl(doc),
					
					media:{
						title: getData_Common.getTitle(doc, 'museum'),	
						alt: getData_Common.getMedia_alt(doc),
						image: getData_Common.getMedia_image(doc, 'medium'),
						no_image: doc.medium_image_url === undefined ? true : false,
						copyright: getData_Common.getMedia_copyright(doc, this.caller),	
						copyright_text_cc0: this.caller.manager.translator.getLabel('teaser_copyright_def'),
						img_id: doc.id,
						url: this.getDetailUrl(doc)
						
					},
					
					info:{
						producent_kunster: this.getListProducers(doc),																																
						title_museum: this.getTeaserTitle(doc),															
						datering_production_vaerkdatering: getData_Common.getProduction_vaerkdatering(doc),		
						ident_invnummer: getData_Common.getIdent_invnummer(doc),	
						location_location: this.getListLocation(doc, this.caller),
						url: this.getDetailUrl(doc),
						
						title_pad: smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.orig)) ? false : true,						
						
						label_ref: this.caller.manager.translator.getLabel("list_reference")
					},
					
					debug:{
						score: getData_Common.getScore(doc)						
					}
			};	


			return data;

		};  				
		
		this.getDetailUrl = function(doc){									
			var model = {};
			model.q = doc.id;
			model.view = 'detail';
			model.lang = smkCommon.getCurrentLanguage();

			return ModelManager.buildURLFromModel(model); 
		};
		
		this.getTeaserTitle = function(doc){
			var title_mus = getData_Common.getTitle(doc, 'museum');
			var title_besk = getData_Common.getTitle(doc, 'beskriv');
			var title_serie = getData_Common.getTitle(doc, 'serie');
			var title_teaser = title_mus || title_besk || title_serie;
			
			var title = new String();
			var max = 70;
			var short;
			
			if(title_teaser != null && title_teaser.length > 0){
				switch(smkCommon.getCurrentLanguage()){
				case "dk":		 		
					title = title_teaser[0].title;
					break;
				case "en":
					title = smkCommon.isValidDataText(title_teaser[0].trans) ? title_teaser[0].trans : title_teaser[0].title; 
					break;
				}									
			}else{				
				title = doc.title_first;
			}
			
			if (smkCommon.isValidDataText(title))
				title = title.length > max ? sprintf('%s(...)', title.substring(0, max)) : title;
				
			return smkCommon.isValidDataText(title) ? title : null;
		};
		
		this.getListLocation = function (doc, caller){
			var location = smkCommon.firstCapital(doc.location_name);
			var location_inhouse = smkCommon.isValidDataText(location) ? caller.manager.translator.getCollection(smkCommon.replace_dansk_char(location)) : ''; 
			var label = smkCommon.isValidDataText(location_inhouse) ? 
					sprintf('%s %s', caller.manager.translator.getLabel("teaser_on_display"), location) 
						: 
					caller.manager.translator.getLabel("teaser_appoint");
			
			return label;
		};
		
		this.getListProducers = function(doc){									
			var res = new Array();
			var list = new Array();
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.orig)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.orig));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.tilsk)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.tilsk));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.tidl)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.tidl));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.vaerksted)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.vaerksted));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.efterfoel)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.efterfoel));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.inventor)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.inventor));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.skole)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.skole));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.stil)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.stil));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.kopi)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.kopi));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.efterfor)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.efterfor));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.udgiver)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.udgiver));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.trykker)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.trykker));
			if (smkCommon.isValidDataText(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.forfatter)))
				list.push(getData_Common.getProducent_producent(doc, getData_Common.enumProducent.forfatter));
			
			var max = 3;
			
			for (var i = 0, l = list.length; res.length < max && i < l; i++) {
				
				for (var j = 0, k = list[i].length; res.length < max && j < k ; j++) {
					if (res.length == max - 1 && (j + 1 < k || i + 1 < l))
						list[i][j].artist_data.etc = '(...)';
						
					
					if(smkCommon.isValidDataText(list[i][j].artist_data.role))
						list[i][j].artist_data.role = sprintf(' %s', list[i][j].artist_data.role);
						
					res.push(list[i][j]);
				}				
				
			}
			
			return res; 
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