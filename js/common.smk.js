(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var common = {};
		factory(common);
		if (typeof define === "function" && define.amd) {
			define(common); // AMD
		} else {
			root.smkCommon = common; // <script>
		}
	}
}(this, function (common) {			

	common.split_1_niv = ";-;";
	common.split_2_niv = ";--;";
	common.split_3_niv = ";---;";
	common.split_4_niv = ";-v;";	
	
	
	common.getValueFromSplit = function(splited, index){		
		return splited.length > index && common.isValidDataText(splited[index]) ? splited[index] : null;		
	};
	
	common.firstCapital = function(string){				
		return string === undefined ? '' : string.charAt(0).toUpperCase() + string.slice(1)		
	};
	
	common.isValidDataText = function(text, field){
		text = new String(text);
		if (text === undefined 
				|| text == null 
				|| text == 'undefined'
				|| text == 'null' 
				|| text == '')
			return false;

		var field_expr = field === undefined ? 'defaut' : field;
		text = text.trim().toLowerCase();

		switch(field_expr) {
		case 'role':
			if(text == 'original')
				return false
				break;              
		case 'agent':
			if(text == 'unknown')
				return false
				break;
		case 'date':              
		case 'orga_place':
		case 'natio':
			if(text == 'undefined'
				|| text == 'null' 
				|| text == ''
				|| text == '(?)')
				return false
				break;          
		} 

		return true;

	}; 

	common.ordinal_suffix = function (i) {
		var j = i % 10;
		if (j == 1 && i != 11) {
			return "st";
		}
		if (j == 2 && i != 12) {
			return "nd";
		}
		if (j == 3 && i != 13) {
			return "rd";
		}
		return "th";
	};

	common.replace_dansk_char = function(text) {				

		if (text === undefined)
			return text;			

		var res = text;

		// utf8 encoding (JSON)
		if (text.match(/[æøåé]/g) != null)
			res = text.replace( /[æ]/g, "ae" ).replace( /[ø]/g, "oe" ).replace( /[å]/g, "aa" ).replace( /[é]/g, "e" );						

		// 
		if (res.match(/[����]/g) != null)
			res = text.replace( /�/g, "ae" ).replace( /�/g, "oe" ).replace( /�/g, "aa" ).replace( /�/g, "e" );						

		return res;
	};

	/*
	 * check an artwork copyright
	 * @param doc - result returned by Solr for artwork 
	 * @return - false if not under copyright, copyright text if otherwise 
	 */
	common.computeCopyright = function(doc) {

		return doc.copyright !== undefined ? doc.copyright : false;

	};

	common.getDefaultPicture = function(size){		
		var picturePath = ""
			var server = common.getCurrentServerName();
		var pluginPath = common.getCurrentPluginDir();

		switch(size){
		case "small":		 			  			  			  
			picturePath = 'http://%s/%simages/default_picture_2_small.png';					  			  			  
			break;
		case "medium":		 			  			  			  
			picturePath = 'http://%s/%simages/default_picture_2_medium.png';					  			  			  
			break;
		case "large":		 			  			  			  
			picturePath = 'http://%s/%simages/default_picture_2_large.png';					  			  			  
			break;
		default:		    			  			   							  
			picturePath = 'http://%s/%simages/default_picture_2_small.png';		  	 		  	  
		break;		  
		}	

		return sprintf(picturePath, server, pluginPath);
	};

	common.getPluginURL = function(){
		var server = common.getCurrentServerName();
		var pluginPath = common.getCurrentPluginDir();

		return sprintf('http://%s/%s', server, pluginPath);				
	};	

	common.getScaledPicture = function(fullsizePath, size, TYPO3_picture){								 

		var pictureScaleServerPath = 'rs.smk.dk'; //'cspic.smk.dk:8080/SmkImageServer/rest/conversionservice/scaling'; //'cspic.smk.dk';
		var TYPO3_server = 'http://www.smk.dk';
		var Picture_server = 'http://cspic.smk.dk';
		//var pictureAdresse = TYPO3_picture == true ? sprintf('%s/%s', TYPO3_server, fullsizePath) : sprintf('%s/%s', Picture_server, common.getLocation(fullsizePath).pathname.replace(/^\/|/g, ''));
		var pictureAdresse = TYPO3_picture == true ? sprintf('%s/%s', TYPO3_server, fullsizePath) : sprintf('%s', common.getLocation(fullsizePath).pathname.replace(/^\/|/g, ''));
		var width = '';

		switch(size){
		case "small":		 			  			  			  
			width = '88';					  			  			  
			break;
		case "medium":		 			  			  			  
			width = '198';					  			  			  
			break;
		case "large":		 			  			  			  
			width = '418';					  			  			  
			break;
		default:		    			  			   							  
			width = '88';		  	 		  	  
		break;		  
		};	

		return sprintf('http://%s/?pic=%s&mode=width&width=%s', pictureScaleServerPath, pictureAdresse, width);
		//return (sprintf('http://%s?width=%s&image=%s', pictureScaleServerPath, width, pictureAdresse));
	};

	common.getLocation = function(href) {
		var l = document.createElement("a");
		l.href = href;
		return l;
	};	

	common.getCurrentLanguage = function(){		
		return smkSearchAllConf.currentLanguage;
	};

	common.getCurrentPluginDir = function(){		
		return smkSearchAllConf.pluginDir;
	};

	common.getCurrentServerName = function(){		
		return smkSearchAllConf.serverName;
	};		

	common.getSearchPOST = function (){
		return smkSearchAllConf.searchStringPOST;
	};	


	common.removeA = function (arr) {
		if (!AjaxSolr.isArray(arr))
			return [];

		var what, a = arguments, L = a.length, ax;
		while (L > 1 && arr.length) {
			what = a[--L];
			while ((ax= arr.indexOf(what)) !== -1) {
				arr.splice(ax, 1);
			}
		}
		return arr;
	};

}));