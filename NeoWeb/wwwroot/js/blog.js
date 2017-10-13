$(function () {
    //根据年份显示日期
    $(".year").click(function () {
        $(".blog_date ul").hide(300);
        $(this.parentNode).find("ul").show(300);
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