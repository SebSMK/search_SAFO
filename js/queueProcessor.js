$.taskQueue = {
    _timer: null,
    _queue: [],
    add: function(fn, context, time) {
        var setTimer = function(time) {
            $.taskQueue ._timer = setTimeout(function() {
                time = $.taskQueue .add();
                if ($.taskQueue ._queue.length) {
                    setTimer(time);
                }
            }, time || 2);
        }

        if (fn) {
            $.taskQueue ._queue.push([fn, context, time]);
            if ($.taskQueue ._queue.length == 1) {
                setTimer(time);
            }
            return;
        }

        var next = $.taskQueue ._queue.shift();
        if (!next) {
            return 0;
        }
        next[0].call(next[1] || window);
        return next[2];
    },
    clear: function() {
        clearTimeout($.taskQueue ._timer);
        $.taskQueue ._queue = [];
    }
};