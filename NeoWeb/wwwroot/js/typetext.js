/*循环时间、最终状态、字符串个数、字符个数、两种定时器、
 */
typetext();
function typetext(){
    $(".typetext").html();
    setTimeout(deleted, 800);
}

function typing(ele) {
    ele = "Most Community Driven";
    var str = "";
    for (var i = 0; i <= ele.length; i++) {
        (function (i) {      //立刻执行函数
            setTimeout(function () {
                str = str + ele.charAt(i);
                $(".typetext").html(str);
            }, i * 200);
        })(i); 
    }
}

function deleted(ele) {
    ele = $(".typetext").html();
    var _l = ele.length;
    var str = "";
    for (var i = 0; i <= ele.length; i++) {
        (function (i) {      //立刻执行函数
            setTimeout(function () {
                str = ele.substring(0, _l-i);
                $(".typetext").html(str);
                if (i == _l) setTimeout(typing, 500);
            }, i * 60);
        })(i);
    }
}