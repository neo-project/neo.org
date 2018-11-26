function submitE() {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    var _em = $("#em").val();
    $(".modal").modal('show');
    if(_em === ""){
        // alert("输入不能为空!");
        return false;
    }else if(!reg.test(_em)){
        // alert("验证不通过!");
        return false;
    }else{
        $.ajax({
            url: 'https://neo.org/subscription/add?email='+_em,
            type: "GET",
            success: function (data) {
                console.log(data);

            }
        });
        return true;
    }
}