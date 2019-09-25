
/**
* Created by Mingxia on 2019/9/25.
* Typing
*/

function TypeText(options) {
    options = options || {};
    this.options = {
        id: options.id || 'typetext',
        text: options.text || ["TypeText"],
        speed: options.speed || 200,
        despeed: options.despeed || 60,
        space: options.space || 500
    };

    this.ele = document.getElementById(this.options.id);
    this.html = this.ele.innerHtml;
    this.text = this.options.text;
    this.speed = this.options.speed;
    this.despeed = this.options.despeed;
    this.space = this.options.space;

    this.init();
}

TypeText.prototype = {
    deleted: function () {
        var ele = $("#typetext").html();
        var _l = ele.length;
        var type = "";
        for (var i = 0; i <= ele.length; i++) {
            (function (i) {
                setTimeout(function () {
                    type = ele.substring(0, _l - i);
                    document.getElementById("typetext").innerText = type;
                }, i * 60);
            })(i);
        }
    },
    typing: function (str) {
        var type = "";
        for (var i = 0; i <= str.length; i++) {
            (function (i) {      //立刻执行函数
                setTimeout(function () {
                    type = type + str.charAt(i);
                    document.getElementById("typetext").innerText = type;
                }, i * 200);
            })(i);
        }
    },
    getarr: function () {
        var last = 0, de = 0;
        this.text.forEach((item, index) => {
            de = last + item.length * this.speed + this.space;
            setTimeout(this.typing, last, item);
            last = last + item.length * (this.despeed + this.speed) + this.space * 2;
            if (index !== this.text.length - 1) {
                setTimeout(this.deleted, de);
            }
        });
    },
    hastext: function () {

    },
    init: function () {
        this.getarr();
    }
}