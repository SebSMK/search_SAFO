(function ($) {

	AjaxSolr.SearchBoxAutoWidget = AjaxSolr.AbstractTextWidget.extend({

		values_list: [
		              {
		            	  "key": "1961",
		            	  "value": "Test Side Story",
		            	  "tokens": [
		            	             "West",
		            	             "Side",
		            	             "Story"
		            	             ]
		              },
		              {
		            	  "key": "1962",
		            	  "value": "Tawrence of Arabia",
		            	  "tokens": [
		            	             "Lawrence",
		            	             "of",
		            	             "Arabia"
		            	             ]
		              },
		              {
		            	  "key": "1963",
		            	  "value": "Tom Jones",
		            	  "tokens": [
		            	             "Tom",
		            	             "Jones"
		            	             ]
		              },
		              {
		            	  "key": "2012",
		            	  "value": "Argo",
		            	  "tokens": [
		            	             "Argo"
		            	             ]
		              }
		              ],

		              init: function () {						
		            	  var self = this;
		            	  var $target = $(this.target);		  
		            	  var json_data = {"default_text" : this.manager.translator.getLabel("search_box_default"), 'search': this.manager.translator.getLabel("search_box_button")};	 
		            	  var html = self.template_integration_json(json_data, '#searchboxTemplate');		  
		            	  $target.html(html);				
		              },		    

		              beforeRequest: function(){						
		            	  if(ModelManager.get_view() != 'detail'){
		            		  var searchstring = ModelManager.get_q().length != 0 ? ModelManager.get_q() : ModelManager.get_auto_values().replace(/^"|"$/g, '');
		            		  $(this.target).find('input').val(searchstring);
		            	  }
		            	  $(this.target).find('input').attr('placeholder', this.manager.translator.getLabel("search_box_default"));

		              },

		              afterRequest: function () {

		            	  var self = this;	  
		            	  if (!self.getRefresh()){
		            		  //self.setRefresh(true);
		            		  return;
		            	  }								

		            	  var callback = function (response) {
		            		  var list = [];
		            		  for (var i = 0; i < self.fields.length; i++) {
		            			  var field = self.fields[i];
		            			  for (var facet in response.facet_counts.facet_fields[field]) {
		            				  list.push({
		            					  field: field,
		            					  key: facet,
		            					  value: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ') - ' + field
		            				  });
		            			  }
		            		  }

		            		  var films = new Bloodhound({
		            			  datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.value); },
		            			  queryTokenizer: Bloodhound.tokenizers.whitespace,
		            			  limit: 10,

		            			  local: list
		            		  });

		            		  films.initialize();

		            		  $(self.target).find('input.search-bar-field').typeahead({
		            			  hint: !0,
		            			  highlight: !0,
		            			  minLength: 1
		            		  }, {
		            			  name: 'film',
		            			  displayKey: 'value',
		            			  source: films.ttAdapter()
		            		  }).bind("typeahead:selected", function(obj, datum, name) {
		            			  $(this).data("key", datum.key);
		            		  });

		            		  $(self.target).find('input').on("click", function (e) {
		            			  e.preventDefault();
		            			  alert($(this).data("key"));
		            		  });

		            		  self.setRefresh(false); //only one time


//		            		  self.requestSent = false;
//		            		  $(self.target).find('input').autocomplete('destroy').autocomplete({
//		            		  source: list,
//		            		  select: function(event, ui) {
//		            		  if (ui.item) {
//		            		  self.requestSent = true;
//		            		  //if (self.manager.store.addByValue('fq', ui.item.field + ':' + AjaxSolr.Parameter.escapeValue(ui.item.value))) {
//		            		  //self.doRequest();

//		            		  $(self).trigger({
//		            		  type: "smk_search_filter_changed",
//		            		  params: {auto: ui.item.field + ':' + AjaxSolr.Parameter.escapeValue(ui.item.value)}
//		            		  });   
//		            		  //}
//		            		  }
//		            		  }
//		            		  });

//		            		  // This has lower priority so that requestSent is set.
//		            		  $(self.target).find('input').bind('keydown', function(e) {
//		            		  if (self.requestSent === false && e.which == 13) {
//		            		  var value = $(this).val();
//		            		  //if (value && self.set(value)) {
//		            		  //self.doRequest();
//		            		  $(self).trigger({
//		            		  type: "smk_search_q_added",
//		            		  val: value
//		            		  });		
//		            		  //}
//		            		  }
//		            		  });

		            		  // add "text auto selection" on box click
		            		  $(self.target).find('input').on("click", function () {
		            			  $(this).select();
		            		  });
		            	  } // end callback

		            	  var params = [ 'rows=0&facet=true&facet.limit=-1&facet.mincount=1&json.nl=map' ];
		            	  for (var i = 0; i < this.fields.length; i++) {
		            		  params.push('facet.field=' + this.fields[i]);
		            	  }
//		            	  var values = this.manager.store.values('fq');
//		            	  for (var i = 0; i < values.length; i++) {
//		            	  params.push('fq=' + encodeURIComponent(values[i]));
//		            	  }
		            	  //params.push('q=' + this.manager.store.get('q').val());
		            	  params.push('q=*:*');
		            	  $.getJSON(this.manager.solrUrl + 'select?' + params.join('&') + '&wt=json&json.wrf=?', {}, callback);



//		            	  $(this.target).find('input').unbind().removeData('events'); //.val('');

//		            	  var self = this;

//		            	  var callback = function (response) {
//		            	  var list = [];
//		            	  for (var i = 0; i < self.fields.length; i++) {
//		            	  var field = self.fields[i];
//		            	  for (var facet in response.facet_counts.facet_fields[field]) {
//		            	  list.push({
//		            	  field: field,
//		            	  value: facet,
//		            	  label: facet + ' (' + response.facet_counts.facet_fields[field][facet] + ') - ' + field
//		            	  });
//		            	  }
//		            	  }

//		            	  self.requestSent = false;
//		            	  $(self.target).find('input').autocomplete('destroy').autocomplete({
//		            	  source: list,
//		            	  select: function(event, ui) {
//		            	  if (ui.item) {
//		            	  self.requestSent = true;
//		            	  //if (self.manager.store.addByValue('fq', ui.item.field + ':' + AjaxSolr.Parameter.escapeValue(ui.item.value))) {
//		            	  //self.doRequest();

//		            	  $(self).trigger({
//		            	  type: "smk_search_filter_changed",
//		            	  params: {auto: ui.item.field + ':' + AjaxSolr.Parameter.escapeValue(ui.item.value)}
//		            	  });   
//		            	  //}
//		            	  }
//		            	  }
//		            	  });

//		            	  // This has lower priority so that requestSent is set.
//		            	  $(self.target).find('input').bind('keydown', function(e) {
//		            	  if (self.requestSent === false && e.which == 13) {
//		            	  var value = $(this).val();
//		            	  //if (value && self.set(value)) {
//		            	  //self.doRequest();
//		            	  $(self).trigger({
//		            	  type: "smk_search_q_added",
//		            	  val: value
//		            	  });		
//		            	  //}
//		            	  }
//		            	  });

//		            	  // add "text auto selection" on box click
//		            	  $(self.target).find('input').on("click", function () {
//		            	  $(this).select();
//		            	  });
//		            	  } // end callback

//		            	  var params = [ 'rows=0&facet=true&facet.limit=-1&facet.mincount=1&json.nl=map' ];
//		            	  for (var i = 0; i < this.fields.length; i++) {
//		            	  params.push('facet.field=' + this.fields[i]);
//		            	  }
////		            	  var values = this.manager.store.values('fq');
////		            	  for (var i = 0; i < values.length; i++) {
////		            	  params.push('fq=' + encodeURIComponent(values[i]));
////		            	  }
//		            	  //params.push('q=' + this.manager.store.get('q').val());
//		            	  params.push('q=*:*');
//		            	  $.getJSON(this.manager.solrUrl + 'select?' + params.join('&') + '&wt=json&json.wrf=?', {}, callback);
		              },

		              substringMatcher: function(a) {
		            	  return function(b, c) {
		            		  var d, e;
		            		  // an array that will be populated with substring matches
		            		  d = [], // regex used to determine if a string contains the substring `q`
		            		  e = new RegExp(b, "i"), // iterate through the pool of strings and for any string that
		            		  // contains the substring `q`, add it to the `matches` array
		            		  $.each(a, function(a, b) {
		            			  e.test(b) && // the typeahead jQuery plugin expects suggestions to a
		            			  // JavaScript object, refer to typeahead docs for more info
		            			  d.push({
		            				  value: b
		            			  });
		            		  }), c(d);
		            	  };
		              },


		              template_integration_json: function (json_data, templ_id){	  
		            	  var template = this.template; 	
		            	  var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
		            	  return html;
		              }

	});

})(jQuery);
