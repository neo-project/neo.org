function resize() {
    for (var i = 0; i < 10 && $("#menu_list").width() + $("#logo_div").width() > $("#nav_container").width(); i++) {
        $("#dropdown_btn").show();
        $("#more_list").prepend($(".nav-item:last"));
        $(".nav-item:last").removeClass("nav-item");
    }
    if ($("#menu_list").width() + $("#logo_div").width() + 100 <= $("#nav_container").width()) {
        var preShowItem = $("#more_list li:first");
        $("#dropdown_btn").before(preShowItem);
        preShowItem.addClass("nav-item");
        if ($("#more_list li").length == 0) {
            $("#dropdown_btn").hide();
        }
    }
}
resize();
$(window).bind('resize', resize);

function language(lang) {
    var rgExp = /\w{2}-\w{2}/;

    if (rgExp.exec(location.href)) {
        location.href = location.href.replace(rgExp, lang);
    }
    else {
        location.href = location.href + "?culture=" + lang;
    }
}