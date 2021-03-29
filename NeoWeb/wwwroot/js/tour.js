$(document).ready(function () {
    $('map').imageMapResize();
    var currentSlide = 1;
    function showSlide(slideIndex) {
        if (slideIndex !== 1) {
            window.scrollTo(0, 0);
        }
        const slides = document.getElementsByClassName('text-group');
        const imageSlides = document.getElementsByClassName('carouselImgs');
        const circles = document.getElementsByClassName('circle');
        if (slideIndex > slides.length) { currentSlide = slides.length }
        if (slideIndex < 1) { currentSlide = 1 }
        for (var i = 0; i < slides.length; i++) {
            $(slides[i]).addClass('fade-out');
            $(slides[i]).removeClass('fade-in');
            $(imageSlides[i]).addClass('fade-out');
            $(imageSlides[i]).removeClass('fade-in');
            $(circles[i]).removeClass('circle-black');
        }
        $(slides[currentSlide - 1]).removeClass('fade-out');
        $(slides[currentSlide - 1]).addClass('fade-in');
        $(imageSlides[currentSlide - 1]).removeClass('fade-out');
        $(imageSlides[currentSlide - 1]).addClass('fade-in');
        $(circles[currentSlide - 1]).addClass('circle-black');

        $("#next").removeClass('arrow-grey');
        $("#prev").removeClass('arrow-grey');
        if (currentSlide === 1) {
            $(".logo-white").removeClass('hide-in-mobile');
            $(".logo-dark").addClass('hide-in-mobile');
            $("#bottom-guide").addClass('hide-in-mobile');
            $(".right-corner-mobile").addClass('hide-in-mobile');
            $("#bottom-guide-container").addClass('hide');
            $("#bottom-guide-container").removeClass('bottom-guide-container');
        }else if (currentSlide === 2) {
            $(".logo-white").addClass('hide-in-mobile');
            $(".logo-dark").removeClass('hide-in-mobile');
            //$(".tour-left-logo").addClass('hide-in-mobile');
            $("#bottom-guide").removeClass('hide-in-mobile');
            $(".right-corner-mobile").removeClass('hide-in-mobile');
            //$("#prev").addClass('arrow-grey');
        } else if (currentSlide === slides.length) {
            $(".logo-dark").addClass('hide-in-mobile');
            $(".logo-white").removeClass('hide-in-mobile');
            $("#next").addClass('arrow-grey');
        } else {
            $(".logo-white").addClass('hide-in-mobile');
            $(".logo-dark").removeClass('hide-in-mobile');
        }

    }

    function nextSlide() {
        showSlide(currentSlide += 1);
    }
    function previousSlide() {
        if (currentSlide !== 1) {
            showSlide(currentSlide -= 1);
        }

    }

    $("#start").click(() => {
        currentSlide = 2;
        showSlide(currentSlide);
        $("#bottom-guide-container").removeClass('hide');
        $("#bottom-guide-container").addClass('bottom-guide-container');
    })

    $("#prev").click(() => {
        previousSlide();
    })

    $("#next").click(() => {
        nextSlide();
    })

    $(".circle").click((e) => {
        const page = $(e.currentTarget).data('page') 
        if (page !== 1) {
            currentSlide = page;
            showSlide(currentSlide);
        }
    })

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function getTouches(evt) {
        return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }

    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    };

    function handleTouchMove(evt) {
        if (!xDown || !yDown) {
            return;
        }

        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff >= 10){
                if (currentSlide !== 1) {
                    nextSlide();
                }
            } else if(xDiff <= -10){
                previousSlide();
            }
        } 
        /* reset values */
        xDown = null;
        yDown = null;
    };

    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }
        switch (event.key) {
            case "Right": 
            case "ArrowRight":
                if (currentSlide !== 1) {
                    nextSlide();
                }
                break;
            case "Left":
            case "ArrowLeft":
                previousSlide();
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);
});