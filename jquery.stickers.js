if (typeof DEBUG === 'undefined') {
    DEBUG = true
} else {
}

function log(s) {
    DEBUG && console.log(s)
/*
    $.get("/log.php", 
    {info: s})
*/
}

(function($) {
    DEBUG && log("Initializing")
    $.fn.stick = function(base, options) {
        if (!base || !base.length) base = $('body');
        var stickers = this; // for clarity

        function stick() {
            var $this = $(this),
                data = $this.data('sticker'),
                scroll = $(window).scrollTop();
/*
            DEBUG && log("scrollTop="+scroll
                +" $this.offset().top="+$this.offset().top
                +" $this.offset().left="+$this.offset().left
                +" $this.position().top="+$this.position().top
                +" $this.position().left="+$this.position().left)
*/
            if (data.slipMin >= data.slipMax) return
            if (scroll > data.slipMin && 
                scroll < data.slipMax) {
/*                DEBUG && log("data.useFixed="+data.useFixed) */
                if (typeof(data.useFixed) == 'undefined' || data.useFixed) {
                    $this.css(data.fixed);
                    if (data.useFixed) return;
                    DEBUG && log(scroll+data.topMargin)
                    if (Math.round($this.offset().top-(scroll+data.topMargin)) != 0) { // oops, mobile Safari??
                        DEBUG && log("OOPS! "
                            +"scrollTop="+scroll
                            +" $this.offset().top="+$this.offset().top
                            +" data.topMargin="+data.topMargin
                            +" $this.attr('id')="+$this.attr('id'))
/*                        data.absolute.top = scroll;
                        $this.css(data.absolute)
*/
                    }
                } else {
                    data.absolute.top = scroll;
                    $this.css(data.absolute)
                }
                if (typeof(data.useFixed) == 'undefined') {
                    $this.data('sticker', 
                        $.extend($this.data('sticker'), {
                                    useFixed: $this.css('position') == 'fixed'
                                })
                    )
                }
            } else if (scroll <= data.slipMin) {
                data.absolute.top = data.posMin;
                $this.css(data.absolute);
            } else if (scroll >= data.slipMax) {
                data.absolute.top = data.posMin+data.slipMax-data.slipMin;
                $this.css(data.absolute);
            }
        }

        stickers.each(function () {
            var $this = $(this), 
                data = $this.data('sticker')
            if (!data) {
                DEBUG && log("init("+$this.attr('id')+"):"
                            +" base.offset().top="+base.offset().top
                            +" base.position().top="+base.position().top
                            +" base.outerHeight()="+base.outerHeight()
                            +" base.height()="+base.height()
                            +" $this.offset().top="+$this.offset().top
                            +" $this.position().top="+$this.position().top
                            +" $this.height()="+$this.height()
                            +" $this.outerHeight()="+$this.outerHeight()
                            +" $this.offsetParent().offset().top="+$this.offsetParent().offset().top
                            +" $this.css('margin-top')="+$this.css('margin-top'))
                var slipMin = $this.offsetParent().offset().top+$this.position().top
                var slipMax = slipMin+base.outerHeight()-$this.outerHeight()-($this.offset().top-base.offset().top)
//                var slipMax = slipMin+base.outerHeight()-$this.outerHeight()+(base.offset().top-$this.offset().top)*2
                $this.data('sticker', {
                    stickTo: base,
                    slipMin: slipMin,
                    slipMax: slipMax,
                    posMin: $this.position().top,
                    topMargin: parseFloat($this.css('margin-top').replace("px", "")),
                    absolute: { top: $this.position().top, 
                                width: $this.width(),
                                height: $this.height(),
                                position: 'absolute'},
                    fixed: { top: 0, 
                             width: $this.width(),
                             height: $this.height(),
                             position: 'fixed' }
                })
            }
            stick.call(this);
        });

        $(window).bind('scroll hashchange', stickers, function(event) {
            event.data.each(stick)
        });

        $(window).bind('resize', stickers, function(event) {
            DEBUG && log("re-stick")
            event.data.each(function() {
                stick.call(this)
            });
        });
        return this;
    };
})(jQuery);
