define(['oxjs', './search-suggest'], function (OX, SearchSuggest) {
    OX.config({devHost:'//local.openxsl.com'})
    var targetDS = '/stock-analysis@258805cd7dc3804a64f61504e';
    //targetDS='/stock-analysis@2587df42dca0b15ab810cc602'
    var fav=function(newSymbol,fn){//看它有没有,有的话,喜欢之,没有的话,获取详细信息插入再喜欢之
        var callfav=function(tid){
            OX.callapi('fav' + targetDS, {
                tid: tid
            }, fn);
        };
        OX.callapi('find' + targetDS, {
            symbol: newSymbol
        }, function (r) {
            if (r && r.data && r.data.length) {
                var stock = r.data[0];

                callfav(stock._id)
            } else {
                OX.getJSON('http://momofox.com:8000/analyze/querymaybelow?symbols=' + newSymbol, function (r) {
                    var n=r[0];

                    OX.callapi('update' + targetDS, {
                        query: {
                            symbol: n.symbol
                        },
                        update: {
                            $set: {
                                med: n.med,
                                close: n.close,
                                avg: n.avg,
                                lastDate: n.lastDate
                            }
                        }

                    }, function(ret){
                        //console.log('ret',ret)
                        var upserted=ret.data&&ret.data.upserted;
                        if(upserted){
                            var new_id=upserted[0]._id;
                            callfav(new_id)
                        }else{
                            fav(newSymbol,fn)
                        }

                    });

                });

            }
            //console.log(r)
        })
    };
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
                var tid = this.getAttribute('data-id')

                OX.callapi('fav' + targetDS, {
                    tid: tid,
                    cancel:true
                }, afterSave);
            })
            var searchInput = $mod.find('.J_search');

            var afterSave = function () {
                    //location.reload(true);
                };
            SearchSuggest.init(searchInput.on('filled:suggest', function () {
                var newSymbol = searchInput.val();

                fav(newSymbol,afterSave)
                /*
                 OX.callapi('insert'+targetDS, {
                 rel:[searchInput.val()],
                 user: $mod.attr('data-uid')
                 }, function () {
                 location.reload(true);
                 });
                 */
            }))


        }
    }
})
