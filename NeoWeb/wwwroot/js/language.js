var dict = {};

$(function () {
    registerWords();
    var currentLanguage = navigator.language || navigator.browserLanguage;
    if (currentLanguage.split('-')[0] == 'zh') {
        setLanguage("zh");
    }
    else if (currentLanguage.split('-')[0] == 'es') {
        setLanguage("es");
    }
    else if (currentLanguage.split('-')[0] == 'ko') {
        setLanguage("ko");
    }
    else if (currentLanguage.split('-')[0] == 'ja') {
        setLanguage("ja");
    }
    else {
        setLanguage("en");
    }
    $("#enBtn").bind("click", function () {
        setLanguage("en");
    });

    $("#zhBtn").bind("click", function () {
        setLanguage("zh");
    });

    $("#esBtn").bind("click", function () {
        setLanguage("es");
    });

    $("#jaBtn").bind("click", function () {
        setLanguage("ja");
    });

    $("#koBtn").bind("click", function () {
        setLanguage("ko");
    });

    $("#frBtn").bind("click", function () {
        setLanguage("fr");
    });

    $("#applyBtn").bind("click", function () {
        alert(__tr("a translation test!"));
    });

    $(".set-lang [id$='Btn']").bind("click", function () {
        statistic();
    })
    statistic();
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
                $(this).html(__tr($(this).attr("lang")));
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
        url: "js/" + lang + ".json" + "?v=" + Math.random(),
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