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
