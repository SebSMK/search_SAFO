
$(document).ready(function(a) {
    a.fn.dropit = function(b) {
        var c = {
            init: function(b) {
                return this.dropit.settings = a.extend({}, this.dropit.defaults, b), this.each(function() {
                    var b = a(this), c = a.fn.dropit.settings;
                    // Hide initial submenus
                    b.addClass("dropit").find(">" + c.triggerParentEl + ":has(" + c.submenuEl + ")").addClass("dropit-trigger").find(c.submenuEl).addClass("dropit-submenu").hide(), 
                    // Open on click
                    b.on(c.action, c.triggerParentEl + ":has(" + c.submenuEl + ") > " + c.triggerEl, function() {
                        // Close click menu's if clicked again
                        // Close click menu's if clicked again
                        // Hide open menus
                        // Open this menu
                        return "click" == c.action && a(this).parents(c.triggerParentEl).hasClass("dropit-open") ? (c.beforeHide.call(this), 
                        a(this).parents(c.triggerParentEl).removeClass("dropit-open").find(c.submenuEl).hide(), 
                        c.afterHide.call(this), !1) : (c.beforeHide.call(this), a(".dropit-open").removeClass("dropit-open").find(".dropit-submenu").hide(), 
                        c.afterHide.call(this), c.beforeShow.call(this), a(this).parents(c.triggerParentEl).addClass("dropit-open").find(c.submenuEl).show(), 
                        c.afterShow.call(this), !1);
                    }), // Close if outside click
                    a(document).on("click", function() {
                        c.beforeHide.call(this), a(".dropit-open").removeClass("dropit-open").find(".dropit-submenu").hide(), 
                        c.afterHide.call(this);
                    }), // If hover
                    "mouseenter" == c.action && b.on("mouseleave", function() {
                        c.beforeHide.call(this), a(this).removeClass("dropit-open").find(c.submenuEl).hide(), 
                        c.afterHide.call(this);
                    }), c.afterLoad.call(this);
                });
            }
        };
        return c[b] ? c[b].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof b && b ? void a.error('Method "' + b + '" does not exist in dropit plugin!') : c.init.apply(this, arguments);
    }, a.fn.dropit.defaults = {
        action: "click",
        // The open action for the trigger
        submenuEl: "ul",
        // The submenu element
        triggerEl: "a",
        // The trigger element
        triggerParentEl: "li",
        // The trigger parent element
        afterLoad: function() {},
        // Triggers when plugin has loaded
        beforeShow: function() {},
        // Triggers before submenu is shown
        afterShow: function() {},
        // Triggers after submenu is shown
        beforeHide: function() {},
        // Triggers before submenu is hidden
        afterHide: function() {}
    }, a.fn.dropit.settings = {};
}(jQuery));