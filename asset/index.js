define(['oxjs'], function (OXJS) {
    
    return {
        init: function ($mod) {
            var lastLi = null;
            //targetDS+=$mod.attr('data-dsid');
            $mod.on('swipeLeft', 'li', function () {
                lastLi = $(this).addClass('show-del')
            });
            $mod.on('touchend', function () {
                if (lastLi) {
                    lastLi.removeClass('show-del')
                    lastLi = null;
                }
            });
            $mod.on('tap', '.bt-del', function (e) {
                var symbol = this.getAttribute('data-symbol')

                $mod.OXDelete( {
                    $fav:{
                        'stock-analysis':{
                            symbol:symbol
                        }
                    }
                });
            }).on(OXJS.MODEL_EVENT.AFTER_WRITE,function(){
                $mod.OXRefresh();
            });
            


        }
    }
})
