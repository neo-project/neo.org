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
        $("#hintDev").html("Please check you email format and entry again.");
        $(".modal").modal('show');
        return false;
    }else if(!reg.test(_em)){
        $("#hintDev").html("Please check you email format and entry again.");
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