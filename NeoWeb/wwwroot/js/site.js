function language(lang) {
    var rgExp = /\w{2}-\w{2}/;

    if (rgExp.exec(location.href)) {
        location.href = location.href.replace(rgExp, lang);
    }
    else {
        location.href = location.href + "?culture=" + lang;
    }
}