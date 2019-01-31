$(document).scroll(function () { navColor() });

function language(lang) {
    var rgExp = /\w{2}-\w{2}/;

    if (rgExp.exec(location.href)) {
        location.href = location.href.replace(rgExp, lang);
    }
    else {
        location.href = location.href + "?culture=" + lang;
    }
}

function navColor() {
    var scrnum = $(document).scrollTop();
    var $nav = $(".navbar");
    if (scrnum <= 100) {
        $nav.removeAttr('style');
    } else {
        $nav.css("background", "#FFF");
        $nav.css("top", "0px");
    }
}