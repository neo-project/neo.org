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