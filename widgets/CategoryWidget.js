(function ($) {

AjaxSolr.CategoryWidget = AjaxSolr.AbstractFacetWidget.extend({	
	
  init: function () {        
	  	var labels = {'simple': this.manager.translator.getLabel('category_simple'),'advanced': this.manager.translator.getLabel('category_advanced')};
        var html = this.template_integration_json(labels, '#categoryItemsTemplate');
        $(this.target).html(html);
  },
  
  afterRequest: function () { 
	  
	  var self = this;	  
	  if (!self.getRefresh()){
		self.setRefresh(true);
		return;
	  }
	  var labels = {'simple': self.manager.translator.getLabel('category_simple'),'advanced': self.manager.translator.getLabel('category_advanced')};
      var html = self.template_integration_json(labels, '#categoryItemsTemplate');
      $(self.target).html(html);
  },
  
  template_integration_json: function (json_data, templ_id){	  
		var template = this.template; 		
		var html = Mustache.to_html($(template).find(templ_id).html(), json_data);
		return html;
  },
  
  /**
   * @param {String} value The value.
   * @returns {Function} Sends a request to Solr if it successfully adds a
   *   filter query with the given value.
   */
  clickHandler: function () {
    var self = this, meth = this.multivalue ? 'add' : 'set';
    return function (event) {      
      event.stopImmediatePropagation();
      
      var method = self[meth];
      var selectedTab = $(event.currentTarget).attr("name");
            
      $(self).trigger({
    	  type: "smk_search_category_changed",
    	  category: selectedTab		  
      }); 

	  return false;
    }
  },
  
  setActiveTab: function (tab){
	  this.activeCategory = tab;
  },
  
  /**
   * Sets the filter query.
  *
  * @returns {Boolean} Whether the selection changed.
  */
 set: function (value) {
     return this.changeSelection(function () {
     	var a = this.manager.store.removeByValue('fq', new RegExp('^-?' + this.field + ':')),
         b = value == 'all' ? true : this.manager.store.add('fq', new AjaxSolr.Parameter({ name: 'fq', value: this.fq(value), locals: { tag:this.field } }));
     return a || b;
   });
 },

 /**
  * Adds a filter query.
  *
  * @returns {Boolean} Whether a filter query was added.
  */
	add: function (value) {
		return this.changeSelection(function () {
			return this.manager.store.add('fq', new AjaxSolr.Parameter({ name: 'fq', value: this.fq(value), locals: { tag:this.field } }));
		});
	}, 
  
});

})(jQuery);
