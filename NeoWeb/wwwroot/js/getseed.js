getSeed();
function getSeed() {
    $.ajax({
        type: "GET",
        url: "js/seedlist.json",
        dataType: "json",
        success: function (data) {
            var blo_h = 0;
            for (var i = 0; i < data.sites.length; i++) {
                var json = { 'jsonrpc': '2.0', 'method': 'getblockcount', 'params': [], 'id': i};
                var str = JSON.stringify(json);
                var _url = data.sites[i].url + ":" + data.sites[i].port;
                $.ajax({
                    type: 'POST',
                    url: _url,
                    data: str,
                    success: function (re) {
                        if (re.result >= blo_h) {
                            blo_h = re.result;
                            return send_url = data.sites[re.id].url + ":" + data.sites[re.id].port;
                        }
                    }
                });
            }
        },
        fail: function () {
            alert("fail");
        }
    });
}

