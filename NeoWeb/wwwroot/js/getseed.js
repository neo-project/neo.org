getSeed();
function getSeed() {
    $.ajax({
        type: "GET",
        url: "js/seedlist.json",
        dataType: "json",
        success: function (data) {
            var blo_h = 0, url_s;
            var json = { 'jsonrpc': '2.0', 'method': 'getblockcount', 'params': [], 'id': 1 };
            var str = JSON.stringify(json);
            for (var i = 0; i < data.sites.length; i++) {
                var _url = data.sites[i].url + ":" + data.sites[i].port;
                $.ajax({
                    type: 'POST',
                    url: _url,
                    data: str,
                    async: false,
                    success: function (data) {
                        if (data.result >= blo_h) {
                            blo_h = data.result;
                            url_s = _url;
                        }
                    }
                })
            }
            send_url = url_s;
        },
        fail: function () {
            alert("fail");
        }
    });
}

