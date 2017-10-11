$(function () {
    //根据年份显示日期
    $("#blogDate li a.iconfont").click(function () {
        var _this = $(this).parent("li");
        _this.siblings().find("ul").hide();
        $(".selected-part").removeClass("selected-part");
        _this.addClass("selected-part");
        _this.find("ul").toggle(300);
    });

})