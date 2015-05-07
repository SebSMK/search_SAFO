(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var getdataadvanced = {};
		factory(getdataadvanced);
		if (typeof define === "function" && define.amd) {
			define(getdataadvanced); // AMD
		} else {
			root.getData_Advanced = getdataadvanced; // <script>
		}
	}
}(this, function (getdataadvanced) {

	getdataadvanced.constructor = function(caller){

		this.getData = function (list){			
			return this.proceedList(list);
		};  										
		
		this.proceedList = function(list){
			var columns = [];			
			if(list !== undefined){
				for (var i = 0, l = list.length; i < l; i++) {										
					var values = [];
					var lang = "";
					lab = this.caller.manager.translator.getLabel("adv_" + list[i]['lab'] + "_column_title");
					lang = list[i]['lang'];
					for (var m = 0, n = list[i]['values'].length; m < n; m++) {
						var value = {"id":	"adv_" + list[i]['values'][m]['id'], "lang": list[i]['values'][m]['lang']};
						values.push(value);
					}		
					
					columns.push({lab: lab, lab_tag: "adv_" + list[i]['lab'] + "_column_title", values: values});
				}				
			};
			
			return columns;
		};				
		
		/*
		 * variables
		 */
		this.caller = caller;
	}

}));