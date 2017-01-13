define(['oxjs','./search-suggest'],function(OX,SearchSuggest){
  return {
    init:function($mod){
        var lastLi=null;
        $mod.on('swipeLeft','li',function(){
            lastLi=$(this).addClass('show-del')
        });
        $mod.on('touchend',function(){
            if(lastLi){
                lastLi.removeClass('show-del')
                lastLi=null;
            }
        });
        $mod.on('tap','.bt-del',function(e){
            var symbol=this.getAttribute('data-symbol')
            OX.callapi('update'+userRelDS, {
                query:{
                    user: loginUser
                },
                update:{
                    $pull:{
                        rel:symbol
                    }
                }

            }, afterSave);
        })
        var searchInput=$mod.find('.J_search');

        var userRelDS='/user-rel@25875f75238b2609b633f6285',
            loginUser=$mod.attr('data-uid'),
            afterSave=function(){
                location.reload(true);
            };
        SearchSuggest.init(searchInput.on('filled:suggest',function(){
            var newSymbol=searchInput.val();
            OX.callapi('find'+userRelDS,{
                user: $mod.attr('data-uid')
            },function(r){
                if(r&& r.data && r.data.length){
                    var rel= r.data[0].rel;
                    if(rel.indexOf(newSymbol)==-1){
                        rel.push(newSymbol)
                        OX.callapi('update'+userRelDS, {
                            query:{
                                user: loginUser
                            },
                            update:{
                                $set:{
                                    rel:rel
                                }
                            }

                        }, afterSave);
                    }else{
                        afterSave();
                    }

                }else{
                    OX.callapi('insert'+userRelDS, {
                        rel:[newSymbol],
                        user: loginUser
                    }, afterSave);
                }
                //console.log(r)
            })
/*
            OX.callapi('insert'+userRelDS, {
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
