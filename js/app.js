//DOMContentLoaded
// Resize images on equalized matrix tiles
function resizeAndLayoutMatrixTileImages() {
    var a = document.querySelectorAll(".matrix-equalized .matrix-tile");
    Array.prototype.forEach.call(a, function(a) {
        var b = a.querySelector("img, i"), c = b.clientHeight, d = (b.clientWidth, a.querySelector(".matrix-tile-image").clientHeight), e = getComputedStyle(a.querySelector(".matrix-tile-image"), null).getPropertyValue("padding-left").replace("px", ""), f = d - 2 * e;
        // Show the images
        b.style.opacity = 1, // If image is too wide
        c >= f ? (b.style.height = f + "px", b.style.width = "auto", b.setAttribute("data-has-been-layouted", "true"), 
        b.style.marginTop = 0) : (b.style.marginTop = (f - c) / 2 + "px", b.setAttribute("data-has-been-layouted", "true"));
    });
}

!function() {
    $(document).ready(function() {
        $(".advanced-search-panel-show-hide a").click(function(a) {
            a.preventDefault(), $(".advanced-search-panel-show-hide a").text(// Swith labels when open/closed
            $(".advanced-search-panel").hasClass("advanced-search-panel-hidden") ? $(".advanced-search-panel-show-hide a").attr("data-label-close") : $(".advanced-search-panel-show-hide a").attr("data-label-open")), 
            // Toggle class to show/hide
            $(".advanced-search-panel").toggleClass("advanced-search-panel-hidden");
        });
    });
}(), // http://harvesthq.github.io/chosen/options.html
jQuery(document).ready(function(a) {
    a(".chosen-select").chosen({
        disable_search_threshold: 10,
        no_results_text: "Oops, nothing found!",
        width: "100%",
        disable_search: !0,
        // When set to true, Chosen will not display the search field (single selects only).
        allow_single_deselect: !0
    });
}), // Truncation of text elements.
// https://github.com/BeSite/jQuery.dotdotdot
$(document).ready(function() {
    // Artwork title
    $(".matrix-tile-header h2 a").dotdotdot({
        tolerance: 0
    }), // Artist(s)
    $(".matrix-tile-header h3").dotdotdot({
        tolerance: 0
    });
}), function(a) {
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
}(jQuery), // Initialize
document.addEventListener("DOMContentLoaded", function() {
    if (document.querySelector(".filter-multiple")) {
        var a = document.querySelectorAll(".filter-multiple"), b = "filter-multiple-open", c = 46;
        //px
        Array.prototype.forEach.call(a, function(a) {
            // Move checked options to a visible area (so you don't need to open the 
            // .filter-multiple to see the selected options)
            var d = a.querySelectorAll(".filter-options input[checked]");
            Array.prototype.forEach.call(d, function(a) {
                var b = a.parentNode.parentNode.parentNode;
                b.querySelector(".filter-options-checked").appendChild(a.parentNode);
            }), a.querySelector(".filter-toggle").addEventListener("click", function(d) {
                d.preventDefault(), d.stopImmediatePropagation(), a.classList.contains(b) ? (a.classList.remove(b), 
                a.style.height = a.querySelector(".filter-options-checked") ? c + a.querySelector(".filter-options-checked").clientHeight + "px" : c + "px") : (a.classList.add(b), 
                a.style.height = a.querySelector(".filter-options").clientHeight + a.querySelector(".filter-options-checked").clientHeight + c + "px");
            }, !0), // Open if the .filter-multiple has the 'open' class
            a.classList.contains(b) ? a.style.height = a.querySelector(".filter-options").clientHeight + a.querySelector(".filter-options-checked").clientHeight + c + "px" : // If options list has checked items, adjust the height of the containing
            // element, so that we can se the checked items.
            a.querySelector(".filter-options-checked") && (a.style.height = c + a.querySelector(".filter-options-checked").clientHeight + "px"), 
            // Hide the down-arrow on the filter toggle if there is only 1 option.
            // aka. nothing more to show.
            0 == a.querySelectorAll(".filter-options li").length && (a.querySelector(".filter-toggle i").style.display = "none"), 
            a.querySelectorAll(".filter-options-checked li").length > 0 && a.classList.add("active");
        });
    }
}), // NOTE
// Add ID to all options. Then multi and single might use the same code.
// Fire when user selects something
$(document).ready(function() {
    !function() {
        var a = $(".filters-selected");
        // Add ul to filters selected container
        a.append("<ul></ul>"), $(".filters .chosen-select").change(function(b, c) {
            // NOTE: params returns the text of the selected option
            var d = b.target.multiple, // true/false
            e = b.target.id;
            // int
            // If the ul is empty just add to it no matter what
            $(a).find("ul li").length || // Add the li
            a.children("ul").append('<li class="filters-selected-item" data-select-id="' + e + '" data-select-multiple="' + d + '"><span>' + c.selected + '</span><a href="#">Close</a></li>'), 
            // If there are already li's in the ul, then do these things;
            void 0 != c && $(a).find("ul li").each(function() {
                // SINGLE-SELECTS
                // if single-select and if already the list, replace with new option
                $(this).attr("data-select-id") == e && "false" == $(this).attr("data-select-multiple") ? $(this).replaceWith('<li class="filters-selected-item" data-select-id="' + e + '" data-select-multiple="' + d + '"><span>' + c.selected + '</span><a href="#">Close</a></li>') : $(this).attr("data-select-id") != e && "false" == $(this).attr("data-select-multiple") && // Add option to list
                a.children("ul").append('<li class="filters-selected-item" data-select-id="' + e + '" data-select-multiple="' + d + '"><span>' + c.selected + '</span><a href="#">Close</a></li>');
            });
        });
    }();
}), function() {
    // Resize thumbs to make them fit within their frame
    function a() {
        var a = document.querySelectorAll(".inline-gallery-thumbs li");
        Array.prototype.forEach.call(a, function(a) {
            var b = a.querySelector("img, i"), c = b.clientHeight, d = (b.clientWidth, a.clientHeight), e = getComputedStyle(a, null).getPropertyValue("padding-left").replace("px", ""), f = d - 2 * e;
            // If image is too wide
            c >= f ? (b.style.height = f + "px", b.style.width = "auto", b.setAttribute("data-has-been-layouted", "true"), 
            b.style.marginTop = 0) : (b.style.marginTop = (f - c) / 2 + "px", b.setAttribute("data-has-been-layouted", "true"));
        });
    }
    // Resize main image to make it fit within its frame
    function b() {
        var a = document.querySelector(".inline-gallery-main"), b = a.querySelector("img"), c = b.clientHeight, d = (b.clientWidth, 
        a.clientHeight), e = getComputedStyle(a, null).getPropertyValue("padding-left").replace("px", ""), f = d - 2 * e;
        // If image is too wide
        c >= f ? (b.style.height = f + "px", b.style.width = "auto", b.setAttribute("data-has-been-layouted", "true"), 
        b.style.marginTop = 0) : (b.style.marginTop = (f - c) / 2 + "px", b.setAttribute("data-has-been-layouted", "true")), 
        //if
        b.style.opacity = "1";
    }
    // Set main image when clicking thumbs
    $(".inline-gallery-thumbs li").click(function() {
        $(".inline-gallery-main img").attr("id") !== $(this).attr("id") && ($(".inline-gallery-main-image").append('<div class="spinner">\n          <div class="rect1"></div>\n          <div class="rect2"></div>\n          <div class="rect3"></div>\n          <div class="rect4"></div>\n          <div class="rect5"></div>\n        </div>'), 
        $(".inline-gallery-copyright-inner").text($(this).attr("data-copyright")), $(".inline-gallery-main img").attr("id", $(this).attr("id")), 
        $(".inline-gallery-main img").attr("src", $(this).attr("data-image-large")), $(".inline-gallery-main img").load(function() {
            $(".inline-gallery-main img").attr("style", ""), b(), $(".inline-gallery-main-image .spinner").remove();
        }), $(this).siblings().removeClass("active"), $(this).addClass("active"));
    }), // Hide / show copyright info
    $(".inline-gallery-copyright-show-hide").click(function(a) {
        a.preventDefault(), $(this).toggleClass("active"), $(".inline-gallery-copyright").toggleClass("active");
    }), $(window).load(function() {
        $(".inline-gallery").length && (a(), b(), // Set copyright info for main image
        $(".inline-gallery-copyright-inner").text($(".inline-gallery-main-image img").attr("data-copyright")));
    });
}(), document.addEventListener("DOMContentLoaded", function() {
    if (document.querySelector(".matrix-tile")) {
        var a = document.querySelectorAll(".matrix-tile");
        // Make the entire matrix tile clickable
        Array.prototype.forEach.call(a, function(a) {
            a.addEventListener("click", function(b) {
                b.stopImmediatePropagation();
                var c = a.querySelector(".matrix-tile-header h2 a").getAttribute("href");
                b.target.hasAttribute("href") || (window.location.href = c);
            }, !0);
        });
    }
}), imagesLoaded(document.querySelectorAll(".matrix-equalized .matrix-tile-image img"), function() {
    document.querySelector(".matrix-equalized") && resizeAndLayoutMatrixTileImages();
}), // Add class to search bar when search field is in focus.
jQuery(document).ready(function(a) {
    a(".search-bar-field, .search-bar-button").focus(function() {
        a(this).parent().addClass("in-focus");
    }).blur(function() {
        a(this).parent().removeClass("in-focus");
    });
}), function() {
    $(".search-bar-strings li a").click(function() {
        $(this).parent("li").remove(), // Remove container element if no search strings left
        0 == $(".search-bar-strings li").length && $(".search-bar-strings").remove();
    });
}(), // Simple tabs. Does not feature deeplinking.
// 
// Each instance of a tabs element consists of
// 1. a set of .tabs and
// 2. corresponding .tab-content areas.
// These are linked together with a data-tabs-id attribute.
// NOTE: hash urls need to be unique. E.g. <a href="#very-unique">Tab link</a>
// Here's a markup example:
/*
<div class="tabs" data-tabs-id="tabs-1">
  <a href="#about" class="active">About</a>
  <a href="#something">Something</a>
</div>

<div class="tab-content tab-content--open" id="about" data-tabs-id="tabs-1">
  Content...
</div>

<div class="tab-content" id="something" data-tabs-id="tabs-1">
  Some other content...  
</div>
*/
document.addEventListener("DOMContentLoaded", function() {
    // Open tab when url hash changes.
    // tabLink = the link inside .tabs that is clicked.
    // tabId = the data-tabs-id value.
    function a(a, b) {
        var b = a.parentNode.getAttribute("data-tabs-id"), c = document.querySelectorAll(".tab-content[data-tabs-id=" + b + "]");
        Array.prototype.forEach.call(c, function(a) {
            a.classList.remove("tab-content--open");
        });
        // Open tab-content with a corresponding id and shared data-tabs-id
        var d = document.querySelector(".tab-content" + a.getAttribute("href"));
        d.classList.add("tab-content--open");
    }
    //function openTab
    // Activate tab link.
    function b(a) {
        // Make the clicked link active by removing the active class from sibling
        // links and...
        Array.prototype.filter.call(a.parentNode.children, function(a) {
            a.classList.remove("active");
        }), //... adding the active class to the clicked link.
        a.classList.add("active");
    }
    // If tabs exist on the page
    if (null != document.querySelector(".tabs") || void 0 != document.querySelector(".tabs")) {
        //function activateTabLink
        // Get all .tabs on the page
        var c = document.querySelectorAll(".tabs");
        // Loop through all .tabs
        Array.prototype.forEach.call(c, function(c) {
            var d = c.getAttribute("data-tabs-id"), e = c.querySelectorAll("a");
            // Get all links that are children of tabId
            // Add an eventListener for every tab link
            Array.prototype.forEach.call(e, function(c) {
                // When a tab link is clicked...
                c.addEventListener("click", function(e) {
                    // Resize thumbnails (they cannot be resized properly when hidden)
                    if (e.preventDefault(), // Activate tab link
                    b(c), // Then open the .tab-content that shares the same data-tabs-id
                    // value and matches the hash in the url.
                    a(c, d), document.querySelector(".matrix-equalized")) {
                        var f = document.querySelectorAll(".matrix-equalized .matrix-tile");
                        Array.prototype.forEach.call(f, function(a) {
                            var b = a.querySelector("img, i");
                            b.style.height = "", b.style.width = "";
                        }), resizeAndLayoutMatrixTileImages();
                    }
                }, !1);
            });
        });
    }
});