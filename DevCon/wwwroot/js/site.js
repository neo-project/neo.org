// Write your Javascript code.
//倒计时方法
//deadline格式new Date("YYYY-MM-DD HH:MM:SS");
function CountTime(deadline) {
    this.millisec = (deadline - new Date())>0? deadline - new Date():0;
}
CountTime.prototype = {
    day: function () { return parseInt(this.millisec / 1000 / 60 / 60 / 24) },
    hour: function () { return parseInt(this.millisec / 1000 / 60 / 60 % 24) },
    minute: function () { return parseInt(this.millisec / 1000 / 60 % 60) },
    second: function () { return parseInt(this.millisec / 1000 % 60) },
    fomate: function (num) {if (num < 10) num = "0" + num;return num;}
}
