$("#em").bind('keypress',function(event){ 
    if(event.keyCode == 13)
    {
        submitE();
    }
});

function submitE() {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    var _em = $("#em").val();
    if(_em === ""){
        $("#hintDev").html("Please check your email format and entry again.");
        $(".modal").modal('show');
        return false;
    }else if(!reg.test(_em)){
        $("#hintDev").html("Please check your email format and entry again.");
        $(".modal").modal('show');
        return false;
    }else{
        $.ajax({
            url: 'https://neo.org/subscription/add?email='+_em,
            type: "GET",
            success: function (data) {
                $("#hintDev").html(data);
                $(".modal").modal('show');
            },
            error:function () {
                $("#hintDev").html("Failed to submit. Please refresh the webpage and retry.");
                $(".modal").modal('show');
            }
        });
        return true;
    }
}

function showSp(e) {
    $(e).hide();
    var _out = $(".speaker-detail");
    var _in = $('.speaker-detail li:last');
    _out.height("auto");
    _in.is("hidden");
}

speakerBtn();
$(window).resize(function () {
    speakerBtn();
});

function speakerBtn() {
    var _out = $(".speaker-detail");
    var _in = $('.speaker-detail li:last');
    var _len = _out.offset().top + _out.height() - _in.offset().top - _in.height();
    if (_len > 0) {
        $(".show-more").hide();
    }
}