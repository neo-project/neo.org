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