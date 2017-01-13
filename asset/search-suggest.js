define(['oxjs','mustache'], function (OX,Mustache) {
    var tpl='<ul>{{#data}}<li>{{Symbol}}</li>{{/data}}</ul>'
    var ajax = function (wd,fn) {
        OX.getJSON('http://momofox.com:8000/company/querysymbol?wd='+wd,fn)
    };
    return {
        init: function (searchInput) {
            var TO;
            searchInput.on('keyup focus',function(){
                if(TO)clearTimeout(TO);
                TO=setTimeout(function(){
                    ajax($.trim(searchInput.val()),function(r){

                        if(r && r.data){
                            if(r.data.length){
                                sugguest.html(Mustache.render(tpl, r)).show()
                            }else{
                                sugguest.html('<font color="#ccc">no symbol match</font>').show()
                            }

                        }else{
                            sugguest.empty().hide();
                        }

                    })
                },300)
            }).on('blur',function(){
                sugguest.hide()
            });
            var sugguest=$('<div class="suggest"/>').prependTo(searchInput.parent()).css({
                width:searchInput.width()

            }).hide().on('tap','li',function(){
               searchInput.val(this.innerHTML).trigger('filled:suggest').blur();
            });


        }

    }
})
