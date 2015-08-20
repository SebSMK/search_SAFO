/*
 *	jQuery dotdotdot 1.6.16
 *
 *	Copyright (c) Fred Heusschen
 *	www.frebsite.nl
 *
 *	Plugin website:
 *	dotdotdot.frebsite.nl
 *
 *	Dual licensed under the MIT and GPL licenses.
 *	http://en.wikipedia.org/wiki/MIT_License
 *	http://en.wikipedia.org/wiki/GNU_General_Public_License
 */
!function(a, b) {
    function c(a, b, c) {
        var d = a.children(), e = !1;
        a.empty();
        for (var g = 0, h = d.length; h > g; g++) {
            var i = d.eq(g);
            if (a.append(i), c && a.append(c), f(a, b)) {
                i.remove(), e = !0;
                break;
            }
            c && c.detach();
        }
        return e;
    }
    function d(b, c, g, h, i) {
        var j = !1, k = "table, thead, tbody, tfoot, tr, col, colgroup, object, embed, param, ol, ul, dl, blockquote, select, optgroup, option, textarea, script, style", l = "script, .dotdotdot-keep";
        return b.contents().detach().each(function() {
            var m = this, n = a(m);
            if ("undefined" == typeof m || 3 == m.nodeType && 0 == a.trim(m.data).length) return !0;
            if (n.is(l)) b.append(n); else {
                if (j) return !0;
                b.append(n), i && b[b.is(k) ? "after" : "append"](i), f(g, h) && (j = 3 == m.nodeType ? e(n, c, g, h, i) : d(n, c, g, h, i), 
                j || (n.detach(), j = !0)), j || i && i.detach();
            }
        }), j;
    }
    function e(b, c, d, e, h) {
        var k = b[0];
        if (!k) return !1;
        var m = j(k), n = -1 !== m.indexOf(" ") ? " " : "ã€€", o = "letter" == e.wrap ? "" : n, p = m.split(o), q = -1, r = -1, s = 0, t = p.length - 1;
        for (//	Only one word
        e.fallbackToLetter && 0 == s && 0 == t && (o = "", p = m.split(o), t = p.length - 1); t >= s && (0 != s || 0 != t); ) {
            var u = Math.floor((s + t) / 2);
            if (u == r) break;
            r = u, i(k, p.slice(0, r + 1).join(o) + e.ellipsis), f(d, e) ? (t = r, //	Fallback to letter
            e.fallbackToLetter && 0 == s && 0 == t && (o = "", p = p[0].split(o), q = -1, r = -1, 
            s = 0, t = p.length - 1)) : (q = r, s = r);
        }
        if (-1 == q || 1 == p.length && 0 == p[0].length) {
            var v = b.parent();
            b.detach();
            var w = h && h.closest(v).length ? h.length : 0;
            v.contents().length > w ? k = l(v.contents().eq(-1 - w), c) : (k = l(v, c, !0), 
            w || v.detach()), k && (m = g(j(k), e), i(k, m), w && h && a(k).parent().append(h));
        } else m = g(p.slice(0, q + 1).join(o), e), i(k, m);
        return !0;
    }
    function f(a, b) {
        return a.innerHeight() > b.maxHeight;
    }
    function g(b, c) {
        for (;a.inArray(b.slice(-1), c.lastCharacter.remove) > -1; ) b = b.slice(0, -1);
        return a.inArray(b.slice(-1), c.lastCharacter.noEllipsis) < 0 && (b += c.ellipsis), 
        b;
    }
    function h(a) {
        return {
            width: a.innerWidth(),
            height: a.innerHeight()
        };
    }
    function i(a, b) {
        a.innerText ? a.innerText = b : a.nodeValue ? a.nodeValue = b : a.textContent && (a.textContent = b);
    }
    function j(a) {
        return a.innerText ? a.innerText : a.nodeValue ? a.nodeValue : a.textContent ? a.textContent : "";
    }
    function k(a) {
        do a = a.previousSibling; while (a && 1 !== a.nodeType && 3 !== a.nodeType);
        return a;
    }
    function l(b, c, d) {
        var e, f = b && b[0];
        if (f) {
            if (!d) {
                if (3 === f.nodeType) return f;
                if (a.trim(b.text())) return l(b.contents().last(), c);
            }
            for (e = k(f); !e; ) {
                if (b = b.parent(), b.is(c) || !b.length) return !1;
                e = k(b[0]);
            }
            if (e) return l(a(e), c);
        }
        return !1;
    }
    function m(b, c) {
        return b ? "string" == typeof b ? (b = a(b, c), b.length ? b : !1) : b.jquery ? b : !1 : !1;
    }
    function n(a) {
        for (var b = a.innerHeight(), c = [ "paddingTop", "paddingBottom" ], d = 0, e = c.length; e > d; d++) {
            var f = parseInt(a.css(c[d]), 10);
            isNaN(f) && (f = 0), b -= f;
        }
        return b;
    }
    if (!a.fn.dotdotdot) {
        a.fn.dotdotdot = function(b) {
            if (0 == this.length) return a.fn.dotdotdot.debug('No element found for "' + this.selector + '".'), 
            this;
            if (this.length > 1) return this.each(function() {
                a(this).dotdotdot(b);
            });
            var e = this;
            e.data("dotdotdot") && e.trigger("destroy.dot"), e.data("dotdotdot-style", e.attr("style") || ""), 
            e.css("word-wrap", "break-word"), "nowrap" === e.css("white-space") && e.css("white-space", "normal"), 
            e.bind_events = function() {
                return e.bind("update.dot", function(b, h) {
                    b.preventDefault(), b.stopPropagation(), i.maxHeight = "number" == typeof i.height ? i.height : n(e), 
                    i.maxHeight += i.tolerance, "undefined" != typeof h && (("string" == typeof h || h instanceof HTMLElement) && (h = a("<div />").append(h).contents()), 
                    h instanceof a && (g = h)), p = e.wrapInner('<div class="dotdotdot" />').children(), 
                    p.contents().detach().end().append(g.clone(!0)).find("br").replaceWith("  <br />  ").end().css({
                        height: "auto",
                        width: "auto",
                        border: "none",
                        padding: 0,
                        margin: 0
                    });
                    var k = !1, l = !1;
                    return j.afterElement && (k = j.afterElement.clone(!0), k.show(), j.afterElement.detach()), 
                    f(p, i) && (l = "children" == i.wrap ? c(p, i, k) : d(p, e, p, i, k)), p.replaceWith(p.contents()), 
                    p = null, a.isFunction(i.callback) && i.callback.call(e[0], l, g), j.isTruncated = l, 
                    l;
                }).bind("isTruncated.dot", function(a, b) {
                    return a.preventDefault(), a.stopPropagation(), "function" == typeof b && b.call(e[0], j.isTruncated), 
                    j.isTruncated;
                }).bind("originalContent.dot", function(a, b) {
                    return a.preventDefault(), a.stopPropagation(), "function" == typeof b && b.call(e[0], g), 
                    g;
                }).bind("destroy.dot", function(a) {
                    a.preventDefault(), a.stopPropagation(), e.unwatch().unbind_events().contents().detach().end().append(g).attr("style", e.data("dotdotdot-style") || "").data("dotdotdot", !1);
                }), e;
            }, //	/bind_events
            e.unbind_events = function() {
                return e.unbind(".dot"), e;
            }, //	/unbind_events
            e.watch = function() {
                if (e.unwatch(), "window" == i.watch) {
                    var b = a(window), c = b.width(), d = b.height();
                    b.bind("resize.dot" + j.dotId, function() {
                        c == b.width() && d == b.height() && i.windowResizeFix || (c = b.width(), d = b.height(), 
                        l && clearInterval(l), l = setTimeout(function() {
                            e.trigger("update.dot");
                        }, 100));
                    });
                } else k = h(e), l = setInterval(function() {
                    if (e.is(":visible")) {
                        var a = h(e);
                        (k.width != a.width || k.height != a.height) && (e.trigger("update.dot"), k = a);
                    }
                }, 500);
                return e;
            }, e.unwatch = function() {
                return a(window).unbind("resize.dot" + j.dotId), l && clearInterval(l), e;
            };
            var g = e.contents(), i = a.extend(!0, {}, a.fn.dotdotdot.defaults, b), j = {}, k = {}, l = null, p = null;
            return i.lastCharacter.remove instanceof Array || (i.lastCharacter.remove = a.fn.dotdotdot.defaultArrays.lastCharacter.remove), 
            i.lastCharacter.noEllipsis instanceof Array || (i.lastCharacter.noEllipsis = a.fn.dotdotdot.defaultArrays.lastCharacter.noEllipsis), 
            j.afterElement = m(i.after, e), j.isTruncated = !1, j.dotId = o++, e.data("dotdotdot", !0).bind_events().trigger("update.dot"), 
            i.watch && e.watch(), e;
        }, //	public
        a.fn.dotdotdot.defaults = {
            ellipsis: "... ",
            wrap: "word",
            fallbackToLetter: !0,
            lastCharacter: {},
            tolerance: 0,
            callback: null,
            after: null,
            height: null,
            watch: !1,
            windowResizeFix: !0
        }, a.fn.dotdotdot.defaultArrays = {
            lastCharacter: {
                remove: [ " ", "ã€€", ",", ";", ".", "!", "?" ],
                noEllipsis: []
            }
        }, a.fn.dotdotdot.debug = function() {};
        //	private
        var o = 1, p = a.fn.html;
        a.fn.html = function(c) {
            return c != b && !a.isFunction(c) && this.data("dotdotdot") ? this.trigger("update", [ c ]) : p.apply(this, arguments);
        };
        //	override jQuery.text
        var q = a.fn.text;
        a.fn.text = function(c) {
            return c != b && !a.isFunction(c) && this.data("dotdotdot") ? (c = a("<div />").text(c).html(), 
            this.trigger("update", [ c ])) : q.apply(this, arguments);
        };
    }
}(jQuery);