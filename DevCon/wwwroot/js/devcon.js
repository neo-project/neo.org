function submitE() {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    var _em = $("#em").val();
    if(_em === ""){
        $("#hintDev").html("输出不能为空");
        $(".modal").modal('show');
        return false;
    }else if(!reg.test(_em)){
        $("#hintDev").html("请检查格式后重新输入");
        $(".modal").modal('show');
        return false;
    }else{
        $.ajax({
            url: 'https://neo.org/subscription/add?email='+_em,
            type: "GET",
            success: function (data) {
                if(data=="true"){
                    $("#hintDev").html("提交成功！");
                    $(".modal").modal('show');
                }else{
                    $("#hintDev").html("请勿多次重复提交！");
                    $(".modal").modal('show');
                }
            },
            error:function () {
                $("#hintDev").html("提交失败，请刷新页面后重试！");
                $(".modal").modal('show');
            }
        });
        return true;
    }
}