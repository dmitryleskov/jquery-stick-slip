/**
 * jQuery Stick-Slip v0.9
 * Temporarily stick an element to the viewport as the page is scrolled
 * Takes no parameters, fully controlled by layout.
 * https://github.com/dmitryleskov/jquery-stick-slip
 *
 * Licensed under the MIT license.
 * Copyright 2011-2012 Dmitry Leskov.
 */
 
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
                DEBUG && log($this.attr("id")+":data.absolute.top="+data.absolute.top)
                $this.css(data.absolute);
            } else if (scroll >= data.slipMax) {
                data.absolute.top = data.posMin+data.slipMax-data.slipMin;
                DEBUG && log($this.attr("id")+":data.absolute.top="+data.absolute.top)
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
                            +" $this.css('margin-top')="+$this.css('margin-top')
                            +" $this.css('float')="+$this.css('float'))

                if (($this.css('position') == 'static' ||
                     $this.css('position') == 'relative') &&
                     $this.css('float') == 'none') {
                    // Create a placeholder <div> so that other elements
                    // do not move when the sticker is removed from normal flow.
                    $this.wrap("<div />")

                    // The placeholder must occupy exactly the same space and 
                    // position as the sticker. Their vertical margins collapse, 
                    // but horizontal don't. Therefore:
                    //
                    //   - The width of the placeholder is set equal to the width 
                    //     of the sticker's _margin_ box, and the horizontal margins 
                    //     of the placeholder are set to zero.
                    //
                    //   - The height of the placeholder is set equal to the height
                    //     of the sticker's _border_ box, and the vertical margins 
                    //     of the placeholder are copied from the sticker.
                    //
                    $this.parent()
                        .width($this.outerWidth(true))
                        .height($this.outerHeight())
                        .css({
                            'border': '0',
                            'padding': '0',
                            'marginTop': $this.css('marginTop'),
                            'marginBottom': $this.css('marginBottom'),
                            'marginRight': 0,
                            'marginLeft': 0,
                            'background-color': 'transparent',
                            'overflow': 'visible'
                        })
                }

                var slipMin = $this.offsetParent().offset().top+$this.position().top
                var slipMax = slipMin+base.outerHeight()-$this.outerHeight()-($this.offset().top-base.offset().top)
//                var slipMax = slipMin+base.outerHeight()-$this.outerHeight()+(base.offset().top-$this.offset().top)*2
                $this.data('sticker', {
                    stickTo: base,
                    slipMin: slipMin,
                    slipMax: slipMax,
                    posMin: $this.position().top,
                    topMargin: parseFloat($this.css('margin-top').replace("px", "")),
                    absolute: { 
                       top: $this.position().top, 
                       width: $this.width(),
                       height: $this.height(),
                       position: 'absolute'},
                    fixed: { 
                       top: 0, 
                       width: $this.width(),
                       height: $this.height(),
                       position: 'fixed' }
                })
            }
            stick.call(this)
        })

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
