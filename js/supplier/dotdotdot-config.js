// Truncation of text elements.
// https://github.com/BeSite/jQuery.dotdotdot
function waitForWebfonts(a, b) {
    for (var c = 0, d = 0, e = a.length; e > d; ++d) !function(d) {
        function e() {
            // If all fonts have been loaded
            // Compare current width with original width
            // If all fonts have been loaded
            return f && f.offsetWidth != g && (++c, f.parentNode.removeChild(f), f = null), 
            c >= a.length && (h && clearInterval(h), c == a.length) ? (b(), !0) : void 0;
        }
        var f = document.createElement("span");
        // Characters that vary significantly among different fonts
        f.innerHTML = "giItT1WQy@!-/#", // Visible - so we can measure it - but not on the screen
        f.style.position = "absolute", f.style.left = "-10000px", f.style.top = "-10000px", 
        // Large font size makes even subtle changes obvious
        f.style.fontSize = "300px", // Reset any font properties
        f.style.fontFamily = "sans-serif", f.style.fontVariant = "normal", f.style.fontStyle = "normal", 
        f.style.fontWeight = "normal", f.style.letterSpacing = "0", document.body.appendChild(f);
        // Remember width with no applied web font
        var g = f.offsetWidth;
        f.style.fontFamily = d;
        var h;
        e() || (h = setInterval(e, 50));
    }(a[d]);
}