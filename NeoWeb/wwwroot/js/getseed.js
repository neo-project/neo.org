getSeed();
function getSeed() {
    $.ajax({
        type: "GET",
        url: "js/seeedlist.json",
        dataType: "json",
        success: function (data) {
            console.log(data);
        },
        fail: function () {
            alert("fail");
        }
    });
}

