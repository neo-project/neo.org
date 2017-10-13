function resize() {
    while ($("#menu_list").width() + $("#logo_div").width() > $("#nav_container").width()) {
        $("#dropdown_btn").show();
        $("#more_list").append($(".menu-item:last"));
        $(".menu-item:last").removeClass("menu-item");
    }
    if ($("#menu_list").width() + $("#logo_div").width() + 100 <= $("#nav_container").width()) {
        var preShowItem = $("#more_list li:first");
        $(".menu-item:last").after(preShowItem);
        preShowItem.addClass("menu-item");
        if ($("#more_list li").length == 0) {
            $("#dropdown_btn").hide();
        }
    }
}
window.onresize = resize;
resize();

var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?89c4ec96535ab0e5578edff466ccb91a";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();