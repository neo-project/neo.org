var dict = {};

$(function () {
    registerWords();
    setLanguage("zh");

    $("#enBtn").bind("click", function () {
        setLanguage("en");
    });

    $("#zhBtn").bind("click", function () {
        setLanguage("zh");
    });

    $("#applyBtn").bind("click", function () {
        alert(__tr("a translation test!"));
    });
});

function setLanguage(lang) {
    setCookie("lang=" + lang + "; path=/;");
    $(".multi-lang").hide();
    $(".show-" + lang).show();
    translate();
}

function getCookieVal(name) {
    var items = document.cookie.split(";");
    for (var i in items) {
        var cookie = $.trim(items[i]);
        var eqIdx = cookie.indexOf("=");
        var key = cookie.substring(0, eqIdx);
        if (name == $.trim(key)) {
            return $.trim(cookie.substring(eqIdx + 1));
        }
    }
    return null;
}

function setCookie(cookie) {
    document.cookie = cookie;
}

function translate() {
    loadDict();

    $("[lang]").each(function () {
        switch (this.tagName.toLowerCase()) {
            case "input":
                $(this).val(__tr($(this).attr("lang")));
                break;
            default:
                $(this).text(__tr($(this).attr("lang")));
        }
    });
}

function __tr(src) {
    return (dict[src] || src);
}

function loadDict() {
    var lang = (getCookieVal("lang") || "en");

    $.ajax({
        async: false,
        type: "GET",
        url: "js/" + lang + ".json",
        success: function (msg) {
            dict = eval(msg);
        }
    });
}

function registerWords() {
    $("[lang]").each(function () {
        switch (this.tagName.toLowerCase()) {
            case "input":
                $(this).attr("lang", $(this).val());
                break;
            default:
                $(this).attr("lang", $(this).text());
        }
    });
}  