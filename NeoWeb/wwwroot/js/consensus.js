var block_height = 0;
var send_url = "https://pyrpc2.narrative.org:443";
var lastt = new Date(),conNum = 0;

blockInfo();
getVolue();
getListdata();

setInterval(function () {
    blockInfo();
}, 1000);

//点击展开
function showDetail(ele) {
    ele.parents(".tr-con").next(".can-detail").toggle("fast");
}

//获取区块高度、出块时间计算
function blockInfo() {
    var json = { 'jsonrpc': '2.0', 'method': 'getblockcount', 'params': [], 'id': 1 };
    var str = JSON.stringify(json);
    countDown(lastt);
    $.ajax({
        type: 'POST',
        url: send_url,
        data: str,
        success: function (data) {
            if (block_height != data.result - 1) {
                lastt = new Date();
                block_height = data.result - 1;
                getListdata();
                $("#blohei").html(block_height);
            }
        },
        fail: function () {
            getSeed();
        }
    });
}

//倒计时函数
function countDown(time) {
    var _left = new Date() - time;
    if (_left >= 0) {
        var hh = parseInt(_left / 1000 / 60 / 60 % 24, 10);
        var mm = parseInt(_left / 1000 / 60 % 60, 10);
        var ss = parseInt(_left / 1000 % 60, 10);
    }
    if (_left < 600000) { $("#lastime").html(ss + "s"); }
    else if (_left < 3600000) { $("#lastime").html(mm + "m" + ss + "s"); }
    else { $("#lastime").html(hh + "h" + mm + "m" + ss + "s"); }
}


//获取节点数据
function getListdata() {
    $.get("../../consensus/getvalidators", []).done(function (data) {
        var _list = JSON.parse(data);
        if (conNum != _list.length) {
            var flag = 0;
            $("#cannum").html(_list.length);
            for (var i = 0; i < _list.length; i++) {
                if (_list[i].Active) flag++;
            }
            $("#connum").html(flag);

            //竞选个数
            var html = "";
            for (var j in _list) {
                html += template('test', _list[j]);

                if (_list[j].Info != null && _list[j].Info.SocialAccount != null) {
                    var accountList = _list[j].Info.SocialAccount.split(';');
                    var socialAccount = "";
                    for (var i = 0; i < accountList.length; i++) {
                        var account = accountList[i].split(':');
                        var accountName = account[0];
                        var accountLink = account[1];
                        if (accountName.toLowerCase() == "twitter")
                            socialAccount += "<a href=https://twitter.com/" + accountLink + "><i class=\"iconfont\">&#xe60a;</i></a>";
                        if (accountName.toLowerCase() == "facebook")
                            socialAccount += "<a href=https://www.facebook.com/" + accountLink + "><i class=\"iconfont\">&#xe87d;</i></a>";
                        if (accountName.toLowerCase() == "weibo")
                            socialAccount += "<a href=https://weibo.com/" + accountLink + "><i class=\"iconfont\">&#xe610;</i></a>";
                        if (accountName.toLowerCase() == "github")
                            socialAccount += "<a href=https://github.com/" + accountLink + "><i class=\"iconfont\">&#xee67;</i></a>";
                    }
                    html += "<p class=\"social-icon\">" + socialAccount + "<p/>";
                }
            }
            
            document.getElementById('tableList').innerHTML = html;
            conNum = _list.length;
        }
    });
}

//图表数据展示
function getVolue() {
    $.get("../../consensus/gettxcount", []).done(function (data) {
        var _list = JSON.parse(data);
        showCharts(_list);
    });
}
function showCharts(data) {
    var myChart = echarts.init(document.getElementById('main'));
    option = {
        backgroundColor: '#F3F3F3',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255,255,255,1)',
            borderRadius: '2',
            axisPointer: {
                lineStyle: {
                    color: '#999999'
                }
            },
            textStyle: {
                fontWeight: 'normal',
                color: '#666666'
            }
        },
        legend: {
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 14,
            itemGap: 14,
            data: [tx_v, block_s],
            right: '0',
            textStyle: {
                fontSize: 12,
                color: '#666666'
            }
        },
        grid: {
            left: '0',
            right: '0',
            bottom: '0',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#CCC',
                    opcity: '0.8'
                }
            },
            data: data.IndexList
        }],
        yAxis: [{
            type: 'value',
            boundaryGap: false,
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    color: '#CCC',
                    fontSize: 14
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#EAEAEA'
                }
            }
        }, {
            type: 'value',
            boundaryGap: false,
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    color: '#CCC',
                    fontSize: 14
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#EAEAEA'
                }
            }
        }],
        series: [{
            name: tx_v,
            type: 'line',
            smooth: true,
            showSymbol: false,
            yAxisIndex: 0,
            lineStyle: {
                normal: {
                    width: 2,
                    shadowColor: 'rgba(80,80,80,0.1)',
                    shadowBlur: 15,
                    shadowOffsetY: 30
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(200,220,25)'
                }
            },
            data: data.TxCountList
        }, {
            name: block_s,
            type: 'line',
            smooth: true,
            showSymbol: false,
            yAxisIndex: 1,
            lineStyle: {
                normal: {
                    width: 2,
                    shadowColor: 'rgba(80,80,80,0.1)',
                    shadowBlur: 15,
                    shadowOffsetY: 30
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgb(170,203,162)'
                }
            },
            data: data.SizeList
        }]
    };
    window.onresize = myChart.resize;
    myChart.setOption(option);
}

