//多语言切换
function setLanguage(culture) {
    $("#culture").val(culture);
    $("#returnUrl").val(window.location.pathname);
    $("#form_language").submit();
}
//懒加载
$('[data-original]').lazyload({
    threshold: 400,
    effect: "fadeIn"
});
//导航栏的叉叉按钮
$('.special-button').click(function () {

    if ($('.bottom').hasClass('active')) {
        $(".st0").attr("class", "st0");
    }

    else {
        $(".st0").attr("class", "st0 active");
    }

    $('.top').toggleClass("active");
    $('.bottom').toggleClass("active");
});
//导航的栏折叠展开
$(".navbar-toggler").click(function () {
    if ($(".navbar-collapse").hasClass("show")) {
        $(".navbar-collapse").removeClass("show");
        $(".navbar").removeClass("show");
    }
    else {
        $(".navbar-collapse").addClass("show");
        $(".navbar").addClass("show");
    }
});
//首页首屏撑满屏幕，其它页面首屏在手机端撑满屏幕
pageSize();
$(window).resize(function () {
    pageSize();
});

function pageSize() {
    if ($(window).height() > 550 && $(window).width() < 450 || $("#homeFri").hasClass("bg8") /*首页*/ ) {
        $("#homeFri").each(function () {
            $(this).css("min-height", $(window).height() - 70);
        });
    }
}
$("#process-bar").css("width", "100%");
setTimeout(function () {
    $("#loading").css("top", "-2000px");
    $("body").css("overflow", "auto");
    $("#process-bar").hide();
}, 5000);