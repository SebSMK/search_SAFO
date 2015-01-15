(function (root, factory) {
	if (typeof exports === "object" && exports) {
		factory(exports); // CommonJS
	} else {
		var getdatadetailstabs = {};
		factory(getdatadetailstabs);
		if (typeof define === "function" && define.amd) {
			define(getdatadetailstabs); // AMD
		} else {
			root.getData_Detail_Tabs = getdatadetailstabs; // <script>
		}
	}
}(this, function (getdatadetailstabs) {

	getdatadetailstabs.constructor = function(caller){

		this.get_data = function (doc){
			var data =  {					
					subwidget:{
						req_original: getData_Common.getSubWidgReq_original(doc),
						req_multiwork: getData_Common.getSubWidgReq_vaerkdele(doc),
						req_relatedid: getData_Common.getSubWidgReq_relatere(doc)									
					}
			};	
						
			return data;	  

		};					  
	}
}));