$(document).ready(function () {
    $('map').imageMapResize();
    var currentSlide = 1;
    function showSlide(slideIndex) {
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
        if (currentSlide === 2) {
            $(".tour-left-logo").addClass('hide-in-mobile');
            $(".bottom-title").addClass('hide-in-mobile');
            $(".N3-logo-container").addClass('hide-in-mobile');
            $(".right-container").removeClass('hide-in-mobile');
            $("#prev").addClass('arrow-grey');
        } else if (currentSlide === slides.length) {
            $("#next").addClass('arrow-grey');
        }
    }

    function nextSlide() {
        showSlide(currentSlide += 1);
    }
    function previousSlide() {
        if (currentSlide !== 2) {
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