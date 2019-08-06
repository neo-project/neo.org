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
$(".navbar-nav .nav-link").click(function () {
    $(".nav-dropdown").not($(this).next()).removeClass("show");
    if ($(this).next().hasClass("show"))
        $(this).next().removeClass("show");
    else
        $(this).next().addClass("show");

});