$(function () {
    //根据年份显示日期
    $("#blogDate li a.iconfont").click(function () {
        var _this = $(this).parent("li");
        _this.siblings().find("ul").hide();
        $(".selected-part").removeClass("selected-part");
        _this.addClass("selected-part");
        _this.find("ul").toggle(300);
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 150) {
            $('.back-to-top').fadeIn(100);
        } else {
            $('.back-to-top').fadeOut(100);
        }
    });

    $('.back-to-top').click(function (event) {
        $('html, body').animate({ scrollTop: 0 }, 500);
    })    
})