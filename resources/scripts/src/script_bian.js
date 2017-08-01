(function($) {
  "use strict";

  $(document).ready(function()
  {

    //home menu js
    //nav-id open click
    $('#nav-id').click(function(){
      $(this).toggleClass('open');
      $('.menu-nav').toggleClass('open');
      $('.nav').toggleClass('open-circle');
    });

    setTimeout(function(){
      $('.menu-nav').removeClass('open');
      $('.nav').removeClass('open-circle');
      $('#nav-id').removeClass('open');

    }, 8000);

    if ( $( 'body' ).hasClass( "home" ) )
    {


    //owl carousel technology
    $('#technology-carousel').owlCarousel({
        loop:false,
        margin:10,
        dots: true,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                slideBy: 1,
                nav:true
            },
            600:{
                items:3,
                slideBy: 3,
                nav:false
            },
            1000:{
                items:3,
                slideBy: 3,
                nav:true,
                loop:false
            }
        }
    })

    //owl carousel timeline
    var owl = $('#timeline-carousel');
    owl.owlCarousel({
      items: 4,
      loop:false,
      margin: 0,
      dots: false,
      URLhashListener: true,
    });

    owl.on('changed.owl.carousel', function(event)
    {
        var targetIdx = event.item.index;
        var root = $( event.target );
        var target = $( '.owl-item:nth-child('+(targetIdx+1)+')', root );
        var duration = 100;
        var count = $( '.content-timeline', target ).length;
        var index = 1;

        $( '.content-timeline', target ).each( function()
        {
            var content = $(this);
            content.css({
                'opacity': 0
            });

            setTimeout( function()
            {
                content.transition({
                    'opacity': 1,
                    'duration': 1000,
                    'complete': function()
                    {
                    }
                });
            },
            duration );
            duration += 100;
        });
        duration = 100;

    });

    //fullpage
    $('#fullpage').fullpage({
      navigation: true,
      navigationPosition: 'right',
      anchors: ['section1', 'section2', 'section3', 'section4', 'section5'],
      navigationTooltips: ['Welcome to NEO', 'WHAT IS NEO', 'EXPLORE NEO', 'TECHNOLOGY', 'TIMELINE AND ROADMAP', 'TEAM MEMBER', 'COMMUNITY'],
      afterRender: function () {
            //playing the video
            $('video').get(0).play();

        }
    });

    $('.down-arrow').click(function(){
      $.fn.fullpage.moveSectionDown();
    });


    //page download
    // what is neo 切换js代码
    document.getElementById("neoTitle").onmouseover = function(e){
        var target = e.target; //获取对应目标元素
        var children = this.children; //获取ul里面的所有li元素集合
        for(var i = 0;i<children.length;i++){
            if(target == children[i]||target.parentNode== children[i]) { //对比目标元素和li集合元素
              // 显示需要的div和代码

              $(".download_selected").removeClass("download_selected");
              $(".change_show").removeClass("change_show");
                var _select = document.getElementById("change_"+i);
                $(_select).addClass("change_show");
                $(children[i]).addClass("download_selected");
                return;
            }
        }
    };



  }
  if ( $( 'body' ).hasClass( "mobile" ) )
    {
      //fullpage mobile
      $('#fullpage-mobile').fullpage({
      navigation: false,
      anchors: ['section1', 'section2', 'section3', 'section4', 'section5'],
      responsiveWidth: 500,
      afterResponsive: function(isResponsive){

        },

    });

    }





  if ( $( 'body' ).hasClass( "blog" ) )
    {
      // 移除对应的class名
      function removeClass( elements,cName ){
        if( hasClass( elements,cName ) ){
        elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" )," " );
        };
      }

      // 在class名后面进行追加
      function addClass( elements,cName ){
        if( !hasClass( elements,cName ) ){
          elements.className += " " + cName;
        };
      };

      // 判断是否存在该Class名
      function hasClass( elements,cName ){
        return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") );//(\\s|^)判断前面(\\s|$)后面是否有空格 再转换为布尔值
      };

      // 调用方法判断距离元素是否出现在可视范围内，ture可以看到
      function visualEle(ele){
        var _top = ele.getBoundingClientRect().top;
        return document.body.scrollHeight-_top>document.body.clientHeight;
      }

      var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: true,
        live: true
      });
        new WOW().init();

        var _year = document.getElementsByClassName("blog_year");
        for (var i = 0; i < _year.length; i++) {
        _year[i].onclick = function(){
          var ss = this.parentNode.parentNode.childNodes;
          for( var j in ss ){
            if(ss[j].nodeName=="LI"){
              ss[j].childNodes[1].style.display = "none";
            }
          }
            this.nextSibling.style.display = "block";
        }
      }

    }

  });
})(jQuery);
