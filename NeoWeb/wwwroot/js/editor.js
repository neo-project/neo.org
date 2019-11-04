function switchLanguage(obj) {
    if (obj === "en") {
        $(".en").show();
        $(".zh").hide();
        $(".switch-border").css("text-align", "left");
    }
    else if (obj === "zh") {
        $(".zh").show();
        $(".en").hide();
        $(".switch-border").css("text-align", "right");
    }
}
$("form").validate({
    ignore: ""//验证隐藏元素
});