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
                if(data=="true"){
                    $("#hintDev").html("Email sucessfully sumbitted!");
                    $(".modal").modal('show');
                }else{
                    $("#hintDev").html("请勿多次重复提交！");
                    $(".modal").modal('show');
                }
            },
            error:function () {
                $("#hintDev").html("Failed to submit. Please refresh the webpage and retry.");
                $(".modal").modal('show');
            }
        });
        return true;
    }
}